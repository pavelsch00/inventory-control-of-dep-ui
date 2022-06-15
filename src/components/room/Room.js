import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import RoomDataService from "../../services/dataService/api-room-service";

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

const Room = props => {
  const { id }= useParams();
  let navigate = useNavigate();
        
  const form = useRef();
  const checkBtn = useRef();

  const initialRoomState = {
    id: id,
    name: "",
    number: ""
  };
  const [currentRoom, setCurrentRoom] = useState(initialRoomState);
  const [message, setMessage] = useState("");
  const getRoom = id => {
    RoomDataService.get(id)
      .then(response => {
        setCurrentRoom(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };
  useEffect(() => {
    if (id)
      getRoom(id);
  }, [id]);
  const handleInputChange = event => {
    const { name, value } = event.target;
    setCurrentRoom({ ...currentRoom, [name]: value });
  };
  const updateRoom = () => {
    form.current.validateAll();
    if (checkBtn.current.context._errors.length === 0) {
    setMessage("Пожалуйста подождите");
    RoomDataService.update(currentRoom.id, currentRoom)
      .then(response => {
        setMessage("Обновление прошло успешно");
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
    <div>
      {currentRoom ? (
        <div className="edit-form">
          <h4>Аудитория</h4>
          <Form ref={form}>
            <div className="form-group">
              <label htmlFor="name">Название</label>
              <Input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={currentRoom.name}
                onChange={handleInputChange}
                validations={[required]}
              />
            </div>
            <div className="form-group">
              <label htmlFor="number">Номер</label>
              <Input
                type="text"
                className="form-control"
                id="number"
                name="number"
                value={currentRoom.number}
                onChange={handleInputChange}
                validations={[required]}
              />
            </div>
            <CheckButton style={{ display: "none" }} ref={checkBtn} />
          </Form>
          <button className="m-3 btn btn-outline-secondary" onClick={goBack}>
            Назад
          </button>
          <button
            type="submit"
            className="m-3 btn btn-outline-secondary"
            onClick={updateRoom}
          >
            Обновить
          </button>
          <p>{message}</p>
        </div>
      ) : (
        <div>
          <br />
          <p>Выберите аудитория...</p>
        </div>
      )}
    </div>
  );
};
export default Room;