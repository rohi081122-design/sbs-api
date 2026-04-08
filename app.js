const express = require('express')
const app = express()
const userRoute = require('./Routes/user')
const contactRoute = require('./Routes/contact')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')


// mongoose.connect('mongodb+srv://satya:sbs1234@sbs.9mhgu1h.mongodb.net/?appName=SBS')
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
        await mongoose.connect('mongodb+srv://surag:sp1234@projectsb.b3s5063.mongodb.net/?appName=projectsb')
        console.log('connected with database')
    }
    catch(err)
    {
        console.log('something is wrong')
        console.log(err)
    }
}

connectWithDatabase()


app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

app.use('/user',userRoute)
app.use('/contact',contactRoute)

module.exports = app