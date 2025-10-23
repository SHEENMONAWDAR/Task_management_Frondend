import React, { useState } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import AddKanbanTaskModal from "./AddKanbanTaskModal";
import KanbanTasksListLayout from "./kanbanTasksListLayout";

const KanbanTasksDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // for reloading tasks

  const handleTaskAdded = () => {
    setShowModal(false);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="flex bg-gray-100 min-h-screen relative">
      {/* Sidebar (desktop) */}
      <div className="hidden md:block fixed h-full w-64 bg-white shadow-md z-30">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      </div>

      {/* Sidebar (mobile) */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-md z-40 transform transition-transform duration-300 md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64 transition-all">
        <Header title="Kanban" setSidebarOpen={setSidebarOpen} />

        <div className="p-8">
          <KanbanTasksListLayout onAddTask={() => setShowModal(true)} refreshKey={refreshKey} />

          {showModal && (
            <AddKanbanTaskModal
              onClose={() => setShowModal(false)}
              onTaskAdded={handleTaskAdded}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default KanbanTasksDashboard;
