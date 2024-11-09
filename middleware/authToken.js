const jwt = require('jsonwebtoken')

async function authToken(req,res,next){
    try{
        // const token = req.cookies?.token || req.body.token
        const token = req.query.token
        // req.query.token

        console.log("req.query.token =>",token)
        if(token === 'null' || !token){
            return res.status(200).json({
                message : "Please Login...!",
                error : true,
                success : false
            })
        }

        jwt.verify(token, process.env.TOKEN_SECRET_KEY, function(err, decoded) {
            // console.log(err)
            // console.log("decoded",decoded)
            
            if(err){
                console.log("error auth", err)
            }

            req.userId = decoded?._id
            console.log("auth middleware passed")

            next()
        });


    }catch(err){
        res.status(400).json({
            message : err.message || err,
            data : [],
            error : true,
            success : false
        })
    }
}


module.exports = authToken