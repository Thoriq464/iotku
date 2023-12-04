const mongoose = require('mongoose');

mongoose.connect('mongodb://root:11@127.0.0.1:27017/bangThoriq?authMechanism=DEFAULT', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: 'admin' // Added authentication database
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Failed to connect to MongoDB:', error);
    });

module.exports = mongoose;
