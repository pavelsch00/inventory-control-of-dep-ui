import React, { useState, useEffect } from "react";
import UserService from "../../services/authService/user.service";

const BoardModerator = () => {
  const [content, setContent] = useState("");
  useEffect(() => {
    UserService.getPublicContent().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        const _content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();
        setContent(_content);
      }
    );
  }, []);
  return (
    <div className="container">
      <header className="jumbotron">
        <h3>Домашняя страница МОЛ</h3>
      </header>
    </div>
  );
};

export default BoardModerator;