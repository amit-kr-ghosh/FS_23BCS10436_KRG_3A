import { useEffect, useState } from "react";
import {
  createTask,
  retrieveTaskById,
  updateTask,
} from "../service/TaskApiService";
import { useNavigate, useParams } from "react-router-dom";
import { FaTasks } from "react-icons/fa";
import "../css/style.css"; // ✅ Global styles

const AddTaskComponent = () => {
  const [task, setTask] = useState("");
  const [errors, setErrors] = useState({ task: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ Get current logged-in user ID from localStorage
  const userId = localStorage.getItem("USER_ID");

  // ✅ Fetch existing task if editing
  useEffect(() => {
    if (id) {
      retrieveTaskById(id)
        .then((response) => setTask(response.data.object.task))
        .catch((error) => console.error("Error retrieving task:", error));
    }
  }, [id]);

  // ✅ Validate form input
  function validateForm() {
    const errorsCopy = { ...errors };
    let valid = true;

    if (!task.trim()) {
      errorsCopy.task = "Task description is required";
      valid = false;
    } else {
      errorsCopy.task = "";
    }

    setErrors(errorsCopy);
    return valid;
  }

  // ✅ Save or Update Task
  function saveTask(event) {
    event.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const now = new Date().toISOString();
    const taskObj = {
      task,
      completed: false,
      taskCreatedAt: id ? undefined : now, // only set for new task
      updatedAt: now,
    };

    // ✅ Use correct user ID
    const action = id
      ? updateTask(taskObj, id)
      : createTask(taskObj, userId);

    action
      .then(() => {
        setSuccess(true);
        // ✅ Redirect and refresh tasks list
        setTimeout(() => {
          navigate("/tasks", { replace: true });
          window.location.reload(); // Ensures tasks refresh for new user
        }, 700);
      })
      .catch((error) => console.error("Error saving task:", error))
      .finally(() => setIsSubmitting(false));
  }

  const AddUpdateText = () => (id ? "Update" : "Add");

  return (
    <div className="task-container d-flex justify-content-center align-items-center">
      <div
        className="task-card-main glass-effect p-4 animate-fade"
        style={{
          maxWidth: "500px",
          padding: "30px 25px",
          borderRadius: "20px",
        }}
      >
        <div className="text-center mb-3">
          <FaTasks size={38} className="text-white mb-2" />
          <h3 className="text-white fw-bold m-0">
            {AddUpdateText()} Task
          </h3>
          <p className="text-white-50 small mt-1">
            {id ? "Edit your existing task" : "Add a new one to your list"}
          </p>
        </div>

        <form onSubmit={saveTask}>
          <div className="form-group mb-3">
            <label className="text-white-50 small mb-1">Task Description</label>
            <textarea
              className={`form-control glass-input rounded-3 ${
                errors.task ? "is-invalid" : ""
              }`}
              rows={2}
              placeholder="Enter task description"
              value={task}
              onChange={(event) => setTask(event.target.value)}
              style={{ resize: "none" }}
            />
            {errors.task && (
              <small className="text-warning mt-1 d-block">{errors.task}</small>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 rounded-pill fw-semibold"
            style={{ padding: "10px 0" }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : `${AddUpdateText()} Task`}
          </button>

          {success && (
            <p className="text-success text-center mt-3 animate-fade">
              ✅ Task {id ? "updated" : "added"} successfully!
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddTaskComponent;
