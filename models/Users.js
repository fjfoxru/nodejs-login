const {Schema, model} = require('mongoose');
const bcrypt = require('bcrypt-nodejs');


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

userSchema.methods.verifyPassword = function(password) {
    return bcrypt.compareSync(password, this._doc.password);
};

module.exports = model('Users', userSchema);