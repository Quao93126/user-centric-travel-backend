const express = require('express');
const usersController = require('../controllers/users')
const { authenticate, authorize } = require('../helpers/auth')

const router = express.Router();

router
    // Register
    .post('/register',  usersController.register)
    // Login
    .post('/login', usersController.login)
    // Insert
    .post('/insert', authenticate, authorize, usersController.insert)
    // Refresh Token
    .post('/refreshToken', usersController.renewToken)
    // Logout
    .post('/logout/:iduser', usersController.logout)
    // Forgot Password
    .post('/ForgotPassword', usersController.ForgotPassword)
    // Send New Password
    .post('/newPassword/:userkey', usersController.newPassword)
    // Verify Token
    .get('/verify/:token', usersController.verify)
    // Get All
    .get('/getall', usersController.getAll)
    // Get All Detail
    .get('/getDetail/:iduser', authenticate, authorize, usersController.getDetail)
    // Update 
    // .patch('/update/:iduser', authenticate, authorize, usersController.update)
    .patch('/update', usersController.update)
    // Delete
    // .delete('/delete/:iduser', authenticate, authorize, usersController.delete)
    .delete('/deleteUser', usersController.deleteUser)
    // add country
    .post('/addCountry',  usersController.addCountry)
    .post('/addCountryCityScore',  usersController.addCountryCityScore)
    .patch('/updateCountry', usersController.updateCountry)
    .get('/getallCountry', usersController.getAllCountry)
    .get('/getAllCountryCityScore', usersController.getAllCountryCityScore)
    .post('/addCity',  usersController.addCity)
    .get('/getallCity', usersController.getAllCity)
module.exports = router;