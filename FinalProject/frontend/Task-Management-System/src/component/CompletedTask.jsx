import { useEffect, useState } from "react";
import {
  deleteTask,
  markDone,
  markPending,
  retrieveAllTasks,
} from "../service/TaskApiService";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaTrash, FaPen, FaEye, FaCheckCircle } from "react-icons/fa";
import "../css/style.css";

const CompletedTask = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Get current logged-in user ID directly from localStorage
  const userId = localStorage.getItem("USER_ID");

  // ✅ Fetch tasks when user or route changes
  useEffect(() => {
    if (userId) fetchTasks();
  }, [userId, location]);

  const fetchTasks = () => {
    retrieveAllTasks(userId)
      .then((response) => setTasks(response.data))
      .catch((error) => console.error("Error fetching tasks:", error));
  };

  const viewTaskDetails = (task) =>
    navigate(`/task-details/${task.id}`, { state: task });

  const updateTask = (id) => navigate(`/update-task/${id}`);

  const deleteTaskFun = (id) => {
    deleteTask(id)
      .then(() => fetchTasks())
      .catch((error) => console.error("Error deleting task:", error));
  };

  const markTask = (id, isChecked) => {
    const action = isChecked ? markDone : markPending;
    action(id)
      .then(() => fetchTasks())
      .catch((error) => console.error("Error updating task:", error));
  };

  return (
    <div className="task-container">
      <div className="task-card-main glass-effect">
        <div className="header">
          <h2>✅ Completed Tasks</h2>
          <Link to="/tasks" className="btn-add">
            Back to Tasks
          </Link>
        </div>

        {tasks.filter((task) => task.completed).length === 0 && (
          <p className="no-task">No completed tasks yet</p>
        )}

        {tasks
          .filter((task) => task.completed)
          .map((task) => (
            <div key={task.id} className="task-item glass-effect">
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
                <span className="task-text task-completed">{task.task}</span>
              </div>

              <small className="task-time">
                Completed:{" "}
                {task.updatedAt
                  ? new Date(task.updatedAt).toLocaleString()
                  : "Unknown time"}
              </small>

              <div>
                <FaCheckCircle className="text-success" />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CompletedTask;
