const express = require('express');
const cors = require('cors')
const ejs = require('ejs')
const path = require('path')
const bodyParser = require('body-parser')
const usersRouter = require('./src/routes/users')
const locationRouter = require('./src/routes/location')
const transactionRouter = require('./src/routes/transaction')
const { PORT } = require('./src/helpers/env')


const app = express();
app.set('views', path.join(__dirname,'src/views'))
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())
var corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200,
  };
app.use(express.static('src/uploads'))
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
  });


app.use(cors(corsOptions))

app.use('/users', usersRouter)
app.use('/location', locationRouter)
app.use('/transaction', transactionRouter)

app.listen(PORT, () => {
    console.log(`App is running at port ${PORT}`)
});


