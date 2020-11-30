const user = require('../models/userModel');
const message = require('../commonFile/commonFunction');
const bcrypt = require('bcrypt-nodejs');
var otpGenerator = require('otp-generator')
var otp;

module.exports = {
    //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<signup Api
    signUp: (req, res) => {
        console.log("i am in starting");
        try {
            console.log("i am in try block");

            if (!req.body.mobileNo || !req.body.password) {
                return res.send({ responseCode: 404, responseMessage: "parameter missing" })
            }
            else {
                console.log("i am in starting1>>>>>");
                var query = { $and: [{ status: { $in: ["ACTIVE", "BLOCK"] } }, { mobileNo: req.body.mobileNo }] }
                user.findOne(query, (error, result) => {
                    console.log("i am in starting2-----------");
                    if (error) {
                        return res.send({ responseCode: 500, responseMessage: "Internal server error" })
                    }
                    else if (result) {
                        return res.send({ responseCode: 404, responseMessage: "MobileNo already exist" })
                    }
                    else {
                        otp = otpGenerator.generate(4, { upperCase: false, specialChars: false, alphabets: false });
                        console.log('checking my otp :', otp)
                        body = "your otp (one time password) is " + otp;
                        message.sendMail(req.body.mobileNo, body, (error1, result1) => {
                            if (error1) {
                                return res.send({ responseCode: 500, responseMessage: "internal server error" })
                            }
                            else if (!result1) {
                                return res.send({ responseCode: 404, responseMessage: "Mobile Number not found" })
                            }
                            else {
                                //  sendingTime = Date.now() + 1 * 60000;
                                console.log("what is the current time")
                                var password = req.body.password;
                                var confirmPassword = req.body.confirmPassword;
                                console.log("checking password", password)
                                console.log("checking confirm password", confirmPassword)
                                if (password == confirmPassword) {
                                    var object = ({
                                        firstName: req.body.firstName,
                                        mobileNo: req.body.mobileNo,
                                        countryCode: req.body.countryCode,
                                        password: bcrypt.hashSync(req.body.password),
                                        lastName: req.body.lastName,
                                        mergeContact: req.body.countryCode + req.body.mobileNo,
                                        otp: otp,
                                        userType: req.body.userType,
                                        sendingTime: Date.now() + 1 * 60000
                                    })
                                    var data = new user(object);
                                    data.save((error1, result1) => {
                                        if (error1) {
                                            return res.send({ responseCode: 500, responseMessage: "Internal server error" })
                                        }
                                        else if (!result1) {
                                            return res.send({ responseCode: 404,  responseMessage: "data not found" })
                                        }
                                        else {
                                            return res.send({ responseCode: 200, responseMessage: "signup successful", result: result1 })
                                        }
                                    })
                                }
                                else {
                                    return res.send({ responseCode: 404, responseMessage: "please enter correct password" })
                                }
                            }
                        })
                    }
                })
            }
        }
        catch{
            console.log("exception area")
        }
    },
    //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Otp verify >>>>>>>>>>>>>>>
    otpVerify: (req, res) => {
        try {
            if (!req.body.mobileNo) {
                res.send({ responseCode: 404, responseMessage: "parameter missing" })
                console.log("first if")
            }
            else {
                console.log("first else")
                user.findOne({ mobileNo: req.body.mobileNo, status: { $in: ["ACTIVE", "BLOCK"] } }, (error, result) => {
                    console.log(" inside findone", result)
                    if (error) {
                        return res.send({ responseCode: 500, responseMessage: "Internal server error" })
                    }
                    else if (!result) {

                        return res.send({ responseCode: 404, responseMessage: "data not found" })

                    }
                    else {
                        console.log("my otp is :", result.otp)
                        var enteringTime = Date.now();
                        if (result.otp == req.body.otp && enteringTime < result.sendingTime) {
                            console.log("i am there in line 166", enteringTime)
                            console.log("i am there in line 166", result.sendingTime)
                            user.findOneAndUpdate({ mobileNo: req.body.mobileNo, status: "ACTIVE" }, { $set: { verifyOtp: true } }, { new: true }, (error1, result1) => {
                                if (error1) {
                                    return res.send({ responseCode: 500, responseMessage: "internal error" })
                                }
                                else if (!result1) {
                                    return res.send({ responseCode: 404, responseMessage: "data not found" })
                                }
                                else {
                                    console.log("otp verified", result1)
                                    return res.send({ responseCode: 200, responseMessage: "otp verified sucessfully" })
                                }
                            })

                        }
                        else {
                            res.send({ respc: 404, respm: "please enter correct otp" })
                        }
                    }

                })
            }
        }
        catch{
            console.log("otp verified")
        }
    },//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<resend Otp Api>>>>>>>>>>>>>>>>>>>>>>>>
    resendOtp: (req, res) => {
        if (!req.body.mobileNo) {
            return res.send({ responseCode: 200, responseMessage: "parameter missing" })
        }
        else {
            user.findOne({ mobileNo: req.body.mobileNo, status: ["ACTIVE", "BLOCK"] }, (error, result) => {
                if (error) {
                    return res.send({ responseCode: 500, responseMessage: "internal server error" })
                }
                else if (!result) {
                    return res.send({ responseCode: 404, responseMessage: "data not found" })
                }
                else {
                    console.log("in result")
                    otp = otpGenerator.generate(4, { upperCase: false, specialChars: false, alphabets: false })
                    console.log("this is my new otp", otp)
                    body = "your otp (one time password) is " + otp;
                    message.sendMail(req.body.mobileNo, body, (error1, result1) => {
                        if (error1) {
                            return res.send({ responseCode: 500, responseMessage: "internal server error" })
                        }
                        else if (!result1) {
                            return res.send({ responseCode: 404, responseMessage: "data not found" })// ,
                        }
                        else {
                            user.findOneAndUpdate({ mobileNo: result.mobileNo, status: "ACTIVE" }, { $set: { otp: otp, sendingTime: Date.now() + 1 * 60000 } }, { new: true }, (error2, result2) => {
                                if (error2) {
                                    return res.send({ responseCode: 500, responseMessage: "internal server error" })
                                }
                                else if (!result2) {
                                    return res.send({ responseCode: 404, responseMessage: "data not found" })
                                }
                                else {
                                    return res.send({ responseCode: 200, responseMessage: "otp sent sucessfully", result: result2 })
                                }
                            })
                        }
                    })
                }
            })
        }
    },
    //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<login Api>>>>>>>>>>>>>>>>>>>>>>>>
    login: (req, res) => {
        try {
            console.log(' i am try for error')
            if (!req.body.mobileNo) {
                return res.send({ responseCode: 404, responseMessage: "parameter missing" });
            }
            else {
                var query = { $and: [{ status: { $ne: ["DELETE", "BLOCK"] } }, { mobileNo: req.body.mobileNo }] }

                user.findOne(query, (error, result) => {
                    if (error) {
                        return res.send({ responseCode: 500, responseMessage: "Internal server error" })
                    }
                    else if (!result) {
                        console.log("checking status of user", result)
                        return res.send({ responseCode: 404, responseMessage: "data not found" })
                    }
                    else {
                        if (result.status == "BLOCK") {
                            return res.send({ responseCode: 404, responseMessage: "currently you are blocked by admin" })
                        }
                        if (result.verifyOtp == true) {
                            var passCheck = bcrypt.compareSync(req.body.password, result.password);//always return true value
                            if (passCheck) {
                                console.log('checking it', result)
                                return res.send({ responseCode: 200, responseMessage: "login sucessfully", result: result })
                            }
                            else {
                                return res.send({ responseCode: 500, responseMessage: "incorrect password" })
                            }
                        }
                        else {
                            return res.send({ responseCode: 404, responseMessage: "please verify your otp first" })
                        }
                    }
                })
            }
        }
        catch{
            console.log("exception occures")
        }
    },
    //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<forgetPasswword Api>>>>>>>>>>>>>>>
    forgotPassword: (req, res) => {
        console.log("welcome in paasswod section")
        try {
            console.log("i am tried to check exception")
            if (req.body.mobileNo) {
                var query = { $and: [{ status: ["ACTIVE", "DELETE"] }, { mobileNo: req.body.mobileNo }] }
                console.log("welcome again>>>>>>")
                user.findOne(query, (error, result) => {
                    if (error) {
                        return res.send({ responseCode: 500, responseMessage: "internal server error" })
                    }
                    else if (!result) {
                        if (result.status == "BLOCK") {
                            return res.send({ responseCode: 404, responseMessage: "currently you arte blocked by admin" })
                        }
                        else {
                            return res.send({ responseCode: 404, responseMessage: "email not found" })
                        }
                    }
                    else {
                        otp = otpGenerator.generate(4, { upperCase: false, specialChars: false, alphabets: false });
                        console.log("ths is my otp", otp)
                        body = "your otp (one time password) for forgot password  is " + otp;
                        message.sendMail(req.body.mobileNo, body, (error1, result1) => {
                            if (error1) {
                                return res.send({ responseCode: 500, responseMessage: "internal server error" })
                            }
                            else if (!result1) {
                                return res.send({ responseCode: 404,  responseMessage: "data not found" })
                            }
                            else {
                                user.findOneAndUpdate({ mobileNo: result.mobileNo, status: "ACTIVE" }, { $set: { otp: otp } }, { new: true }, (error2, result2) => {
                                    if (error2) {
                                        return res.send({ responseCode: 500, responseMessage: "internal server error" })
                                    }
                                    else if (!result2) {
                                        return res.send({ responseCode: 404,  responseMessage: "data not found" })
                                    }
                                    else{
                                        return res.send({ responseCode: 200, responseMessage: "Otp sent sucessfully ",result:result2 })
                                    }
                                })
                            }
                        })
                    }
                })

            }
            else {
                res.send({ responseCode: 500, responseMessage: "plz provide  mobile no" })
            }
        }
        catch{
            console.log("exception occured")
        }
    },
    //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<changePassword>>>>>>>>>>>>>>>>>>>>>
    changePassword: (req, res) => {
        try {
            console.log("i am trid to exception")
            if (!req.body.email || !req.body.password) {
                return res.send({ responseCode: 500, responseMessage: "parameter  missing" })
            }
            else {
                user.findOne({ $and: [{ email: req.body.email }, { status: ["ACTIVE", "BLOCK"] }] }, (error, result) => {
                    if (error) {
                        return res.send({ responseCode: 500, responseMessage: "Internal server error" })
                    }
                    else if (!result) {
                        return res.send({ responseCode: 404,  responseMessage: "data not found" })
                    }
                    else {
                        if (result.status == "BLOCK") {
                            return res.send({ responseCode: 404, responseMessage: "currently you are blocked and not able to change password" })
                        }
                        else {
                            user.findOneAndUpdate({ email: result.email, status: "ACTIVE" }, { $set: { password: bcrypt.hashSync(req.body.password) } }, { new: true }, (error1, result1) => {
                                if (error1) {
                                    return res.send({ responseCode: 500, responseMessage: "Internal server error" })
                                }
                                else if (!result1) {
                                    return res.send({ responseCode: 404,  responseMessage: "data not found" })
                                }
                                else {
                                    return res.send({ responseCode: 200, responseMessage: "Password change successfully", result: result1 })
                                }
                            })
                        }
                    }
                })
            }
        }
        catch{
            console.log('exception occered')
        }
    },
}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<module Ends>>>>>>>>>>>>>>>>>>>>>>>
