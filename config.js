const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/orgspace")
    .then(() => {
        console.log("Database connected.");
    })
    .catch((error) => {
        console.error("Database connection error:", error);
    });

const loginSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    password: {
        type: String,
        required: true
    },

    userType: {
        type: String,
        enum: ["student", "organization", "admin"],
        required: true
    },

    // ======================
    // STUDENT FIELDS
    // ======================

    firstName: {
        type: String,
        required: function () {
            return this.userType === "student";
        },
        trim: true
    },

    lastName: {
        type: String,
        required: function () {
            return this.userType === "student";
        },
        trim: true
    },

    studentId: {
        type: String,
        required: function () {
            return this.userType === "student";
        },
        trim: true
    },

    college: {
        type: String,
        required: function () {
            return this.userType === "student";
        },
        trim: true
    },

    profileImage: {
        type: String,
        default: "/assets/profile-icon.png"
    },

    // ======================
    // ORGANIZATION FIELDS
    // ======================

    orgName: {
        type: String,
        required: function () {
            return this.userType === "organization";
        },
        trim: true
    },

    description: {
        type: String,
        required: function () {
            return this.userType === "organization";
        },
        trim: true
    },

    tagline: {
        type: String,
        default: ""
    },

    president: {
        type: String,
        default: ""
    },

    orgType: {
        type: String,
        default: ""
    },

    logo: {
        type: String,
        default: "/assets/default-org.png"
    }

}, {
    timestamps: true
});

const collection = mongoose.model("users", loginSchema);

module.exports = collection;