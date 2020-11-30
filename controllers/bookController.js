const bookSchema = require('../models/bookSchema');
const message = require('../commonFile/commonFunction');
const user = require('../models/userModel')
const request = require('request');
const fastcsv = require('fast-csv');
const fs = require('fs');
const ws = fs.createWriteStream("output.csv");
const Excel = require('exceljs')

module.exports = {
    addBook: (req, res) => {
        try {
            console.log("i am in try block");
            if (!req.body._id || !req.body.bookName) {
                return res.send({ responseCode: 404, responseMessage: "parameter missing" })
            }
            else {
                user.findOne({ _id: req.body._id, status: "ACTIVE" }, (error, result) => {
                    if (error) {
                        console.log("what is the error", error)
                        return res.send({ responseCode: 500, responseMessage: "data not found" })
                    }

                    else if (!result) {
                        return res.send({ responseCode: 404, responseMessage: "user not found" })
                    }
                    else {
                        bookSchema.findOne({ bookName: req.body.bookName, status: "ACTIVE" }, (error1, result1) => {
                            if (error1) {
                                return res.send({ responseCode: 500, responseMessage: "internal error " })
                            }
                            else if (result1) {
                                return res.send({ responseCode: 404, responseMessage: "book already exist", result: result1 })
                            }
                            else {
                                var object = new bookSchema({
                                    bookName: req.body.bookName,
                                    bookPrice: req.body.bookPrice,
                                    standard: req.body.standard,
                                    edition: req.body.edition,
                                    autherId: result._id,
                                    Likes: "",
                                    //likeBy: ""
                                })
                                object.save((error1, result1) => {
                                    if (error1) {
                                        console.log("data saving error", error1)
                                        return res.send({ responseCode: 500, responseMessage: "Internal server eror" })
                                    }
                                    else if (!result1) {
                                        return res.send({ responseCode: 404, responseMessage: "data notsaved" })
                                    }
                                    else {

                                        return res.send({ responseCode: 200, responseMessage: "this book is saved sucessfully", result: result1 })
                                    }
                                })
                            }
                        })

                    }
                })
            }
        }
        catch {
            console.log("i am in catch section")
        }
    },//<<<<<<<<<<<<<<<<<<<<<<<<<<<<addBook api>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    editBook: (req, res) => {
        try {
            console.log("i am in try block")
            if (!req.body.bookName || !req.body.autherId) {
                return res.send({ responseCode: 404, responseMessage: "parameter missing" })
            }
            else {
                bookSchema.findOne({ bookName: req.body.bookName, status: "ACTIVE", autherId: req.body.autherId }, (error, result) => {
                    if (error) {
                        console.log("i am in book id find")
                        return res.send({ responseCode: 500, responseMessage: "Internal server error" })
                    }
                    else if (!result) {
                        return res.send({ responseCode: 404, responseMessage: "This Book is not exist!" })
                    }
                    else {
                        var query = { bookPrice: req.body.bookPrice, standard: req.body.standard, edition: req.body.edition }
                        bookSchema.findOneAndUpdate({ _id: result._id, status: "ACTIVE" }, { $set: query }, { multi: true }, (error2, result2) => {
                            if (error2) {
                                return res.send({ responseCode: 500, responseMessage: "Internal server error" })
                            }
                            else if (!result2) {
                                return res.send({ responseCode: 404, responseMessage: "data not found" })
                            }
                            else {
                                return res.send({ responseCode: 200, responseMessage: "This Book edited sucessfully", result: result2 })
                            }
                        })
                    }
                })
            }
        }
        catch {
            console.log("i am in catch block")
        }

    },//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>editBook api>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    deleteBook: (req, res) => {
        console.log("hii iam there");
        try {
            console.log('tried to error')
            if (!req.body._id || !req.body.bookName) {
                return res.send({ responseCode: 404, responseMessage: "parameter Missing" })
            }
            else {
                console.log("hii iam in line 103");
                user.findOne({ _id: req.body._id, status: "ACTIVE" }, (error, result) => {
                    if (error) {
                        return res.send({ responseCode: 500, responseMessage: "Internal server error" })
                    }
                    else if (!result) {
                        return res.send({ responseCode: 404, responseMessage: "autherId not found" })
                    }
                    else {
                        console.log("hii iam in line 112");
                        bookSchema.findOne({ bookName: req.body.bookName, status: "ACTIVE" }, (error1, result1) => {
                            if (error1) {
                                return res.send({ responseCode: 500, responseMessage: "Internal server error" })
                            }
                            else if (!result1) {
                                return res.send({ responseCode: 404, responseMessage: "Data not found" })
                            }
                            else {
                                console.log("hii iam in line 121", result1)
                                bookSchema.findOneAndUpdate({ autherId: result1.autherId, bookName: req.body.bookName, status: "ACTIVE" }, { $set: { status: "DELETE" } }, { new: true }, (error2, result2) => {
                                    if (error2) {
                                        return res.send({ responseCode: 500, responseMessage: "Internal server error" })
                                    }
                                    else if (!result2) {
                                        return res.send({ responseCode: 404, responseMessage: "autherId not found" })
                                    }
                                    else {
                                        return res.send({ responseCode: 200, responseMessage: "Book Deleted Successfully!", result: result2 })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        }
        catch {
            console.log("exception occered")
        }
    },//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>delete book Api>>>>>>>>>>>>>>>>>>>>>
    uploadImage: (req, res) => {
        try {
            console.log("trying to check error")
            if (!req.body._id || !req.body.bookName) {
                console.log("i am in there 141")
                return res.send({ responseCode: 404, responseMessage: "Parameter missing" })
            } else {
                console.log("i am in there 144")
                user.findOne({ _id: req.body._id, status: "ACTIVE" }, (error, result) => {
                    if (error) {
                        console.log("i am in there 147")
                        return res.send({ responseCode: 500, responseMessage: "internal server error" })
                    }
                    else if (!result) {
                        console.log("i am in there 151")
                        return res.send({ responseCode: 404, responseMessage: "user not found" })
                    }
                    else {
                        console.log("i am in there 155", result)
                        bookSchema.findOne({ bookName: req.body.bookName, status: "ACTIVE", autherId: result._id }, (error1, result1) => {
                            if (error1) {
                                return res.send({ responseCode: 500, responseMessage: "internal server error" })
                            }
                            else if (!result1) {
                                return res.send({ responseCode: 404, responseMessage: "autherId not found" })
                            }
                            else {
                                message.imageUploadToCloudinary(req.body.profilePic, (error2, result2) => {
                                    console.log("uploadingggg>>>>>>>>>>>>>>>>>>", result1.secure_url)
                                    if (error1) {
                                        console.log(error2)
                                        return res.send({ responseCode: 404, responseMessage: "internal eror" })
                                    }
                                    else if (!result2) {
                                        return res.send({ responseCode: 404, responseMessage: "data not found" })
                                    }
                                    else {
                                        console.log("what is the result here", result2.secure_url)
                                        var query = { profilePic: result2.secure_url }
                                        console.log("this is query", query)
                                        bookSchema.findOneAndUpdate({ autherId: result1.autherId, status: "ACTIVE" }, { $push: query }, { multi: true }, (error3, result3) => {
                                            if (error3) {
                                                console.log("i am here", error2)
                                                return res.send({ responseCode: 500, responseMessage: "Internal server error" })
                                            }
                                            else if (!result3) {
                                                console.log("i am here result", result3)
                                                return res.send({ responseCode: 500, responseMessage: "autherId not found" })
                                            }
                                            else {
                                                res.send({ responseCode: 200, responseMessage: "images uploaded sucessfully", result: result3 })
                                            }
                                        })

                                    }

                                })
                            }
                        })
                    }
                })
            }
        }
        catch {
            console.log("exception occered")
        }
    },//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>uploadImage>>>>>>>>>>>>>>>>>>>>>>>>>>>
    uploadingViaMulter: (req, res) => {
        console.log("what is this")
        try {
            console.log("tried to check exceptions")
            // var pankaj = req.headers.bookName
            // req.headers.bookName = pankaj;
            if (!req.headers._id) {
                console.log("what is this one")
                return res.send({ responseCode: 404, responseMessage: "parameter missing" })
            }
            else {
                console.log("welcome in line 224")
                bookSchema.findOne({ _id: req.headers._id }, (error, result) => {
                    if (error) {
                        return res.send({ responseCode: 500, responseMessage: "internal server error" })
                    }
                    else if (!result) {
                        return res.send({ responseCode: 404, responseMessage: "data not found" })
                    }
                    else {
                        console.log("welcome in line 233")
                        message.imageUpload(req, res, (error1, result1) => {
                            console.log("welcome")
                            if (error1) {
                                return res.send({ responseCode: 500, responseMessage: "internal server error" })
                            }
                            else if (!result1) {
                                return res.send({ responseCode: 404, responseMessage: "result not found" })
                            }
                            else {
                                console.log("welcome")
                                return res.send({ responseCode: 200, responseMessage: "image uploaded" })
                            }
                        })
                    }
                })
            }
        }
        catch {
            console.log("exception occered")
        }
    },//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>uploadingViaMulter<<<<<<<<<<<<<<<<<<
    checkLike: (req, res) => {
        try {
            console.log("trying to check exceptions")

            if (!req.body.bookName || !req.body._id) {
                return res.send({ responseCode: 404, responseMessage: "parameter missing" })
            }
            else {
                console.log(">>>>>>>>>>1>>>>>>>>>")
                bookSchema.findOne({ bookName: req.body.bookName, status: { $ne: ["ACTIVE", "BLOCK"] } }, (error, result) => {
                    if (error) {
                        return res.send({ responseCode: 500, responseMessage: "internal server error" })
                    }
                    else if (!result) {
                        return res.send({ responseCode: 404, responseMessage: "data not found" })
                    }
                    else {

                        console.log(">>>>>>>>>>2>>>>>>>>>")
                        user.findOne({ _id: req.body._id }, (error1, result1) => {
                            if (error1) {
                                return res.send({ responseCode: 500, responseMessage: "internal server error" })
                            }
                            else if (!result1) {
                                return res.send({ responseCode: 404, responseMessage: "Data not found not found" })
                            }
                            else {

                                console.log(">>>>>>>>>>3>>>>>>>>>")
                                console.log("check result else body ", result1._id)
                                var count;
                                console.log("check result", result)
                                var check;
                                console.log("special case", result.likeBy.length)
                                for (check = 0; check <= result.likeBy.length; check++) {
                                    console.log("yaha hu====>>>>>268", result1._id, result.likeBy)
                                    if (result1._id == result.likeBy[check]) {
                                        count = 1;
                                        console.log(">>>>>>>>>>>4>>>>>>>>>", result.likeBy)
                                        //return res.send({ responseCode: 400, responseMessage: "sucessfully liked already" })
                                    }
                                    else {
                                        console.log(">>>>>>>>>>>>>>>>>>5")

                                        console.log(">>>>>>>>>>>>>>>>>>6>>>>>>>>>")
                                        bookSchema.findOneAndUpdate({ bookName: req.body.bookName, status: "ACTIVE" }, { $addToSet: { likeBy: result1._id } }, { new: true }, (error2, result2) => {
                                            console.log(">>>>>>>>>>>>>>>>>>7>>>>>>>>>", error2, result2)
                                            if (error2) {
                                                console.log("error kya hue", error)
                                                return res.send({ responseCode: 500, responseMessage: "internal server error" })
                                            }
                                            else if (!result2) {
                                                return res.send({ responseCode: 404, responseMessage: "data not found" })
                                            }
                                            else {
                                                count = result.likeBy.length;
                                                console.log("count is", count)
                                                //  return res.send({ responseCode: 200, responseMessage: "sucess", result: result2 })
                                            }

                                        })
                                    }

                                } return res.send({ responseCode: 200, responseMessage: "sucess" })

                            }
                        })
                    }
                })
            }
        }
        catch {
            console.log("exception occered")
        }
    },//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>checkLike<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    countLike: (req, res) => {
        try {
            console.log("trying to error")
            if (!req.body.bookName || !req.body._id) {
                return res.send({ responseCode: 404, responseMessage: "parameter missing" })
            }
            else {
                user.findOne({ _id: req.body._id, status: ["ACTIVE", "BLOCK"] }, (error2, result2) => {
                    if (error2) {
                        return res.send({ responseCode: 500, responseMessage: "Internal server error" })
                    }
                    else if (!result2) {
                        return res.send({ responseCode: 404, responseMessage: "data not found" })
                    }
                    else {
                        bookSchema.findOne({ bookName: req.body.bookName, status: { $ne: ["DELETE", "BLOCK"] } }, (error, result) => {
                            if (error) {
                                return res.send({ responseCode: 500, responseMessage: "Internal server error" })
                            }
                            else if (!result) {
                                return res.send({ responseCode: 404, responseMessage: "data not found" })
                            }
                            else {
                                var count = result.likeBy.length;
                                console.log("length of array", count)
                                bookSchema.findOneAndUpdate({ bookName: req.body.bookName, status: "ACTIVE" }, { $set: { Likes: count } }, { new: true }, (error1, result1) => {
                                    if (error1) {
                                        return res.send({ responseCode: 500, responseMessage: "Internal server error" })
                                    }
                                    else if (!result1) {
                                        return res.send({ responseCode: 404, responseMessage: "data not found" })
                                    }
                                    else {
                                        return res.send({ responseCode: 200, responseMessage: "like counted sucessfully", result: result1 })
                                    }
                                })

                            }
                        })
                    }
                })

            }
        }
        catch {
            console.log("i am in exception")
        }
    },//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>countLikes>>>>>>>>>>>>>>>>>>>>>>>>>>>
    manageUser: (req, res) => {
        try {
            console.log('trying to check error')
            if (!req.body.autherId || !req.body.userName) {

                return res.send({ responseCode: 404, responseMessage: "parameter missing" })
            }
            else {
                console.log("i am in 354")
                user.findOne({ userName: req.body.userName }, (error, result) => {
                    if (error) {
                        console.log("i am in 357")
                        return res.send({ responseCode: 500, responseMessage: "internal server error" })
                    }
                    else if (!result) {
                        console.log("i am in 361")
                        return res.send({ responseCode: 404, responseMessage: "data not found" })
                    }
                    else {
                        console.log("i am in 365")
                        if (result.status = "DELETE") {
                            console.log("i am in 367")
                            bookSchema.find({ autherId: req.body.autherId }, (error1, result1) => {
                                if (error1) {
                                    console.log("i am in 370")
                                    return res.send({ responseCode: 500, responseMessage: "internal server error" })
                                }
                                else if (!result1) {
                                    console.log("i am in 374")
                                    return res.send({ responseCode: 404, responseMessage: "data not found" })
                                }
                                else {
                                    console.log("i am in 378")
                                    bookSchema.update({ status: "ACTIVE" }, { status: "DELETE" }, { multi: true }, (error2, result2) => {
                                        if (error2) {
                                            return res.send({ responseCode: 500, responseMessage: "internal server error" })
                                        }
                                        else if (!result2) {
                                            return res.send({ responseCode: 404, responseMessage: "not found" })
                                        }
                                        else {
                                            return res.send({ responseCode: 200, responseMessage: "sucess", result: result2 })
                                        }
                                    })
                                    // return res.send({responseCode:200,responseMessage:"user deleted by Admin"})
                                }
                            })
                        }
                        else if (result.status = "BLOCK") {
                            bookSchema.find({ autherId: req.body.autherId }, (error1, result1) => {
                                if (error1) {
                                    console.log("i am in block 409")
                                    return res.send({ responseCode: 500, responseMessage: "internal server error" })
                                }
                                else if (!result1) {
                                    console.log("i am in block 413")
                                    return res.send({ responseCode: 404, responseMessage: "data not found" })
                                }
                                else {
                                    console.log("i am in block 417")
                                    bookSchema.update({ status: "ACTIVE" }, { status: "BLOCK" }, { multi: true }, (error2, result2) => {
                                        if (error2) {
                                            return res.send({ responseCode: 500, responseMessage: "internal server error" })
                                        }
                                        else if (!result2) {
                                            return res.send({ responseCode: 404, responseMessage: "not found" })
                                        }
                                        else {
                                            return res.send({ responseCode: 200, responseMessage: "sucess", result: result2 })
                                        }
                                    })
                                    // return res.send({responseCode:200,responseMessage:"user deleted by Admin"})
                                }
                            })
                        }
                        else {
                            console.log("i am in 384")
                            return res.send({ responseCode: 200, responseMessage: "user sucessfully managed in Active condition" })
                        }
                    }
                })
            }
        }
        catch {
            console.log(" exceptions occers")
        }
    },//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>managed User>>>>>>>>>>>>>>>>>>>>>>
    downloadDataInXl: (req, res) => {
        console.log("dfgdf")
        bookSchema.find((err, data) => {
            if (err) {
                console.log("error", err)
            }
            else {
                let workbook = new Excel.Workbook()
                let worksheet = workbook.addWorksheet('bookRecord')
                worksheet.columns = [
                    { header: 'List Name', key: 'list_name' },
                    { header: 'Rank', key: 'rank' },
                    { header: 'Primary Isbn', key: 'primary_isbn' },
                    { header: 'Publisher', key: 'publisher' },
                    { header: 'Description', key: 'description' },
                    { header: 'Title', key: 'title' },
                    { header: 'Author', key: 'author' },
                    { header: 'Book_image', key: 'book_image' },
                    { header: 'Book_url', key: 'book_url' }
                ]
                // force the columns to be at least as long as their header row.
                // Have to take this approach because ExcelJS doesn't have an autofit property.
                worksheet.columns.forEach(column => {
                    column.width = column.header.length < 20 ? 30 : column.header.length
                })

                // Make the header bold.
                // Note: in Excel the rows are 1 based, meaning the first row is 1 instead of 0.
                worksheet.getRow(1).font = { bold: true }


                // Dump all the data into Excel
                data.forEach((e, index) => {
                    console.log('e:', e);
                    console.log('index:', index);

                    // By using destructuring we can easily dump all of the data into the row without doing much
                    // We can add formulas pretty easily by providing the formula property.
                    worksheet.addRow({
                        list_name: e.list_name,
                        rank: e.rank,
                        primary_isbn: e.primary_isbn,
                        publisher: e.publisher,
                        description: e.description,
                        title: e.title,
                        author: e.author,
                        book_image: e.book_image,
                        book_url: e.book_url,
                    })
                   
                })
                workbook.csv.writeFile('bookRecord.csv')

            }
        })

    },
    allBooks: (req, res) => {
        bookSchema.find((err, resst) => {
            if (resst == null || resst.length == '') {
                console.log("check inside null")
                const requestOptions = {
                    url: 'https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=PEaAA1dm82Deo6lAsJhvUUMCqMbz1Tub',
                    method: 'GET',
                    json: {},
                    // qs: {
                    //   offset: 20
                    // }
                };
                request(requestOptions, (err, response, body) => {
                    if (err) {
                        console.log(err);
                    } else if (response.statusCode === 200) {
                        for (var i = 0; i < body.results.books.length; i++) {
                            console.log(body.results.books[i].publisher);
                            details = {
                                list_name: body.results.list_name,
                                rank: parseInt(body.results.books[i].rank),
                                primary_isbn: body.results.books[i].primary_isbn10,
                                publisher: body.results.books[i].publisher,
                                description: body.results.books[i].description,
                                title: body.results.books[i].title,
                                author: body.results.books[i].author,
                                book_image: body.results.books[i].book_image,
                                book_url: body.results.books[i].buy_links[0].url
                            }
                            var data = new bookSchema(details);
                            data.save((err, result) => {
                                if (err) {
                                    return res.render('foo');
                                }
                                else {
                                    console.log("done")
                                }
                            })
                        }
                        bookSchema.find((errs, ress) => {
                            if (errs) {
                                return res.render('listing', { data: '' });

                            }
                            else {
                                // res.send({responseCode:200,responseMessage:"Book list",data:ress})
                                const requestOptions = {
                                    url: 'http://localhost:8000/api/v1/downloadDataInXl',
                                    method: 'GET',
                                    json: {},
                                    // qs: {
                                    //   offset: 20
                                    // }
                                };
                                request(requestOptions, function (res) {
                                })
                                console.log("response", requestOptions)
                                return res.render('listing', { data: ress });
                            }
                        })

                    } else {

                        console.log("response.statusCode");
                    }
                })
            } else {
                const requestOptions = {
                    url: 'http://localhost:8000/api/v1/downloadDataInXl',
                    method: 'GET',
                    json: {},
                    // qs: {
                    //   offset: 20
                    // }
                };
                request(requestOptions, function (res) {

                })
                console.log("response", requestOptions)

                console.log("resst", resst)
                return res.render('listing', { data: resst });

            }

        });







    },
    showAllBook: (req, res) => {
        try {
            console.log("try to check error")
            var query = {}
            if (req.body.autherId) {
                query.autherId = req.body.autherId
            }
            if (req.body.bookName) {
                query.bookName = req.body.bookName
            }
            if (req.body.status) {
                query.status = req.body.status
            }
            if (req.body.bookPrice) {
                query.bookPrice = req.body.bookPrice
            }
            if (req.body.standard) {
                query.standard = req.body.standard
            }
            if (req.body.edition) {
                query.edition = req.body.edition
            }
            if (req.body.Likes) {
                query.Likes = req.body.Likes
            }
            var options = {
                page: req.body.page || 1,
                limit: req.body.limit || 10,
                sort: {
                    createdAt: -1
                }
            }
            bookSchema.paginate(query, options, (error, result) => {
                if (error) {
                    console.log("error when i  set limit 3", error)
                    return res.send({ responseCode: 500, responseMessage: "Internal server error" })
                }
                else if (!result) {
                    return res.send({ responseCode: 404, responseMessage: "data not found" })
                }
                else {
                    return res.send({ responseCode: 200, responseMessage: "data review sucessfully", result: result })
                }
            })
        }
        catch {
            console.log("exception occerss")
        }
    },//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Using Paginate>>>>>>>>>>>>>>>>>>>>>
    checkDetails: (req, res) => {
        try {
            console.log("trying to check error")
            if (!req.body._id) {
                return res.send({ responseCode: 404, responseMessage: "parameter missing" })
            }
            else {
                bookSchema.findOne({ '_id': req.body._id, status: ["ACTIVE", "BLOCK"] }).populate("likeBy", (' userName email  countryCode firstName lastName address')).exec((error, result) => {
                    console.log()
                    if (error) {
                        return res.send({ responseCode: 500, responseMessage: "Internal server error" })
                    }
                    else if (!result) {
                        return res.send({ responseCode: 404, responseMessage: "data not found" })
                    }
                    else {
                        return res.send({ responseCode: 200, responseMessage: "show all id of users ", result: result })
                    }
                })
            }
        }
        catch {
            console.log("exception occers")
        }
    }

}//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>export end>>>>>>>>>>>>>>>>>>>>>>>