const express = require('express');
const Razorpay = require('razorpay');
const router = express.Router();
require("dotenv").config();

router.post('/orders',async(req,res)=>{
    console.log('✅ /orders route hit');
    try{
        console.log("Payment order request body :",req.body);
    const razorpay = new Razorpay({
        key_id : process.env.RAZORPAY_KEY_ID,
        key_secret : process.env.RAZORPAY_SECRET ,
    });

    const options = req.body;
    const order = await razorpay.orders.create(options);

    if(!order){
        return res.status(500).send("Error");
    }
    console.log("Razorpay order created :",order);

    res.json(order);
    }
    catch(err){
    console.error("Error in /order route :",err);
    res.status(500).send("Error");
}
});

module.exports = router;