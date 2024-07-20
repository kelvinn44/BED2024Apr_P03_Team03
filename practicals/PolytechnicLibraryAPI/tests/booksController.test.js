// booksController.test.js

const booksController = require("../controllers/booksController");
const Book = require("../models/book");

// Mock the Book model
jest.mock("../models/book"); // Replace with the actual path to your Book model

describe("booksController.getAllBooks", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  it("should fetch all books and return a JSON response", async () => {
    const mockBooks = [
      { id: 1, title: "The Lord of the Rings" },
      { id: 2, title: "The Hitchhiker's Guide to the Galaxy" },
    ];

    // Mock the Book.getAllBooks function to return the mock data
    Book.getAllBooks.mockResolvedValue(mockBooks);

    const req = {};
    const res = {
      json: jest.fn(), // Mock the res.json function
    };

    await booksController.getAllBooks(req, res);

    expect(Book.getAllBooks).toHaveBeenCalledTimes(1); // Check if getAllBooks was called
    expect(res.json).toHaveBeenCalledWith(mockBooks); // Check the response body
  });

  it("should handle errors and return a 500 status with error message", async () => {
    const errorMessage = "Database error";
    Book.getAllBooks.mockRejectedValue(new Error(errorMessage)); // Simulate an error

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await booksController.getAllBooks(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Error retrieving books");
  });
});

describe("booksController.updateAvailability", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("should update the availability of a book and return the updated book", async () => {
      const bookId = 1;
      const newAvailability = "Y";
      const mockUpdatedBook = {
        book_id: bookId,
        title: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        availability: newAvailability,
      };
  
      // Mock the Book.updateAvailability function to return the mock data
      Book.updateAvailability.mockResolvedValue(mockUpdatedBook);
  
      const req = {
        params: { bookId: bookId.toString() },
        body: { availability: newAvailability },
      };
      const res = {
        json: jest.fn(),
      };
  
      await booksController.updateAvailability(req, res);
  
      expect(Book.updateAvailability).toHaveBeenCalledWith(bookId, newAvailability);
      expect(res.json).toHaveBeenCalledWith(mockUpdatedBook);
    });
  
    it("should return 400 if availability is invalid", async () => {
      const bookId = 1;
      const invalidAvailability = "invalid";
  
      const req = {
        params: { bookId: bookId.toString() },
        body: { availability: invalidAvailability },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
  
      await booksController.updateAvailability(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Invalid availability value. It should be 'Y' or 'N'.");
    });
  
    it("should return 404 if the book is not found", async () => {
      const bookId = 999;
      const newAvailability = "Y";
  
      // Mock the Book.updateAvailability function to return null
      Book.updateAvailability.mockResolvedValue(null);
  
      const req = {
        params: { bookId: bookId.toString() },
        body: { availability: newAvailability },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
  
      await booksController.updateAvailability(req, res);
  
      expect(Book.updateAvailability).toHaveBeenCalledWith(bookId, newAvailability);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Book not found");
    });
  
    it("should handle errors and return a 500 status with error message", async () => {
      const bookId = 1;
      const newAvailability = "Y";
      const errorMessage = "Database error";
  
      // Mock the Book.updateAvailability function to throw an error
      Book.updateAvailability.mockRejectedValue(new Error(errorMessage));
  
      const req = {
        params: { bookId: bookId.toString() },
        body: { availability: newAvailability },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
  
      await booksController.updateAvailability(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error updating book availability");
    });
});
