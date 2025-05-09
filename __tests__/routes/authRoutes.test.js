const request = require("supertest");
const express = require("express");
const authRoutes = require("../../routes/authRoutes");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Mock the authentication middleware
jest.mock("../../middlewares/authMiddleware", () => (req, res, next) => next());

// Mock the User model
jest.mock("../../models/User");

// Mock bcrypt
jest.mock("bcryptjs");

// Mock jsonwebtoken
jest.mock("jsonwebtoken");

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);

describe("Auth Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("GET /auth/users - should return a list of users", async () => {
    const mockUsers = [
      {
        username: "user1",
        email: "user1@example.com",
        firstName: "John",
        lastName: "Doe",
        mobileNumber: "1234567890",
        gender: "male",
      },
      {
        username: "user2",
        email: "user2@example.com",
        firstName: "Jane",
        lastName: "Smith",
        mobileNumber: "0987654321",
        gender: "female",
      },
    ];

    User.find.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUsers),
    });

    const response = await request(app).get("/auth/users");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUsers);
    expect(User.find).toHaveBeenCalledTimes(1);
  });

  test("GET /auth/users - should handle server error", async () => {
    User.find.mockReturnValue({
      select: jest.fn().mockRejectedValue(new Error("Database error")),
    });

    const response = await request(app).get("/auth/users");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Server error" });
    expect(User.find).toHaveBeenCalledTimes(1);
  });

  // Tests for register endpoint
  test("POST /auth/register - should register a new user", async () => {
    // Arrange
    const userData = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
      firstName: "Test",
      lastName: "User",
      mobileNumber: "1234567890",
      gender: "male",
    };

    const hashedPassword = "hashedpassword123";

    // Mock User.findOne to return null (no existing user)
    User.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(null);

    // Mock bcrypt.hash
    bcrypt.hash.mockResolvedValue(hashedPassword);

    // Mock User constructor and save method
    const saveMock = jest.fn().mockResolvedValue(undefined);
    User.mockImplementation(() => ({
      save: saveMock,
    }));

    // Act
    const response = await request(app)
      .post("/auth/register")
      .send(userData)
      .set("Content-Type", "application/json");

    // Assert
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: "User registered successfully" });
    expect(User.findOne).toHaveBeenCalledWith({ email: userData.email });
    expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
    expect(User).toHaveBeenCalledWith({
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      mobileNumber: userData.mobileNumber,
      gender: userData.gender,
    });
    expect(saveMock).toHaveBeenCalledTimes(1);
  });

  test("POST /auth/register - should return error if passwords don't match", async () => {
    // Arrange
    const userData = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      confirmPassword: "different",
      firstName: "Test",
      lastName: "User",
      mobileNumber: "1234567890",
      gender: "male",
    };

    // Act
    const response = await request(app)
      .post("/auth/register")
      .send(userData)
      .set("Content-Type", "application/json");

    // Assert
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Passwords don't match" });
    expect(User.findOne).not.toHaveBeenCalled();
  });

  test("POST /auth/register - should return error if email already exists", async () => {
    // Arrange
    const userData = {
      username: "existinguser",
      email: "existing@example.com",
      password: "password123",
      confirmPassword: "password123",
      firstName: "Existing",
      lastName: "User",
      mobileNumber: "1234567890",
      gender: "male",
    };

    // Mock User.findOne to return an existing user
    User.findOne.mockResolvedValue({ _id: "123", email: userData.email });

    // Act
    const response = await request(app)
      .post("/auth/register")
      .send(userData)
      .set("Content-Type", "application/json");

    // Assert
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Email already exists" });
    expect(User.findOne).toHaveBeenCalledWith({ email: userData.email });
    expect(bcrypt.hash).not.toHaveBeenCalled();
  });

  test("POST /auth/register - should return error if username already taken", async () => {
    // Arrange
    const userData = {
      username: "existinguser",
      email: "new@example.com",
      password: "password123",
      confirmPassword: "password123",
      firstName: "New",
      lastName: "User",
      mobileNumber: "1234567890",
      gender: "male",
    };

    // Mock User.findOne to return null for email check, but return a user for username check
    User.findOne
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ _id: "123", username: userData.username });

    // Act
    const response = await request(app)
      .post("/auth/register")
      .send(userData)
      .set("Content-Type", "application/json");

    // Assert
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Username already taken" });
    expect(User.findOne).toHaveBeenCalledWith({ email: userData.email });
    expect(User.findOne).toHaveBeenCalledWith({ username: userData.username });
    expect(bcrypt.hash).not.toHaveBeenCalled();
  });

  test("POST /auth/register - should handle server error", async () => {
    // Arrange
    const userData = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
      firstName: "Test",
      lastName: "User",
      mobileNumber: "1234567890",
      gender: "male",
    };

    // Mock User.findOne to throw an error
    User.findOne.mockRejectedValue(new Error("Database error"));

    // Act
    const response = await request(app)
      .post("/auth/register")
      .send(userData)
      .set("Content-Type", "application/json");

    // Assert
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Server error" });
  });

  // Tests for login endpoint
  test("POST /auth/login - should log in a user successfully", async () => {
    // Arrange
    const loginData = {
      email: "test@example.com",
      password: "password123",
    };

    const mockUser = {
      _id: "user123",
      email: loginData.email,
      password: "hashedpassword123",
      firstName: "Test",
      lastName: "User",
      mobileNumber: "1234567890",
      gender: "male",
    };

    const mockToken = "jwt-token-123";

    // Mock User.findOne
    User.findOne.mockResolvedValue(mockUser);

    // Mock bcrypt.compare
    bcrypt.compare.mockResolvedValue(true);

    // Mock jwt.sign
    jwt.sign.mockReturnValue(mockToken);

    // Set JWT_SECRET environment variable for testing
    process.env.JWT_SECRET = "test-secret";

    // Act
    const response = await request(app)
      .post("/auth/login")
      .send(loginData)
      .set("Content-Type", "application/json");

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ token: mockToken });
    expect(User.findOne).toHaveBeenCalledWith({ email: loginData.email });
    expect(bcrypt.compare).toHaveBeenCalledWith(
      loginData.password,
      mockUser.password
    );
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: mockUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  });

  test("POST /auth/login - should return error if user not found", async () => {
    // Arrange
    const loginData = {
      email: "nonexistent@example.com",
      password: "password123",
    };

    // Mock User.findOne to return null (user not found)
    User.findOne.mockResolvedValue(null);

    // Act
    const response = await request(app)
      .post("/auth/login")
      .send(loginData)
      .set("Content-Type", "application/json");

    // Assert
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "user not found" });
    expect(User.findOne).toHaveBeenCalledWith({ email: loginData.email });
    expect(bcrypt.compare).not.toHaveBeenCalled();
  });

  test("POST /auth/login - should return error if password is incorrect", async () => {
    // Arrange
    const loginData = {
      email: "test@example.com",
      password: "wrongpassword",
    };

    const mockUser = {
      _id: "user123",
      email: loginData.email,
      password: "hashedpassword123",
      firstName: "Test",
      lastName: "User",
      mobileNumber: "1234567890",
      gender: "male",
    };

    // Mock User.findOne
    User.findOne.mockResolvedValue(mockUser);

    // Mock bcrypt.compare to return false (password doesn't match)
    bcrypt.compare.mockResolvedValue(false);

    // Act
    const response = await request(app)
      .post("/auth/login")
      .send(loginData)
      .set("Content-Type", "application/json");

    // Assert
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "invalid email or password" });
    expect(User.findOne).toHaveBeenCalledWith({ email: loginData.email });
    expect(bcrypt.compare).toHaveBeenCalledWith(
      loginData.password,
      mockUser.password
    );
    expect(jwt.sign).not.toHaveBeenCalled();
  });

  test("POST /auth/login - should handle server error", async () => {
    // Arrange
    const loginData = {
      email: "test@example.com",
      password: "password123",
    };

    // Mock User.findOne to throw an error
    User.findOne.mockRejectedValue(new Error("Database error"));

    // Act
    const response = await request(app)
      .post("/auth/login")
      .send(loginData)
      .set("Content-Type", "application/json");

    // Assert
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Server error" });
  });
});
