const db = require("../db");
const fetch = require("node-fetch");

// Create Job
const createJob = (req, res) => {
  const { taskName, payload, priority } = req.body;

  if (!taskName || !priority) {
    return res
      .status(400)
      .json({ message: "taskName and priority are required" });
  }

  const sql =
    "INSERT INTO jobs (taskName, payload, priority, status) VALUES (?, ?, ?, ?)";

  db.query(
    sql,
    [taskName, JSON.stringify(payload || {}), priority, "pending"],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error" });
      }

      res.status(201).json({
        message: "Job created successfully",
        jobId: result.insertId,
      });
    }
  );
};

// Get all jobs
const getAllJobs = (req, res) => {
  let sql = "SELECT * FROM jobs";
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

// Get job by ID
const getJobById = (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM jobs WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (results.length === 0)
      return res.status(404).json({ message: "Job not found" });

    res.json(results[0]);
  });
};

// Run job
const runJob = (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM jobs WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (results.length === 0)
      return res.status(404).json({ message: "Job not found" });

    const job = results[0];

    if (job.status !== "pending") {
      return res
        .status(400)
        .json({ message: `Job already ${job.status}` });
    }

    // Set job to running
    db.query(
      "UPDATE jobs SET status = 'running' WHERE id = ?",
      [id],
      (err) => {
        if (err) return res.status(500).json({ message: "Database error" });

        res.json({ message: "Job started" });

        // Simulate background execution
        setTimeout(() => {
          const completedAt = new Date();

          db.query(
            "UPDATE jobs SET status = 'completed', completedAt = ? WHERE id = ?",
            [completedAt, id],
            (err) => {
              if (err) return console.error(err);

              // ✅ SAFE payload parsing
              let parsedPayload = {};
              try {
                parsedPayload =
                  typeof job.payload === "string"
                    ? JSON.parse(job.payload)
                    : job.payload || {};
              } catch (e) {
                console.error("Payload parse failed:", e);
              }

              // Webhook (safe)
              if (process.env.WEBHOOK_URL) {
                fetch(process.env.WEBHOOK_URL, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    jobId: job.id,
                    taskName: job.taskName,
                    priority: job.priority,
                    payload: parsedPayload,
                    completedAt,
                  }),
                }).catch((err) =>
                  console.error("Webhook failed:", err)
                );
              }
            }
          );
        }, 3000);
      }
    );
  });
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  runJob,
};
