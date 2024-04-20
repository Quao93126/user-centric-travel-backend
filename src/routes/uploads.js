const express = require('express');
const cityImgUploadController = require('../controllers/uploads');

const router = express.Router();
router
    .get('/cityImg/:filename', cityImgUploadController.show)



module.exports = router;
