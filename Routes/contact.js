require('dotenv').config();
const express = require('express')
const Router = express.Router()
const Contact = require('../models/Contact')
const jwt = require('jsonwebtoken')

// add contact

// Router.post('/add-contact',(req,res)=>{
//     const newContact = new Contact({
//         fullName:req.body.name,
//         email:req.body.person_email,
//         phone:req.body.person_phone,
//         address:req.body.add
//     })

//     newContact.save()
//     .then((newData)=>{
//         console.log('data saved')
//         res.status(200).json({
//            result:newData
//         })
//     })
//     .catch((err)=>{
//         console.log(err)
//         res.status(500).json({
//             error:err
//         })
//     })
// })


Router.post('/add-contact',async(req,res)=>{
    try {
        // console.log(req.headers.authorization.split(" ")[1])
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = await jwt.verify(token,process.env.SEC_KEY)
        console.log(tokenData)
        const newContact = new Contact({
            fullName: req.body.fullName,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            gender:req.body.gender,
            userId:tokenData.userId
        })
        
        const newData = await newContact.save()
        res.status(200).json({
            result:newData
        })

    }
    catch(err)
    {
        console.log(err)
        res.status(500).json({
            error:err
        })
    }
})

// get all contact
Router.get('/all-contact',async(req,res)=>{
    try
    {
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = await jwt.verify(token,process.env.SEC_KEY)
        const allContact = await Contact.find({userId:tokenData.userId}).select("_id fullName email phone address gender userId")
        res.status(200).json({
            contacts:allContact
        })
    }
    catch(err)
    {
        console.log(err)
        res.status(500).json({
            error:err
        })
    }
})


// get contact by id
Router.get('/contactById/:id',async(req,res)=>{
    try
    {
        // console.log(req.params.id)
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = await jwt.verify(token,process.env.SEC_KEY)
        const id = req.params.id
        // const data = await Contact.findById(id).select("_id fullName email phone address gender userId")
        const data = await Contact.find({_id:req.params.id,userId:tokenData.userId})
        return res.status(200).json({
            contact:data.length>0 ? data[0] : {}
        })
        


    }
    catch(err)
    {
        console.log(err)
        res.status(500).json({
            error:err
        })
    }
})

// get contact by gender
Router.get('/gender/:g',async(req,res)=>{
    try
    {
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = await jwt.verify(token,process.env.SEC_KEY)
        const contact = await Contact.find({gender:req.params.g,userId:tokenData.userId})
        res.status(200).json({
            contact:contact
        })
    }
    catch(err)
    {
        console.log(err)
        res.status(500).json({
            error:err
        })
    }
})

// delete api 
Router.delete('/:id',async(req,res)=>{
    try
    {
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = await jwt.verify(token,process.env.SEC_KEY)
        await Contact.deleteOne({_id:req.params.id,userId:tokenData.userId})
        res.status(200).json({
            msg:'data deleted'
        })
    }
    catch(err)
    {
        console.log(err)
        res.status(500).json({
            error:err
        })
    }
})

// delete many data
Router.delete('/byGender/:gender',async(req,res)=>{
    try
    {
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = await jwt.verify(token,process.env.SEC_KEY)
        await Contact.deleteMany({gender:req.params.gender,userId:tokenData.userId})
        res.status(200).json({
            msg:'all contact of this gender deleted....'
        })
    }
    catch(err)
    {
        console.log(err)
        res.status(500).json({
            error:err
        })
    }
})


// Update
Router.update('/update/:id',async(req,res)=>{
    try{
        console.log(req.body)
        const newdata = new Contact({
            fullName:req.body.fullname,
            email:req.body.email,
            phone:req.body.phone,
            address: req.body.address,
            gender:req.body.gender
        })
        await Contact.findByIdAndUpdate({_id:req.params.id,(new newdata)})
        res.status(200).json({
            msg:'data updated'
        })
    }
    catch(err)
    {
        console.log(err)
        res.status(500).json({
            error:err
        })
    }
})





module.exports = Router