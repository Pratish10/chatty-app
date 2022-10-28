import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import Messages from "../components/Messages";
import Sidebar from "../components/Sidebar";

const Chat = () => {
  return (
    <>
      <Container className="chat">
        <Row>
          <Col md={4}>
            <Sidebar />
          </Col>
          <Col md={8}>
            <Messages />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Chat;
