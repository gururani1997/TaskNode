const express = require('express')
const app = express()
const path = require('path');
const request = require('request');
const { check } = require('express-validator/check')
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true, limit: '30mb' }))
app.use(bodyParser.json({ limit: "16mb" }))
//adding views dir on there.
app.use(bodyParser.json())
app.use('/assets', express.static('public'))
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"));

app.get('/', (req, res) => {
    res.render("foo")
})
app.use('/api/v1', require('./routes/userRoutes'))
// app.use('/api/v1', require('./routes/bookRoutes'))
const db = require('./mongodb')
app.listen(8000, () => {
    console.log("app is listening on port 8000")
})