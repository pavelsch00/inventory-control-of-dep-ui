import React, { useState, useEffect } from "react";
import UserDataService from "../../services/dataService/api-user-service";
import FacultyDataService from "../../services/dataService/api-faculty-service";
import PositionDataService from "../../services/dataService/api-position-service";
import { Link } from "react-router-dom";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const UserList = () => {
  const [User, setUser] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchId, setSearchName] = useState("");
  const [currentFaculty, setCurrentFaculty] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);

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
    retrieveUser();
  }, []);
  const onChangeSearchName = e => {
    const searchId = e.target.value;
    setSearchName(searchId);
  };
  const retrieveUser = () => {
    UserDataService.getAll()
      .then(response => {
        setUser(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };
  const getFacultyById = id  => {
    FacultyDataService.get(id)
      .then(response => {
        setCurrentFaculty(response.data);
        console.log(response.data)
      })
      .catch(e => {
        console.log(e);
      });
  };
  const getPositionById = id  => {
    PositionDataService.get(id)
      .then(response => {
        setCurrentPosition(response.data);
        console.log(response.data)
      })
      .catch(e => {
        console.log(e);
      });
  };
  const refreshList = () => {
    retrieveUser();
    setCurrentUser(null);
    setCurrentIndex(-1);
  };
  const setActiveUser = (User, index) => {
    setCurrentUser(User);
    setCurrentIndex(index);
    getFacultyById(User.facultyId);
    getPositionById(User.positionId);
  };
  const statusChange = () => {
    const data = {
      isActive: !currentUser.isActive
    }

    UserDataService.setIsActive(currentUser.email, data)
      .then(response => {
        refreshList();
      })
      .catch(e => {
        console.log(e);
      });
  };
  const findById = () => {
      UserDataService.getAll()
      .then(response => {
        if(searchId === ""){
          setUser(response.data);
        }else{
          setUser(response.data.filter(x =>isNaN(x[filter]) ? x[filter].includes(searchId) : x[filter] == searchId));
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
            placeholder="?????????? ???? ????????????????"
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
                setFilterName("??????");
                handleClose();
                }}>??????</MenuItem>
                <MenuItem onClick={() => {
                setFilter("lastName");
                setFilterName("????????????????");
                handleClose();
                }}>????????????????</MenuItem>
                <MenuItem onClick={() => {
                setFilter("surname");
                setFilterName("??????????????");
                handleClose();
                }}>??????????????</MenuItem>
                <MenuItem onClick={() => {
                setFilter("positionName");
                setFilterName("??????????????????");
                handleClose();
                }}>??????????????????</MenuItem>
                <MenuItem onClick={() => {
                setFilter("facultyNumber");
                setFilterName("??????????????????");
                handleClose();
                }}>??????????????????</MenuItem>
                <MenuItem onClick={() => {
                setFilter("email");
                setFilterName("?????????????????????? ??????????");
                handleClose();
                }}>?????????????????????? ??????????</MenuItem>
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
      <div className="col-md-8">
        <h4>???????????? ??????????????????????????</h4>
        <TableContainer sx={{ width: 920 }} component={Paper}>
          <Table  aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>??????</TableCell>
                <TableCell>????????????????</TableCell>
                <TableCell>??????????????</TableCell>
                <TableCell>??????????????????</TableCell>
                <TableCell>??????????????????</TableCell>
                <TableCell>?????????????????????? ??????????</TableCell>
                <TableCell>????????????</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {User &&
                User.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    className={
                      "list-group-item " + (row.id === currentIndex ? "active" : "")
                    }
                    onClick={() => setActiveUser(row, row.id)}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell>{row.lastName}</TableCell>
                    <TableCell>{row.surname}</TableCell>
                    <TableCell>{row.positionName}</TableCell>
                    <TableCell>{row.facultyName}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.isActive == true ? "??????????????" : "????????????????????????"}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Link
          to={"/add-user"}
          className="m-3 btn btn-outline-secondary" >????????????????  
        </Link>
      </div>
      <div className="col-md-4 user">
        {currentUser && currentFaculty && currentPosition ? (
          <div>
            <h4>????????????????????????</h4>
            <div>
              <label>
                <strong>??????:</strong>
              </label>{" "}
              {currentUser.name}
            </div>
            <div>
              <label>
                <strong>????????????????:</strong>
              </label>{" "}
              {currentUser.lastName}
            </div>
            <div>
              <label>
                <strong>??????????????:</strong>
              </label>{" "}
              {currentUser.surname}
            </div>
            <div>
              <label>
                <strong>??????????????????:</strong>
              </label>{" "}
              {currentPosition.name}
            </div>
            <div>
              <label>
                <strong>??????????????????:</strong>
              </label>{" "}
              {currentFaculty.name}
            </div>
            <div>
              <label>
                <strong>????????????:</strong>
              </label>{" "}
              {currentUser.isActive == true ? "??????????????" : "????????????????????????"}
            </div>
            <div><Link 
              to={"/user/" + currentUser.email}
              className="m-1 btn btn-outline-secondary"
            >
              ??????????????????????????
            </Link>
            {currentUser.isActive == true ? (
                <button className="m-1 btn btn-outline-secondary" onClick={statusChange}>
                  ??????????????????????????
                </button>
            ) : (
                <button className="m-1 btn btn-outline-secondary" onClick={statusChange}>
                ????????????????????????????
              </button>
            )}
            </div>
          </div>
        ) : (
          <div>
            <br />
            <p>???????????????? ????????????????????????...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;