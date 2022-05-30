import React, { useState, useEffect } from "react";
import InventoryBookeDataService from "../../services/dataService/api-inventorybook-service";
import OperationsTypeDataService from "../../services/dataService/api-operationstype-service";
import MaterialValueDataService from "../../services/dataService/api-materialvalue-service";
import UserDataService from "../../services/dataService/api-user-service";

import { Link } from "react-router-dom";

const InventoryBookeList = () => {
  const [InventoryBooke, setInventoryBooke] = useState([]);
  const [currentInventoryBooke, setCurrentInventoryBooke] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchId, setSearchName] = useState("");
  const [currentOperationsType, setCurrentOperationsType] = useState(null);
  const [currentMaterialValue, setCurrentMaterialValue] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    retrieveInventoryBooke();
  }, []);
  const onChangeSearchName = e => {
    const searchId = e.target.value;
    setSearchName(searchId);
  };
  const retrieveInventoryBooke = () => {
    InventoryBookeDataService.getAll()
      .then(response => {
        setInventoryBooke(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };
  const getOperationsTypeById = id  => {
    OperationsTypeDataService.get(id)
      .then(response => {
        setCurrentOperationsType(response.data);
        console.log(response.data)
      })
      .catch(e => {
        console.log(e);
      });
  };
  const getMaterialValueById = id  => {
    MaterialValueDataService.get(id)
      .then(response => {
        setCurrentMaterialValue(response.data);
        console.log(response.data)
      })
      .catch(e => {
        console.log(e);
      });
  };
  const getUserById = id  => {
    UserDataService.getById(id)
      .then(response => {
        setCurrentUser(response.data);
        console.log(response.data)
      })
      .catch(e => {
        console.log(e);
      });
  };

  const refreshList = () => {
    retrieveInventoryBooke();
    setCurrentInventoryBooke(null);
    setCurrentIndex(-1);
  };
  const setActiveInventoryBooke = (InventoryBooke, index) => {
    setCurrentInventoryBooke(InventoryBooke);
    setCurrentIndex(index);
    getOperationsTypeById(InventoryBooke.operationTypeId);
    getMaterialValueById(InventoryBooke.materialValueId);
    getUserById(InventoryBooke.userId);
    console.log(InventoryBooke);
  };
  const deleteInventoryBooke = () => {
    InventoryBookeDataService.remove(currentInventoryBooke.id)
      .then(response => {
        refreshList();
      })
      .catch(e => {
        console.log(e);
      });
  };
  const findById = () => {
      InventoryBookeDataService.getAll()
      .then(response => {
        setInventoryBooke(response.data.filter(x => x.name.includes(searchId)));
      })
      .catch(e => {
        console.log(e);
      });
  };
  return (
    <div className="list row">
      <div className="col-md-12">
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
        <h2>Инвентарная книга</h2>
        <h4>Список материальных ценностей</h4>
        <ul className="list-group">
          {InventoryBooke &&
            InventoryBooke.map((InventoryBooke, index) => (
              <li
                className={
                  "list-group-item " + (index === currentIndex ? "active" : "")
                }
                onClick={() => setActiveInventoryBooke(InventoryBooke, index)}
                key={index}
              >
                {InventoryBooke.materialValueName} {InventoryBooke.materialValuInventoryNumber} {InventoryBooke.operationTypeName} {InventoryBooke.date}
              </li>
            ))}
        </ul>
        <Link
          to={"/add-inventorybook"}
          className="m-3 btn btn-outline-secondary" >Добавить  
        </Link>
      </div>
      <div className="col-md-6">
        {currentInventoryBooke && currentOperationsType && currentMaterialValue && currentUser ? (
          <div>
            <h4>Инвентарная книга</h4>
            <div>
              <label>
                <strong>Материальная ценность:</strong>
              </label>{" "}
              {currentMaterialValue.name}
            </div>
            <div>
              <label>
                <strong>Тип операции:</strong>
              </label>{" "}
              {currentOperationsType.name}
            </div>
            <div>
              <label>
                <strong>Комментарий:</strong>
              </label>{" "}
              {currentInventoryBooke.comment}
            </div>
            <div>
              <label>
                <strong>Дата:</strong>
              </label>{" "}
              {currentInventoryBooke.date}
            </div>
            <div>
              <label>
                <strong>Сотрудник:</strong>
              </label>{" "}
              {currentUser.name} {currentUser.surname} {currentUser.lastName} 
            </div>
            <Link
              to={"/inventorybook/" + currentInventoryBooke.id}
              className="m-3 btn btn-outline-secondary"
            >
              Редактировать
            </Link>
            <button className="m-3 btn btn-outline-secondary" onClick={deleteInventoryBooke}>
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
export default InventoryBookeList;