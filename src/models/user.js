const mongoose = require('mongoose');

const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
      required: true,
    },
    hash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.methods.validPassword = function (password) {
  const currentPassword = this;

  // Calculate the hash of the provided password using the salt of the current password
  const hash = crypto
    .pbkdf2Sync(password, currentPassword.salt, 10000, 512, 'sha512')
    .toString('hex');

  // Check if the calculated hash matches the stored hash
  return currentPassword.hash === hash;
};

userSchema.methods.saveUser = function (username, password) {
  // Generate the salt and calculate the hash for the new password
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 512, 'sha512')
    .toString('hex');

  // Update the password and salt in the database
  this.salt = salt;
  this.hash = hash;
  this.username = username.toUpperCase().trim();

  // Save the updated user to the database
  return this.save();
};

const User = mongoose.model('User', userSchema);

module.exports = User;
