var mongoose = require('mongoose');


mongoose.Promise - global.Promise;
const mlab = 'mongodb://localhost:27017/Images';
mongoose.connect(mlab);

module.exports = {
    mongoose
};