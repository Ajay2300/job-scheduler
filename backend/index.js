const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db"); // make sure db.js connects to MySQL

const jobRoutes = require("./routes/jobs");

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Job Scheduler Backend Running");
});

// Job routes
app.use("/jobs", jobRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
