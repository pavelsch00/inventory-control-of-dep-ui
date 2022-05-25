import React, { useState, useEffect } from "react";
import PositionDataService from "../../services/dataService/api-position-service";
import { Link } from "react-router-dom";

const PositionList = () => {
  const [Position, setPosition] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchId, setSearchName] = useState("");
  
  useEffect(() => {
    retrievePosition();
  }, []);
  const onChangeSearchName = e => {
    const searchId = e.target.value;
    setSearchName(searchId);
    console.log(searchId);
  };
  const retrievePosition = () => {
    PositionDataService.getAll()
      .then(response => {
        setPosition(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };
  const refreshList = () => {
    retrievePosition();
    setCurrentPosition(null);
    setCurrentIndex(-1);
  };
  const setActivePosition = (Position, index) => {
    setCurrentPosition(Position);
    setCurrentIndex(index);
  };
  const deletePosition = () => {
    PositionDataService.remove(currentPosition.id)
      .then(response => {
        console.log(response.data);
        refreshList();
      })
      .catch(e => {
        console.log(e);
      });
  };
  const findById = () => {
      PositionDataService.getAll()
      .then(response => {
        setPosition(response.data.filter(x => x.name.includes(searchId)));
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
        <h4>Список должностей</h4>
        <ul className="list-group">
          {Position &&
            Position.map((Position, index) => (
              <li
                className={
                  "list-group-item " + (index === currentIndex ? "active" : "")
                }
                onClick={() => setActivePosition(Position, index)}
                key={index}
              >
                {Position.name}
              </li>
            ))}
        </ul>
        <Link
          to={"/add-position"}
          className="m-3 btn btn-outline-secondary" >Добавить  
        </Link>
      </div>
      <div className="col-md-6">
        {currentPosition ? (
          <div>
            <h4>Должность</h4>
            <div>
              <label>
                <strong>Название:</strong>
              </label>{" "}
              {currentPosition.name}
            </div>
            <Link
              to={"/position/" + currentPosition.id}
              className="m-3 btn btn-outline-secondary"
            >
              Редактировать
            </Link>
            <button className="m-3 btn btn-outline-secondary" onClick={deletePosition}>
              Удалить
            </button>
          </div>
        ) : (
          <div>
            <br />
            <p>Выберите должность...</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default PositionList;