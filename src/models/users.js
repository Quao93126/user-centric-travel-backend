const db = require('../configs/db')
const users = {
  register: data => {
    return new Promise((resolve, reject) => {
      // db.query('SHOW COLUMNS FROM `users` LIKE "city"', (err, results) => {
      //   if (err){console.log("error----")}
      //   else {
      //     console.log("success-------", results.length)
      //     if (results.length ===0) {
      //       db.query("DROP TABLE users", function (err, result) {
      //         if (err) throw err;
      //         console.log("Table deleted");
      //       });
      //     }

      //   }
      // })
      
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
                    score VARCHAR(255),
                    country VARCHAR(255),
                    city VARCHAR(255),
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
        `SELECT * FROM users`,
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
  update: (data) => {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE users SET name=?, score=?, userrole=? WHERE email=?`,
        [data.name, data.score, data.userrole, data.email],
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
  deleteUser: idEmail => {
    return new Promise((resolve, reject) => {
      db.query(
        `DELETE FROM users WHERE email = '${idEmail}'`,
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
  updateCountry: (data, prev) => {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE country SET ? WHERE title=?`,
        [data, prev],
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
  getAllCountryCityScore: (id) =>{
    return new Promise((resolve,reject) => {
        db.query(`SELECT country, city, score FROM users WHERE id = ?`, id, (err,result) => {
            if(err){
                reject(new Error(err))
            }else{
                resolve(result)
            }
        })
    })
  },
  addCountryCityScore: data => {
    return new Promise((resolve, reject) => {
      db.query('SHOW TABLES LIKE "users"', (err, results) => {
        if (err) {
          reject(new Error(err))
        } else {
          // db.query('INSERT INTO users SET ?', data, (err, result) => {
          //   if (err) {
          //     reject(new Error(err))
          //   } else {
          //     resolve(result)
          //   }
          // })
          db.query('SELECT * FROM users WHERE id = ?', data.id, (err, rows) => {
            if (err) {
              reject(new Error(err))
            } else {
              if (rows.length > 0) {
                // const userId = rows[0].id; // Assuming you have an 'id' column in your users table
                // Update the country and city for the matched row
                db.query('UPDATE users SET country = ?, city = ?, score = ? WHERE id = ?', [data.country, data.city, data.score, data.id], (err, result) => {
                  if (err) {
                    reject(new Error(err))
                  } else {
                    resolve(result)
                  }
                });
              } else {
                console.log('User with name "fff" not found.');
              }
            }
          });



          
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
