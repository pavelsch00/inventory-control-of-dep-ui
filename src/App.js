import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/authService/auth.service";
import Login from "./components/authorization/login";
import Register from "./components/authorization/register";
import Password from "./components/authorization/password";
import Home from "./components/home/home";
import Profile from "./components/authorization/profile";
import BoardModerator from "./components/home/board-moderator";
import BoardAdmin from "./components/home/board-admin";

import DepartmentList from "./components/department/DepartmentList";
import Department from "./components/department/Department";
import AddDepartment from "./components/department/AddDepartment";

import FacultyList from "./components/faculty/FacultyList";
import Faculty from "./components/faculty/Faculty";
import AddFaculty from "./components/faculty/AddFaculty";

import PositionList from "./components/position/PositionList";
import Position from "./components/position/Position";
import AddPosition from "./components/position/AddPosition";

import CategoryList from "./components/category/CategoryList";
import Category from "./components/category/Category";
import AddCategory from "./components/category/AddCategory";

import OperationsTypeList from "./components/operationsType/OperationsTypeList";
import OperationsType from "./components/operationsType/OperationsType";
import AddOperationsType from "./components/operationsType/AddOperationsType";

import RoomList from "./components/room/RoomList";
import Room from "./components/room/Room";
import AddRoom from "./components/room/AddRoom";

import MaterialValueList from "./components/materialvalue/MaterialValueList";
import MaterialValue from "./components/materialvalue/MaterialValue";
import AddMaterialValue from "./components/materialvalue/AddMaterialValue";

import InventoryBookList from "./components/inventorybook/InventoryBookList";
import InventoryBook from "./components/inventorybook/InventoryBook";
import AddInventoryBook from "./components/inventorybook/AddInventoryBook";

import AprovalList from "./components/aproval/AprovalList";

const App = () => {
  const [showMaterialPersonBoard, setMaterialPersonBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [showDepHeadBoard, setDepHeadBoard] = useState(false);
  const [showPurchaseDepartmentBoard, setPurchaseDepartmentBoard] = useState(false);
  
  const [currentUser, setCurrentUser] = useState(undefined);
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setMaterialPersonBoard(user.roles.includes("MaterialPerson"));
      setShowAdminBoard(user.roles.includes("Admin"));
      setPurchaseDepartmentBoard(user.roles.includes("PurchaseDepartment"));
      setDepHeadBoard(user.roles.includes("DepHead"));
    }
  }, []);
  const logOut = () => {
    AuthService.logout();
  };
  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <Link to={"/"} className="navbar-brand">
          Учет
        </Link>
        <div className="navbar-nav mr-auto">
        {showDepHeadBoard && (
               <div className="navbar-nav ml-auto">
               <li className="nav-item">
                 <Link to={"/inventorybook"} className="nav-link">
                   Инвентарная книга
                 </Link>
               </li>
               <li className="nav-item">
                 <Link to={"/aproval"} className="nav-link">
                   Запрос на подтверждние
                 </Link>
               </li>
             </div>
          )}
        {showPurchaseDepartmentBoard && (
               <div className="navbar-nav ml-auto">
               <li className="nav-item">
                 <Link to={"/inventorybook"} className="nav-link">
                   Инвентарная книга
                 </Link>
               </li>
               <li className="nav-item">
                 <Link to={"/aproval"} className="nav-link">
                   Запрос на подтверждние
                 </Link>
               </li>
             </div>
          )}
          {showMaterialPersonBoard && (
               <div className="navbar-nav ml-auto">
               <li className="nav-item">
                 <Link to={"/materialvalue"} className="nav-link">
                   Материальная ценность
                 </Link>
               </li>
               <li className="nav-item">
                 <Link to={"/inventorybook"} className="nav-link">
                   Инвентарная книга
                 </Link>
               </li>
               <li className="nav-item">
                 <Link to={"/aproval"} className="nav-link">
                   Запрос на подтверждние
                 </Link>
               </li>
             </div>
          )}
          {showAdminBoard && (
               <div className="navbar-nav ml-auto">
               <li className="nav-item">
                 <Link to={"/department"} className="nav-link">
                   Специальность
                 </Link>
               </li>
               <li className="nav-item">
                 <Link to={"/faculty"} className="nav-link">
                   Факультет
                 </Link>
               </li>
               <li className="nav-item">
                 <Link to={"/position"} className="nav-link">
                   Должность
                 </Link>
               </li>
               <li className="nav-item">
                 <Link to={"/category"} className="nav-link">
                   Категория
                 </Link>
               </li>
               <li className="nav-item">
                 <Link to={"/operationsType"} className="nav-link">
                   Тип операции
                 </Link>
               </li>
               <li className="nav-item">
                 <Link to={"/room"} className="nav-link">
                   Аудитория
                 </Link>
               </li>
             </div>
          )}
          {currentUser && (
            <li className="nav-item">
              <Link to={"/profile"} className="nav-link">
                Профиль
              </Link>
            </li>
          )}
        </div>
        {currentUser ? (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/profile"} className="nav-link">
                {currentUser.username}
              </Link>
            </li>
            <li className="nav-item">
              <a href="/login" className="nav-link logout" onClick={logOut}>
                Выход
              </a>
            </li>
          </div>
        ) : (
          <div className="navbar-nav ml-auto">

          </div>
        )}
      </nav>
      <div className="container mt-3">
      <Routes>
        <Route exact path="/home" element={<Home/>} />
        <Route exact path="/login" element={<Login/>} />
        <Route exact path="/register" element={<Register/>} />
        <Route exact path="/profile" element={<Profile/>} />
        <Route exact path="/change-password/:email" element={<Password/>} />
        <Route path="/mod" element={<BoardModerator/>} />
        <Route path="/admin" element={<BoardAdmin/>} />

        <Route path="/department" element={<DepartmentList/>} />
        <Route path="/add-department" element={<AddDepartment/>} />
        <Route path="/department/:id" element={<Department/>} />

        <Route path="/faculty" element={<FacultyList/>} />
        <Route path="/add-faculty" element={<AddFaculty/>} />
        <Route path="/faculty/:id" element={<Faculty/>} />

        <Route path="/position" element={<PositionList/>} />
        <Route path="/add-position" element={<AddPosition/>} />
        <Route path="/position/:id" element={<Position/>} />

        <Route path="/category" element={<CategoryList/>} />
        <Route path="/add-category" element={<AddCategory/>} />
        <Route path="/category/:id" element={<Category/>} />

        <Route path="/operationsType" element={<OperationsTypeList/>} />
        <Route path="/add-operationsType" element={<AddOperationsType/>} />
        <Route path="/operationsType/:id" element={<OperationsType/>} />

        <Route path="/room" element={<RoomList/>} />
        <Route path="/add-room" element={<AddRoom/>} />
        <Route path="/room/:id" element={<Room/>} />

        <Route path="/materialvalue" element={<MaterialValueList/>} />
        <Route path="/add-materialvalue" element={<AddMaterialValue/>} />
        <Route path="/materialvalue/:id" element={<MaterialValue/>} />

        <Route path="/inventorybook" element={<InventoryBookList/>} />
        <Route path="/add-inventorybook" element={<AddInventoryBook/>} />
        <Route path="/inventorybook/:id" element={<InventoryBook/>} />

        <Route path="/aproval" element={<AprovalList/>} />
      </Routes>
      </div>
    </div>
  );
};
export default App;