const mongoose = require('mongoose')


const orderSchema = new mongoose.Schema({
    productDetails : {
        type : Array,
        default : []
    },
    userId : {
        type : String,
        default : ""
    },
    paymentDetails : {
        paymentId : {
            type : String,
            default : ""
        },
        orderId: String,
        payment_method_type : String,
        payment_status : {
            type : String,
            default : "unPaid"
        }
    },
    shipping_address : String,
    orderStatus:{
        type:String,
        default:"under process"
    },
    totalAmount : {
        type : Number,
        default : 0
    }
},{
    timestamps : true
})

const orderModel = mongoose.model('order',orderSchema)

module.exports = orderModel