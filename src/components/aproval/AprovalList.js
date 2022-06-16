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

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';

const AprovarList = () => {
  const [filter, setFilter] = useState("materialValueName");
  const [filterName, setFilterName] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [checked, setChecked] = useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const [showMaterialPersonBoard, setMaterialPersonBoard] = useState(false);
  const [Aprovar, setAprovar] = useState([]);
  const [currentAprovar, setCurrentAprovar] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchId, setSearchName] = useState("");
  const [currentInventoryBook, setCurrentInventoryBook] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAprove, setIsAprove] = useState(false);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    retrieveAprovar(user.UserId);
    setMaterialPersonBoard(user.roles.includes("MaterialPerson"));
  }, [currentAprovar]);

  useEffect(() => {
    if(currentAprovar !== null){
      updateMaterialValue();
    }
  }, [isAprove]);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    retrieveAprovar(user.UserId);
    AprovarDataService.getAll(user.UserId)
    .then(response => {
     if(checked){
        setAprovar(response.data.filter(x => x["isAprove"] === false));
      }else{
        setAprovar(response.data);
      }
    })
    .catch(e => {
      console.log(e);
    });
  }, [checked]);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const onChangeTrue = () => {
    setIsAprove(true);
  };
  const onChangeFalse = () => {
    setIsAprove(false);
  };
  const onChangeSearchName = e => {
    const searchId = e.target.value;
    setSearchName(searchId);
  };
  const retrieveAprovar = (userId) => {
    AprovarDataService.getAll(userId)
      .then(response => {
        if(checked){
          setAprovar(response.data.filter(x => x["isAprove"] === false));
        }else{
          setAprovar(response.data);
        }
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

  const setActiveAprovar = (Aprovar, index) => {
    setCurrentAprovar(Aprovar);
    setCurrentIndex(index);
    getInventoryBookById(Aprovar.inventoryBookId);
    getUserById(Aprovar.userId);
  };
  const updateMaterialValue = () => {
    var data = {
        inventoryBookId: currentAprovar.inventoryBookId,
        userId: currentAprovar.userId,
        isAprove: isAprove
    };

    AprovarDataService.update(currentAprovar.id, data)
      .then(response => {
        const user = AuthService.getCurrentUser();
        retrieveAprovar(user.UserId);
      })
      .catch(e => {
        console.log(e);
      });
  };
  const findById = () => {
      const user = AuthService.getCurrentUser();
      AprovarDataService.getAll(user.UserId)
      .then(response => {
        const data = response.data.filter(x => x["isAprove"] === false);

        if(checked){
          setAprovar(data.filter(x => x[filter].includes(searchId)));
        }else{
          setAprovar(response.data.filter(x => x[filter].includes(searchId)));
        } 
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
            placeholder="Выберите фильтр и введите данные для поиска"
            value={searchId}
            onChange={onChangeSearchName}
          />
          <div>
            <button
              className="searchButton btn btn-outline-secondary"
              onClick={handleClick}
            >
              {filterName ? filterName : "Выберите фильтр"}
            </button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={() => {
                setFilter("materialValueName");
                setFilterName("Название");
                handleClose();
                }}>Название</MenuItem>
              <MenuItem onClick={() => {
                setFilter("operationTypeName");
                setFilterName("Тип операции");
                handleClose();
                }}>Тип операции</MenuItem>
                <MenuItem onClick={() => {
                setFilter("categoryName");
                setFilterName("Категория");
                handleClose();
                }}>Категория</MenuItem>
                <MenuItem onClick={() => {
                setFilter("roomNumber");
                setFilterName("Аудитория");
                handleClose();
                }}>Аудитория</MenuItem>
            </Menu>
          </div>
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findById}
            >
              Поиск
            </button>
          </div>
          <div className="col-md-12">
      <label>
        Скрыть подтвержденные:
      </label>
      <Switch
      checked={checked}
      onChange={handleChange}
      inputProps={{ 'aria-label': 'controlled' }}
      />
      </div>
        </div>
      </div>
      <div className="col-md-8">
        <h2>Запрос на подтверждние</h2>
        <h4>Список материальных ценностей</h4>
        <TableContainer sx={{ width: 800 }} component={Paper}>
          <Table  aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Название</TableCell>
                <TableCell>Категория</TableCell>
                <TableCell>Тип операции</TableCell>
                <TableCell>Номер аудитории</TableCell>
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
                    <TableCell component="th" scope="row">{row.materialValueName}</TableCell>
                    <TableCell>{row.categoryName}</TableCell>
                    <TableCell>{row.operationTypeName}</TableCell>
                    <TableCell>{row.roomNumber}</TableCell>
                    <TableCell component="th" scope="row">{row.isAprove === true ? "Одобрено" : "Не одобренно"}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
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
              {currentUser.surname} {currentUser.name} {currentUser.lastName} 
            </div>    
            {!showMaterialPersonBoard && !currentAprovar.isAprove && (
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