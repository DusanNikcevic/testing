const mongoose = require('mongoose');

var VideoSchema = new mongoose.Schema({
    link: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

var Video = mongoose.model('Video', VideoSchema);

module.exports = {
    Video
};