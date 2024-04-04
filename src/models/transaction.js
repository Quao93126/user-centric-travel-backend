const db = require('../configs/db')

const transaction = {
    getall: () =>{
        return new Promise((resolve,reject) => {
            db.query(`SELECT *FROM transaction`, (err,result) => {
                if(err){
                    reject(new Error(err))
                }else{
                    resolve(result)
                }
            })
        })
    },
    insertbooking : (data) => {
        return new Promise((resolve, reject) => {
          db.query('SHOW TABLES LIKE "transaction"', (err, results) => {
            if (err) {
              reject(new Error(err))
            } else {
              if (results.length === 0) {
                const createTableQuery = `
                    CREATE TABLE transaction (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        userid VARCHAR(255),
                        bnumber VARCHAR(255),
                        bpost VARCHAR(255),
                        btime VARCHAR(255),
                        bcost VARCHAR(255),
                        btype VARCHAR(255),
                        multi VARCHAR(255),
                        bdate DATETIME
                    )`
                db.query(createTableQuery, (err, result) => {
                  if (err) {
                    reject(new Error(err))
                  } else {
                    db.query('INSERT INTO transaction SET ?', data, (err, result) => {
                      if (err) {
                        reject(new Error(err))
                      } else {
                        resolve(result)
                      }
                    })
                  }
                })
              } else {
                db.query('INSERT INTO transaction SET ?', data, (err, result) => {
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
      
    bookingdetail: (id) => {
        return new Promise((resolve,reject) => {
            db.query(`SELECT *FROM transaction WHERE userid = '${id}'`,
            (err,result) => {
                if(err) {
                    reject(new Error(err))
                }else{
                    resolve(result)
                }
            } )
        })
    },
    bookinguser: (id) =>{
        return new Promise((resolve, reject) => {
            db.query(`SELECT *FROM transaction WHERE userid = '${id}'`,
            (err,result) => {
                if(err) {
                    reject(new Error(err))
                }else {
                    resolve(result)
                }
            })
        })
    },
    deletebooking: (data) => {
      console.log(data.bdate)
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM transaction WHERE userid = ? AND bnumber = ? AND bpost = ? AND btime = ? AND bcost = ? AND btype = ? AND bdate = ?`, [data.userid, data.bnumber, data.bpost, data.btime, data.bcost, data.btype, data.bdate], (err, result) => {
                if (err) {
                  reject(new Error(err))
                } else {
                  resolve(result)
                }
            })
        })
    },
    updatebooking: (data) => {
      return new Promise((resolve, reject) => {
        db.query(`UPDATE transaction SET bcost = ? WHERE userid = ? AND bnumber = ? AND bpost = ? AND btime = ? AND btype = ? AND bdate = ?`, 
          [data.bcost, data.userid, data.bnumber, data.bpost, data.btime, data.btype, data.bdate], 
          (err, result) => {
            if (err) {
              reject(new Error(err));
            } else {
              resolve(result);
            }
          });
      });
    }
}

module.exports = transaction