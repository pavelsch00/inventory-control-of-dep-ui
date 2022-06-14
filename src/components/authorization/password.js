import React, { useState, useRef } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { useParams, useNavigate } from 'react-router-dom';
import UserService from "../../services/dataService/api-user-service";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        Поле обязательно для запалнения!
      </div>
    );
  }
};

const newPasswordFirstValidator = (newPasswordFirst) => {
  if (newPasswordFirst.length < 4 || newPasswordFirst.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        Пароль должен содержать от 4 до 20 симвалов.
      </div>
    );
  }
};

const newPasswordSecondValidator = (newPasswordSecond) => {
    if (newPasswordSecond.length < 4 || newPasswordSecond.length > 20) {
      return (
        <div className="alert alert-danger" role="alert">
          Пароль должен содержать от 4 до 20 симвалов.
        </div>
      );
    }
  };

const vpassword = (oldPassword) => {
    if (oldPassword.length < 4 || oldPassword.length > 20) {
        return (
          <div className="alert alert-danger" role="alert">
            Пароль должен содержать от 4 до 20 симвалов.
          </div>
        );
      }
};
const Password = props => {
  const { email }= useParams();
  let navigate = useNavigate();
  const form = useRef();
  const checkBtn = useRef();
  const [newPasswordFirst, setnewPasswordFirst] = useState("");
  const [newPasswordSecond, setnewPasswordSecond] = useState("");
  const [password, setPassword] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");

  const onChangeNewPasswordFirst = (e) => {
    const newPasswordFirst = e.target.value;
    setnewPasswordFirst(newPasswordFirst);
  };
  const onChangeNewPasswordSecond = (e) => {
    const newPasswordSecond = e.target.value;
    setnewPasswordSecond(newPasswordSecond);
  };
  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };
  const goBack = () => {
    navigate("/profile");
  };
  const handleRegister = (e) => {
    e.preventDefault();
    setMessage("");
    setSuccessful(false);
    form.current.validateAll();
    if(newPasswordFirst !== newPasswordSecond)
    {
        setMessage("Пароли не совпадают.");
    }
        if (checkBtn.current.context._errors.length === 0 && newPasswordFirst === newPasswordSecond) {
        var data = {
            currentPassword: password,
            newPassword: newPasswordFirst,
        };

        UserService.changepassword(email, data).then(
        (response) => {
          setMessage("Обновление прошло успешно.");
          setSuccessful(true);
        },
        (error) => {
          var resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
            if(error.response.data === "Passwords do not match"){
                resMessage = "Неверный старый пароль!"
            }
          setMessage(resMessage);
          setSuccessful(false);
        }
      );
    }
  };
  return (
    <div className="col-md-12">
      <div className="card card-container">
        <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className="profile-img-card"
        />
        <Form onSubmit={handleRegister} ref={form}>
          {!successful && (
            <div>
              <div className="form-group">
              <label htmlFor="password">Старый пароль</label>
              <Input
                type="password"
                className="form-control"
                name="password"
                value={password}
                onChange={onChangePassword}
                validations={[required, vpassword]}
              />
            </div>
            <div className="form-group">
                <label htmlFor="newPasswordFirst">Новый пароль</label>
                <Input
                  type="password"
                  className="form-control"
                  name="newPasswordFirst"
                  value={newPasswordFirst}
                  onChange={onChangeNewPasswordFirst}
                  validations={[required, newPasswordFirstValidator]}
                />
              </div>
              <div className="form-group">
                <label htmlFor="newPasswordSecond">Повторите пароль</label>
                <Input
                  type="password"
                  className="form-control"
                  name="newPasswordSecond"
                  value={newPasswordSecond}
                  onChange={onChangeNewPasswordSecond}
                  validations={[required, newPasswordSecondValidator]}
                />
              </div>
              <div className="form-group">
                <button className="m-2 btn btn-outline-secondary" onClick={goBack}>
                    Назад
                </button>
                <button className="m-2 btn btn-outline-secondary">Изменить пароль</button>
              </div>
            </div>
          )}
          {message && (
            <div className="form-group">
              <div
                className={ successful ? "alert alert-success" : "alert alert-danger" }
                role="alert"
              >
                {message}
              </div>
              <button className="m-3 btn btn-outline-secondary" onClick={goBack}>
                  Назад
              </button>
            </div>
          )}
          <CheckButton style={{ display: "none" }} ref={checkBtn} />
        </Form>
      </div>
    </div>
  );
};

export default Password;