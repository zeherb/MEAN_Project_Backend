const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser');
// connect to database 
const connect = require('./database/connect');
const app = express()
// morgan config
app.use(morgan('dev'))
// parse application/json
app.use(bodyParser.json())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// dotenv config
require('dotenv').config()
// cors
const cors = require("cors");
app.use(cors());

// port config
const port = 3000

app.get('/', (req, res) => {
    res.json({ message: 'Hello World!' })
})
app.listen(port, () => {
    console.log(`Application listening at http://localhost:${port}`)
})

const userApi = require('./routes/userRoute')
const authApi = require('./routes/authRoute')
const eventApi = require('./routes/eventRoute')
const forgottenPasswordApi = require('./routes/forgottenPasswordRoute')
const tagApi = require('./routes/tagRoute')
const ticketApi = require('./routes/ticketRoute')
const reservationApi = require('./routes/reservationRoute')

app.use('', userApi)
app.use('', authApi)
app.use('', eventApi)
app.use('', forgottenPasswordApi)
app.use('', tagApi)
app.use('', ticketApi)
app.use('', reservationApi)