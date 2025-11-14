import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  loginApi,
  saveLoggedUser,
  storeBasicAuth,
} from "../service/AuthApiService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/style.css";

const LoginComponent = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  async function handleLoginForm(event) {
    event.preventDefault();

    if (validateForm()) {
      await loginApi(username, password)
        .then((response) => {
          const basicAuth = "Basic " + btoa(username + ":" + password);
          const role = response.data.role;

          // ✅ Store auth + user info in localStorage
          storeBasicAuth(basicAuth);
          saveLoggedUser(response.data.id, username, role);

          // ✅ Navigate and auto reload to refresh all task pages
          toast.success("Welcome back! Loading your tasks...");
          navigate("/tasks", { replace: true });

        })
        .catch(() => {
          setErrors({
            ...errors,
            password: "Invalid username or password",
          });
        });
    }
  }

  function validateForm() {
    let valid = true;
    const errorsCopy = { ...errors };

    if (!username.trim()) {
      errorsCopy.username = "Username required";
      valid = false;
    } else {
      errorsCopy.username = "";
    }

    if (!password.trim()) {
      errorsCopy.password = "Password required";
      valid = false;
    } else {
      errorsCopy.password = "";
    }

    setErrors(errorsCopy);
    return valid;
  }

  return (
    <div className="login-page">
      <Container>
        <Row className="justify-content-center align-items-center min-vh-90">
          <Col md={6} lg={5}>
            <div className="glass-effect p-5 rounded-4 shadow-lg animate-fade">
              <h2 className="text-center mb-4 text-white fw-bold">
                Welcome Back
              </h2>
              <p className="text-center text-light mb-4">
                Log in to your <strong>TaskBuddy</strong> account to manage your
                tasks efficiently.
              </p>

              <form onSubmit={handleLoginForm}>
                <div className="mb-3">
                  <input
                    type="text"
                    name="username"
                    className={`form-control glass-input ${
                      errors.username ? "is-invalid" : ""
                    }`}
                    placeholder="Enter your username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                  />
                  {errors.username && (
                    <div className="invalid-feedback">{errors.username}</div>
                  )}
                </div>

                <div className="mb-4">
                  <input
                    type="password"
                    name="password"
                    className={`form-control glass-input ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-primary w-100 rounded-pill fw-bold"
                  >
                    Login
                  </button>
                </div>
              </form>

              <p className="text-center text-light mt-4 mb-0">
                Don’t have an account?{" "}
                <span
                  className="text-warning fw-bold cursor-pointer"
                  onClick={() => navigate("/create-account")}
                >
                  Create one
                </span>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginComponent;
