const axios = require('axios');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Account = require('../models/account');
const accountController = require("../controllers/accountController");

jest.mock('axios');
jest.mock('jsonwebtoken');
jest.mock('bcryptjs');
jest.mock('../models/account');

describe("accountController", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  describe("getUser", () => {
    it("should return user details for a valid user ID", async () => {
      const mockUser = { id: 1, firstname: "John", lastname: "Doe" };
      Account.getUserById.mockResolvedValue(mockUser);

      const req = { params: { id: 1 } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await accountController.getUser(req, res);

      expect(Account.getUserById).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it("should return 404 if user is not found", async () => {
      Account.getUserById.mockResolvedValue(null);

      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await accountController.getUser(req, res);

      expect(Account.getUserById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('User not found');
    });

    it("should handle errors and return 500", async () => {
      Account.getUserById.mockRejectedValue(new Error("Server error"));

      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await accountController.getUser(req, res);

      expect(Account.getUserById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Server error');
    });
  });

  describe("loginUser", () => {
    it("should return 400 if reCAPTCHA token is missing", async () => {
      const req = { body: { email: "john.doe@example.com", password: "password123" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await accountController.loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "reCAPTCHA token is missing" });
    });

    it("should return 400 if reCAPTCHA verification fails", async () => {
      axios.post.mockResolvedValue({ data: { success: false } });

      const req = { body: { email: "john.doe@example.com", password: "password123", 'g-recaptcha-response': "invalidToken" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await accountController.loginUser(req, res);

      expect(axios.post).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Failed reCAPTCHA verification" });
    });

    it("should return 401 if user credentials are invalid", async () => {
      axios.post.mockResolvedValue({ data: { success: true } });
      Account.getUserByEmail.mockResolvedValue(null);

      const req = { body: { email: "john.doe@example.com", password: "password123", 'g-recaptcha-response': "validToken" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await accountController.loginUser(req, res);

      expect(Account.getUserByEmail).toHaveBeenCalledWith("john.doe@example.com");
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
    });

    it("should return 200 and a token for valid credentials", async () => {
      axios.post.mockResolvedValue({ data: { success: true } });
      const mockUser = { account_id: 1, email: "john.doe@example.com", password: "hashedPassword", role: "User" };
      Account.getUserByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("validToken");

      const req = { body: { email: "john.doe@example.com", password: "password123", 'g-recaptcha-response': "validToken" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await accountController.loginUser(req, res);

      expect(Account.getUserByEmail).toHaveBeenCalledWith("john.doe@example.com");
      expect(bcrypt.compare).toHaveBeenCalledWith("password123", "hashedPassword");
      expect(jwt.sign).toHaveBeenCalledWith({ id: mockUser.account_id, role: mockUser.role }, process.env.JWT_SECRET_KEY, { expiresIn: '3600s' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Login successful', user: mockUser, token: "validToken" });
    });

    it("should handle errors and return 500", async () => {
      axios.post.mockRejectedValue(new Error("Server error"));

      const req = { body: { email: "john.doe@example.com", password: "password123", 'g-recaptcha-response': "validToken" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await accountController.loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe("createUser", () => {
    it("should return 400 if reCAPTCHA verification fails", async () => {
      axios.post.mockResolvedValue({ data: { success: false } });

      const req = { body: { firstname: "John", lastname: "Doe", email: "john.doe@example.com", phone_number: "1234567890", password: "password123", recaptchaToken: "invalidToken" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await accountController.createUser(req, res);

      expect(axios.post).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Failed reCAPTCHA verification" });
    });

    it("should return 400 if required fields are missing", async () => {
      const req = { body: { email: "john.doe@example.com", phone_number: "1234567890", password: "password123", recaptchaToken: "validToken" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await accountController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Please provide first name, last name, email, phone number, and password" });
    });

    it("should return 400 if email already exists", async () => {
      axios.post.mockResolvedValue({ data: { success: true } });
      Account.getUserByEmail.mockResolvedValue({});

      const req = { body: { firstname: "John", lastname: "Doe", email: "john.doe@example.com", phone_number: "1234567890", password: "password123", recaptchaToken: "validToken" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await accountController.createUser(req, res);

      expect(Account.getUserByEmail).toHaveBeenCalledWith("john.doe@example.com");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Email already exists" });
    });

    it("should return 400 if phone number already exists", async () => {
      axios.post.mockResolvedValue({ data: { success: true } });
      Account.getUserByPhoneNum.mockResolvedValue({});

      const req = { body: { firstname: "John", lastname: "Doe", email: "john.doe@example.com", phone_number: "1234567890", password: "password123", recaptchaToken: "validToken" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await accountController.createUser(req, res);

      expect(Account.getUserByPhoneNum).toHaveBeenCalledWith("1234567890");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Phone number already exists" });
    });

    it("should create a new user and return 201 with token", async () => {
      axios.post.mockResolvedValue({ data: { success: true } });
      Account.getUserByEmail.mockResolvedValue(null);
      Account.getUserByPhoneNum.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashedPassword");
      const mockUser = { account_id: 1, firstname: "John", lastname: "Doe", email: "john.doe@example.com", phone_number: "1234567890", role: "User" };
      Account.createUser.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue("validToken");

      const req = { body: { firstname: "John", lastname: "Doe", email: "john.doe@example.com", phone_number: "1234567890", password: "password123", recaptchaToken: "validToken" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await accountController.createUser(req, res);

      expect(axios.post).toHaveBeenCalled();
      expect(Account.getUserByEmail).toHaveBeenCalledWith("john.doe@example.com");
      expect(Account.getUserByPhoneNum).toHaveBeenCalledWith("1234567890");
      expect(bcrypt.hash).toHaveBeenCalledWith("password123", expect.any(Number));
      expect(Account.createUser).toHaveBeenCalledWith("John", "Doe", "john.doe@example.com", "1234567890", "hashedPassword");
      expect(jwt.sign).toHaveBeenCalledWith({ id: mockUser.account_id, role: mockUser.role }, process.env.JWT_SECRET_KEY, { expiresIn: '3600s' });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: "User created successfully", user: mockUser, token: "validToken" });
    });

    it("should handle errors and return 500", async () => {
      axios.post.mockRejectedValue(new Error("Server error"));

      const req = { body: { firstname: "John", lastname: "Doe", email: "john.doe@example.com", phone_number: "1234567890", password: "password123", recaptchaToken: "validToken" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await accountController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
    });
  });

  describe("updateUser", () => {
    it("should update user details and return the updated user", async () => {
      const mockUser = { id: 1, firstname: "John", lastname: "Doe", email: "john.doe@example.com", phone_number: "1234567890", password: "hashedPassword" };
      bcrypt.hash.mockResolvedValue("newHashedPassword");
      Account.updateUser.mockResolvedValue(mockUser);

      const req = { params: { id: 1 }, body: { firstname: "John", lastname: "Doe", email: "john.doe@example.com", phone_number: "1234567890", password: "newPassword" } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis(), send: jest.fn() };

      await accountController.updateUser(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith("newPassword", expect.any(Number));
      expect(Account.updateUser).toHaveBeenCalledWith(1, "John", "Doe", "john.doe@example.com", "1234567890", "newHashedPassword");
      expect(res.json).toHaveBeenCalledWith({ user: mockUser });
    });

    it("should update user details without password and return the updated user", async () => {
      const mockUser = { id: 1, firstname: "John", lastname: "Doe", email: "john.doe@example.com", phone_number: "1234567890" };
      Account.updateUser.mockResolvedValue(mockUser);

      const req = { params: { id: 1 }, body: { firstname: "John", lastname: "Doe", email: "john.doe@example.com", phone_number: "1234567890" } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis(), send: jest.fn() };

      await accountController.updateUser(req, res);

      expect(Account.updateUser).toHaveBeenCalledWith(1, "John", "Doe", "john.doe@example.com", "1234567890", null);
      expect(res.json).toHaveBeenCalledWith({ user: mockUser });
    });

    it("should handle errors and return 500", async () => {
      Account.updateUser.mockRejectedValue(new Error("Server error"));

      const req = { params: { id: 1 }, body: { firstname: "John", lastname: "Doe", email: "john.doe@example.com", phone_number: "1234567890", password: "newPassword" } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis(), send: jest.fn() };

      await accountController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Server error');
    });
  });
});
