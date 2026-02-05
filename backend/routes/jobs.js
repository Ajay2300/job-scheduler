const express = require("express");
const router = express.Router();

const { createJob, getAllJobs, getJobById, runJob } = require("../controllers/jobsController");

// Create a job
router.post("/", createJob);

// List all jobs (with optional filters)
router.get("/", getAllJobs);

// Get job by ID
router.get("/:id", getJobById);

// Run job (simulate)
router.post("/run-job/:id", runJob);

module.exports = router;
