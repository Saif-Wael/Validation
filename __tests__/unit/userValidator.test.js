const {
  isValidEmail,
  isStrongPassword,
  formatName,
  isValidMobileNumber,
  formatUserData,
  getUserInitials
} = require('../../helpers/userValidator');

describe('User Validator Unit Tests', () => {
  describe('Email Validation', () => {
    test('should validate correct email formats', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.com')).toBe(true);
    });

    test('should reject invalid email formats', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail(null)).toBe(false);
    });
  });

  describe('Password Validation', () => {
    test('should validate strong passwords', () => {
      expect(isStrongPassword('Password123')).toBe(true);
      expect(isStrongPassword('StrongP4ssword')).toBe(true);
    });

    test('should reject weak passwords', () => {
      expect(isStrongPassword('password')).toBe(false);
      expect(isStrongPassword('PASSWORD')).toBe(false);
      expect(isStrongPassword('12345678')).toBe(false);
      expect(isStrongPassword('Pass1')).toBe(false);
      expect(isStrongPassword('')).toBe(false);
      expect(isStrongPassword(null)).toBe(false);
    });
  });

  describe('Mobile Number Validation', () => {
    test('should validate correct mobile numbers', () => {
      expect(isValidMobileNumber('01234567890')).toBe(true);
      expect(isValidMobileNumber('12345678901')).toBe(true);
    });

    test('should reject invalid mobile numbers', () => {
      expect(isValidMobileNumber('123456789')).toBe(false); // too short
      expect(isValidMobileNumber('123456789012')).toBe(false); // too long
      expect(isValidMobileNumber('1234567890a')).toBe(false); // contains letter
      expect(isValidMobileNumber('')).toBe(false);
      expect(isValidMobileNumber(null)).toBe(false);
    });
  });

  describe('Name Formatting', () => {
    test('should format names correctly', () => {
      expect(formatName('john')).toBe('John');
      expect(formatName('MARY')).toBe('Mary');
      expect(formatName('jOhN')).toBe('John');
    });

    test('should handle empty or invalid names', () => {
      expect(() => formatName('')).toThrow();
      expect(() => formatName(null)).toThrow();
      expect(() => formatName(undefined)).toThrow();
    });
  });

  describe('User Data Formatting', () => {
    test('should format user data correctly', () => {
      const userData = {
        firstName: 'john',
        lastName: 'DOE',
        email: 'TEST@example.com',
        username: 'USERNAME',
        gender: 'MALE'
      };

      const formatted = formatUserData(userData);
      expect(formatted.firstName).toBe('John');
      expect(formatted.lastName).toBe('Doe');
      expect(formatted.email).toBe('test@example.com');
      expect(formatted.username).toBe('username');
      expect(formatted.gender).toBe('male');
    });

    test('should handle null or invalid user data', () => {
      expect(formatUserData(null)).toBeNull();
      expect(formatUserData(undefined)).toBeNull();
      expect(formatUserData('invalid')).toBeNull();
    });
  });

  describe('User Initials', () => {
    test('should generate correct initials', () => {
      expect(getUserInitials('John', 'Doe')).toBe('JD');
      expect(getUserInitials('mary', 'SMITH')).toBe('MS');
    });

    test('should handle empty or invalid names', () => {
      expect(getUserInitials('', 'Doe')).toBe('');
      expect(getUserInitials('John', '')).toBe('');
      expect(getUserInitials(null, 'Doe')).toBe('');
      expect(getUserInitials('John', null)).toBe('');
    });
  });
}); 