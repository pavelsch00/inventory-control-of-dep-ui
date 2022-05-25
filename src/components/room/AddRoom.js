import React, { useState } from "react";
import RoomDataService from "../../services/dataService/api-room-service";
import { useNavigate } from 'react-router-dom';

const AddRoom = () => {
  let navigate = useNavigate();
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
    var data = {
      name: Room.name,
      number: Room.number
    };
    RoomDataService.create(data)
      .then(response => {
        setRoom({
          id: response.data.id,
          name: response.data.name,
          number: response.data.number,
        });
        console.log(response.data);
        setMessage("Создание прошло успешно");
      })
      .catch(e => {
        console.log(e);
      });
  };
  const goBack = () => {
    navigate("/room");
  };
  return (
    <div className="submit-form">
      <h4>Аудитория</h4>
      <div>
        <div className="form-group">
          <label htmlFor="name">Название</label>
          <input
            type="text"
            className="form-control"
            id="name"
            required
            value={Room.name}
            onChange={handleInputChange}
            name="name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="number">Номер</label>
          <input
            type="text"
            className="form-control"
            id="number"
            required
            value={Room.number}
            onChange={handleInputChange}
            name="number"
          />
        </div>
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