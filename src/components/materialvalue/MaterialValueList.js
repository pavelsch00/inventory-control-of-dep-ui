import React, { useState, useEffect } from "react";
import MaterialValueDataService from "../../services/dataService/api-materialvalue-service";
import { Link } from "react-router-dom";

const MaterialValueList = () => {
  const [MaterialValue, setMaterialValue] = useState([]);
  const [currentMaterialValue, setCurrentMaterialValue] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchId, setSearchName] = useState("");
  
  useEffect(() => {
    retrieveMaterialValue();
  }, []);
  const onChangeSearchName = e => {
    const searchId = e.target.value;
    setSearchName(searchId);
    console.log(searchId);
  };
  const retrieveMaterialValue = () => {
    MaterialValueDataService.getAll()
      .then(response => {
        setMaterialValue(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };
  const refreshList = () => {
    retrieveMaterialValue();
    setCurrentMaterialValue(null);
    setCurrentIndex(-1);
  };
  const setActiveMaterialValue = (MaterialValue, index) => {
    setCurrentMaterialValue(MaterialValue);
    setCurrentIndex(index);
  };
  const deleteMaterialValue = () => {
    MaterialValueDataService.remove(currentMaterialValue.id)
      .then(response => {
        console.log(response.data);
        refreshList();
      })
      .catch(e => {
        console.log(e);
      });
  };
  const findById = () => {
      MaterialValueDataService.getAll()
      .then(response => {
        setMaterialValue(response.data.filter(x => x.name.includes(searchId)));
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
        <h4>Список материальных ценностей</h4>
        <ul className="list-group">
          {MaterialValue &&
            MaterialValue.map((MaterialValue, index) => (
              <li
                className={
                  "list-group-item " + (index === currentIndex ? "active" : "")
                }
                onClick={() => setActiveMaterialValue(MaterialValue, index)}
                key={index}
              >
                {MaterialValue.name}-{MaterialValue.number}
              </li>
            ))}
        </ul>
        <Link
          to={"/add-materialvalue"}
          className="m-3 btn btn-outline-secondary" >Добавить  
        </Link>
      </div>
      <div className="col-md-6">
        {currentMaterialValue ? (
          <div>
            <h4>Материальная ценность</h4>
            <div>
              <label>
                <strong>Название:</strong>
              </label>{" "}
              {currentMaterialValue.name}
            </div>
            <div>
              <label>
                <strong>Номер:</strong>
              </label>{" "}
              {currentMaterialValue.number}
            </div>
            <Link
              to={"/materialvalue/" + currentMaterialValue.id}
              className="m-3 btn btn-outline-secondary"
            >
              Редактировать
            </Link>
            <button className="m-3 btn btn-outline-secondary" onClick={deleteMaterialValue}>
              Удалить
            </button>
          </div>
        ) : (
          <div>
            <br />
            <p>Выберите материальную ценность...</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default MaterialValueList;