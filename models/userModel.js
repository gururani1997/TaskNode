const mongoose = require('mongoose')
const schema = mongoose.Schema;
var user = new schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    mobileNo: {
        type: String,
        required: true
    },
    countryCode: {
        type: String
    },
    mergeContact: {
        type: String
    },
    password: {
        type: String
    },
    verifyOtp: {
        type: Boolean,
        default: false
    },
    userType: {
        type: String,
        enum: ["VENDOR", "USER"],
        default: "USER"
    },
    status: {
        type: String,
        default: "ACTIVE",
        enum: ["ACTIVE", "BLOCK", "DELETE"]
    },
    otp: {
        type: String
    },
    sendingTime: {
        type: Date
    },
    enteringTime: {
        type: Date
    }
}, { timestamps: true })
module.exports = mongoose.model('user', user);
function init() {
    console.log("me here>>>>>>>>>>>>>>>>>>33")
    let object = {
        firstName: 'Pankaj',
        lastName: 'Gururani',
        mobileNo: "9917073613",
        countryCode: "+91",
        mergeContact: `${countryCode},${mobileNo}`,
        password: 'Pankaj1997'
    }
    firstName: 'Pankaj',
        mongoose.model("userSchema", user).findOne({ firstName: "Pankaj" }, (err, result) => {
            console.log("hey >>>>>> 44")
            if (err) console.log("manager creation at findOne error--> ", err);
            else if (!result) {
                mongoose.model("userSchema", userSchema).save(object, (err, success) => {
                    if (err) {
                        console.log("error occered in admin creation")
                    }
                    else if (!success) {
                        console.log("Result not found in admin creation")
                    }
                    else {
                        console.log(" admin creation sucess")
                    }
                })
            }
            else {
                console.log("Default Admin.", result)
            }
        })
}
