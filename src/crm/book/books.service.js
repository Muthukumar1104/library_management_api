const CustomError = require('../../infrastructures/errors/custom.error');
const { bookCollection } = require('../../infrastructures/schemas');
const logger = require('../../infrastructures/utils/logger');
// const omit = require('lodash.omit');
const Common = require('../common/common');

const common = new Common();

// Book Services
module.exports = class ContactServices {
  async getBookList(req, res, next) {
    try {
      const query = req?.query;
      const limit = query?.limit ? +query?.limit : 10;
      const skip = query?.skip ? +query?.skip : 0;
      const archived = query?.archived === 'true';
      const mongoQuery = [];
      mongoQuery.push({
        $match: {
          is_deleted: archived,
          $or: [
            { title: { $regex: query.search, $options: 'i' } },
            {
              author: { $regex: query.search, $options: 'i' },
            },
          ],
        },
      });
      mongoQuery.push({
        $facet: {
          pagination: [{ $count: 'total' }, { $addFields: { limit: limit, offset: skip } }],
          data: [{ $skip: skip }, { $limit: limit }],
        },
      });

      const book = await bookCollection.aggregate(mongoQuery);
      return res.status(200).json({
        data: {
          pagination: book[0]?.pagination?.length
            ? {
                ...book[0]?.pagination[0],
              }
            : {
                total: 0,
                limit: limit,
                offset: skip,
              },
          data: book[0]?.data ?? [],
        },
      });
    } catch (e) {
      next(e);
    }
  }

  async getBookByIds(bookIds) {
    logger.log('getContactByIds');
    const book = await bookCollection.find({
      _id: bookIds,
    });
    return book ?? [];
  }

  async getBookById(req, res, next) {
    try {
      const data = req?.params;
      // Valid the id.
      await common.isObjectId(data?.id);
      const books = await bookCollection.findById({ _id: data?.id });
      if (!books?._id) throw new CustomError('Contacts not found', 404);
      return res.status(200).json({
        data: books,
      });
    } catch (e) {
      next(e);
    }
  }

  async saveBook(req, res, next) {
    // const error =
    logger.log('saveBook');
    const bookData = req?.body;
    try {
      const isContactExists = await bookCollection.findOne({
        title: bookData?.title,
        is_deleted: false,
      });

      const book = isContactExists || new bookCollection();
      book.title = bookData.title;
      book.author = bookData.author;
      book.quantity = bookData.quantity;
      book.rentfee = bookData.rentfee;
      book.created_date = new Date().toLocaleDateString();

      const bookDocument = await bookCollection.findOneAndUpdate({ title: bookData?.title }, book, {
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

  async updateBook(req, res, next) {
    try {
      const bookId = req.body.id;
      const bookData = req.body;

      const existingBook = await bookCollection.findOne({
        _id: bookId,
        is_deleted: false,
      });

      if (!existingBook) {
        return res.status(404).json({ error: 'Book not found' });
      }

      existingBook.title = bookData.title;
      existingBook.author = bookData.author;
      existingBook.quantity = bookData.quantity;
      existingBook.rentfee = bookData.rentfee;
      const updatedBook = await bookCollection.findOneAndUpdate({ _id: bookId }, { $set: existingBook }, { new: true });

      return res.status(200).json({
        data: updatedBook,
      });
    } catch (e) {
      next(e);
    }
  }

  async searchBook(req, res) {
    const query = req?.body;
    const limit = query?.limit ?? 10;
    const skip = query?.skip ?? 0;
    const matchQuery = [
      {
        $sort: { created_at: -1 },
      },
    ];

    if (query?.title) {
      matchQuery.unshift({
        title: { $regex: query.title, $options: 'i' },
      });
    }

    if (query?.author) {
      matchQuery.unshift({
        author: { $regex: query.author, $options: 'i' },
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
      const contacts = await bookCollection.aggregate(mongoQuery);
      return res.status(200).json({
        data: contacts,
      });
    } catch (e) {
      return res.status(200).json({
        data: [],
      });
    }
  }

  async deleteBook(req, res, next) {
    const bookId = req?.params?.id;

    try {
      const deletedResource = await bookCollection.findByIdAndDelete({ _id: bookId });

      if (!deletedResource) {
        return res.status(404).json({ error: 'Resource not found' });
      }

      res.json({ message: 'Resource deleted successfully' });
    } catch (e) {
      next(e);
    }
  }
};
