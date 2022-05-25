import React, { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import AuthService from "./services/authService/auth.service";
import Login from "./components/authorization/login.component";
import Register from "./components/authorization/register.component";
import Home from "./components/home/home.component";
import Profile from "./components/authorization/profile.component";
import BoardModerator from "./components/home/board-moderator.component";
import BoardAdmin from "./components/home/board-admin.component";

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

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);
    this.state = {
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    };
  }
  componentDidMount() {
    const user = AuthService.getCurrentUser();
    if (user) {
      this.setState({
        currentUser: user,
        showModeratorBoard: user.roles.includes("MaterialPerson"),
        showAdminBoard: user.roles.includes("Admin"),
      });
    }
  }
  logOut() {
    AuthService.logout();
  }
  render() {
    const { currentUser, showModeratorBoard, showAdminBoard } = this.state;
    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/"} className="navbar-brand">
            Учет
          </Link>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/home"} className="nav-link">
                Home
              </Link>
            </li>
            {showModeratorBoard && (
              <li className="nav-item">
                <Link to={"/mod"} className="nav-link">
                  Moderator Board
                </Link>
              </li>
            )}
            {showAdminBoard && (
               <div className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to={"/admin"} className="nav-link">
                    Admin Board
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to={"/department"} className="nav-link">
                    Department
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to={"/faculty"} className="nav-link">
                    Faculty
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to={"/position"} className="nav-link">
                    Position
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to={"/category"} className="nav-link">
                    Сategory
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to={"/operationsType"} className="nav-link">
                    Operations Type
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to={"/room"} className="nav-link">
                    Room
                  </Link>
                </li>
              </div>
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
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          )}
        </nav>
        <div className="container mt-3">
          <Routes>
            <Route exact path="/home" element={<Home/>} />
            <Route exact path="/login" element={<Login/>} />
            <Route exact path="/register" element={<Register/>} />
            <Route exact path="/profile" element={<Profile/>} />
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
          </Routes>
        </div>
      </div>
    );
  }
}

export default App;