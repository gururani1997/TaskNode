const mongoose = require('mongoose')
const schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var bookSchema = new schema({
    list_name: {
        type: String,
    },
    rank: {
        type: String,
    },
    primary_isbn: {
        type: String,
    },
    publisher: {
        type: String
    },
    description: {
        type: String
    },
    title: {
        type: String
    }, 
    author: {
        type: String
    },
    book_image: {
        type: String
    }, 
    book_url: {
        type: String
    },  
    status: {
        type: String,
        default: "ACTIVE",
        enum: ["ACTIVE", "BLOCK", "DELETE"]
    },
    profilePic: [{
        type: String,
        default: Date.now()
    }],
    likeBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }]


}, { timestamps: true })
bookSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Book', bookSchema);


