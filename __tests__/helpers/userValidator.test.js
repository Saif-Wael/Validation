const {
  isValidEmail,
  isStrongPassword,
  formatName,
  isValidMobileNumber,
  formatUserData,
  getUserInitials,
} = require("../../helpers/userValidator");

describe("user validation utilities", () => {
  describe("isValidEmail", () => {
    test("should return true for valid email addresses", () => {
      expect(isValidEmail("hazem@gmail.com")).toBe(true);
      expect(isValidEmail("seif.hatem@gmail.com")).toBe(true);
      expect(isValidEmail("seif+tag@gmail.com")).toBe(true);
    });

    test("should return false for invalid email addresses", () => {
      expect(isValidEmail("user@")).toBeFalsy();
      expect(isValidEmail("user@domain")).toBeFalsy();
      expect(isValidEmail("@gmail.com")).toBeFalsy();
      expect(isValidEmail("user domain.com")).toBeFalsy();
    });

    test("should return false for non-string inputs", () => {
      expect(isValidEmail(null)).toBe(false);
      expect(isValidEmail(undefined)).toBe(false);
      expect(isValidEmail(123)).toBe(false);
      expect(isValidEmail({})).toBe(false);
      expect(isValidEmail([])).toBe(false);
    });
  });

  describe("isStrongPassword", () => {
    test("should return true for strong passwords", () => {
      expect(isStrongPassword("Password123")).toBeTruthy();
      expect(isStrongPassword("StrongP4ssword")).toBeTruthy();
      expect(isStrongPassword("C0mplexP@ss")).toBeTruthy();
    });

    test("should return false for weak passwords", () => {
      expect(isStrongPassword("password")).toBe(false);
      expect(isStrongPassword("PASSWORD")).toBe(false);
      expect(isStrongPassword("12345678")).toBe(false);
      expect(isStrongPassword("Pass1")).toBe(false);
    });
  });

  describe("formatName", () => {
    test("should format name correctly", () => {
      expect(formatName("hazem")).toEqual("Hazem");
      expect(formatName("seif")).toEqual("Seif");
      expect(formatName("soliman")).toEqual("Soliman");
    });

    test("should handle names with spaces", () => {
      expect(formatName(" jaber ")).toEqual("Jaber");
    });

    test("should throw error for non-string input", () => {
      expect(() => formatName(null)).toThrow("Name must be a non-empty string");
      expect(() => formatName(undefined)).toThrow("Name must be a non-empty string");
      expect(() => formatName(123)).toThrow("Name must be a non-empty string");
    });

    test("should throw error for empty string", () => {
      expect(() => formatName("")).toThrow("Name must be a non-empty string");
      expect(() => formatName("   ")).toThrow("Name cannot be empty");
    });
  });

  describe("isValidMobileNumber", () => {
    test("should validate correct mobile numbers", () => {
      expect(isValidMobileNumber("1234567890")).toBe(true);
      expect(isValidMobileNumber("12345678901")).toBe(true);
      expect(isValidMobileNumber("+1-234-567-8901")).toBe(true);
    });

    test("should reject too short or too long numbers", () => {
      expect(isValidMobileNumber("123456789")).toBe(false);
      expect(isValidMobileNumber("1234567890123456")).toBe(false);
    });
  });

  describe("formatUserData", () => {
    test("should format user data correctly", () => {
      const input = {
        firstName: "hazem",
        lastName: "hassan",
        email: "hazem.hassan@gmail.com",
        username: "hazem123",
        gender: "MALE",
        mobileNumber: "1234567890",
      };

      const expected = {
        firstName: "Hazem",
        lastName: "Hassan",
        email: "hazem.hassan@gmail.com",
        username: "hazem123",
        gender: "male",
        mobileNumber: "1234567890",
      };

      expect(formatUserData(input)).toEqual(expected);
    });

    test("should return null for non-object input", () => {
      expect(formatUserData(null)).toBeNull();
      expect(formatUserData("string")).toBeNull();
      expect(formatUserData(123)).toBeNull();
    });

    test("should handle partial user data", () => {
      const input = {
        firstName: "soliman",
      };

      const expected = {
        firstName: "Soliman",
      };

      expect(formatUserData(input)).toMatchObject(expected);
    });
  });

  describe("getUserInitials", () => {
    test("should return correct initials", () => {
      expect(getUserInitials("hazem", "hassan")).toBe("HH");
      expect(getUserInitials("seif", "wail")).toBe("SW");
    });

    test("should handle names with spaces", () => {
      expect(getUserInitials(" soliman ", " sami ")).toBe("SS");
    });

    test("should return empty string for invalid inputs", () => {
      const invalidInputs = [
        getUserInitials("", "hassan"),
        getUserInitials("hazem", ""),
        getUserInitials(null, "hassan"),
        getUserInitials("hazem", null),
        getUserInitials(123, "hassan"),
        getUserInitials("hazem", 123),
      ];

      expect(invalidInputs).toEqual(expect.arrayContaining(["", "", "", "", "", ""]));

      invalidInputs.forEach((input) => {
        expect(input).toBe("");
      });
    });
  });
});
