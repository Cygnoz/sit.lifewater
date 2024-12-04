// v1.1

const mongoose = require("mongoose");
const { Schema } = mongoose;


const accountSchema = new Schema({
    accountName: {type:String},
    accountId: {type:String},
    accountSubhead: {type:String},
    accountHead: {type:String},
    accountGroup: {type:String},

    openingDate: {type:String},    
    description: {type:String},
});

const Accounts = mongoose.model("Accounts", accountSchema);

module.exports = Accounts;