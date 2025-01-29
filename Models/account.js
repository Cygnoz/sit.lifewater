// // v1.1

// const mongoose = require("mongoose");
// const { Schema } = mongoose;


// const accountSchema = new Schema({
//     accountName: {type:String},
//     accountId: {type:String},
//     accountSubhead: {type:String},
//     accountHead: {type:String},
//     accountGroup: {type:String},

//     openingDate: {type:String},    
//     description: {type:String},
// });

// const Accounts = mongoose.model("Accounts", accountSchema);

// module.exports = Accounts;


// v1.5
 
const mongoose = require("mongoose");
const { Schema } = mongoose;
 
 
const accountSchema = new Schema({
    organizationId: {type:String},
    accountName: {type:String},
    accountCode: {type:String},
    accountId: {type:String},
 
    accountSubhead: {type:String},
    accountHead: {type:String},
    accountGroup: {type:String},
 
    parentAccountId: {type: mongoose.Schema.Types.ObjectId, ref: 'Accounts'},
 
    description: {type:String},
 
    bankAccNum: {type:String},
    bankIfsc: {type:String},
    bankCurrency: {type:String},
 
    systemAccounts: { type: Boolean }, // false: edit and deletable(non - system accounts), true: non-edit and non-deletable(system accounts)
 
    createdDateTime: { type: Date, default: () => new Date() },
 
});
 
const Accounts = mongoose.model("Accounts", accountSchema);
 
module.exports = Accounts;