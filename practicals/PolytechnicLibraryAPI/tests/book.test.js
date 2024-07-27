// book.test.js
const Book = require("../models/book");
const sql = require("mssql");
const dbConfig = require("../dbConfig");

jest.mock("mssql"); // Mock the mssql library

describe("Book.getAllBooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve all books from the database", async () => {
    const mockBooks = [
      {
        book_id: 1,
        title: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        availability: "Y",
      },
      {
        book_id: 2,
        title: "The Hitchhiker's Guide to the Galaxy",
        author: "Douglas Adams",
        availability: "N",
      },
    ];

    const mockRequest = {
      query: jest.fn().mockResolvedValue({ recordset: mockBooks }),
    };
    const mockConnection = {
      request: jest.fn().mockReturnValue(mockRequest),
      close: jest.fn().mockResolvedValue(undefined),
    };

    sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

    const books = await Book.getAllBooks();

    expect(sql.connect).toHaveBeenCalledWith(dbConfig);
    expect(mockConnection.close).toHaveBeenCalledTimes(1);
    expect(books).toHaveLength(2);
    expect(books[0]).toBeInstanceOf(Book);
    expect(books[0].book_id).toBe(1);
    expect(books[0].title).toBe("The Lord of the Rings");
    expect(books[0].author).toBe("J.R.R. Tolkien");
    expect(books[0].availability).toBe("Y");
    // Add assertions for the second book
    expect(books[1].book_id).toBe(2);
    expect(books[1].title).toBe("The Hitchhiker's Guide to the Galaxy");
    expect(books[1].author).toBe("Douglas Adams");
    expect(books[1].availability).toBe("N");
  });

  it("should handle errors when retrieving books", async () => {
    const errorMessage = "Database Error";
    sql.connect.mockRejectedValue(new Error(errorMessage));
    await expect(Book.getAllBooks()).rejects.toThrow(errorMessage);
  });
});

describe("Book.updateBookAvailability", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update the availability of a book", async () => {
    const bookId = 1;
    const newAvailability = "N";
    const mockUpdatedBook = {
      book_id: 1,
      availability: newAvailability,
    };

    const mockRequest = {
      query: jest.fn().mockResolvedValue({ rowsAffected: [1] }),
      input: jest.fn().mockReturnThis(),
    };
    const mockConnection = {
      request: jest.fn().mockReturnValue(mockRequest),
      close: jest.fn().mockResolvedValue(undefined),
    };

    sql.connect.mockResolvedValue(mockConnection);

    const updatedBook = await Book.updateAvailability(bookId, newAvailability);

    expect(sql.connect).toHaveBeenCalledWith(dbConfig);
    expect(mockRequest.input).toHaveBeenCalledWith("id", bookId);
    expect(mockRequest.input).toHaveBeenCalledWith("availability", newAvailability);
    expect(mockRequest.query).toHaveBeenCalledWith(
      "UPDATE Books SET availability = @availability WHERE book_id = @id"
    );
    expect(mockConnection.close).toHaveBeenCalledTimes(1); // Ensure this is called only once
    expect(updatedBook).toBeInstanceOf(Book);
    expect(updatedBook.book_id).toBe(mockUpdatedBook.book_id);
    expect(updatedBook.availability).toBe(mockUpdatedBook.availability);
  });

  it("should return null if book with the given id does not exist", async () => {
    const bookId = 999;
    const newAvailability = "N";

    const mockRequest = {
      query: jest.fn().mockResolvedValue({ rowsAffected: [0] }),
      input: jest.fn().mockReturnThis(),
    };
    const mockConnection = {
      request: jest.fn().mockReturnValue(mockRequest),
      close: jest.fn().mockResolvedValue(undefined),
    };

    sql.connect.mockResolvedValue(mockConnection);

    const updatedBook = await Book.updateAvailability(bookId, newAvailability);

    expect(sql.connect).toHaveBeenCalledWith(dbConfig);
    expect(mockRequest.input).toHaveBeenCalledWith("id", bookId);
    expect(mockRequest.input).toHaveBeenCalledWith("availability", newAvailability);
    expect(mockRequest.query).toHaveBeenCalledWith(
      "UPDATE Books SET availability = @availability WHERE book_id = @id"
    );
    expect(mockConnection.close).toHaveBeenCalledTimes(1); // Ensure this is called only once
    expect(updatedBook).toBeNull();
  });

  it("should handle errors during the update", async () => {
    const bookId = 1;
    const newAvailability = "N";
    const errorMessage = "Database Error";

    const mockRequest = {
      input: jest.fn().mockReturnThis(),
      query: jest.fn().mockRejectedValue(new Error(errorMessage)),
    };
    const mockConnection = {
      request: jest.fn().mockReturnValue(mockRequest),
      close: jest.fn().mockResolvedValue(undefined),
    };

    sql.connect.mockResolvedValue(mockConnection);

    await expect(Book.updateAvailability(bookId, newAvailability)).rejects.toThrow(
      errorMessage
    );

    expect(sql.connect).toHaveBeenCalledWith(dbConfig);
    expect(mockRequest.input).toHaveBeenCalledWith("id", bookId);
    expect(mockRequest.input).toHaveBeenCalledWith("availability", newAvailability);
    expect(mockRequest.query).toHaveBeenCalledWith(
      "UPDATE Books SET availability = @availability WHERE book_id = @id"
    );
    expect(mockConnection.close).toHaveBeenCalledTimes(1);
  });
});