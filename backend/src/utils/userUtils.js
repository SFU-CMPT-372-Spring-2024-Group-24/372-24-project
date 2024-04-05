const { User } = require("../db");
const bcrypt = require("bcrypt");
const validator = require("validator");
const Sequelize = require("sequelize");

// Function check length
function validateLength(field, fieldName, min, max) {
  if (!field.length) {
    throw new Error(`${fieldName} is required.`);
  }

  if (field.length < min) {
    throw new Error(`${fieldName} is too short. Minimum ${min} characters.`);
  }

  if (field.length > max) {
    throw new Error(`${fieldName} is too long. Maximum ${max} characters.`);
  }
}

// Validate name
function validateName(name) {
  validateLength(name, 'Name', 2, 50);

  if (!validator.isAlpha(name, 'en-US', { ignore: " " })) {
    throw new Error("Invalid name. Name must only contain letters.");
  }
}

// Validate username
async function validateUsername(username) {
  // Check length
  validateLength(username, 'Username', 2, 20);

  // Check if username is alphanumeric
  if (!validator.isAlphanumeric(username)) {
    throw new Error("Invalid username. Username must only contain letters and numbers.");
  }

  // Check if username exists
  const user = await User.findOne({ where: { username } });
  if (user) {
    throw new Error("Username already exists");
  }
}

// Function to validate email
async function validateEmail(email) {
  // Check if email is valid
  if (!validator.isEmail(email)) {
    throw new Error("Invalid email. Please try again.");
  }

  // Check if email exists
  const user = await User.findOne({ where: { email } });
  if (user) {
    throw new Error("Email already exists");
  }
}

// Function to validate password
function validatePassword(password, passwordConfirmation) {
  // Check length
  validateLength(password, 'Password', 4, 50);

  // Check if password and passwordConfirmation match
  if (password !== passwordConfirmation) {
    throw new Error("Passwords do not match");
  }
}

// Function to hash password
async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// Compare password
async function comparePassword(password1, password2) {
  return await bcrypt.compare(password1, password2);
}

module.exports = {
  validateName,
  validateUsername,
  validateEmail,
  validatePassword,
  hashPassword,
  comparePassword,
};