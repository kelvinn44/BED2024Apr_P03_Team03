const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger-output.json"; // Output file for the spec
const routes = ["./app.js"]; // Path to your API route files

const doc = {
  info: {
    title: "BED2024Apr_P03_Team03 API",
    description: "API documentation for BED2024Apr_P03_Team03 assignment",
  },
  host: "localhost:3000", // Replace with your actual host if needed
};

swaggerAutogen(outputFile, routes, doc);
