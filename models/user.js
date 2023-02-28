const { default: mongoose } = require("mongoose");
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdEvents: [{
        type: Schema.Types.ObjectId,
        ref: "Event"
    }]
});

userSchema.statics.findUserByCredential = async (email, password) => {
    const user = await mongoose.model('User', userSchema).findOne({ email });
    if (!user)
        throw new Error("Invalid email or password");
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
        throw new Error("Invalid email or password");

    return user;
};
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id.toString() }, 'thisismysecretforkwttoken');
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
};
userSchema.method.toJSON = () => {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;

    return userObject;
};

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

// userSchema.post('find', async function (result) {
//     const user = this;
//     result.forEach(user => {
//         user.password = null
//     });
// });

module.exports = mongoose.model('User', userSchema);