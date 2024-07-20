const Account = require("../models/account");
const sql = require("mssql");

jest.mock("mssql"); // Mock the mssql library

describe("Account model", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  describe("getUserById", () => {
    it("should return user by ID", async () => {
      const mockUser = {
        account_id: 1,
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com",
        phone_number: "1234567890",
        password: "password123",
        role: "User",
        recurring_donation_amount: 100,
      };

      const mockRequest = {
        query: jest.fn().mockResolvedValue({ recordset: [mockUser] }),
        input: jest.fn().mockReturnThis(),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };

      sql.connect.mockResolvedValue(mockConnection);

      const user = await Account.getUserById(1);

      expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
      expect(mockRequest.input).toHaveBeenCalledWith("id", sql.Int, 1);
      expect(mockRequest.query).toHaveBeenCalledWith(expect.any(String));
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(user).toBeInstanceOf(Account);
      expect(user.account_id).toBe(mockUser.account_id);
      expect(user.email).toBe(mockUser.email);
    });

    it("should return null if user not found", async () => {
      const mockRequest = {
        query: jest.fn().mockResolvedValue({ recordset: [] }),
        input: jest.fn().mockReturnThis(),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };

      sql.connect.mockResolvedValue(mockConnection);

      const user = await Account.getUserById(1);

      expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
      expect(mockRequest.input).toHaveBeenCalledWith("id", sql.Int, 1);
      expect(mockRequest.query).toHaveBeenCalledWith(expect.any(String));
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(user).toBeNull();
    });

    it("should handle errors", async () => {
      const errorMessage = "Database error";

      sql.connect.mockRejectedValue(new Error(errorMessage));

      await expect(Account.getUserById(1)).rejects.toThrow("Error fetching user by ID");
    });
  });

  describe("getUserByEmail", () => {
    it("should return user by email", async () => {
      const mockUser = {
        account_id: 1,
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com",
        phone_number: "1234567890",
        password: "password123",
        role: "User",
        recurring_donation_amount: 100,
      };

      const mockRequest = {
        query: jest.fn().mockResolvedValue({ recordset: [mockUser] }),
        input: jest.fn().mockReturnThis(),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };

      sql.connect.mockResolvedValue(mockConnection);

      const user = await Account.getUserByEmail("john.doe@example.com");

      expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
      expect(mockRequest.input).toHaveBeenCalledWith("email", sql.VarChar, "john.doe@example.com");
      expect(mockRequest.query).toHaveBeenCalledWith(expect.any(String));
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(user).toBeInstanceOf(Account);
      expect(user.email).toBe(mockUser.email);
    });

    it("should return null if user not found by email", async () => {
      const mockRequest = {
        query: jest.fn().mockResolvedValue({ recordset: [] }),
        input: jest.fn().mockReturnThis(),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };

      sql.connect.mockResolvedValue(mockConnection);

      const user = await Account.getUserByEmail("john.doe@example.com");

      expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
      expect(mockRequest.input).toHaveBeenCalledWith("email", sql.VarChar, "john.doe@example.com");
      expect(mockRequest.query).toHaveBeenCalledWith(expect.any(String));
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(user).toBeNull();
    });

    it("should handle errors", async () => {
      const errorMessage = "Database error";

      sql.connect.mockRejectedValue(new Error(errorMessage));

      await expect(Account.getUserByEmail("john.doe@example.com")).rejects.toThrow("Error fetching user by email");
    });
  });

  describe("getUserByPhoneNum", () => {
    it("should return user by phone number", async () => {
      const mockUser = {
        account_id: 1,
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com",
        phone_number: "1234567890",
        password: "password123",
        role: "User",
        recurring_donation_amount: 100,
      };

      const mockRequest = {
        query: jest.fn().mockResolvedValue({ recordset: [mockUser] }),
        input: jest.fn().mockReturnThis(),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };

      sql.connect.mockResolvedValue(mockConnection);

      const user = await Account.getUserByPhoneNum("1234567890");

      expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
      expect(mockRequest.input).toHaveBeenCalledWith("phone_number", sql.VarChar, "1234567890");
      expect(mockRequest.query).toHaveBeenCalledWith(expect.any(String));
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(user).toBeInstanceOf(Account);
      expect(user.phone_number).toBe(mockUser.phone_number);
    });

    it("should return null if user not found by phone number", async () => {
      const mockRequest = {
        query: jest.fn().mockResolvedValue({ recordset: [] }),
        input: jest.fn().mockReturnThis(),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };

      sql.connect.mockResolvedValue(mockConnection);

      const user = await Account.getUserByPhoneNum("1234567890");

      expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
      expect(mockRequest.input).toHaveBeenCalledWith("phone_number", sql.VarChar, "1234567890");
      expect(mockRequest.query).toHaveBeenCalledWith(expect.any(String));
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(user).toBeNull();
    });

    it("should handle errors", async () => {
      const errorMessage = "Database error";

      sql.connect.mockRejectedValue(new Error(errorMessage));

      await expect(Account.getUserByPhoneNum("1234567890")).rejects.toThrow("Error fetching user by phone number");
    });
  });

  describe("createUser", () => {
    it("should create a new user and return the user data", async () => {
      const mockUserData = {
        account_id: 1,
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com",
        phone_number: "1234567890",
        role: "User",
      };

      const mockRequest = {
        query: jest.fn().mockResolvedValue({ recordset: [{ account_id: 1 }] }),
        input: jest.fn().mockReturnThis(),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };

      sql.connect.mockResolvedValue(mockConnection);

      const user = await Account.createUser(
        mockUserData.firstname,
        mockUserData.lastname,
        mockUserData.email,
        mockUserData.phone_number,
        "password123"
      );

      expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
      expect(mockRequest.input).toHaveBeenCalledWith("firstname", sql.VarChar, mockUserData.firstname);
      expect(mockRequest.input).toHaveBeenCalledWith("lastname", sql.VarChar, mockUserData.lastname);
      expect(mockRequest.input).toHaveBeenCalledWith("email", sql.VarChar, mockUserData.email);
      expect(mockRequest.input).toHaveBeenCalledWith("phone_number", sql.VarChar, mockUserData.phone_number);
      expect(mockRequest.input).toHaveBeenCalledWith("password", sql.VarChar, "password123");
      expect(mockRequest.query).toHaveBeenCalledWith(expect.any(String));
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(user).toEqual(mockUserData);
    });

    it("should handle unique constraint violation error", async () => {
      const errorMessage = "Violation of UNIQUE KEY constraint";

      const mockRequest = {
        query: jest.fn().mockRejectedValue({ code: "EREQUEST", originalError: { info: { message: errorMessage } } }),
        input: jest.fn().mockReturnThis(),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };

      sql.connect.mockResolvedValue(mockConnection);

      await expect(
        Account.createUser("John", "Doe", "john.doe@example.com", "1234567890", "password123")
      ).rejects.toThrow("Email or phone number already in use");
    });

    it("should handle errors", async () => {
      const errorMessage = "Database error";

      const mockRequest = {
        query: jest.fn().mockRejectedValue(new Error(errorMessage)),
        input: jest.fn().mockReturnThis(),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };

      sql.connect.mockResolvedValue(mockConnection);

      await expect(
        Account.createUser("John", "Doe", "john.doe@example.com", "1234567890", "password123")
      ).rejects.toThrow("Error creating new user");
    });
  });

  describe("updateUser", () => {
    it("should update user details and return the updated user", async () => {
      const mockUser = {
        account_id: 1,
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com",
        phone_number: "1234567890",
        password: "password123",
        role: "User",
        recurring_donation_amount: 100,
      };

      const mockRequest = {
        query: jest.fn().mockResolvedValue({}),
        input: jest.fn().mockReturnThis(),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };

      sql.connect.mockResolvedValue(mockConnection);

      Account.getUserById = jest.fn().mockResolvedValue(mockUser);

      const updatedUser = await Account.updateUser(
        1,
        "John",
        "Doe",
        "john.doe@example.com",
        "1234567890",
        "password123"
      );

      expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
      expect(mockRequest.input).toHaveBeenCalledWith("id", sql.Int, 1);
      expect(mockRequest.input).toHaveBeenCalledWith("firstname", sql.VarChar, "John");
      expect(mockRequest.input).toHaveBeenCalledWith("lastname", sql.VarChar, "Doe");
      expect(mockRequest.input).toHaveBeenCalledWith("email", sql.VarChar, "john.doe@example.com");
      expect(mockRequest.input).toHaveBeenCalledWith("phone_number", sql.VarChar, "1234567890");
      expect(mockRequest.input).toHaveBeenCalledWith("password", sql.VarChar, "password123");
      expect(mockRequest.query).toHaveBeenCalledWith(expect.any(String));
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(updatedUser).toEqual(mockUser);
    });

    it("should handle errors", async () => {
      const errorMessage = "Database error";

      const mockRequest = {
        query: jest.fn().mockRejectedValue(new Error(errorMessage)),
        input: jest.fn().mockReturnThis(),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };

      sql.connect.mockResolvedValue(mockConnection);

      await expect(
        Account.updateUser(1, "John", "Doe", "john.doe@example.com", "1234567890", "password123")
      ).rejects.toThrow("Error updating user details");
    });
  });
});
