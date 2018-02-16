var mongoose = require('mongoose');


mongoose.Promise - global.Promise;
const mlab = 'mongodb://admin:12345678@ds237808.mlab.com:37808/images';
mongoose.connect(mlab, {
    useMongoClient: true
});

module.exports = {
    mongoose
};