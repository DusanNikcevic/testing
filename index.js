const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');
const app = express();

const fs = require('fs');

const {
    Image
} = require('./image');

const {
    mongoose
} = require('./mongoose');

const port = process.env.PORT || 3000;

const publicPath = path.join(__dirname, './public');
app.use(express.static(publicPath));

// default options
app.use(fileUpload({
    safeFileNames: true,
    preserveExtension: true
}));

app.post('/upload', function (req, res) {

    console.log();
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;


    // Use the mv() method to place the file somewhere on your server
    var name = req.files.sampleFile.name;
    var location = path.join(__dirname + `/images/${name}`);
    sampleFile.mv(location, function (err) {
        if (err) {
            return res.status(500).send(err);
        }
        var image = new Image({
            name,
            location
        });

        image.save().then(function () {
            console.log('image saved')
        }).catch((e) => {
            console.log('image not saved', e);
        });

        res.send('File uploaded!' + `<img src="${location}"></img>`);
    });


});

app.get('/images', function (req, res) {
    Image.find({}).then((images) => {
        res.send(images);
    });
});

app.listen(port, () => {
    console.log('Server started at port 3000')
});