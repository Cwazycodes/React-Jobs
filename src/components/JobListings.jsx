import React, { useEffect, useState } from "react";
import JobListing from "./JobListing";
import Spinner from "./Spinner";

const JobListings = ({ isHome = false }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const apiUrl = isHome
        ? `${import.meta.env.VITE_API_BASE_URL}/jobs?_limit=3`
        : `${import.meta.env.VITE_API_BASE_URL}/jobs`;

      try {
        const res = await fetch(apiUrl);
        if (!res.ok) {
          throw new Error(`Failed to fetch jobs: ${res.statusText}`);
        }
        const data = await res.json();
        setJobs(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [isHome]);

  return (
    <section className="bg-blue-50 px-4 py-10">
      <div className="container-xl lg:container m-auto">
        <h2 className="text-3xl font-bold text-indigo-500 mb-6 text-center">
          {isHome ? "Recent Jobs" : "Browse Jobs"}
        </h2>

        {loading ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <JobListing key={job._id} job={job} />
              ))
            ) : (
              <p>No jobs found.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default JobListings;
