const orderModel = require('../../models/orderProductModel')
const userModel = require('../../models/userModel')

exports.changeOrderStatus = async(req, res) => {
    try{
        const userId = req.userId

        const user = await userModel.findById(userId)
    
        if(user.role !== 'ADMIN'){
            return res.status(500).json({
                message : "not access"
            })
        }
        const {orderId} = req.body
        const order = await orderModel.findById(orderId)
        if(!order){
            return res.status(400).json({
                success:false,
                message:"order not found"
            })
        }
        const {status} = req.body
        order.orderStatus = status
        await order.save()
        return res.status(200).json({
            success:true,
            message:"order status is updated successfully",
            status
        })
    } catch(err){
        return res.status(400).json({
            success:false,
            message:"error in changeOrder controller",
            error:err.message
        })
    }
}