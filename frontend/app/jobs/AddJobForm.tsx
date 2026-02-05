"use client";
import { useState } from "react";

interface AddJobFormProps {
  onJobAdded: () => void;
}

export default function AddJobForm({ onJobAdded }: AddJobFormProps) {
  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState("Low");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskName) return;

    try {
      const res = await fetch("http://localhost:5000/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskName, priority }),
      });

      if (res.ok) {
        setTaskName("");
        setPriority("Low");
        onJobAdded(); // refresh the jobs list
      } else {
        console.error("Failed to add job");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 space-y-2">
      <input
        type="text"
        placeholder="Task Name"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="border p-2 rounded w-full"
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Add Job
      </button>
    </form>
  );
}