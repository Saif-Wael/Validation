/**
 * User validation utility functions
 * These functions help validate and format user data
 */

/**
 * Validates an email address format
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
function isValidEmail(email) {
  if (!email || typeof email !== "string") {
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates a password meets requirements
 * - At least 8 characters
 * - Contains at least one uppercase letter
 * - Contains at least one lowercase letter
 * - Contains at least one number
 * @param {string} password - The password to validate
 * @returns {boolean} - Whether the password meets requirements
 */
function isStrongPassword(password) {
  if (!password || typeof password !== "string") {
    return false;
  }

  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password)
  );
}

/**
 * Formats a user's name (first letter uppercase, rest lowercase)
 * @param {string} name - The name to format
 * @returns {string} - The formatted name
 * @throws {Error} - If name is not a string or is empty
 */
function formatName(name) {
  if (!name || typeof name !== "string") {
    throw new Error("Name must be a non-empty string");
  }

  name = name.trim();
  if (name.length === 0) {
    throw new Error("Name cannot be empty");
  }

  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

/**
 * Validates a mobile number (must be exactly 11 digits)
 * @param {string} mobileNumber - The mobile number to validate
 * @returns {boolean} - Whether the mobile number is valid
 */
function isValidMobileNumber(mobileNumber) {
  if (!mobileNumber || typeof mobileNumber !== "string") {
    return false;
  }

  // Remove any spaces or special characters
  const digitsOnly = mobileNumber.replace(/\D/g, "");
  
  // Check if the result contains exactly 11 digits
  return /^\d{11}$/.test(digitsOnly);
}

/**
 * Formats user data for display or storage
 * @param {Object} userData - User data to format
 * @returns {Object} - Formatted user data
 */
function formatUserData(userData) {
  if (!userData || typeof userData !== "object") {
    return null;
  }

  const formatted = { ...userData };

  if (formatted.firstName) {
    formatted.firstName = formatName(formatted.firstName);
  }

  if (formatted.lastName) {
    formatted.lastName = formatName(formatted.lastName);
  }

  if (formatted.email) {
    formatted.email = formatted.email.toLowerCase();
  }

  if (formatted.username) {
    formatted.username = formatted.username.toLowerCase();
  }

  if (formatted.gender) {
    formatted.gender = formatted.gender.toLowerCase();
  }

  return formatted;
}

/**
 * Extracts user's initials from their first and last name
 * @param {string} firstName - User's first name
 * @param {string} lastName - User's last name
 * @returns {string} - User's initials
 */
function getUserInitials(firstName, lastName) {
  if (
    !firstName ||
    !lastName ||
    typeof firstName !== "string" ||
    typeof lastName !== "string"
  ) {
    return "";
  }

  firstName = firstName.trim();
  lastName = lastName.trim();

  if (firstName.length === 0 || lastName.length === 0) {
    return "";
  }

  return `${firstName.charAt(0).toUpperCase()}${lastName
    .charAt(0)
    .toUpperCase()}`;
}

module.exports = {
  isValidEmail,
  isStrongPassword,
  formatName,
  isValidMobileNumber,
  formatUserData,
  getUserInitials,
};
