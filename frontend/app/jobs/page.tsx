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

  const fetchJobs = async () => {
    const res = await fetch("http://192.168.1.3:5000/jobs");

    const data = await res.json();
    setJobs(data);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const runJob = async (jobId: number) => {
   await fetch(`http://192.168.1.3:5000/jobs/run-job/${jobId}`, {
      method: "POST",
    });
    fetchJobs();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Jobs</h1>
      <AddJobForm onJobAdded={fetchJobs} />

      <div className="space-y-2">
        {jobs.map((job) => (
          <div key={job.id} className="border p-4 rounded shadow">
            <p><b>Task:</b> {job.taskName}</p>
            <p><b>Status:</b> {job.status}</p>
            <p><b>Priority:</b> {job.priority}</p>
            <p><b>Created:</b> {new Date(job.createdAt).toLocaleString()}</p>

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
