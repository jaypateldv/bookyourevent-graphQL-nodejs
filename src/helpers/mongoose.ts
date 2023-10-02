const { default: mongoose } = require("mongoose");
export const DB = mongoose.connect(process.env.MONGO_URL);
