const mongoose = require("mongoose");
const uuidv1 = require("uuid/v1");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
    },
    secondLastName: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    salt: String,
    updated: Date,
    resetPasswordLink: {
      data: String,
      default: "",
    },
    isAdmin: { type: Boolean, required: true },
    role: {
      type: String,
      required: true,
    },
    proyects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Proyect",
      },
    ],
  },
  {
    timestamps: true,
  }
);

/**
 * Virtual fields are additional fields for a given model.
 * Their values can be set manually or automatically with defined functionality.
 * Keep in mind: virtual properties (password) don’t get persisted in the database.
 * They only exist logically and are not written to the document’s collection.
 */

// virtual field
userSchema
  .virtual("password")
  .set(function(password) {
    // create temporary variable called _password
    this._password = password;
    // generate a timestamp
    this.salt = uuidv1();
    // encryptPassword()
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

// methods
userSchema.methods = {
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  encryptPassword: function(password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
};

// pre middleware
userSchema.pre("remove", function(next) {
  Post.remove({ postedBy: this._id }).exec();
  next();
});

module.exports = mongoose.model("User", userSchema);
