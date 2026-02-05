const db = require("../db");

// Create Job
const createJob = (req, res) => {
  const { taskName, payload, priority } = req.body;
  if (!taskName || !priority) {
    return res.status(400).json({ message: "taskName and priority are required" });
  }

  const jobData = {
    taskName,
    payload: JSON.stringify(payload || {}),
    priority,
    status: "pending",
  };

  const sql = "INSERT INTO jobs (taskName, payload, priority, status) VALUES (?, ?, ?, ?)";
  db.query(sql, [jobData.taskName, jobData.payload, jobData.priority, jobData.status], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
    res.status(201).json({ message: "Job created successfully", jobId: result.insertId });
  });
};

// Get all jobs
const getAllJobs = (req, res) => {
  let sql = "SELECT * FROM jobs";

  // Optional filtering
  const { status, priority } = req.query;
  const conditions = [];
  const params = [];

  if (status) {
    conditions.push("status = ?");
    params.push(status);
  }
  if (priority) {
    conditions.push("priority = ?");
    params.push(priority);
  }

  if (conditions.length) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
};

// Get job by id
const getJobById = (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM jobs WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(results[0]);
  });
};

// Run job (simulate)
const runJob = (req, res) => {
  const { id } = req.params;

  // Check if job exists
  db.query("SELECT * FROM jobs WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (results.length === 0) return res.status(404).json({ message: "Job not found" });

    const job = results[0];
    if (job.status === "running" || job.status === "completed") {
      return res.status(400).json({ message: `Cannot run a job that is ${job.status}` });
    }

    // Set status to running
    db.query("UPDATE jobs SET status = 'running' WHERE id = ?", [id], (err) => {
      if (err) return res.status(500).json({ message: "Database error" });

      res.json({ message: "Job is now running" });

      // Simulate background processing
      setTimeout(() => {
        const completedAt = new Date();
        db.query(
          "UPDATE jobs SET status = 'completed', updatedAt = ?, completedAt = ? WHERE id = ?",
          [completedAt, completedAt, id],
          (err) => {
            if (err) return console.error(err);

            // Trigger webhook (example using fetch)
            const fetch = require("node-fetch"); // npm install node-fetch
            const WEBHOOK_URL = process.env.WEBHOOK_URL || "https://webhook.site/<your-id>";

            const payload = {
              jobId: job.id,
              taskName: job.taskName,
              priority: job.priority,
              payload: JSON.parse(job.payload),
              completedAt,
            };

            fetch(WEBHOOK_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            })
              .then((res) => console.log("Webhook sent"))
              .catch((err) => console.error("Webhook error:", err));
          }
        );
      }, 3000);
    });
  });
};

module.exports = { createJob, getAllJobs, getJobById, runJob };
