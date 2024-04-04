const express = require('express');
const transactionController = require('../controllers/transaction');
const { authenticate, authorize } = require('../helpers/auth')



const router = express.Router();

router
    .get('/getall', authenticate,authorize, transactionController.getall) // admin
    .post('/booking', authenticate, authorize, transactionController.insertbooking) //insert
    .get('/bookingdetail/:idtransaction', authenticate, authorize, transactionController.bookingdetail) //detailtransaksi
    .get('/bookingusers/:iduser', authenticate, authorize, transactionController.bookinguser) //halaman booking user
    .post('/deletebooking', authenticate, authorize, transactionController.deletebooking) //delete
    .post('/updatebooking', authenticate, authorize, transactionController.updatebooking) //update

module.exports = router;