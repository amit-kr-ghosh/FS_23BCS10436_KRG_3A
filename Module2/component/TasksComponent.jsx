import React, { useEffect, useState } from "react";
import {
  deleteTask,
  markDone,
  markPending,
  retrieveAllTasks,
} from "../service/TaskApiService";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaTrash, FaPen, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import "../css/style.css";

const TasksComponent = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  // ✅ Always get current user from localStorage
  const userId = localStorage.getItem("USER_ID");


  useEffect(() => {
    fetchTasks();
  }, [userId]);

  const fetchTasks = () => {
    retrieveAllTasks(userId)
      .then((response) => setTasks(response.data))
      .catch((error) => console.log(error));
  };

  const updateTask = (id) => navigate(`/update-task/${id}`);
  const viewTaskDetails = (task) =>
    navigate(`/task-details/${task.id}`, { state: task });

  const deleteTaskFun = (id) => {
    deleteTask(id)
      .then(() => {
        fetchTasks();
        toast.success("Task deleted successfully");
      })
      .catch(() => toast.error("Failed to delete task"));
  };

  const markTask = (id, isChecked) => {
    const action = isChecked ? markDone : markPending;
    const successMsg = isChecked
      ? "Task marked as completed"
      : "Task marked as pending";
    const errorMsg = isChecked
      ? "Failed to mark as completed"
      : "Failed to mark as pending";

    action(id)
      .then(() => {
        fetchTasks();
        toast.success(successMsg);
      })
      .catch(() => toast.error(errorMsg));
  };

  return (
    <div className="task-container">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="task-card-main glass-effect"
      >
        <div className="header">
          <h2>Pending Tasks</h2>
          <Link to="/add-task" className="btn-add">
            <FaPlus /> Add Task
          </Link>
        </div>

        {tasks.filter((task) => !task.completed).length === 0 && (
          <p className="no-task">No pending tasks 🎉</p>
        )}

        {tasks.map(
          (task) =>
            !task.completed && (
              <motion.div
                key={task.id}
                className="task-item glass-effect"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <div className="task-actions">
                  <button
                    className="btn-icon"
                    onClick={() => viewTaskDetails(task)}
                  >
                    <FaEye />
                  </button>
                  <button
                    className="btn-icon"
                    onClick={() => updateTask(task.id)}
                  >
                    <FaPen />
                  </button>
                  <button
                    className="btn-icon delete"
                    onClick={() => deleteTaskFun(task.id)}
                  >
                    <FaTrash />
                  </button>
                </div>

                <div className="task-content">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    className="task-checkbox"
                    onChange={(e) => markTask(task.id, e.target.checked)}
                  />
                  <span className="task-text">{task.task}</span>
                </div>
                <small className="task-time">
                  {task.updatedAt
                    ? `Updated: ${new Date(task.updatedAt).toLocaleString()}`
                    : `Created: ${new Date(
                        task.taskCreatedAt
                      ).toLocaleString()}`}
                </small>
              </motion.div>
            )
        )}
      </motion.div>
    </div>
  );
};

export default TasksComponent;
