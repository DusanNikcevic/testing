var express = require("express")
var multer = require('multer')
var app = express()
var path = require('path')
const {
    Image
} = require('./image')

var fs = require('fs');

const {
    mongoouse
} = require('./mongoose');

const publicPath = path.join(__dirname, './public');
app.use(express.static(publicPath));


var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/images')
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

app.post('/upload', function (req, res) {
    var upload = multer({
        storage: storage,
        fileFilter: function (req, file, callback) {
            var ext = path.extname(file.originalname)
            if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
                return callback(res.end('Only images are allowed'), null)
            }
            callback(null, true)
        }
    }).single('userFile');
    upload(req, res, function (err) {
        // console.log(req.file);
        res.redirect('/')

        var image = new Image({
            name: req.file.filename,
            location: req.file.path
        })

        image.save().then(() => {
            console.log('Added to db')
        }).catch((e) => {
            console.log('db failed', e);
        });
    });

});

app.get('/images', (req, res) => {
    Image.find({}).then((images) => {
        res.send(images);
    });
});



var port = process.env.PORT || 3000
app.listen(port, function () {
    console.log('Node.js listening on port ' + port)
})