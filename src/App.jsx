import React, { useState, useEffect } from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import JobsPage from "./pages/JobsPage";
import NotFoundPage from "./pages/NotFoundPage";
import JobPage, { jobLoader } from "./pages/JobPage";
import AddJobPage from "./pages/AddJobPage";
import EditJobPage from "./pages/EditJobPage";

console.log("App component loaded");
const App = () => {
  const [jobs, setJobs] = useState([]);

  console.log("Inside App component");


  const fetchJobs = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/jobs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data = await res.json();
      setJobs(data); 
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };


  useEffect(() => {
    fetchJobs();
  }, []);


  const addJob = async (newJob) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newJob),
      });

      if (!res.ok) {
        throw new Error("Failed to add job");
      }

      const data = await res.json();

      setJobs((prevJobs) => [...prevJobs, data]);

      return data;
    } catch (error) {
      console.error("Error adding job:", error);
    }
  };

  // Delete a job
  const deleteJob = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/jobs/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete job");
      }

      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== id));

      return res.ok;
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  // Update an existing job
  const updateJob = async (updatedJob) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/jobs/${updatedJob._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedJob),
      });

      if (!res.ok) {
        throw new Error("Failed to update job");
      }

      const data = await res.json();

      setJobs((prevJobs) =>
        prevJobs.map((job) => (job._id === data._id ? data : job))
      );

      return data;
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/jobs" element={<JobsPage jobs={jobs} getJobs={fetchJobs} />} />
        <Route path="/add-job" element={<AddJobPage addJobSubmit={addJob} />} />
        <Route
          path="/edit-job/:id"
          element={<EditJobPage updateJobSubmit={updateJob} />}
          loader={jobLoader}
        />
        <Route
          path="/jobs/:id"
          element={<JobPage deleteJob={deleteJob} />}
          loader={jobLoader}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;