import React, { useState, useEffect } from "react";
import OperationsTypeDataService from "../../services/dataService/api-operationstype-service";
import { Link } from "react-router-dom";

const OperationsTypeList = () => {
  const [OperationsType, setOperationsType] = useState([]);
  const [currentOperationsType, setCurrentOperationsType] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchId, setSearchName] = useState("");
  
  useEffect(() => {
    retrieveOperationsType();
  }, []);
  const onChangeSearchName = e => {
    const searchId = e.target.value;
    setSearchName(searchId);
    console.log(searchId);
  };
  const retrieveOperationsType = () => {
    OperationsTypeDataService.getAll()
      .then(response => {
        setOperationsType(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };
  const refreshList = () => {
    retrieveOperationsType();
    setCurrentOperationsType(null);
    setCurrentIndex(-1);
  };
  const setActiveOperationsType = (OperationsType, index) => {
    setCurrentOperationsType(OperationsType);
    setCurrentIndex(index);
  };
  const deleteOperationsType = () => {
    OperationsTypeDataService.remove(currentOperationsType.id)
      .then(response => {
        console.log(response.data);
        refreshList();
      })
      .catch(e => {
        console.log(e);
      });
  };
  const findById = () => {
      OperationsTypeDataService.getAll()
      .then(response => {
        setOperationsType(response.data.filter(x => x.name.includes(searchId)));
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
        <h4>Список операций</h4>
        <ul className="list-group">
          {OperationsType &&
            OperationsType.map((OperationsType, index) => (
              <li
                className={
                  "list-group-item " + (index === currentIndex ? "active" : "")
                }
                onClick={() => setActiveOperationsType(OperationsType, index)}
                key={index}
              >
                {OperationsType.name}
              </li>
            ))}
        </ul>
        <Link
          to={"/add-operationsType"}
          className="m-3 btn btn-outline-secondary" >Добавить  
        </Link>
      </div>
      <div className="col-md-6">
        {currentOperationsType ? (
          <div>
            <h4>Тип операции</h4>
            <div>
              <label>
                <strong>Название:</strong>
              </label>{" "}
              {currentOperationsType.name}
            </div>
            <Link
              to={"/operationsType/" + currentOperationsType.id}
              className="m-3 btn btn-outline-secondary"
            >
              Редактировать
            </Link>
            <button className="m-3 btn btn-outline-secondary" onClick={deleteOperationsType}>
              Удалить
            </button>
          </div>
        ) : (
          <div>
            <br />
            <p>Выберите тип операции...</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default OperationsTypeList;