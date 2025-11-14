import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { registerApi } from "../service/AuthApiService";
import { useNavigate } from "react-router-dom";
import "../css/style.css"; // Make sure the styles below are in this file

const CreateAccount = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  function handleRegistrationForm(event) {
    event.preventDefault();

    if (validateForm()) {
      const register = { username, email, password };

      registerApi(register)
        .then((response) => {
          console.log(response.data);
          navigate("/login");
        })
        .catch((error) => console.error(error));
    }
  }

  function validateForm() {
    let valid = true;
    const errorsCopy = { ...errors };

    if (!username.trim()) {
      errorsCopy.username = "Username required";
      valid = false;
    } else errorsCopy.username = "";

    if (!email.trim()) {
      errorsCopy.email = "Email required";
      valid = false;
    } else if (!isValidEmail(email)) {
      errorsCopy.email = "Invalid email address";
      valid = false;
    } else errorsCopy.email = "";

    if (!password.trim()) {
      errorsCopy.password = "Password required";
      valid = false;
    } else if (!isValidPassword(password)) {
      errorsCopy.password = "Password must be at least 6 characters long";
      valid = false;
    } else errorsCopy.password = "";

    setErrors(errorsCopy);
    return valid;
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isValidPassword(password) {
    return password.length >= 6;
  }

  return (
    <div className="signup-page">
      <Container>
        <Row className="align-items-center justify-content-center min-vh-90">
          <Col lg={5} md={7}>
            <div className="glass-effect p-5 rounded-4 shadow-lg animate-fade">
              <h2 className="text-center mb-4 fw-bold gradient-text">
                Create Your Account
              </h2>
              <p className="text-center text-white-50 mb-4">
                Join <span className="fw-semibold text-warning">TaskBuddy</span> and start managing your tasks effortlessly.
              </p>

              <form onSubmit={handleRegistrationForm}>
                <div className="mb-3">
                  <input
                    type="text"
                    name="username"
                    className={`form-control glass-input rounded-pill ${
                      errors.username ? "is-invalid" : ""
                    }`}
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  {errors.username && (
                    <div className="invalid-feedback">{errors.username}</div>
                  )}
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    name="email"
                    className={`form-control glass-input rounded-pill ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>

                <div className="mb-4">
                  <input
                    type="password"
                    name="password"
                    className={`form-control glass-input rounded-pill ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-primary w-100 rounded-pill py-2 fw-semibold"
                  >
                    Sign Up
                  </button>
                </div>
              </form>

              <p className="text-center mt-4 mb-0 text-light">
                Already have an account?{" "}
                <span
                  className="text-warning fw-semibold"
                  onClick={() => navigate("/login")}
                  style={{ cursor: "pointer" }}
                >
                  Login
                </span>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CreateAccount;
