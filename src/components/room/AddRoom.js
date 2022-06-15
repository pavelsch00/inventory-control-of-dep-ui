import React, { useState, useRef } from "react";
import RoomDataService from "../../services/dataService/api-room-service";
import { useNavigate } from 'react-router-dom';

import Input from "react-validation/build/input";
import Form from "react-validation/build/form";
import CheckButton from "react-validation/build/button";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        Поле обязательно для заполнения!
      </div>
    );
  }
};

const AddRoom = () => {
  let navigate = useNavigate();
      
  const form = useRef();
  const checkBtn = useRef();

  const initialRoomState = {
    id: null,
    name: "",
    number: ""
  };
  const [Room, setRoom] = useState(initialRoomState);
  const [message, setMessage] = useState("");
  const handleInputChange = event => {
    const { name, value } = event.target;
    setRoom({ ...Room, [name]: value });
  };
  const saveRoom = () => {
    form.current.validateAll();
    if (checkBtn.current.context._errors.length === 0) {
    setMessage("Пожалуйста подождите");
    var data = {
      name: Room.name,
      number: Room.number
    };
    RoomDataService.create(data)
      .then(response => {
        setMessage("Создание прошло успешно");
      })
      .catch(e => {
        console.log(e);
      });
    }
  };
  const goBack = () => {
    navigate("/room");
  };
  return (
    <div className="submit-form">
      <h4>Аудитория</h4>
      <div>
      <Form ref={form}>
        <div className="form-group">
          <label htmlFor="name">Название</label>
          <Input
            type="text"
            className="form-control"
            id="name"
            required
            value={Room.name}
            onChange={handleInputChange}
            name="name"
            validations={[required]}
          />
        </div>
        <div className="form-group">
          <label htmlFor="number">Номер</label>
          <Input
            type="text"
            className="form-control"
            id="number"
            required
            value={Room.number}
            onChange={handleInputChange}
            name="number"
            validations={[required]}
          />
        </div>
        <CheckButton style={{ display: "none" }} ref={checkBtn} />
        </Form>
        <button className="m-3 btn btn-outline-secondary" onClick={goBack}>
          Назад
        </button>
        <button onClick={saveRoom} className="m-3 btn btn-outline-secondary">
          Добавить
        </button>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default AddRoom;