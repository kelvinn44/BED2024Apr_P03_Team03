const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Forum {
  constructor(post_id, account_id, post_date, title, content, firstname) {
    this.post_id = post_id;
    this.account_id = account_id;
    this.post_date = post_date;
    this.title = title;
    this.content = content;
    this.firstname = firstname;
  }

  static async getAllPosts() {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT Forum.post_id, Forum.account_id, Forum.post_date, Forum.title, Forum.content, Account.firstname 
      FROM Forum 
      INNER JOIN Account ON Forum.account_id = Account.account_id
      ORDER BY Forum.post_date DESC
      `;

    const request = connection.request();
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset.map(
      (row) =>
        new Forum(
          row.post_id,
          row.account_id,
          row.post_date,
          row.title,
          row.content,
          row.firstname
        )
    );
  }

  static async getPostById(postId) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM Forum WHERE post_id = @postId`;
    const request = connection.request();
    request.input("postId", sql.Int, postId);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset[0]
      ? new Forum(
          result.recordset[0].post_id,
          result.recordset[0].account_id,
          result.recordset[0].post_date,
          result.recordset[0].title,
          result.recordset[0].content
        )
      : null;
  }

  static async createPost(newPostData, accountId) {
    try {
      const connection = await sql.connect(dbConfig);
      const sqlQuery = `
          INSERT INTO Forum (account_id, post_date, title, content)
          VALUES (@accountId, @postDate, @title, @content);
          SELECT SCOPE_IDENTITY() AS post_id;
        `;

      const request = connection.request();
      request.input("accountId", sql.Int, accountId);
      request.input("postDate", sql.DateTime, new Date());
      request.input("title", sql.NVarChar, newPostData.title);
      request.input("content", sql.NVarChar, newPostData.content);

      const result = await request.query(sqlQuery);

      connection.close();

      return result.recordset[0].post_id;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  static async updatePost(postId, title, content) {
    try {
      const connection = await sql.connect(dbConfig);
      const sqlQuery = `
          UPDATE Forum
          SET title = @title, content = @content
          WHERE post_id = @postId
        `;
  
      const request = connection.request();
      request.input("postId", sql.Int, postId);
      request.input("title", sql.NVarChar, title);
      request.input("content", sql.NVarChar, content);
  
      const result = await request.query(sqlQuery);
  
      connection.close();
  
      return result.rowsAffected[0] === 1;
    } catch (err) {
      console.log(err);
      return false;
    }
  }  

  static async deletePost(postId) {
    try {
      const connection = await sql.connect(dbConfig);
      const sqlQuery = `DELETE FROM Forum WHERE post_id = @postId`;

      const request = connection.request();
      request.input("postId", sql.Int, postId);
      const result = await request.query(sqlQuery);

      connection.close();

      return result.rowsAffected[0] === 1;
    } catch (error) {
      console.log("Error deleting post");
      return false;
    }
  }
};

module.exports = Forum;

   