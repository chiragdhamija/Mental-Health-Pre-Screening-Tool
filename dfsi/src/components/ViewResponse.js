import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import ProfileSection from "./ProfileSection";
import InteractionSummary from "./InteractionSummary";
import PerformanceCard from "./PerformanceCard";
import "./ViewResponse.css";
import Navbar from "./Navbar";

const ViewResponse = () => {
  const { resp_id } = useParams();
  const location = useLocation();
  const [childData, setChildData] = useState(location.state?.candidate || null);
  const [summary, setSummary] = useState(null);

  // Function to fetch child details
  // const get_child_data_from_id = async (childId) => {
  //   const response = await fetch(`http://127.0.0.1:5000/get_child_data_from_id?child_id=${encodeURIComponent(childId)}`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  //   const data = await response.json();
  //   return data;
  // };

  // Function to fetch diagnosis details
  // const get_diagnosis = async (childId) => {
  //   const response = await fetch(`http://127.0.0.1:5000/get_diagnosis_for_child?child_id=${encodeURIComponent(childId)}`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  //   const data = await response.json();
  //   console.log("Diagnosis data:", data);
  //   return data;
  // };

  // Function to fetch diagnosis summary
  const get_diagnosis_summary = async (diagnosis, age) => {
    console.log("DEBUG: Fetching diagnosis summary for:", diagnosis);

    const response = await fetch(
      `http://127.0.0.1:5000/summary_from_diagnosis?diagnosis=${encodeURIComponent(diagnosis)}&child_age=3`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    return { summary: data, age: age };
  };

  // Fetch additional details for the child
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (!childData) {
          console.error("Initial child data not provided.");
          return;
        }

        // Fetch diagnosis summary
        const diagnosisSummary = await get_diagnosis_summary(childData.diagnosis, childData.age);

        // DEBUG
        console.log("Diagnosis summary:", diagnosisSummary);

        // Update state with fetched details
        setSummary(diagnosisSummary.summary);
      } catch (err) {
        console.error("Error fetching details:", err.message);
      }
    };

    fetchDetails();
  }, [childData]);

  return (
    <div className="view-response">
      <Navbar />
      <div className="content">
        <div className="left-section">
          {childData ? (
            <>
              <ProfileSection childData={childData} />
              <InteractionSummary summary={summary?.summary.replace("(Child’s name)", childData.name)} />
            </>
          ) : (
            <div>No child data available.</div>
          )}
        </div>
        <div className="right-section">
          {childData && <PerformanceCard childData={childData} />}
        </div>
      </div>
    </div>
  );
};

export default ViewResponse;