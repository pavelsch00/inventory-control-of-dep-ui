import React from "react";
import AuthService from "../../services/authService/auth.service";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Link } from "react-router-dom";
import Typography from '@mui/material/Typography';

const Profile = () => {
  const currentUser = AuthService.getCurrentUser();
  const userInfo = currentUser.Surname + " " + currentUser.Name + " " + currentUser.LastName;
  var role = "currentUser.roles";

  if(currentUser.roles === "Admin"){
    role = "Администратор";
  }

  if(currentUser.roles === "MaterialPerson"){
    role = "Материально ответственное лицо";
  }

  if(currentUser.roles === "DepHead"){
    role = "Заведующий кафедрой";
  }

  if(currentUser.roles === "PurchaseDepartment"){
    role = "Сотрудник отдела снабжения";
  }

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
          Роль: {role}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Электронная почта: {currentUser.UserName}
        </Typography>
      </CardContent>
      <CardActions>
      <Link
              to={"/change-password/" + currentUser.UserName}
              className="btn btn-outline-secondary password"
            >
              Изменить пароль
      </Link>
      </CardActions>
    </Card>

    </div>
  );
};
export default Profile;