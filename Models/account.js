
// v1.1

const mongoose = require("mongoose");
const { Schema } = mongoose;


const accountSchema = new Schema({
    accountName: {type:String},
    accountId: {type:String},
    accountSubhead: {type:String},
    accountHead: {type:String},
    accountGroup: {type:String},
    
    description: {type:String},

    bankAccNum: {type:String},
    bankIfsc: {type:String},
    bankCurrency: {type:String},
});

const Accounts = mongoose.model("Accounts", accountSchema);

module.exports = Accounts;