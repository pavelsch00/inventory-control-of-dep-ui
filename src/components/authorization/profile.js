import React from "react";
import AuthService from "../../services/authService/auth.service";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const Profile = () => {
  const currentUser = AuthService.getCurrentUser();
  const userInfo = currentUser.Surname + " " + currentUser.Name + " " + currentUser.LastName;
  return userInfo && (
    <div className="edit-form">
    <Card  className="profile">
      <CardMedia
        component="img"
        alt="green iguana"
        image="https://www.kindpng.com/picc/m/78-785827_user-profile-avatar-login-account-male-user-icon.png"
      />
      <CardContent className="profile">
        <Typography gutterBottom variant="h5" component="div">
        {userInfo}
        </Typography>
        <Typography variant="body" color="text.secondary">
          Роль: {currentUser.roles}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Электронная почта: {currentUser.UserName}
        </Typography>
      </CardContent>
      <CardActions>
      <button
            type="submit"
            className="m-3 btn btn-outline-secondary"
          >
            Изменить пароль
          </button>
          <button
            type="submit"
            className="m-3 btn btn-outline-secondary"
          >
            Редактировать данные
          </button>
      </CardActions>
    </Card>

    </div>
  );
};
export default Profile;