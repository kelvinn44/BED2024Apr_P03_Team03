const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Book {
  constructor(book_id, title, author, availability) {
    this.book_id = book_id;
    this.title = title;
    this.author = author;
    this.availability = availability;
  }

  static async getAllBooks() {
    let connection;
    try {
      connection = await sql.connect(dbConfig);
      const sqlQuery = `SELECT * FROM Books`;
      const request = connection.request();
      const result = await request.query(sqlQuery);
      return result.recordset.map(
        (row) => new Book(row.book_id, row.title, row.author, row.availability)
      );
    } catch (error) {
      throw new Error('Database Error');
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }

  static async getBookById(id) {
    let connection;
    try {
      connection = await sql.connect(dbConfig);
      const sqlQuery = `SELECT * FROM Books WHERE book_id = @id`;
      const request = connection.request();
      request.input("id", id);
      const result = await request.query(sqlQuery);
      return result.recordset[0]
        ? new Book(
            result.recordset[0].book_id,
            result.recordset[0].title,
            result.recordset[0].author,
            result.recordset[0].availability
          )
        : null;
    } catch (error) {
      throw new Error('Database Error');
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }

  static async createBook(newBookData) {
    let connection;
    try {
      connection = await sql.connect(dbConfig);
      const sqlQuery = `INSERT INTO Books (title, author, availability) VALUES (@title, @author, @availability); SELECT SCOPE_IDENTITY() AS id;`;
      const request = connection.request();
      request.input("title", newBookData.title);
      request.input("author", newBookData.author);
      request.input("availability", newBookData.availability);
      const result = await request.query(sqlQuery);
      return this.getBookById(result.recordset[0].id);
    } catch (error) {
      throw new Error('Database Error');
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }

  static async updateBook(id, newBookData) {
    let connection;
    try {
      connection = await sql.connect(dbConfig);
      const sqlQuery = `UPDATE Books SET title = @title, author = @author, availability = @availability WHERE book_id = @id`;
      const request = connection.request();
      request.input("id", id);
      request.input("title", newBookData.title || null);
      request.input("author", newBookData.author || null);
      request.input("availability", newBookData.availability || null);
      await request.query(sqlQuery);
      return this.getBookById(id);
    } catch (error) {
      throw new Error('Database Error');
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }

  static async deleteBook(id) {
    let connection;
    try {
      connection = await sql.connect(dbConfig);
      const sqlQuery = `DELETE FROM Books WHERE book_id = @id`;
      const request = connection.request();
      request.input("id", id);
      const result = await request.query(sqlQuery);
      return result.rowsAffected > 0;
    } catch (error) {
      throw new Error('Database Error');
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }

  static async updateAvailability(bookId, newAvailability) {
    let connection;
    try {
      connection = await sql.connect(dbConfig);  // Ensure dbConfig is used here
      const request = connection.request();
      request.input("id", bookId);
      request.input("availability", newAvailability);
      const result = await request.query(
        "UPDATE Books SET availability = @availability WHERE book_id = @id"
      );

      // Check if result and rowsAffected are defined
      if (result && result.rowsAffected && result.rowsAffected[0] === 0) {
        return null; // No book found
      }

      // Return the updated book object
      return new Book(bookId, null, null, newAvailability);
    } catch (error) {
      throw new Error('Database Error');
    } finally {
      if (connection) {
        await connection.close(); // Ensure the connection is closed here
      }
    }
  }
}

module.exports = Book;