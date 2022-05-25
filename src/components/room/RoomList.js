import React, { useState, useEffect } from "react";
import RoomDataService from "../../services/dataService/api-room-service";
import { Link } from "react-router-dom";

const RoomList = () => {
  const [Room, setRoom] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchId, setSearchName] = useState("");
  
  useEffect(() => {
    retrieveRoom();
  }, []);
  const onChangeSearchName = e => {
    const searchId = e.target.value;
    setSearchName(searchId);
    console.log(searchId);
  };
  const retrieveRoom = () => {
    RoomDataService.getAll()
      .then(response => {
        setRoom(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };
  const refreshList = () => {
    retrieveRoom();
    setCurrentRoom(null);
    setCurrentIndex(-1);
  };
  const setActiveRoom = (Room, index) => {
    setCurrentRoom(Room);
    setCurrentIndex(index);
  };
  const deleteRoom = () => {
    RoomDataService.remove(currentRoom.id)
      .then(response => {
        console.log(response.data);
        refreshList();
      })
      .catch(e => {
        console.log(e);
      });
  };
  const findById = () => {
      RoomDataService.getAll()
      .then(response => {
        setRoom(response.data.filter(x => x.name.includes(searchId)));
      })
      .catch(e => {
        console.log(e);
      });
  };
  return (
    <div className="list row">
      <div className="col-md-8">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Поиск по названию"
            value={searchId}
            onChange={onChangeSearchName}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findById}
            >
              Поиск
            </button>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <h4>Список аудиторий</h4>
        <ul className="list-group">
          {Room &&
            Room.map((Room, index) => (
              <li
                className={
                  "list-group-item " + (index === currentIndex ? "active" : "")
                }
                onClick={() => setActiveRoom(Room, index)}
                key={index}
              >
                {Room.name}-{Room.number}
              </li>
            ))}
        </ul>
        <Link
          to={"/add-room"}
          className="m-3 btn btn-outline-secondary" >Добавить  
        </Link>
      </div>
      <div className="col-md-6">
        {currentRoom ? (
          <div>
            <h4>Аудитория</h4>
            <div>
              <label>
                <strong>Название:</strong>
              </label>{" "}
              {currentRoom.name}
            </div>
            <div>
              <label>
                <strong>Номер:</strong>
              </label>{" "}
              {currentRoom.number}
            </div>
            <Link
              to={"/room/" + currentRoom.id}
              className="m-3 btn btn-outline-secondary"
            >
              Редактировать
            </Link>
            <button className="m-3 btn btn-outline-secondary" onClick={deleteRoom}>
              Удалить
            </button>
          </div>
        ) : (
          <div>
            <br />
            <p>Выберите аудитория...</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default RoomList;