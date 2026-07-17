const dns = require('dns');
// Set DNS servers if the local resolver is 127.0.0.1/localhost to avoid querySrv ECONNREFUSED on Windows
if (dns.getServers().includes('127.0.0.1') || dns.getServers().includes('::1') || dns.getServers().length === 0) {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
}


require('dotenv').config()
const express = require('express')
const app = express()
const userRoute = require('./Routes/user')
const contactRoute = require('./Routes/contact')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')


// mongoose.connect('')
// .then(()=>{
//     console.log('connected with database')
// })
// .catch(err=>{
//     console.log('something is wrong')
//     console.log(err)
// })

const connectWithDatabase = async()=>{
    try
    {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log('connected with database')
    }
    catch(err)
    {
        console.log('something is wrong')
        console.log(err)
    }
}

connectWithDatabase()


app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

app.use('/user',userRoute)
app.use('/contact',contactRoute)

module.exports = app