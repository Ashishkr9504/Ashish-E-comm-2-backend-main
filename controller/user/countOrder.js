const orderProductModel = require('../../models/orderProductModel')
const countOrder = async(req,res)=>{
    try{
        const userId = req.userId

        const count = await orderProductModel.countDocuments({
            userId : userId
        })
        const orderDetails = await orderProductModel.find({userId})

        res.json({
            data : {
                count : count
            },
            orderDetails,
            message : "ok",
            error : false,
            success : true
        })
    }catch(error){
        res.json({
            message : error.message || error,
            error : false,
            success : false,
        })
    }
}

module.exports = countOrder