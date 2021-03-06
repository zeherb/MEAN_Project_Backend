const express = require('express')
const morgan = require('morgan')
// connect to database 
const connect = require('./database/connect');
const bearerStratigy = require('./strategy/bearerStrategy')
const http = require('http');


const app = express()
// morgan config
app.use(morgan('dev'))
// parse application/json
app.use(express.json())
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))
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


const userApi = require('./routes/userRoute')
const authApi = require('./routes/authRoute')
const eventApi = require('./routes/eventRoute')
const forgottenPasswordApi = require('./routes/forgottenPasswordRoute')
const tagApi = require('./routes/tagRoute')
const ticketApi = require('./routes/ticketRoute')
const reservationApi = require('./routes/reservationRoute');
const notificationApi = require('./routes/notificationRoute')
const socketApi = require('./routes/socketRoute')


app.use('/event-pics', express.static('uploads/event-pics'))
app.use('/avatar', express.static('uploads/avatars'))
app.use('/qrCodes', express.static('qrCodes'))
app.use('/tickets', express.static('tickets'))



app.use('', userApi)
app.use('', authApi)
app.use('', eventApi)
app.use('', forgottenPasswordApi)
app.use('', tagApi)
app.use('', ticketApi)
app.use('', reservationApi)
app.use('', notificationApi)
app.use('', socketApi)


var socket;
const server = http.createServer(app);

const io = require('socket.io')(server);
io.on('connection', sockett => {
    socket = sockett;
    console.log('Socket: client connected', sockett.id);
    socket.emit('connected');
    socket.on('disconnect', () => {
        console.log('disconnected')
    })
});

app.set('io', io)
server.listen(port, () => {
    console.log(`Application listening at http://localhost:${port}`)
})



