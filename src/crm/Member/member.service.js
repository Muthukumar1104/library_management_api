const CustomError = require('../../infrastructures/errors/custom.error');
const { memberCollection } = require('../../infrastructures/schemas');
// const logger = require('../../infrastructures/utils/logger');
const Common = require('../common/common');

const common = new Common();

// Book Services
module.exports = class ContactServices {
  async getMemberList(req, res, next) {
    try {
      const query = req?.query;
      const limit = query?.limit ? +query?.limit : 10;
      const skip = query?.skip ? +query?.skip : 0;
      const archived = query?.archived === 'true';
      const matchQuery = [
        {
          is_deleted: archived,
        },
      ];

      if (query?.name) {
        matchQuery.unshift({
          name: { $regex: query.name, $options: 'i' },
        });
      }

      const mongoQuery = [];
      if (matchQuery?.length) {
        mongoQuery.push({
          $match: {
            $and: matchQuery,
          },
        });
      }

      mongoQuery.push({
        $facet: {
          pagination: [{ $count: 'total' }, { $addFields: { limit: limit, offset: skip } }],
          data: [{ $skip: skip }, { $limit: limit }],
        },
      });

      const member = await memberCollection.aggregate(mongoQuery);
      return res.status(200).json({
        data: {
          pagination: member[0]?.pagination?.length
            ? {
                ...member[0]?.pagination[0],
              }
            : {
                total: 0,
                limit: limit,
                offset: skip,
              },
          data: member[0]?.data ?? [],
        },
      });
    } catch (e) {
      next(e);
    }
  }

  async getMemberByIds(memberIds) {
    const members = await memberCollection.find({
      _id: memberIds,
    });
    return members ?? [];
  }

  async getMemberById(req, res, next) {
    try {
      const data = req?.params;
      // Valid the id.
      await common.isObjectId(data?.id);
      const members = await memberCollection.findById({ _id: data?.id });
      if (!members?._id) throw new CustomError('Contacts not found', 404);
      return res.status(200).json({
        data: members,
      });
    } catch (e) {
      next(e);
    }
  }

  async saveMember(req, res, next) {
    const memberData = req?.body;
    try {
      const isContactExists = await memberCollection.findOne({
        name: memberData?.name,
        is_deleted: false,
      });

      const member = isContactExists || new memberCollection();
      member.name = memberData.name;
      member.mobile = memberData.mobile;
      member.address = memberData.address;
      member.created_date = new Date().toLocaleDateString();

      const bookDocument = await memberCollection.findOneAndUpdate({ name: memberData?.name }, member, {
        upsert: true,
        new: true,
      });

      return res.status(200).json({
        data: bookDocument,
      });
    } catch (e) {
      next(e);
    }
  }

  async updateMember(req, res, next) {
    try {
      const memberId = req.body.id;
      const memberData = req.body;

      const existingMember = await memberCollection.findOne({
        _id: memberId,
        is_deleted: false,
      });

      if (!existingMember) {
        return res.status(404).json({ error: 'Book not found' });
      }

      existingMember.name = memberData.name;
      existingMember.mobile = memberData.mobile;
      existingMember.address = memberData.address;
      const updatedMember = await memberCollection.findOneAndUpdate(
        { _id: memberId },
        { $set: existingMember },
        { new: true },
      );

      return res.status(200).json({
        data: updatedMember,
      });
    } catch (e) {
      next(e);
    }
  }

  async searchMember(req, res) {
    const query = req?.body;
    const limit = query?.limit ?? 10;
    const skip = query?.skip ?? 0;
    const matchQuery = [
      {
        $sort: { created_at: -1 },
      },
    ];

    if (query?.name) {
      matchQuery.unshift({
        name: { $regex: query.name, $options: 'i' },
      });
    }

    try {
      const mongoQuery = [];
      if (matchQuery?.length) {
        mongoQuery.push({
          $match: {
            $and: matchQuery,
          },
        });
      }
      mongoQuery.push({
        $facet: {
          pagination: [{ $count: 'total' }, { $addFields: { limit: limit, offset: skip } }],
          data: [{ $skip: skip }, { $limit: limit }],
        },
      });
      const contacts = await memberCollection.aggregate(mongoQuery);
      return res.status(200).json({
        data: contacts,
      });
    } catch (e) {
      return res.status(200).json({
        data: [],
      });
    }
  }

  async deleteMember(req, res, next) {
    const memberId = req?.params?.id;

    try {
      const deletedResource = await memberCollection.findByIdAndDelete({ _id: memberId });

      if (!deletedResource) {
        return res.status(404).json({ error: 'Resource not found' });
      }

      res.json({ message: 'Resource deleted successfully' });
    } catch (e) {
      next(e);
    }
  }
};
