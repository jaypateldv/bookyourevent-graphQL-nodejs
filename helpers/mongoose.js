const { default: mongoose } = require("mongoose");
const DB = mongoose.connect(process.env.MONGO_URL);
module.exports = DB;