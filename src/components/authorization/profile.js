import React from "react";
import AuthService from "../../services/authService/auth.service";
const Profile = () => {
  const currentUser = AuthService.getCurrentUser();
  return (
    <div className="container">
      <header className="jumbotron">
        <h3>
          <strong>{currentUser.username}</strong> Профиль
        </h3>
      </header>
      <p>
        <strong>Токен:</strong> {currentUser.accessToken.substring(0, 20)} ...{" "}
        {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}
      </p>
      <p>
        <strong>Id:</strong> {currentUser.UserId}
        {console.log(currentUser)}
      </p>
      <p>
        <strong>Электронная почта:</strong> {currentUser.UserName}
      </p>
      <strong>Роль:</strong>
      <ul>
        {currentUser.roles}
      </ul>
    </div>
  );
};
export default Profile;