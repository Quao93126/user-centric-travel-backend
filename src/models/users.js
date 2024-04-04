const db = require('../configs/db')
const users = {
  register: data => {
    console.log("dddd")
    return new Promise((resolve, reject) => {
      db.query('SHOW TABLES LIKE "users"', (err, results) => {
        if (err) {
          reject(new Error(err))
        } else {
          if (results.length === 0) {
            const createTableQuery = `
                CREATE TABLE users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255),
                    email VARCHAR(255),
                    password VARCHAR(255),
                    phonenumber VARCHAR(255),
                    location VARCHAR(255),
                    refreshToken VARCHAR(255),
                    image VARCHAR(255),
                    userrole VARCHAR(255),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )`
            db.query(createTableQuery, (err, result) => {
              if (err) {
                reject(new Error(err))
              } else {
                db.query('INSERT INTO users SET ?', data, (err, result) => {
                  if (err) {
                    reject(new Error(err))
                  } else {
                    resolve(result)
                  }
                })
              }
            })
          } else {
            db.query('INSERT INTO users SET ?', data, (err, result) => {
              if (err) {
                reject(new Error(err))
              } else {
                resolve(result)
              }
            })
          }
        }
      })
    })
  },
  login: data => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM users WHERE email = '${data.email}'`,
        (err, result) => {
          if (err || result.length === 0) {
            reject(new Error(err))
          } else {
            resolve(result)
          }
        }
      )
    })
  },
  logout: id => {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE users SET refreshToken = null WHERE id='${id}'`,
        (err, result) => {
          if (err) {
            reject(new Error(err))
          } else {
            resolve(result)
          }
        }
      )
    })
  },
  updateRefreshToken: (token, id) => {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE users SET refreshToken='${token}' WHERE id='${id}'`,
        (err, result) => {
          if (err) {
            reject(new Error(err))
          } else {
            resolve(result)
          }
        }
      )
    })
  },
  newPassword: (password, userkey) => {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE users SET password='${password}' WHERE userkey='${userkey}'`,
        (err, result) => {
          if (err) {
            reject(new Error(err))
          } else {
            resolve(result)
          }
        }
      )
    })
  },
  resetKey: email => {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE users SET userkey= null WHERE email='${email}'`,
        (err, result) => {
          if (err) {
            reject(new Error(err))
          } else {
            resolve(result)
          }
        }
      )
    })
  },
  updateUserKey: (userKey, email) => {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE users SET userKey='${userKey}' WHERE email='${email}'`,
        (err, result) => {
          if (err) {
            reject(new Error(err))
          } else {
            resolve(result)
          }
        }
      )
    })
  },
  checkRefreshToken: refreshToken => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT *FROM users WHERE refreshToken='${refreshToken}'`,
        (err, result) => {
          if (err) {
            reject(new Error(err))
          } else {
            resolve(result)
          }
        }
      )
    })
  },
  getAll: () => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM users INNER JOIN location ON users.idlocation = location.idlocation`,
        (err, result) => {
          if (err) {
            reject(new Error(err))
          } else {
            resolve(result)
          }
        }
      )
    })
  },
  getDetail: iduser => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM users INNER JOIN location ON users.idlocation = location.idlocation WHERE users.iduser ='${iduser}'`,
        (err, result) => {
          if (err) {
            reject(new Error(err))
          } else {
            resolve(result)
          }
        }
      )
    })
  },
  insert: data => {
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO users (email, username, password, level, image, address ) VALUES ('${data.email}', '${data.username}', '${data.password}', '${data.level}', '${data.image}', '${data.address}')`,
        (err, result) => {
          if (err) {
            reject(new Error(err))
          } else {
            resolve(result)
          }
        }
      )
    })
  },
  update: (data, iduser) => {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE users SET ? WHERE iduser=?`,
        [data, iduser],
        (err, result) => {
          if (err) {
            console.log(new Error(err))
            reject(new Error(err))
          } else {
            resolve(result)
          }
        }
      )
    })
  },
  delete: iduser => {
    return new Promise((resolve, reject) => {
      db.query(
        `DELETE FROM users WHERE iduser = '${iduser}'`,
        (err, result) => {
          if (err) {
            reject(new Error(err))
          } else {
            resolve(result)
          }
        }
      )
    })
  },
  getUsers: data => {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE users SET active = 1 WHERE email= '${data}'`,
        (err, result) => {
          if (err) {
            reject(new Error(err))
          } else {
            resolve(result)
          }
        }
      )
    })
  },
  getEmailUsers: email => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT *FROM users WHERE email='${email}'`, (err, result) => {
        if (err) {
          reject(new Error(err))
        } else {
          if (result.length > 0) {
            resolve(result)
          } else {
            reject(`Email tidak ditemukan`)
          }
        }
      })
    })
  },
  checkTelegramUser: useridtelegram => {
    return new Promise((resolve, reject) => {
      console.log('useridtelegram ', useridtelegram)
      db.query(
        `SELECT COUNT(*) AS count FROM users  WHERE useridtelegram=${useridtelegram}`,
        (err, result) => {
          if (err) {
            reject(new Error(err))
          } else {
            resolve(result[0])
          }
        }
      )
    })
  },
  getTelegramUser: useridtelegram => {
    return new Promise((resolve, reject) => {
      console.log('useridtelegram ', useridtelegram)
      db.query(
        `SELECT *FROM users WHERE useridtelegram='${useridtelegram}'`,
        (err, result) => {
          if (err) {
            reject(new Error(err))
          } else {
            resolve(result)
          }
        }
      )
    })
  },
  insertTelegramUser: data => {
    return new Promise((resolve, reject) => {
      console.log('data')
      console.log(data)
      db.query(
        `INSERT INTO users (username,  useridtelegram ,active) VALUES ('${data.username}', '${data.useridtelegram}', '${data.active}')`,
        (err, result) => {
          if (err) {
            reject(new Error(err))
          } else {
            resolve(result)
          }
        }
      )
    })
  },
  addCountry: data => {
    return new Promise((resolve, reject) => {
      db.query('SHOW TABLES LIKE "country"', (err, results) => {
        if (err) {
          reject(new Error(err))
        } else {
          if (results.length === 0) {
            const createTableQuery = `
                CREATE TABLE country (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    title VARCHAR(255),
                    score VARCHAR(255),
                    value VARCHAR(255)
                )`
            db.query(createTableQuery, (err, result) => {
              if (err) {
                reject(new Error(err))
              } else {
                db.query('INSERT INTO country SET ?', data, (err, result) => {
                  if (err) {
                    reject(new Error(err))
                  } else {
                    resolve(result)
                  }
                })
              }
            })
          } else {
            db.query('INSERT INTO country SET ?', data, (err, result) => {
              if (err) {
                reject(new Error(err))
              } else {
                resolve(result)
              }
            })
          }
        }
      })
    })
  },
  getallCountry: () =>{
    return new Promise((resolve,reject) => {
        db.query(`SELECT *FROM country`, (err,result) => {
            if(err){
                reject(new Error(err))
            }else{
                resolve(result)
            }
        })
    })
  },
  addCity: data => {
    return new Promise((resolve, reject) => {
      db.query('SHOW TABLES LIKE "city"', (err, results) => {
        if (err) {
          reject(new Error(err))
        } else {
          if (results.length === 0) {
            const createTableQuery = `
                CREATE TABLE city (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    cityname VARCHAR(255),
                    score VARCHAR(255),
                    country VARCHAR(255)
                )`
            db.query(createTableQuery, (err, result) => {
              if (err) {
                reject(new Error(err))
              } else {
                db.query('INSERT INTO city SET ?', data, (err, result) => {
                  if (err) {
                    reject(new Error(err))
                  } else {
                    resolve(result)
                  }
                })
              }
            })
          } else {
            db.query('INSERT INTO city SET ?', data, (err, result) => {
              if (err) {
                reject(new Error(err))
              } else {
                resolve(result)
              }
            })
          }
        }
      })
    })
  },
  getallCity: () =>{
    return new Promise((resolve,reject) => {
        db.query(`SELECT *FROM city`, (err,result) => {
            if(err){
                reject(new Error(err))
            }else{
                resolve(result)
            }
        })
    })
  },
}
module.exports = users
