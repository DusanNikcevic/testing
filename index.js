var express = require("express")
var multer = require('multer')
var app = express()
var path = require('path')

const bodyParser = require('body-parser');

const {
    Image
} = require('./image')

const {
    Video
} = require('./video')

var fs = require('fs');

const {
    mongoouse
} = require('./mongoose');

const publicPath = path.join(__dirname, './public');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(express.static(publicPath));


var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/images')
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

app.post('/upload', (req, res) => {
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
        console.log(req.body);
        res.redirect('/imageUpload');

        var image = new Image({
            name: req.file.filename,
            location: req.file.path,
            title: req.body.title,
            description: req.body.description
        });

        image.save().then(() => {
            console.log('Added to db')
        }).catch((e) => {
            console.log('db failed', e);
        });
    });

});

app.post('/uploadVideo', (req, res) => {

    var video = new Video({
        link: req.body.videoLink,
        title: req.body.videoTitle,
        description: req.body.videoDescription
    });

    video.save().then(() => {
        console.log('Added to db')
    }).catch((e) => {
        console.log('db failed', e);
    });

    res.redirect('/videoUpload');

});

app.get('/imageUpload', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/uploadImage.html'));
});

app.get('/videoUpload', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/uploadVideo.html'));
});

app.get('/images', (req, res) => {
    Image.find({}).then((images) => {
        res.send(images);
    });
});

app.get('/videos', (req, res) => {
    Video.find({}).then((videos) => {
        res.send(videos);
    });
});


var port = process.env.PORT || 3000
app.listen(port, function () {
    console.log('Node.js listening on port ' + port)
})