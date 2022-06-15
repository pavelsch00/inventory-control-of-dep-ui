import React, { useState, useEffect } from "react";
import FacultyDataService from "../../services/dataService/api-faculty-service";
import { Link } from "react-router-dom";

const FacultyList = () => {
  const [Faculty, setFaculty] = useState([]);
  const [currentFaculty, setCurrentFaculty] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchId, setSearchName] = useState("");
  
  useEffect(() => {
    retrieveFaculty();
  }, []);
  const onChangeSearchName = e => {
    const searchId = e.target.value;
    setSearchName(searchId);
    console.log(searchId);
  };
  const retrieveFaculty = () => {
    FacultyDataService.getAll()
      .then(response => {
        setFaculty(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };
  const refreshList = () => {
    retrieveFaculty();
    setCurrentFaculty(null);
    setCurrentIndex(-1);
  };
  const setActiveFaculty = (Faculty, index) => {
    setCurrentFaculty(Faculty);
    setCurrentIndex(index);
  };
  const deleteFaculty = () => {
    FacultyDataService.remove(currentFaculty.id)
      .then(response => {
        console.log(response.data);
        refreshList();
      })
      .catch(e => {
        console.log(e);
      });
  };
  const findById = () => {
      FacultyDataService.getAll()
      .then(response => {
        setFaculty(response.data.filter(x => x.name.includes(searchId)));
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
        <h4>Список факультетов</h4>
        <ul className="list-group">
          {Faculty &&
            Faculty.map((Faculty, index) => (
              <li
                className={
                  "list-group-item " + (index === currentIndex ? "active" : "")
                }
                onClick={() => setActiveFaculty(Faculty, index)}
                key={index}
              >
                {Faculty.name}
              </li>
            ))}
        </ul>
        <Link
          to={"/add-faculty"}
          className="m-3 btn btn-outline-secondary" >Добавить  
        </Link>
      </div>
      <div className="col-md-6">
        {currentFaculty ? (
          <div>
            <h4>Факультет</h4>
            <div>
              <label>
                <strong>Название:</strong>
              </label>{" "}
              {currentFaculty.name}
            </div>
            <Link
              to={"/faculty/" + currentFaculty.id}
              className="m-3 btn btn-outline-secondary"
            >
              Редактировать
            </Link>
            <button className="m-3 btn btn-outline-secondary" onClick={deleteFaculty}>
              Удалить
            </button>
          </div>
        ) : (
          <div>
            <br />
            <p>Выберите факультет...</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default FacultyList;