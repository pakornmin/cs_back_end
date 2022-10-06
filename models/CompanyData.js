const mongoose = require('mongoose');

const CompanyDataSchema = mongoose.Schema({
    name: {type: String, require: true},
    url: {type: String, require: true},
    iconPath: {type: String, require: true},
    category: {type: String, require: true},
    shopStatus: {type: String, require: true},
    total: {type: Number, require: true},
    contributions: {type: Array, require: true},
    top_three: {type: Array, require: true}
});

module.exports = mongoose.model('CompanyData', CompanyDataSchema);