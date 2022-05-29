import React, { useState, useEffect } from "react";
import MaterialValueDataService from "../../services/dataService/api-materialvalue-service";
import RoomDataService from "../../services/dataService/api-room-service";
import CategoryDataService from "../../services/dataService/api-category-service";
import { Link } from "react-router-dom";

const MaterialValueList = () => {
  const [MaterialValue, setMaterialValue] = useState([]);
  const [currentMaterialValue, setCurrentMaterialValue] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchId, setSearchName] = useState("");
  const [currentRoom, setCurrentRoom] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);

  useEffect(() => {
    retrieveMaterialValue();
  }, []);
  const onChangeSearchName = e => {
    const searchId = e.target.value;
    setSearchName(searchId);
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
  const getRoomById = id  => {
    RoomDataService.get(id)
      .then(response => {
        setCurrentRoom(response.data);
        console.log(response.data)
      })
      .catch(e => {
        console.log(e);
      });
  };
  const getCategoryById = id  => {
    CategoryDataService.get(id)
      .then(response => {
        setCurrentCategory(response.data);
        console.log(response.data)
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
    getRoomById(MaterialValue.roomId);
    getCategoryById(MaterialValue.categoryId);
  };
  const deleteMaterialValue = () => {
    MaterialValueDataService.remove(currentMaterialValue.id)
      .then(response => {
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
                {MaterialValue.inventoryNumber}-{MaterialValue.description}
              </li>
            ))}
        </ul>
        <Link
          to={"/add-materialvalue"}
          className="m-3 btn btn-outline-secondary" >Добавить  
        </Link>
      </div>
      <div className="col-md-6">
        {currentMaterialValue && currentRoom && currentCategory ? (
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
                <strong>Описание:</strong>
              </label>{" "}
              {currentMaterialValue.description}
            </div>
            <div>
              <label>
                <strong>Цена:</strong>
              </label>{" "}
              {currentMaterialValue.price}
            </div>
            <div>
              <label>
                <strong>Катигория:</strong>
              </label>{" "}
              {currentCategory.name}
            </div>
            <div>
              <label>
                <strong>Дата списание:</strong>
              </label>{" "}
              {currentMaterialValue.writeOffDate}
            </div>
            <div>
              <label>
                <strong>Заводской номер:</strong>
              </label>{" "}
              {currentMaterialValue.factoryNumber}
            </div>
            <div>
              <label>
                <strong>Инентарный номер:</strong>
              </label>{" "}
              {currentMaterialValue.inventoryNumber}
            </div>
            <div>
              <label>
                <strong>Номенклатурный номер:</strong>
              </label>{" "}
              {currentMaterialValue.nomenclatureNumber}
            </div>
            <div>
              <label>
                <strong>Паспортный номер номер:</strong>
              </label>{" "}
              {currentMaterialValue.passportNumber}
            </div>
            <div>
              <label>
                <strong>Аудитория:</strong>
              </label>{" "}
              {currentRoom.name} - {currentRoom.number}
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