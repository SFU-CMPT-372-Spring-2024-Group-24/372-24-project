const { User } = require("../db");
const bcrypt = require("bcrypt");
const validator = require("validator");
const Sequelize = require("sequelize");

// Function to check if username exists
async function usernameExists(username) {
  const user = await User.findOne({ where: { username } });

  if (user) {
    throw new Error("Username already exists");
  }
};

// Function to check if email exists
async function emailExists(email) {
  const user = await User.findOne({ where: { email } });

  if (user) {
    throw new Error("Email already exists");
  }
}

// Function to validate username
function validateUsername(username) {
  if (!validator.isAlphanumeric(username)) {
    throw new Error("Invalid username");
  }
}

// Function to validate email
function validateEmail(email) {
  if (!validator.isEmail(email)) {
    throw new Error("Invalid email");
  }
}

// Function to validate password
function validatePassword(password, passwordConfirmation) {
  if (password !== passwordConfirmation) {
    throw new Error("Passwords do not match");
  }
}

// Function to hash password
async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

module.exports = {
  usernameExists,
  emailExists,
  validateUsername,
  validateEmail,
  validatePassword,
  hashPassword,
};