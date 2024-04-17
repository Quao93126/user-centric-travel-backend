const usersModel = require('../models/users')
const { success, failed, tokenStatus } = require('../helpers/response')
const { JWT_KEY, passwordd, emaill, url, urlforgot } = require('../helpers/env')
const upload = require('../helpers/upload')
const fs = require('fs')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mailer = require('nodemailer')
const response = require('../helpers/response')
const users = {
    register: async (req, res) => {
        try {
            const body = req.body
            const salt = await bcrypt.genSalt(10)
            const hashWord = await bcrypt.hash(body.password, salt)
            let usrrole = "user"
            // const usernamefromname = body.username.replace(/[^0-9a-z]/gi, '')
            if (body.email === "que.quao126@gmail.com") {
                usrrole = "admin"
            }
            const data = {
                name: body.username, 
                email: body.email,
                password: hashWord,
                refreshToken: null,
                country: "",
                city: "",
                score: "0",
                userrole: usrrole,
            }
            
            const token = jwt.sign({
                email: data.email,
                username: data.username
            }, JWT_KEY, {
                expiresIn: '30d'
            })
            
            data.refreshToken = token
            usersModel.register(data)
            .then(() => {
                console.log("Set Cookie")
                res.cookie('jwt', token, {
                    httpOnly: true,
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    sameSite: 'strict'
                })
                res.json({
                    message: `Success Registration`
                })
            })
            .catch((err) => {
                failed(res, [], err.message)
            })
        } catch (error) {
            failed(res, [], 'Internal server error!')            
        }
    },
    verify: (req,res) => {
        const token = req.params.token
        if(token) {
            jwt.verify(token, JWT_KEY, (err,decode) => {
                if(err){
                    res.status(505)
                    failed(res, [], `Failed Activation`)
                }else{
                    const email = decode.email
                    usersModel.getUsers(email)
                    .then((result) => {
                        if(result.affectedRows){
                            res.status(200)
                            // success(res, {email}, `Congrats Gaes`)
                            res.render('index', {email})
                        }else{
                            res.status(505)
                            failed(res, [], err.message)
                        }
                    })
                    .catch((err)=>{
                        res.status(505)
                        response.failed(res, [], err.message)
                    })
                }
            })
        }
    },
    login: async (req, res) => {
        try {
            const body = req.body
            usersModel.login(body)
            .then(async(result) => {
                const userData = result[0]
                const hashWord = userData.password
                const userRefreshToken = userData.refreshToken
                const correct = await bcrypt.compare(body.password, hashWord)
                if (correct) {
                    
                    jwt.sign(
                        { 
                            email : userData.email,
                            username : userData.username,
                            role: userData.role
                        },
                        JWT_KEY,
                        { expiresIn: 120 },

                        (err, token) => {
                            if (err) {
                                console.log(err)
                            } else {
                                res.json({
                                    success: true,
                                    token: "JWT " + token,
                                    id: userData.id,
                                    name: userData.name,
                                    email: userData.email,
                                    isAdmin: userData.userrole,
                                });
                            }
                        }
                    ) 
                    
                } else {
                    failed(res, [], "Incorrect password! Please try again")
                }
            })
            .catch((err) => {
                failed(res, [], err.message)
            })
        } catch (error) {
            failed(res, [], 'Internal server error!')
        }
    },
    renewToken: (req, res) =>{
        const refreshToken = req.body.refreshToken
        usersModel.checkRefreshToken(refreshToken)
        .then((result)=>{
            if(result.length >=1){
                const user = result[0];
                const newToken = jwt.sign(
                    {
                        email: user.email,
                        username: user.username,
                        level: user.level
                    },
                    JWT_KEY,
                    {expiresIn: 3600}
                )
                const data = {
                    token: newToken,
                    refreshToken: refreshToken
                }
                tokenStatus(res,data, `The token has been refreshed successfully`)
            }else{
                failed(res,[], `Refresh token not found`)
            }
        }).catch((err) => {
            failed(res, [], err.message)
        })
    },
    logout: (req,res) => {
        try {
            const destroy = req.params.iduser
            usersModel.logout(destroy)
            .then((result) => {
                success(res,result, `Logout Success`)
            }).catch((err) => {
                failed(res,[], err.message)
            })
        } catch (error) {
            failed(res, [], `Internal Server Error`)
        }
    },
    ForgotPassword: (req,res) => {
        try {
            const body = req.body
            const email = body.email
            usersModel.getEmailUsers(body.email)

            .then(() => {
                const userKey = jwt.sign({
                    email: body.email,
                    username: body.username
                }, JWT_KEY)

                usersModel.updateUserKey(userKey,email)
                .then(async() => {
                    let transporter = mailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 587,
                        secure: false,
                        requireTLS: true,
                        auth:{
                            user: emaill,
                            pass: passwordd
                        }
                    })
    
                    let mailOptions = {
                        from    : `ANKASA ${emaill}`,
                        to      : body.email,
                        subject : `Reset Password ${body.email}`,
                        html:
                        `Hai
                        This is an email to reset the password
                        KLIK --> <a href="${urlforgot}/forgot?userkey=${userKey}">Klik this link for Reset Password</a>  <---`
                    }
    
                    transporter.sendMail(mailOptions,(err, result) => {
                        if(err) {
                            res.status(505)
                            failed(res, [], err.message)
                        } else {
                            success(res, [result], `Send Mail Success`)
                        }
                    })
                    res.json({
                        message: `Please Check Email For Reset Password`
                    })
                }).catch((err) =>{
                    failed(res, [], err)
                })
            }).catch((err) =>{
                failed(res, [], err)
            })
        } catch (error) {
            failed(res, [], `Internal Server Error`)
        }
    },
    newPassword: async (req, res) => {
        try {
            const body = req.body
            
            const salt = await bcrypt.genSalt(10)
            const hashWord = await bcrypt.hash(body.password, salt)

            const key = req.params.userkey

            usersModel.newPassword(hashWord ,key)

            .then((result) => {
                success(res, result, `Update Password Success`)
                jwt.verify(key, JWT_KEY, (err,decode) =>{
                    if(err){
                        res.status(505)
                        failed(res, [], `Failed Reset userkey`)
                    }else{
                        const email = decode.email
                        console.log(email)
                        usersModel.resetKey(email)
                        .then((results) => {
                            if(results.affectedRows){
                                res.status(200)
                                success(res, results, `Update Password Success`)
                            }else{
                                res.status(505)
                                // failed(res,[],err.message)
                            }
                        }).catch((err) => {
                            // failed(res, [], err)
                        })
                    }
                })
            }).catch((err) => {
                failed(res, [], err)
            })        
        } catch (error) {
            failed(res, [], `Internal Server Error`)
        }
    },
    getAll: (req, res) => {
        try {
            const body = req.params.body
            usersModel.getAll()
            .then((result) => {
                success(res, result, 'Here are the users that data you requested')
            })
            .catch((err) => {
                failed(res, [], err)
            })
        } catch (error) {
            failed(res, [], 'Internal server error!')
        }
    },
    getDetail: (req, res) => {
        try {
            const iduser = req.params.iduser
            usersModel.getDetail(iduser)
            .then((result) => {
                success(res, result, `Here is the data of users with id ${iduser}`)
            })
            .catch((err) => {
                failed(res, [], err.message)
            })
        } catch (error) {
            failed(res, [], 'Internal server error!')
        }
    },
    insert: (req, res) => {
        try {
            upload.single('image')(req, req, (err) => {
                if(err) {
                    if(err.code === 'LIMIT_FILE_SIZE'){
                        failed(res, [], 'Image size is too big! Please upload another one with size <5mb')
                    } else {
                        failed(res, [], err)
                    }
                } else {
                    const body = req.body
                    body.image = req.file.filename
                    usersModel.insert(body)
                    .then((result) => {
                        success(res, result, 'Image is uploaded successfully')
                    })
                    .catch((err) => {
                        failed(res, [], err.message)
                    })
                }
            })
        } catch (error) {
            failed(res, [], 'Internal server error!')
        }
    },
    update:(req, res) => {
        try {
            const body = req.body
            usersModel.update(body)
            .then((result) => {
                success(res, result, 'Update success')
            })
            .catch((err) => {
                failed(res, [], err.message)
            })
            // upload.single('image')(req, res, (err) => {
            //     if(err){
            //         if(err.code === 'LIMIT_FILE_SIZE'){
            //             failed(res, [], 'Image size is too big! Please upload another one with size <5mb')
            //         } else {
            //             failed(res, [], err)
            //         }
            //     } else {
            //         const iduser = req.params.iduser
            //         const body = req.body
            //         usersModel.getDetail(iduser)
            //         .then((result) => {
            //             const oldImg = result[0].image
            //             body.image = !req.file ? oldImg: req.file.filename
            //             if (body.image !== oldImg) {
            //                 if (oldImg !== '404.png') {
            //                     fs.unlink(`src/uploads/${oldImg}`, (err) => {
            //                         if (err) {
            //                             failed(res, [], err.message)
            //                         } else {
            //                             usersModel.update(body, iduser)
            //                                 .then((result) => {
            //                                     success(res, result, 'Update success')
            //                                 })
            //                                 .catch((err) => {
            //                                     failed(res, [], err.message)
            //                                 })
            //                         }
            //                     })
            //                 } else {
            //                     usersModel.update(body, iduser)
            //                         .then((result) => {
            //                             success(res, result, 'Update success')
            //                         })
            //                         .catch((err) => {
            //                             failed(res, [], err.message)
            //                         })
            //                 }
            //             } else {
            //                 usersModel.update(body, iduser)
            //                     .then((result) => {
            //                         success(res, result, 'Update success')
            //                     })
            //                     .catch((err) => {
            //                         failed(res, [], err.message)
            //                     })
            //             }
            //         })
            //     }
            // })
        } catch (error) {
            failed(res, [], 'Internal server error!')
        }
    },
    delete: (req, res) => {
        try {
            const iduser = req.params.iduser
            usersModel.getDetail(iduser)
            .then((result) => {
                const image = result[0].image
                if(image === '404.png'){
                    usersModel.delete(iduser)
                    .then((result) => {
                        success(res, result, `User with id=${iduser} is deleted!`)
                    })
                    .catch((err) => {
                        failed(res, [], err.message)
                    })
                }else{
                    fs.unlink(`src/uploads/${image}`, (err) => {
                        if(err) {
                            failed(res, [], err.message)
                        } else {
                            usersModel.delete(iduser)
                            .then((result) => {
                                success(res, result, `User with id ${iduser} is deleted!`)
                            })
                            .catch((err) => {
                                failed(res, [], err.message)
                            })
                        }
                    })
                }
            })
            .catch((err) => {
                failed(res, [], err.message)
            })
        } catch (error) {
            failed(res, [], 'Internal server error!')
        }
    },
    deleteUser: (req, res) => {
        try {
            const idEmail = req.query.email;
            usersModel.deleteUser(idEmail)
            .then((result) => {
                success(res, result, `User with email=${iduser} is deleted!`)
            })
            .catch((err) => {
                failed(res, [], err.message)
            })

            // usersModel.getDetail(iduser)
            // .then((result) => {
            //     const image = result[0].image
            //     console.log("-------------------", image)
            //     if(image === '404.png'){
            //         usersModel.delete(iduser)
            //         .then((result) => {
            //             success(res, result, `User with id=${iduser} is deleted!`)
            //         })
            //         .catch((err) => {
            //             failed(res, [], err.message)
            //         })
            //     }else{
            //         fs.unlink(`src/uploads/${image}`, (err) => {
            //             if(err) {
            //                 failed(res, [], err.message)
            //             } else {
            //                 usersModel.delete(iduser)
            //                 .then((result) => {
            //                     success(res, result, `User with id ${iduser} is deleted!`)
            //                 })
            //                 .catch((err) => {
            //                     failed(res, [], err.message)
            //                 })
            //             }
            //         })
            //     }
            // })
            // .catch((err) => {
            //     console.log("ppppppppppp")
            //     failed(res, [], err.message)
            // })
        } catch (error) {
            failed(res, [], 'Internal server error!')
        }
    },
    addCountry: async (req, res) => {
        try {
            const body = req.body

            // const usernamefromname = body.username.replace(/[^0-9a-z]/gi, '')
            const data = {
                title: body.a, 
                score: body.b,
                value: body.c
            }

            usersModel.addCountry(data)
            .then(() => {
                res.json({
                    message: `Success Registration`
                })
            })
            .catch((err) => {
                failed(res, [], err.message)
            })
        } catch (error) {
            failed(res, [], 'Internal server error!')            
        }
    },
    
    updateCountry:(req, res) => {
        try {
            const body = req.body
            const data = {
                title: body.title, 
                score: body.difficultynum,
                value: body.countryCode
            }
            usersModel.updateCountry(data, body.prev)
            .then(() => {
                res.json({
                    message: `Success Update Country`
                })
            })
            .catch((err) => {
                failed(res, [], err.message)
            })
        } catch (error) {
            failed(res, [], 'Internal server error!')
        }
    },
    getAllCountry: (req, res) => {
        try {
            const body = req.params.body
            usersModel.getallCountry()
            .then((result) => {
                success(res, result, 'Here are the users that data you requested')
            })
            .catch((err) => {
                failed(res, [], err)
            })
        } catch (error) {
            failed(res, [], 'Internal server error!')
        }
    },
    getAllCountryCityScore: (req, res) => {
        try {
            const id = parseInt(req.originalUrl.split('?id=')[1]);
            usersModel.getAllCountryCityScore(id)
            .then((result) => {
                success(res, result, 'Here are the users that data you requested')
            })
            .catch((err) => {
                failed(res, [], err)
            })
        } catch (error) {
            failed(res, [], 'Internal server error!')
        }
    },    
    addCountryCityScore: async (req, res) => {
        try {
            const body = req.body

            // const usernamefromname = body.username.replace(/[^0-9a-z]/gi, '')
            const data = {
                id: body.a, // id
                country: body.b, // country
                city: body.c, // city
                score: body.d, // score
            }
            usersModel.addCountryCityScore(data)
            .then(() => {
                res.json({
                    message: `Success Registration`
                })
            })
            .catch((err) => {
                failed(res, [], err.message)
            })
        } catch (error) {
            failed(res, [], 'Internal server error!')            
        }
    },
    addCity: async (req, res) => {
        try {
            const body = req.body

            // const usernamefromname = body.username.replace(/[^0-9a-z]/gi, '')
            debugger;
            const data = {
                cityname: body.city, 
                score: body.difficultyScore,
                country: body.country
            }

            usersModel.addCity(data)
            .then(() => {
                res.json({
                    message: `Success Registration`
                })
            })
            .catch((err) => {
                failed(res, [], err.message)
            })
        } catch (error) {
            failed(res, [], 'Internal server error!')            
        }
    },
    getAllCity: (req, res) => {
        try {
            const body = req.params.body
            usersModel.getallCity()
            .then((result) => {
                success(res, result, 'Here are the users that data you requested')
            })
            .catch((err) => {
                failed(res, [], err)
            })
        } catch (error) {
            failed(res, [], 'Internal server error!')
        }
    },
}


module.exports = users