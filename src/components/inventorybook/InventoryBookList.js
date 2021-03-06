import React, { useState, useEffect } from "react";
import InventoryBookeDataService from "../../services/dataService/api-inventorybook-service";
import OperationsTypeDataService from "../../services/dataService/api-operationstype-service";
import MaterialValueDataService from "../../services/dataService/api-materialvalue-service";
import UserDataService from "../../services/dataService/api-user-service";
import { Link } from "react-router-dom";
import AuthService from "../../services/authService/auth.service";
import AprovarDataService from "../../services/dataService/api-aprovar-service";
import PdfCreatorDataService from "../../services/dataService/api-pdfcreator-service";

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

const InventoryBookeList = () => {
  const [checked, setChecked] = useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const [checkedAprove, setCheckedAprove] = useState(false);

  const handleChangeAprove = (event) => {
    setCheckedAprove(event.target.checked);
  };

  const [showMaterialPersonBoard, setMaterialPersonBoard] = useState(false);
  const [showPurchaseDepartmentBoard, setPurchaseDepartmentBoard] = useState(false);
  const [InventoryBooke, setInventoryBooke] = useState([]);
  const [currentInventoryBooke, setCurrentInventoryBooke] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchId, setSearchName] = useState("");
  const [currentOperationsType, setCurrentOperationsType] = useState(null);
  const [currentMaterialValue, setCurrentMaterialValue] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAllAprove, setAllAprove] = useState(false);

  const [filter, setFilter] = useState("materialValueName");
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
    InventoryBookeDataService.getAll()
    .then(response => {
      if(checked && checkedAprove){
        const data = response.data.filter(x => x["operationTypeName"].includes("????????"));
        setInventoryBooke(data.filter(x => x["isAprove"] === true));
      }else if(checked){
        setInventoryBooke(response.data.filter(x => x["operationTypeName"].includes("????????")));
      }else if(checkedAprove){
        setInventoryBooke(response.data.filter(x => x["isAprove"] === true));
      }else{
        setInventoryBooke(response.data);
      }
    })
    .catch(e => {
      console.log(e);
    });
  }, [checked, checkedAprove]);

  useEffect(() => {
    retrieveInventoryBooke();
    const user = AuthService.getCurrentUser();
    setMaterialPersonBoard(user.roles.includes("MaterialPerson"));
    setPurchaseDepartmentBoard(user.roles.includes("PurchaseDepartment"));
  }, []);

  const getIsAllAproveById = (id)  => {
    AprovarDataService.getById(id)
      .then(response => {
        setAllAprove(response.data);
        console.log(response.data)
      })
      .catch(e => {
        console.log(e);
      });
  };
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
    getIsAllAproveById(InventoryBooke.id);
    getUserById(InventoryBooke.userId);
  };
  const pdfCreatorHandle = () => {
    PdfCreatorDataService.get(InventoryBooke)
      .then(response => {
        //Create a Blob from the PDF Stream
        const file = new Blob([response.data], { type: "application/pdf" });
        //Build a URL from the file
        const fileURL = URL.createObjectURL(file);
        //Open the URL on new Window
         const pdfWindow = window.open();
         pdfWindow.location.href = fileURL;       
      })
      .catch(e => {
        console.log(e);
      });
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
        const data = response.data.filter(x => x["operationTypeName"].includes("????????"));
        const dataAprove = response.data.filter(x => x["isAprove"] === true);

        if(checked && checkedAprove){
          const dataAprove = data.filter(x => x["isAprove"] === true);
          setInventoryBooke(dataAprove.filter(x => x[filter].includes(searchId)));
        }else if(checked){
          setInventoryBooke(data.filter(x => x[filter].includes(searchId)));
        }else if(checkedAprove){
          setInventoryBooke(dataAprove.filter(x => x[filter].includes(searchId)));
        }else{
          setInventoryBooke(response.data.filter(x => x[filter].includes(searchId)));
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
          <div>
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
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={() => {
                setFilter("materialValueName");
                setFilterName("????????????????");
                handleClose();
                }}>????????????????</MenuItem>
              <MenuItem onClick={() => {
                setFilter("materialValuInventoryNumber");
                setFilterName("?????????????????????? ??????????");
                handleClose();
                }}>?????????????????????? ??????????</MenuItem>
              <MenuItem onClick={() => {
                setFilter("operationTypeName");
                setFilterName("?????? ????????????????");
                handleClose();
                }}>?????? ????????????????</MenuItem>
                <MenuItem onClick={() => {
                setFilter("date");
                setFilterName("???????? ??????????????");
                handleClose();
                }}>???????? ??????????????</MenuItem>
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
                <MenuItem onClick={() => {
                setFilter("nomenclatureNumber");
                setFilterName("???????????????????????????? ??????????");
                handleClose();
                }}>?????????????????????????? ??????????</MenuItem>
            </Menu>
          </div>
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
      <div className="col-md-12">
      <label>
        ???????????? ??????????????????:
      </label>
      <Switch
      checked={checked}
      onChange={handleChange}
      inputProps={{ 'aria-label': 'controlled' }}
      />
      </div>
      <div className="col-md-12">
      <label>
        ???????????? ???? ????????????????????????????:
      </label>
      <Switch
      checked={checkedAprove}
      onChange={handleChangeAprove}
      inputProps={{ 'aria-label': 'controlled' }}
      />
      </div>
      <div className="col-md-8">
        <h2>?????????????????????? ??????????</h2>
        <h4>???????????? ???????????????????????? ??????????????????</h4>
        <TableContainer sx={{ width: 850 }} component={Paper}>
          <Table  aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>????????????????</TableCell>
                <TableCell>??????????????????</TableCell>
                <TableCell>?????? ????????????????</TableCell>
                <TableCell>?????????? ??????????????????</TableCell>
                <TableCell>????????</TableCell>
                <TableCell>?????????????????????? ??????????</TableCell>
                <TableCell>???????????????????????????? ??????????</TableCell>
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
                    <TableCell>{row.categoryName}</TableCell>
                    <TableCell>{row.operationTypeName}</TableCell>
                    <TableCell>{row.roomNumber}</TableCell>
                    <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                    <TableCell>{row.materialValuInventoryNumber}</TableCell>
                    <TableCell>{row.nomenclatureNumber}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        {showMaterialPersonBoard &&
          <Link
            to={"/add-inventorybook"}
            className="m-3 btn btn-outline-secondary" >????????????????  
          </Link>
        }
        {showPurchaseDepartmentBoard && 
          <button className="m-3 btn btn-outline-secondary" onClick={pdfCreatorHandle}>
            ?????????????????????????? ???????????????????????????????????? ??????????
          </button>
          }

        {showMaterialPersonBoard && 
          <button className="m-3 btn btn-outline-secondary" onClick={pdfCreatorHandle}>
            ?????????????????????????? ???????????????????????????????????? ??????????
          </button>
          }
      </div>
      <div className="col-md-4">
        {currentInventoryBooke && currentOperationsType && currentMaterialValue && currentUser ? (
          <div>
            <h4>?????????????????????? ??????????</h4>
            <div>
              <label>
                <strong>???????????????????????? ????????????????:</strong>
              </label>{" "}
              {currentMaterialValue.name}
            </div>
            <div>
              <label>
                <strong>?????? ????????????????:</strong>
              </label>{" "}
              {currentOperationsType.name}
            </div>
            <div>
              <label>
                <strong>??????????????????:</strong>
              </label>{" "}
              {currentInventoryBooke.roomNumber}
            </div>
            <div>
              <label>
                <strong>??????????????????????:</strong>
              </label>{" "}
              {currentInventoryBooke.comment}
            </div>
            <div>
              <label>
                <strong>????????:</strong>
              </label>{" "}
              {new Date(currentInventoryBooke.date).toLocaleString()}
            </div>
            <div>
              <label>
                <strong>??????????????????:</strong>
              </label>{" "}
              {currentUser.name} {currentUser.surname} {currentUser.lastName} 
            </div>
            <div>
              <label>
                <strong>???????????? ??????????????????:</strong>
              </label>{" "}
              {isAllAprove.isAprove === true ? "????????????????" : "???? ??????????????????" }
            </div>
            {showMaterialPersonBoard && (
            <div>
            {currentInventoryBooke.operationTypeName !== "????????????????" && isAllAprove.isAprove &&
              <Link
              to={"/inventorybook/" + currentInventoryBooke.id}
              className="m-3 btn btn-outline-secondary"
            >
              ??????????????????????????
            </Link> 
            }
             {isAllAprove.isAprove == false && currentInventoryBooke.operationTypeName === "????????????????" &&
              <Link
              to={"/inventorybook/" + currentInventoryBooke.id}
              className="m-3 btn btn-outline-secondary"
            >
              ??????????????????????????
            </Link> 
            }
              {isAllAprove.isAprove == true && currentInventoryBooke.operationTypeName === "????????????????" &&
               (<button className="m-3 btn btn-outline-secondary" onClick={deleteInventoryBooke}>
                ??????????????
              </button>)}
              {isAllAprove.isAprove == false && currentInventoryBooke.operationTypeName === "????????" &&
               (<button className="m-3 btn btn-outline-secondary" onClick={deleteInventoryBooke}>
                ??????????????
              </button>)}
            </div>)}
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

export default InventoryBookeList;