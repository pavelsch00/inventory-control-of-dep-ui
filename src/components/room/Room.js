import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import RoomDataService from "../../services/dataService/api-room-service";

const Room = props => {
  const { id }= useParams();
  let navigate = useNavigate();
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
        console.log(response.data);
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
    setMessage("Пожалуйста подождите");
    RoomDataService.update(currentRoom.id, currentRoom)
      .then(response => {
        console.log(response.data);
        setMessage("Обновление прошло успешно");
      })
      .catch(e => {
        console.log(e);
      });
  };
  const goBack = () => {
    navigate("/room");
  };
  return (
    <div>
      {currentRoom ? (
        <div className="edit-form">
          <h4>Аудитория</h4>
          <form>
            <div className="form-group">
              <label htmlFor="name">Название</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={currentRoom.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="number">Номер</label>
              <input
                type="text"
                className="form-control"
                id="number"
                name="number"
                value={currentRoom.number}
                onChange={handleInputChange}
              />
            </div>
          </form>
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
          <p>Выбирите аудитория...</p>
        </div>
      )}
    </div>
  );
};
export default Room;