import React, { useState, useEffect } from "react";
import DepartmentDataService from "../../services/dataService/api-department-service";
import { Link } from "react-router-dom";

const DepartmentList = () => {
  const [Department, setDepartment] = useState([]);
  const [currentDepartment, setCurrentDepartment] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchId, setSearchName] = useState("");
  
  useEffect(() => {
    retrieveDepartment();
  }, []);
  const onChangeSearchName = e => {
    const searchId = e.target.value;
    setSearchName(searchId);
    console.log(searchId);
  };
  const retrieveDepartment = () => {
    DepartmentDataService.getAll()
      .then(response => {
        setDepartment(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };
  const refreshList = () => {
    retrieveDepartment();
    setCurrentDepartment(null);
    setCurrentIndex(-1);
  };
  const setActiveDepartment = (Department, index) => {
    setCurrentDepartment(Department);
    setCurrentIndex(index);
  };
  const deleteDepartment = () => {
    DepartmentDataService.remove(currentDepartment.id)
      .then(response => {
        console.log(response.data);
        refreshList();
      })
      .catch(e => {
        console.log(e);
      });
  };
  const findById = () => {
      DepartmentDataService.getAll()
      .then(response => {
        setDepartment(response.data.filter(x => x.name.includes(searchId)));
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
        <h4>Список кафедр</h4>
        <ul className="list-group">
          {Department &&
            Department.map((Department, index) => (
              <li
                className={
                  "list-group-item " + (index === currentIndex ? "active" : "")
                }
                onClick={() => setActiveDepartment(Department, index)}
                key={index}
              >
                {Department.name}
              </li>
            ))}
        </ul>
        <Link
          to={"/add-department"}
          className="m-3 btn btn-outline-secondary" >Добавить  
        </Link>
      </div>
      <div className="col-md-6">
        {currentDepartment ? (
          <div>
            <h4>Кафедра</h4>
            <div>
              <label>
                <strong>Название:</strong>
              </label>{" "}
              {currentDepartment.name}
            </div>
            <Link
              to={"/department/" + currentDepartment.id}
              className="m-3 btn btn-outline-secondary"
            >
              Редактировать
            </Link>
            <button className="m-3 btn btn-outline-secondary" onClick={deleteDepartment}>
              Удалить
            </button>
          </div>
        ) : (
          <div>
            <br />
            <p>Выберите кафедру...</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default DepartmentList;