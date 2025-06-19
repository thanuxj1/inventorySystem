const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const packageValues = {
    platinum: 100000,
    gold: 50000,
    silver: 30000,
    bronze: 15000
};

const userSchema = new Schema({
    CID: {
        type: Number, // Data type
        required: true, // Validate
    },
    package: {
        type: String, // Data type
        enum: Object.keys(packageValues), // Restrict to specific values
        required: true // Validate
    },
    discount: {
        type: Number, // Data type
        required: true, // Validate
    },
    extra: {
        type: Number, // Data type
        required: true // Validate
    },
    type: {
        type: String, // Data type
        required: true // Validate
    },
    date: {
        type: Date, // Data type
        required: true // Validate
    },
    gmail: {
        type: String, // Data type
        required: true // Validate
    },
    total: {
        type: Number, // Data type
        required: true, // Validate
        default: function() {
            return packageValues[this.package] || 0;
        }
    }
});

module.exports = mongoose.model(
    "UserModel", // File name
    userSchema // Function
);
