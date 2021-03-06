import React, { useState, useEffect } from "react";
import MaterialValueDataService from "../../services/dataService/api-materialvalue-service";
import RoomDataService from "../../services/dataService/api-room-service";
import CategoryDataService from "../../services/dataService/api-category-service";
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

const MaterialValueList = () => {
  const [showMaterialPersonBoard, setMaterialPersonBoard] = useState(false);
  const [MaterialValue, setMaterialValue] = useState([]);
  const [currentMaterialValue, setCurrentMaterialValue] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchId, setSearchName] = useState("");
  const [currentRoom, setCurrentRoom] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);

  const [filter, setFilter] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  useEffect(() => {
    retrieveMaterialValue();
    const user = AuthService.getCurrentUser();
    setMaterialPersonBoard(user.roles.includes("MaterialPerson"));
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
        if(searchId === ""){
          setMaterialValue(response.data);
        }else{
          setMaterialValue(response.data.filter(x =>isNaN(x[filter]) ? x[filter].includes(searchId) : x[filter] == searchId));
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
            placeholder="???????????????? ???????????? ?? ?????????????? ???????????? ?????? ????????????"
            value={searchId}
            onChange={onChangeSearchName}
          />
          <button
              className="searchButton btn btn-outline-secondary"
              onClick={handleClick}
            >
              {filterName ? filterName : "???????????????? ????????????"}
            </button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={() => {
                setFilter("name");
                setFilterName("????????????????");
                handleClose();
                }}>????????????????</MenuItem>
                <MenuItem onClick={() => {
                setFilter("description");
                setFilterName("????????????????");
                handleClose();
                }}>????????????????</MenuItem>
                <MenuItem onClick={() => {
                setFilter("categoryName");
                setFilterName("??????????????????");
                handleClose();
                }}>??????????????????</MenuItem>
                <MenuItem onClick={() => {
                setFilter("roomNumber");
                setFilterName("??????????????????");
                handleClose();
                }}>??????????????????</MenuItem>
            </Menu>
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findById}
            >
              ??????????
            </button>
          </div>
        </div>
      </div>
      <div className="col-md-7">
        <h4>???????????? ???????????????????????? ??????????????????</h4>
        <TableContainer sx={{ width: 650 }} component={Paper}>
          <Table  aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>????????????????</TableCell>
                <TableCell>????????????????</TableCell>
                <TableCell>??????????????????</TableCell>
                <TableCell>??????????????????</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {MaterialValue &&
                MaterialValue.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    className={
                      "list-group-item " + (row.id === currentIndex ? "active" : "")
                    }
                    onClick={() => setActiveMaterialValue(row, row.id)}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>{row.categoryName}</TableCell>
                    <TableCell>{row.roomNumber}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Link
          to={"/add-materialvalue"}
          className="m-3 btn btn-outline-secondary" >????????????????  
        </Link>
      </div>
      <div className="col-md-5">
        {currentMaterialValue && currentRoom && currentCategory ? (
          <div>
            <h4>???????????????????????? ????????????????</h4>
            <div>
              <label>
                <strong>????????????????:</strong>
              </label>{" "}
              {currentMaterialValue.name}
            </div>
            <div>
              <label>
                <strong>????????????????:</strong>
              </label>{" "}
              {currentMaterialValue.description}
            </div>
            <div>
              <label>
                <strong>??????????????????:</strong>
              </label>{" "}
              {currentCategory.name}
            </div>
            <div>
              <label>
                <strong>??????????????????:</strong>
              </label>{" "}
              {currentRoom.name} - {currentRoom.number}
            </div>
            {showMaterialPersonBoard && (<div><Link 
              to={"/materialvalue/" + currentMaterialValue.id}
              className="m-3 btn btn-outline-secondary"
            >
              ??????????????????????????
            </Link>
            <button className="m-3 btn btn-outline-secondary" onClick={deleteMaterialValue}>
              ??????????????
            </button></div>)}
          </div>
        ) : (
          <div>
            <br />
            <p>???????????????? ???????????????????????? ????????????????...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialValueList;