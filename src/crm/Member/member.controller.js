/* eslint-disable no-unused-vars */
const express = require('express');
const BookServices = require('./member.service');
const router = express.Router();
const { authenticateJWT } = require('../../infrastructures/middlewares/authenticate.middleware');
const { validate } = require('../../infrastructures/utils/validation');
const SaveMemberValidation = require('./validators/member.validator');

const memberservice = new BookServices();

router.get('/', authenticateJWT, memberservice.getMemberList);
router.get('/:id', authenticateJWT, memberservice.getMemberById);
router.post('/', authenticateJWT, SaveMemberValidation(), validate, memberservice.saveMember);
router.get('/search', authenticateJWT, memberservice.searchMember);
router.post('/update', authenticateJWT, SaveMemberValidation(), validate, memberservice.updateMember);
router.get('/delete/:id', authenticateJWT, memberservice.deleteMember);

module.exports = router;
