## Week 11 & 12 Practical - Polytechnic Library API notes

Create a ".env" file in PolytechnicLibaryAPI directory and in the file enter the following:
`JWT_SECRET_KEY=<your_secret_key>`

To create a random secret key:
1. In your terminal type "node"
2. Enter: require('crypto').randomBytes(64).toString('hex')
3. Copy and paste the output to your ".env" file: `<your_secret_key>` input

### dbConfig.js update reminder
Update the dbConfig.js username, password, and database to match your own DB configuration.

### Postman Testing

When using Postman to test, make sure to type:

- **Key:** `Authorization`
- **Value:** `Bearer <token>`

In the Headers section of Postman.

You get `<token>` when you have logged in successfully.

---
### Sample data from DB

Username:Password

User1:Hashed1 - member role

User2:Hashed2 - member role

User3:Hashed3 - librarian role

****Main requirements for Back-end API fully working using Postman**

e.g.:

- Only authorized users can access the system. This includes librarians and registered library members.
- Library members and Librarians can view books and their availability.
- Librarians have the access to update a book's availability.
- Both can Login or Register as either member or librarian
