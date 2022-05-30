import React, { useState, useEffect } from "react";
import InventoryBookeDataService from "../../services/dataService/api-inventorybook-service";
import OperationsTypeDataService from "../../services/dataService/api-operationstype-service";
import MaterialValueDataService from "../../services/dataService/api-materialvalue-service";
import UserDataService from "../../services/dataService/api-user-service";
import { Link } from "react-router-dom";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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
      <div className="col-md-8">
        <h2>Инвентарная книга</h2>
        <h4>Список материальных ценностей</h4>
        <TableContainer sx={{ width: 650 }} component={Paper}>
          <Table  aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Название</TableCell>
                <TableCell>Инвентарный номер</TableCell>
                <TableCell>Тип операции</TableCell>
                <TableCell>Дата</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {InventoryBooke &&
                InventoryBooke.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    className={
                      "list-group-item " + (row.id === currentIndex ? "active" : "")
                    }
                    onClick={() => setActiveInventoryBooke(row, row.id)}
                  >
                    <TableCell component="th" scope="row">{row.materialValueName}</TableCell>
                    <TableCell>{row.materialValuInventoryNumber}</TableCell>
                    <TableCell>{row.operationTypeName}</TableCell>
                    <TableCell>{row.date}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Link
          to={"/add-inventorybook"}
          className="m-3 btn btn-outline-secondary" >Добавить  
        </Link>
      </div>
      <div className="col-md-4">
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

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }
  
  const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
  ];

export default InventoryBookeList;