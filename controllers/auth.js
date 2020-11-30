const user = require('../models/userModel');
const jwt = require('jsonwebtoken');
module.exports = {
    //  tokenGen = jwt.sign({ email: req.body.email }, 'Secret');
    verifyUser: (req, res, next) => {
        console.log("what is my token", req.headers.token)
        if (req.headers.token) {
            console.log("what is my token", req.headers.token)
            jwt.verify(req.headers.token, "Secret", (err, decoded) => {
                if (err) {
                    return res.send({ responseCode: 500, responseMessage: "internal server error1" })
                } else if (!decoded) {
                    return res.send({ responseCode: 404, responseMessage: "data not found1" })
                } else {
                    user.findOne({ email: decoded.email }, (error, result) => {
                        if (error) {
                            return res.send({ responseCode: 500, responseMessage: "internal server  error2" })
                        } else if (!result) {
                            return res.send({ responseCode: 404, responseMessage: "data not found2" })
                        } else {
                            if (result.status == "ACTIVE") {
                                next();
                            } else if (result.status == "BLOCK") {
                                return res.send({ responseCode: 404, responseMessage: "user blocked by Default" })
                            } else {
                                return res.send({ responseCode: 404, responseMessage: "signup first" })
                            }
                        }
                    })
                }
            })
        }
        else {
            return res.send({ responseCode: 404, responseMessage: "Token missing" })

        }

    }















}