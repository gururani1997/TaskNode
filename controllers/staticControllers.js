const staticModel = require("../models/staticModel");
module.exports = {
    staticPage: (req, res) => {
        staticModel.find((error1, result1) => {
            if (error1) {
                return res.send({ responseCode: 500, responseMessage: "internal server error" })
            }
            else if (!result1) {
                return res.send({ responseCode: 404, responseMessage: "static content not found" })
            }
            else {
                return res.send({ responseCode: 200, responseMessage: "static content", result1 })
            }
        })
    }
}