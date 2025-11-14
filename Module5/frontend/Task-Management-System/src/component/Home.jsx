import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import "../css/HomePage.css"; // use same CSS file for global design

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <Container className="text-center text-white py-2">
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col lg={8}>
            <div className="glass-effect p-5 rounded-4 shadow-lg">
              <h1 className="display-5 fw-bold mb-4 animate-fade">
                Welcome to <span className="gradient-text">TaskBuddy</span>
              </h1>
              <p className="lead mb-4">
                Simplify your workflow, organize your day, and track your progress effortlessly.
                <br />
                Whether you’re a student, professional, or team, TaskBuddy helps you stay focused and
                achieve more — smartly.
              </p>

              <div className="d-flex justify-content-center gap-3 mt-4">
                <Button
                  variant="success"
                  className="rounded-pill px-4 py-2"
                  onClick={() => navigate("/tasks")}
                >
                  View Tasks
                </Button>
                <Button
                  variant="outline-light"
                  className="rounded-pill px-4 py-2"
                  onClick={() => navigate("/create-account")}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HomePage;
