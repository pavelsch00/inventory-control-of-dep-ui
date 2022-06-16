import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';

import FacultyDataService from "../../services/dataService/api-faculty-service";
import PositionDataService from "../../services/dataService/api-position-service";
import DepartmentDataService from "../../services/dataService/api-department-service";
import AuthService from "../../services/dataService/api-auth-service";

import Dropdown from 'react-bootstrap/Dropdown'
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        Поле обязательно для заполнения!
      </div>
    );
  }
};

const AddUser = () => {
  let navigate = useNavigate();
  const form = useRef();
  const checkBtn = useRef();

  const initialUserState = {
    id: 0,
    name: "",
    lastName: "",
    surname: "",
    password: "",
    email: "",
    positionId: 0,
    departmentId: 0,
    facultyId: 0,
  };
  const [User, setUser] = useState(initialUserState);

  const [facultyList, setFacultyList] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  const [positionList, setPositionList] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);

  const [departmentList, setDepartmentList] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const [message, setMessage] = useState("");

  useEffect(() => {
    getFacultyList();
    getPositionList();
    getDepartmentList();

    if(positionList.length !== 0 && facultyList.length !== 0 && departmentList.length !== 0 ) {
      setPosition(positionList[0].id);
      setFaculty(facultyList[0].id);
      setDepartment(departmentList[0].id);
    }

  }, [positionList.length, facultyList.length, departmentList.length ]);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setUser({ ...User, [name]: value });
  };
  const setPosition = id => {
    setSelectedPosition(positionList.find(x => x.id === parseInt(id)));
  };
  const getPositionList = ()  => {
    PositionDataService.getAll()
      .then(response => {
        setPositionList(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const setFaculty = id => {
    setSelectedFaculty(facultyList.find(x => x.id === parseInt(id)));
  };

  const getFacultyList = ()  => {
    FacultyDataService.getAll()
      .then(response => {
        setFacultyList(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const setDepartment = id => {
    setSelectedDepartment(departmentList.find(x => x.id === parseInt(id)));
  };

  const getDepartmentList = ()  => {
    DepartmentDataService.getAll()
      .then(response => {
        setDepartmentList(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const saveUser = () => {
    form.current.validateAll();
    if (checkBtn.current.context._errors.length === 0) {
    setMessage("Пожалуйста подождите");

    var role = []

    if(selectedPosition.name === "Заведующий кафедрой"){
        role.push("DepHead");
    }else if(selectedPosition.name === "Администратор"){
        role.push("Admin");
    }else if(selectedPosition.name === "Сотрудник отдела снабжения"){
        role.push("PurchaseDepartment");
    }else if(selectedPosition.name === "Материально ответственное лицо"){
        role.push("MaterialPerson");
    }

    const data = {
      firstname: User.name,
      lastName: User.lastName,
      surname: User.surname,
      password: User.password,
      passwordConfirm: User.password,
      email: User.email,
      departmentId: selectedDepartment.id,
      positionId: selectedPosition.id,
      facultyId: selectedFaculty.id,
      roles: role
    };
    console.log(data);
    AuthService.create(data)
      .then(response => {
        console.log(response.data);
        setMessage("Создание прошло успешно");
      })
      .catch(e => {
        console.log(e);
      });
  }};
  const goBack = () => {
    navigate("/user");
  };
  return (
    <div>
      { selectedPosition && selectedFaculty && selectedDepartment ? (
        <div className="edit-form">
          <h4>Пользователь</h4>
          <Form ref={form} onSubmit={saveUser}>
          <div className="form-group">
              <label htmlFor="name">Имя</label>
              <Input
                type="text"
                className="form-control"
                name="name"
                value={User.name}
                onChange={handleInputChange}
                validations={[required]}
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Отчество</label>
              <Input
                type="text"
                className="form-control"
                name="lastName"
                value={User.lastName}
                onChange={handleInputChange}
                validations={[required]}
              />
            </div>
            <div className="form-group">
              <label htmlFor="surname">Фамилия</label>
              <Input
                type="text"
                className="form-control"
                name="surname"
                value={User.surname}
                onChange={handleInputChange}
                validations={[required]}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Электронная почта</label>
              <Input
                type="text"
                className="form-control"
                name="email"
                value={User.email}
                onChange={handleInputChange}
                validations={[required]}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Пароль</label>
              <Input
                type="password"
                className="form-control"
                name="password"
                value={User.password}
                onChange={handleInputChange}
                validations={[required]}
              />
            </div>
            <div className="form-group">
              <label htmlFor="positionId">Должность</label>
              <Dropdown onSelect={(e) => setPosition(e) }  >
                <Dropdown.Toggle variant="secondary" id="dropdown-basic" className="form-control">
                {selectedPosition?.name}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {positionList &&
                    positionList.map((position) => (
                      <Dropdown.Item value={position.id} eventKey={position.id} >{position.name}</Dropdown.Item>
                    ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="form-group">
              <label htmlFor="facultyId">Факультет</label>
              <Dropdown onSelect={(e) => setFaculty(e)} >
                <Dropdown.Toggle variant="secondary" id="dropdown-basic" className="form-control">
                {selectedFaculty?.name}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {facultyList &&
                    facultyList.map((faculty, index) => (
                      <Dropdown.Item eventKey={faculty.id} >{faculty.name}</Dropdown.Item>
                    ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="form-group">
              <label htmlFor="departmentId">Специальность</label>
              <Dropdown onSelect={(e) => setDepartment(e)} >
                <Dropdown.Toggle variant="secondary" id="dropdown-basic" className="form-control">
                {selectedDepartment?.name}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {departmentList &&
                    departmentList.map((department, index) => (
                      <Dropdown.Item eventKey={department.id} >{department.name}</Dropdown.Item>
                    ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          <CheckButton style={{ display: "none" }} ref={checkBtn} />
          </Form>
          <button className="m-3 btn btn-outline-secondary" onClick={goBack}>
            Назад
          </button>
          <button
            type="submit"
            className="m-3 btn btn-outline-secondary"
            onClick={saveUser}
          >
            Создать
          </button>
          
          <p>{message}</p>
        </div>
      ) : (
        <div>
          <br />
          <p>Выберите материальную ценность...</p>
        </div>
      )}
    </div>
  );
};

export default AddUser;