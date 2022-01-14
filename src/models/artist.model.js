const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const artistSchema = mongoose.Schema({
    name: {
        firstName: {type: String, required: true, trim: true},
        lastName: {type: String, required: true, trim: true},
    },
    username: {type: String, required: true, trim: true, unique: true},
    email: {type: String, required: true, trim: true, unique: true},
    password: {type: String, required: true, minlength: 8},
    bio: {type: String, trim: true},
    imageURL: {type: String, trim: true}
}, {
    versionKey: false,
    timestamps: false
});

artistSchema.pre('save', function(next) {
    if(!this.isModified('password')) {
        return next();
    }

    const hash = bcryptjs.hashSync(this.password, 8);
    this.password = hash;
    return next();
})

artistSchema.methods.checkPassword = function(password) {
    const match = bcryptjs.compareSync(password, this.password);

    return match;
}

const Artist = new mongoose.model('artists', artistSchema);

module.exports = Artist;