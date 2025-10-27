import React, { useEffect, useState } from "react";
import { CiCalendar } from "react-icons/ci";
import WaveProgressChart from "../../Charts/WaveProgressChart";
import API from "../../../api"; 

const Analytics = ({ project }) => {
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    if (!project?.project_id) return;

    const fetchMonthlyData = async () => {
      try {
        const res = await API.post(`/taskmonthlystatusByProjectId/${project.project_id}`, {});
        setMonthlyData(res.data || []);
      } catch (error) {
        console.error("Error fetching monthly task analytics:", error);
      }
    };

    fetchMonthlyData();
  }, [project?.project_id]);

  return (
    <div>
      <div className="border border-gray-200 rounded-md p-5 bg-white">
        {/* Header */}
        <div className="mb-5">
          <div className="text-2xl font-bold">Project Analytics</div>
          <div className="text-sm text-gray-400">
            Performance metrics and insights
          </div>
        </div>

        {/* Overview Grid */}
        <div className="grid grid-cols-12 mt-4 gap-2">
          {/* Tasks Completed */}
          <div className="col-span-4 bg-slate-50 rounded-md p-4">
            <div className="text-gray-600">Tasks Completed</div>
            <div className="text-2xl font-bold">
              {project.task_completed}/{project.total_tasks}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className="bg-black h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${project.project_progress || 0}%` }}
              ></div>
            </div>
          </div>

          {/* Dates */}
          <div className="col-span-4 bg-slate-50 rounded-md p-4">
            <span className="text-gray-600 mb-2 block">Dates</span>
            <div className="space-y-1 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <CiCalendar className="text-gray-500" />
                <p>
                  <strong>Start:</strong>{" "}
                  {project.project_start_date
                    ? new Date(project.project_start_date).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "2-digit", year: "numeric" }
                      )
                    : "N/A"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <CiCalendar className="text-gray-500" />
                <p>
                  <strong>Deadline:</strong>{" "}
                  {project.project_due_date
                    ? new Date(project.project_due_date).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "2-digit", year: "numeric" }
                      )
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Budget */}
          <div className="col-span-4 bg-slate-50 rounded-md p-4">
            <div className="text-gray-600">Budget</div>
            <div className="text-2xl font-bold">${project.project_budget}</div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="mt-6">
          <WaveProgressChart monthlyData={monthlyData} />
        </div>

        {/* Fallback Section */}
        {monthlyData.length === 0 && (
          <div className="bg-gray-200 rounded-md w-full flex justify-center mt-8 py-10">
            <div className="text-gray-500">
              Project analytics charts will be displayed here
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
