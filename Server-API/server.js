require('./config/config');
var express = require("express");
var multer = require('multer');
var app = express();
var path = require('path');
const _ = require('lodash');
const {ObjectID} = require('mongodb');

const moment = require('moment');

const bodyParser = require('body-parser');

const {Image} = require('./models/image')

const {Video} = require('./models/video')

const {User} = require('./models/user')

const {mongoouse} = require('./db/mongoose');

const {authenticate} = require('./middleware/authenticate');

const publicPath = path.join(__dirname, './public');
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(publicPath));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

app.use(bodyParser.json());

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './images')
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

app.get('/options', authenticate, (req, res) => {
    res.sendFile(path.join(__dirname + '/public/options.html'));
});

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
        res.redirect('/imageUpload');

        var image = new Image({name: req.file.filename, location: req.file.path, title: req.body.title, description: req.body.description});

        image
            .save()
            .then(() => {
                console.log('Added to db')
            })
            .catch((e) => {
                console.log('db failed', e);
            });
    });

});

app.post('/uploadVideo', authenticate, (req, res) => {

    var video = new Video({link: req.body.videoLink, title: req.body.videoTitle, description: req.body.videoDescription});

    video
        .save()
        .then(() => {
            console.log('Added to db')
        })
        .catch((e) => {
            console.log('db failed', e);
        });

    res.redirect('/videoUpload');

});

app.get('/imageUpload', authenticate, (req, res) => {
    res.sendFile(path.join(__dirname + '/public/uploadImage.html'));
});

app.get('/videoUpload', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/uploadVideo.html'));
});

app.get('/images', (req, res) => {
    Image
        .find({})
        .then((images) => {
            res.send(images);
        });
});

app.get('/videos', authenticate, (req, res) => {
    Video
        .find({})
        .then((videos) => {
            res.send(videos);
        });
});

app.delete('/delete-video/:id', authenticate, (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res
            .status(404)
            .send('id not valid');
    }
    Video
        .findByIdAndRemove(id)
        .then((video) => {
            if (!video) {
                return res
                    .status(404)
                    .send();
            }
            res.redirect('/videoUpload');
        })
        .catch((e) => {
            res
                .status(400)
                .send();
        });
});

app.delete('/delete-image/:id', authenticate, (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res
            .status(404)
            .send('id not valid');
    }
    Image
        .findByIdAndRemove(id)
        .then((image) => {
            if (!video) {
                return res
                    .status(404)
                    .send();
            }
            res.redirect('/imageUpload');
        })
        .catch((e) => {
            res
                .status(400)
                .send();
        });
});

app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user
        .save()
        .then(() => {
            return user.generateAuthToken();
        })
        .then((token) => {
            res
                .header('x-auth', token)
                .send(user);
        })
        .catch((e) => {
            console.log(e);
            res
                .status(400)
                .send(e);
        })
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    User
        .findByCredentials(body.email, body.password)
        .then((user) => {
            return user
                .generateAuthToken()
                .then((token) => {
                    res
                        .header('x-auth', token)
                        .sendFile(path.join(__dirname + '/public/options.html'));
                });
        })
        .catch((e) => {
            res
                .status(400)
                .send();
        });
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req
        .user
        .removeToken(req.token)
        .then(() => {
            res
                .status(200)
                .send();
        }, () => {
            res
                .status(400)
                .send();
        });
});

var port = 3000;
app.listen(port, function () {
    console.log('Node.js listening on port ' + port)
});