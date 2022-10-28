import React, { useContext, useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useLoginUserMutation } from "../services/appApi";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/appContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginUser, { isLoading, error }] = useLoginUserMutation();
  const navigate = useNavigate();
  const { socket } = useContext(AppContext);

  function handleLogin(e) {
    e.preventDefault();
    loginUser({ email, password }).then(({ data }) => {
      if (data) {
        socket.emit("new-user");
        navigate("/chats");
      }
    });
  }

  return (
    <FormContainer>
      <Form style={{ width: "80%", maxWidth: 500 }} onSubmit={handleLogin}>
        <div className="brand">
          <h2>login</h2>
        </div>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          {error && <p className="alert alert-danger">{error.data}</p>}
          <Form.Control
            className="input"
            type="email"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Control
            className="input"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </Form.Group>
        <Button className="btn" type="submit">
          {isLoading ? <Spinner animation="border" /> : "Login"}
        </Button>
        <span>
          Don't have an account ? <Link to="/register">Create One</Link>
        </span>
      </Form>
    </FormContainer>
  );
};

export default Login;

const FormContainer = styled.div`
  height: 89vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #ff00cc;
  background: -webkit-linear-gradient(to right, #333399, #ff00cc);
  background: linear-gradient(to right, #333399, #ff00cc);

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    h2 {
      color: white;
      text-transform: uppercase;
    }
  }

  .register-pfp-container {
    width: 100px;
    height: 100px;
    margin: 0 auto;
    position: relative;
    margin-bottom: 20px;
  }

  .register-pfp {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 2px solid gray;
    object-fit: cover;
  }

  .add-pic-icon {
    position: absolute;
    bottom: 0;
    right: 10px;
    color: gray;
    cursor: pointer;
    z-index: 99;
  }

  .ip-upload {
    color: white;
    margin-top: 10px;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    padding: 3rem 5rem;
  }
  .input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    color: white;
    border-radius: 0px;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  .btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    border-radius: 0px;
    font-weight: bold;
    cursor: pointer;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #f902cb;
      transition: 0.3s;
    }
  }
  span {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;
