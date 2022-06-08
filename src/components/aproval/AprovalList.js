import React, { useState, useEffect } from "react";
import AprovarDataService from "../../services/dataService/api-aprovar-service";
import InventoryBookDataService from "../../services/dataService/api-inventorybook-service";
import UserDataService from "../../services/dataService/api-user-service";
import { Link } from "react-router-dom";
import AuthService from "../../services/authService/auth.service";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const AprovarList = () => {
  const [showMaterialPersonBoard, setMaterialPersonBoard] = useState(false);
  const [Aprovar, setAprovar] = useState([]);
  const [currentAprovar, setCurrentAprovar] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchId, setSearchName] = useState("");
  const [currentInventoryBook, setCurrentInventoryBook] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAprove, setIsAprove] = useState(false);
  const [isAllAprove, setAllAprove] = useState(false);
  
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    retrieveAprovar(user.UserId);
    setMaterialPersonBoard(user.roles.includes("MaterialPerson"));
  }, [currentAprovar]);
  const getIsAllAproveById = ()  => {
    AprovarDataService.getById(currentInventoryBook.id)
      .then(response => {
        setAllAprove(response.data);
        console.log(response.data)
      })
      .catch(e => {
        console.log(e);
      });
  };
  const onChangeTrue = () => {
    setIsAprove(true);
    updateMaterialValue();
  };
  const onChangeFalse = () => {
    setIsAprove(false);
    updateMaterialValue();
  };
  const onChangeSearchName = e => {
    const searchId = e.target.value;
    setSearchName(searchId);
  };
  const retrieveAprovar = (userId) => {
    AprovarDataService.getAll(userId)
      .then(response => {
        setAprovar(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };
  const getInventoryBookById = id  => {
    InventoryBookDataService.get(id)
      .then(response => {
        setCurrentInventoryBook(response.data);
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
    retrieveAprovar();
    setCurrentAprovar(null);
    setCurrentIndex(-1);
  };
  const setActiveAprovar = (Aprovar, index) => {
    setCurrentAprovar(Aprovar);
    setCurrentIndex(index);
    getInventoryBookById(Aprovar.inventoryBookId);
    getIsAllAproveById(Aprovar.userId);
    getUserById(Aprovar.userId);
    console.log(Aprovar);
  };
  const updateMaterialValue = () => {
    var data = {
        inventoryBookId: currentAprovar.inventoryBookId,
        userId: currentAprovar.userId,
        isAprove: isAprove
    };

    AprovarDataService.update(currentAprovar.id, data)
      .then(response => {
      })
      .catch(e => {
        console.log(e);
      });
  };
  const findById = () => {
      AprovarDataService.getAll()
      .then(response => {
        setAprovar(response.data.filter(x => x.name.includes(searchId)));
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
        <h2>Запрос на подтверждние</h2>
        <h4>Список материальных ценностей</h4>
        <TableContainer sx={{ width: 650 }} component={Paper}>
          <Table  aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Состояние</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {Aprovar &&
                Aprovar.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    className={
                      "list-group-item " + (row.id === currentIndex ? "active" : "")
                    }
                    onClick={() => setActiveAprovar(row, row.id)}
                  >
                    <TableCell component="th" scope="row">{row.isAprove === true ? "Одобрено" : "Не одобренно"}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Link
          to={"/add-aprovar"}
          className="m-3 btn btn-outline-secondary" >Добавить  
        </Link>
      </div>
      <div className="col-md-4">
        {currentAprovar && currentInventoryBook && currentUser ? (
          <div>
            <h4>Инвентарная книга</h4>
            <div>
              <label>
                <strong>Материальная ценность:</strong>
              </label>{" "}
              {currentInventoryBook.materialValueName}
            </div>
            <div>
              <label>
                <strong>Тип операции:</strong>
              </label>{" "}
              {currentInventoryBook.operationTypeName}
            </div>
            <div>
              <label>
                <strong>Описание:</strong>
              </label>{" "}
              {currentInventoryBook.comment}
            </div>
            <div>
              <label>
                <strong>Дата:</strong>
              </label>{" "}
              {currentInventoryBook.date}
            </div>
            <div>
              <label>
                <strong>Сотрудник:</strong>
              </label>{" "}
              {currentUser.name} {currentUser.surname} {currentUser.lastName} 
            </div>
            {!showMaterialPersonBoard &&             <div>
              <label>
                <strong>Статус одобрения:</strong>
              </label>{" "}
              {isAllAprove.isAprove === true ? "Одобрено" : "Не одобренно" }
            </div>}

            
            {!showMaterialPersonBoard && (
            <div>
                <button className="m-3 btn btn-outline-secondary" onClick={onChangeTrue}>
                  Одобрить
                </button>
                <button className="m-3 btn btn-outline-secondary" onClick={onChangeFalse}>
                  Отклонить
                </button>
            </div>)}
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

export default AprovarList;