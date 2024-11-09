const {instance} = require('../../config/razorpay')
const crypto = require("crypto");
require('dotenv').config()
const orderModel = require('../../models/orderProductModel')

exports.checkOut = async(req, res) => {
    try{
        const options = {
            amount: Number(req.body.amount)*100,  // amount in the smallest currency unit
            currency: "INR",
            receipt: "order_rcptid_11",
            notes:{
                name:"arijit",
                title:"barik"
            }
          };
          const order = await instance.orders.create(options)
          return res.status(200).json({
            success: true,
            message: "order is created successfully",
            order
          })
    } catch(err){
        console.log(err)
        return res.status(400).json({
            success: false,
            message: "error while creating order",
            error: err.message
        })
    }
}


//verify payment

exports.paymentVarification = async(req, res) => {
    try{
        // console.log("req.body at payment varification->", req.body)
        // console.log("req at payment varification ->", req)
        
        const {razorpay_payment_id,razorpay_order_id,razorpay_signature} = req.body
        const productArr = req.body.products.products
        const {address, amount, userId} = req.body
        // console.log("req.body:", req.body)
        // console.log("address = ", address)
        // console.log("products->", req.body.products.products[1])
        const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_API_SECRET
        // console.log("secret->",RAZORPAY_KEY_SECRET)
        
        let body = razorpay_order_id + "|" + razorpay_payment_id
        const expectedSignature = crypto.createHmac("sha256", RAZORPAY_KEY_SECRET)
                                        .update(body)
                                        .digest("hex");
        
                                        
        const isAuthentic = expectedSignature == razorpay_signature
        if(isAuthentic){
            //database save
            
            // const requiredDetails = await instance.orders.fetch(razorpay_order_id)
            const requiredDetails = await instance.orders.fetch(razorpay_order_id)
            // console.log("requiredDetails->", requiredDetails)
            
            
            // console.log("varified")
            // res.redirect(
            //     `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
            // )
            // console.log("productArr",productArr)
            
            await orderModel.create({
                productDetails:productArr,
                userId:userId,
                paymentDetails:{
                    orderId:razorpay_order_id,
                    paymentId: razorpay_payment_id,
                    payment_method_type:"razorpay",
                    payment_status:"paid"
                },
                totalAmount:amount,
                shipping_address:address,
            })
            const url = process.env.FRONTEND_URL + '/order'
            // console.log("url = ", url)
            res.redirect(
                `${url}`
            )
        }
        else{
            return res.status(400).json({
                success: false,
                message: "error while varify order"
            })
        }
        
        // console.log("original sign->", razorpay_signature) 
        // console.log("created sign->", expectedSignature)                                                      
       
        //   return res.status(200).json({
        //     success: true,
        //     message: "varification is done successfully",
        //     // result: isSignatureValid
        //   })
    } catch(err){
        return res.status(400).json({
            success: false,
            message: "error while varify order",
            error: err.message
        })
    }
}

