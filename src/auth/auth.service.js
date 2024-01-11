const logger = require('../infrastructures/utils/logger');
const { userCollection } = require('../infrastructures/schemas');
const CustomError = require('../infrastructures/errors/custom.error');
const { generateAccessToken } = require('../infrastructures/utils/get_token');
const bcrypt = require('bcrypt');
const saltRounds = 10;

class AuthService {
  async signUp(req, res, next) {
    const user = req?.body;
    logger.log(user);
    try {
      const isUserExists = await userCollection.findOne({ email: user?.email });

      if (isUserExists?.id) throw new CustomError('User email id already exists', 409);
      const saveUser = new userCollection();
      saveUser.email = user.email;
      saveUser.name = user.name;
      saveUser.mobile = user.mobile;
      saveUser.last_login_date = new Date();
      saveUser.password = await bcrypt.hash(user.password, saltRounds);
      await saveUser.save();

      const token = generateAccessToken({ email: user.email, id: saveUser.id });

      return res.status(200).json({
        data: {
          user: {
            email: user.email,
            name: user.name,
            mobile: user.mobile,
            last_login_date: user.last_login_date,
          },
          token,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async logIn(req, res, next) {
    const user = req?.body;
    try {
      const isUserExists = await userCollection.findOne({ email: user?.email });
      if (!isUserExists?.id) throw new CustomError('User not found', 404);
      const isValidPassword = await bcrypt.compare(user.password, isUserExists.password);
      if (!isValidPassword) throw new CustomError('User email or password or invalid', 400);
      const token = generateAccessToken({ email: user.email, id: isUserExists.id });
      return res.status(200).json({
        data: {
          user: {
            email: isUserExists.email,
            name: isUserExists.name,
            mobile: isUserExists.mobile,
            last_login_date: isUserExists.last_login_date,
          },
          token,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async logOut(req, res) {
    const user = req?.user;
    await userCollection.updateOne(
      { email: user?.email },
      {
        $set: {
          last_login_date: new Date(),
        },
      },
    );
    return res.status(200).json({ data: { success: true } });
  }

  async forgetPassword(req, res, next) {
    const user = req?.body;
    try {
      const isUserExists = await userCollection.findOne({ email: user?.email });
      if (!isUserExists?.id) throw new CustomError('User not found', 404);
      const newPassword = await bcrypt.hash(user.password, saltRounds);
      await userCollection.updateOne(
        { email: user?.email },
        {
          $set: {
            password: newPassword,
          },
        },
      );
      return res.status(200).json({ data: { success: true, msg: 'Password updated' } });
    } catch (err) {
      next(err);
    }
  }

  async me(req, res, next) {
    const user = req?.user;
    try {
      const isUserExists = await userCollection.findOne({ email: user?.email });
      if (!isUserExists?.id) throw new CustomError('User not found', 404);
      return res.status(200).json({
        data: {
          user: {
            email: isUserExists.email,
            firstname: isUserExists.firstname,
            lastname: isUserExists.lastname,
            mobile: isUserExists.mobile,
            last_login_date: isUserExists.last_login_date,
          },
        },
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AuthService;
