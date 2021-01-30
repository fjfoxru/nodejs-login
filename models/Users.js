const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    login: {
        type: String,
        required: true,
    },
    pass: {
        type: String,
        required: true,
    },
    
});

module.exports = model('Users', userSchema);