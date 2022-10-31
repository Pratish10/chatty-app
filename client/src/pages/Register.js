import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import dummy_pfp from "../assets/dummy-pfp.webp";
import { Form, Button, Spinner } from "react-bootstrap";
import { useRegisterUserMutation } from "../services/appApi";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [registerUser, { isLoading, error }] = useRegisterUserMutation();
  const [img, setImg] = useState(null);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [imgPreview, setImgPreview] = useState(null);
  const navigate = useNavigate();

  function validateImg(e) {
    const file = e.target.files[0];
    if (file.size >= 1048576) {
      return alert("Please upload image less than 1mb");
    } else {
      setImg(file);
      setImgPreview(URL.createObjectURL(file));
    }
  }

  async function uploadImg() {
    const data = new FormData();
    data.append("file", img);
    data.append("upload_preset", "chatty app");
    try {
      setUploadingImg(true);
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/duasxwism/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const urlData = await res.json();
      setUploadingImg(false);
      return urlData.url;
    } catch (error) {
      setUploadingImg(false);
      console.log(error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!img) return alert("Please upload your profile picture");
    const url = await uploadImg(img);
    console.log(url);

    registerUser({ name, email, password, image: url }).then(({ data }) => {
      if (data) {
        console.log(data);
        navigate("/chats");
      }
    });
  }

  return (
    <FormContainer>
      <Form style={{ width: "80%", maxWidth: 500 }} onSubmit={handleSubmit}>
        <div className="brand">
          <h3>Register</h3>
        </div>
        <div className="register-pfp-container">
          <img
            src={imgPreview || dummy_pfp}
            alt="dummy-pfp"
            className="register-pfp"
          />
          <label htmlFor="image-upload" className="img-upload">
            <i className="fa-solid fa-circle-plus add-pic-icon"></i>
          </label>
          <input
            className="ip-upload"
            type="file"
            id="img-upload"
            accept="image/png, image/jpeg, image/jpg"
            onChange={validateImg}
          />
        </div>
        {error && <p className="alert alert-danger">{error.data}</p>}
        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Control
            className="input"
            type="text"
            placeholder="Enter name"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Control
            className="input"
            type="email"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Control
            className="input"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </Form.Group>
        <Button className="btn" type="submit">
          {uploadingImg || isLoading ? (
            <Spinner animation="border" />
          ) : (
            "Create User"
          )}
        </Button>
        <span>
          Already have an account ? <Link to="/login">Login</Link>
        </span>
      </Form>
    </FormContainer>
  );
};

export default Register;

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
    h3 {
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
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 2px solid gray;
    object-fit: cover;
  }

  .add-pic-icon {
    position: absolute;
    bottom: 20px;
    right: 25px;
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
    gap: 5px;
    background-color: #00000076;
    padding: 2rem 5rem;
  }
  .input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    color: white;
    width: 100%;
    font-size: 1rem;
    border-radius: 0px;
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
    font-weight: bold;
    cursor: pointer;
    font-size: 1rem;
    border-radius: 0px;
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
