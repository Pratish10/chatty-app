import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import styled from "styled-components";
import Alert from "react-bootstrap/Alert";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppContext } from "../Context/appContext";

const Messages = () => {
  const [message, setMessage] = useState("");
  const messageEndRef = useRef(null);
  const user = useSelector((state) => state.user);
  const { socket, currentRoom, setMessages, messages, privateMemberMsg } =
    useContext(AppContext);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function getFormattedDate() {
    const date = new Date();
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();

    month = month.length > 1 ? month : "0" + month;
    let day = date.getDate().toString();

    day = day.length > 1 ? day : "0" + day;

    return month + "/" + day + "/" + year;
  }

  function scrollToBottom() {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const todaysDate = getFormattedDate();
  socket.off("room-messages").on("room-messages", (roomMessages) => {
    console.log("room messages", roomMessages);
    setMessages(roomMessages);
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!message) return;
    const today = new Date();
    const minutes =
      today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
    const time = today.getHours() + ":" + minutes;
    const roomId = currentRoom;
    socket.emit("message-room", roomId, message, user, time, todaysDate);
  }

  return (
    <MessagesContainer>
      <br />
      <div className="msg-opt">
        {user && !privateMemberMsg?._id && (
          <div className="alert alert-info msg-header">{currentRoom} room</div>
        )}
        {user && privateMemberMsg?._id && (
          <>
            <div className="alet alert-info conversation-info">
              <span>
                Conversation with {privateMemberMsg.name}
                <img
                  src={privateMemberMsg.image}
                  alt={privateMemberMsg.name}
                  className="conversation-pfp"
                />
              </span>
            </div>
          </>
        )}
        {!user && (
          <Alert variant="danger">
            You need to <Link to="/register">register</Link> then you will be
            able to chat with someone. If you are already registered. Click here
            to <Link to="/login">login</Link>.
          </Alert>
        )}
        {user &&
          messages.map(({ _id: date, messagesByDate }, idx) => (
            <div key={idx}>
              <p className="alert alert-info text-center message-date-indicator">
                {date}
              </p>
              {messagesByDate?.map(
                ({ content, time, from: sender }, msgIdx) => (
                  <div
                    className={
                      sender?.email === user?.email
                        ? "message"
                        : "incoming-message"
                    }
                    key={msgIdx}
                  >
                    <div className="message-inner">
                      <div className="d-flex align-items-center mb-3">
                        <img
                          src={sender.image}
                          alt={sender.name}
                          style={{
                            width: 35,
                            height: 35,
                            objectFit: "cover",
                            borderRadius: "50%",
                            marginRight: 10,
                          }}
                        />
                        <p className="message-sender">
                          {sender._id === user?._id ? "You" : sender.name}
                        </p>
                      </div>
                      <p className="message-content">{content}</p>
                      <p className="message-timestamp-left">{time}</p>
                    </div>
                  </div>
                )
              )}
            </div>
          ))}
        <div ref={messageEndRef} />
      </div>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={11}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Type your message here..."
                disabled={!user}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col md={1}>
            <Button type="submit" style={{ width: "100%" }} disabled={!user}>
              <i className="fa-solid fa-paper-plane"></i>
            </Button>
          </Col>
        </Row>
      </Form>
    </MessagesContainer>
  );
};

export default Messages;

const MessagesContainer = styled.div`
  .msg-opt {
    border-radius: 5px;
    height: 75vh;
    border: 1px solid lightgray;
    overflow-y: scroll;
    margin-bottom: 20px;
  }

  .message-inner {
    margin-left: 20px;
    margin-bottom: 10px;
    padding: 10px;
    min-width: 200px;
    max-width: 90%;
    text-align: left;
    min-height: 80px;
    display: inline-block;
    border-radius: 10px;
    background-color: #6dd5ed;
  }
  .incoming-message .message-inner {
    background-color: #00b09b;
  }

  .incoming-message {
    display: flex;
    justify-content: flex-end;
    margin-right: 20px;
  }
  .message-timestamp-left {
    font-size: 0.85em;
    font-weight: 300;
    margin-top: 10px;
  }

  .message-sender {
    margin-bottom: 5px;
    font-weight: bold;
  }

  .message-date-indicator {
    width: 150px;
    margin: 0 auto;
  }
  .msg-header {
    font-weight: bold !important;
  }

  .conversation-info {
    padding: 0;
    margin: 0 auto;
    text-align: center;
    height: 100px;
  }

  .conversation-pfp {
    width: 40px;
    height: 40px;
    object-fit: cover;
    margin: 10px auto;
    margin-bottom: 15px;
    border-radius: 50%;
    margin-left: 10px;
  }
`;
