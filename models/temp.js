const mongoose = require('mongoose');

const tempSchema = new mongoose.Schema({
    city: String,
});

module.exports =  mongoose.model("Temp", tempSchema);