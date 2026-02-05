"use client";
import { useEffect, useState } from "react";
import AddJobForm from "./AddJobForm";

interface Job {
  id: number;
  taskName: string;
  status: string;
  priority: string;
  createdAt: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);

  const fetchJobs = () => {
    fetch("http://localhost:5000/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const runJob = (jobId: number) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === jobId ? { ...job, status: "completed" } : job
      )
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Jobs</h1>
      <AddJobForm onJobAdded={fetchJobs} />
      <div className="space-y-2">
        {jobs.map((job) => (
          <div key={job.id} className="border p-4 rounded shadow">
            <p><strong>Task:</strong> {job.taskName}</p>
            <p><strong>Status:</strong> {job.status}</p>
            <p><strong>Priority:</strong> {job.priority}</p>
            <p><strong>Created At:</strong> {new Date(job.createdAt).toLocaleString()}</p>

            {job.status === "pending" && (
              <button
                onClick={() => runJob(job.id)}
                className="px-2 py-1 border rounded mt-2"
              >
                Run Job
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
