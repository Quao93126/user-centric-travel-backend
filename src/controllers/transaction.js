const transactionModel = require('../models/transaction')
const { success, failed } = require('../helpers/response')
// const QRCode = require('qrcode')

const transaction = {
    getall: (req,res) => {
        try {
            transactionModel.getall()
            .then((result) => {
                success(res, result, `Here are the booking that data you requested`)
            }).catch((err) => {
                failed(res, [], err)
            })
        } catch (error) {
            failed(res, [], `Internal Server Error`)
        }
    },
    insertbooking: (req,res) => {
        try {
            const body = req.body
            const date = new Date(body.date)
            const dateUTC = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
            const dateOnly = dateUTC.toISOString().split('T')[0]
            const data = {
                id: body.id,
                userid: body.userid,
                bnumber: body.number,
                bpost: body.post,
                btime: body.time,
                bcost: body.cost,
                multi: body.multi,
                btype: body.type,
                bdate: dateOnly
            }
            transactionModel.insertbooking(data)
            .then((result) => {
                success(res, result, `Data Booking Success`)
            }).catch((err) => {
                failed(res, [], err.message)
            })
        } catch (error) {
            failed(res,[], `Internal Server Error`)
        }
    },
    bookingdetail: (req,res) => {
        try {
            const id = req.params.idtransaction

            transactionModel.bookingdetail(id)
            .then((result) => {
                success(res, result, `Data Detail Booking`)

            }).catch((err) => {
                (res, [], err.message)
            })
        } catch (error) {
            failed(res, [], `Internal Server Error`)
        }
    },
    bookinguser: (req, res) => {
        try {
            const id = req.params.iduser
            transactionModel.bookinguser(id)
            .then((result) => {
                success(res, result, `Data Booking User`)
            }).catch((err) => {
                (res, [], err.message)
            })
        } catch (error) {
            failed(res,[], `Internal Server Error`)
        }
    },
    deletebooking: (req,res) => {
        try {
            const body = req.body
            const date = new Date(body.date)
            const dateUTC = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
            const dateOnly = dateUTC.toISOString().split('T')[0]
            const data = {
                userid: body.userid,
                bnumber: body.number,
                bpost: body.post,
                btime: body.time,
                bcost: body.cost,
                // multi: body.multi,
                btype: body.type,
                bdate: dateOnly
            }
            transactionModel.deletebooking(data)
            .then((result) => {
                success(res, result, `Delete Booking Success`)
            }).catch((err) => {
                failed(res, [], err.message)
            })
        } catch (error) {
            failed(res,[], `Internal Server Error`)
        }
    },
    updatebooking: (req,res) => {
        try {
            const body = req.body
            const date = new Date(body.date)
            const dateUTC = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
            const dateOnly = dateUTC.toISOString().split('T')[0]
            const data = {
                userid: body.userid,
                bnumber: body.number,
                bpost: body.post,
                btime: body.time,
                bcost: body.cost,
                // multi: body.multi,
                btype: body.type,
                bdate: dateOnly
            }
            transactionModel.updatebooking(data)
            .then((result) => {
                success(res, result, `Delete Booking Success`)
            }).catch((err) => {
                failed(res, [], err.message)
            })
        } catch (error) {
            failed(res,[], `Internal Server Error`)
        }
    }
}

module.exports = transaction