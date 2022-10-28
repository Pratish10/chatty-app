import React from "react";
import { Button, Col, Row } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const Home = () => {
  return (
    <Row className="home">
      <Col
        md={6}
        className="d-flex flex-direction-column align-items-center justify-content-center"
      >
        <div>
          <h1>Simple and Reliable Messaging</h1>
          <p>Chatty App let's you connect with the world</p>
          <LinkContainer to="/chats">
            <Button>Get Started</Button>
          </LinkContainer>
        </div>
      </Col>
      <Col md={6} className="home_hero"></Col>
    </Row>
  );
};

export default Home;
