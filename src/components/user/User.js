import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import UserDataService from "../../services/dataService/api-user-service";
import DepartmentDataService from "../../services/dataService/api-department-service";
import FacultyDataService from "../../services/dataService/api-faculty-service";
import PositionDataService from "../../services/dataService/api-position-service";

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

const User = props => {
  const { id }= useParams();
  let navigate = useNavigate();
  const form = useRef();
  const checkBtn = useRef();

  const initialUserState = {
    facultyId: 0,
    name: "",
    description: "",
    departmentId: 0
  };
  const [currentUser, setCurrentUser] = useState(initialUserState);
  const [message, setMessage] = useState("");

  const [departmentList, setDepartmentList] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const [facultyList, setFacultyList] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  const [positionList, setPositionList] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);

  const getUser = id => {
    UserDataService.get(id)
      .then(response => {
        setCurrentUser(response.data);
        getDepartmentById(response.data.departmentId);
        getDepartmentList();
        getFacultyById(response.data.facultyId);
        getFacultyList();
        getPositionById(response.data.positionId);
        getPositionList();
      })
      .catch(e => {
        console.log(e);
      });
  };
  useEffect(() => {
    if (id)
      getUser(id);
  }, [id]);
  
  const handleInputChange = event => {
    const { name, value } = event.target;

    setCurrentUser({ ...currentUser, [name]: value });
  };

  const setDepartment = id => {
    setSelectedDepartment(departmentList.find(x => x.id === parseInt(id)));

    currentUser.departmentId = parseInt(selectedDepartment.id);
  };
  const getDepartmentById = id  => {
    DepartmentDataService.get(id)
      .then(response => {
        setSelectedDepartment(response.data);
      })
      .catch(e => {
        console.log(e);
      });
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

  const setFaculty = id => {
    setSelectedFaculty(facultyList.find(x => x.id === parseInt(id)));
  };
  const getFacultyById = id  => {
    FacultyDataService.get(id)
      .then(response => {
        setSelectedFaculty(response.data);
      })
      .catch(e => {
        console.log(e);
      });
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

  const setPosition = id => {
    setSelectedPosition(positionList.find(x => x.id === parseInt(id)));
  };
  const getPositionById = id  => {
    PositionDataService.get(id)
      .then(response => {
        setSelectedPosition(response.data);
      })
      .catch(e => {
        console.log(e);
      });
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

  const updateUser = () => {
    form.current.validateAll();
    if (checkBtn.current.context._errors.length === 0) {
    setMessage("Пожалуйста подождите");
    var data = {
      facultyId: selectedFaculty.id,
      positionId: selectedPosition.id,
      departmentId: selectedDepartment.id,
      name: currentUser.name,
      lastName: currentUser.lastName,
      surname: currentUser.surname
    };

    var role = {
        roles: []
    };

    if(selectedPosition.name === "Заведующий кафедрой"){
        role.roles.push("DepHead");
    }else if(selectedPosition.name === "Администратор"){
        role.roles.push("Admin");
    }else if(selectedPosition.name === "Сотрудник отдела снабжения"){
        role.roles.push("PurchaseDepartment");
    }else if(selectedPosition.name === "Материально ответственное лицо"){
        role.roles.push("MaterialPerson");
    }

    var currentRole = {
        roles: currentUser.roles
    };

    UserDataService.update(currentUser.email, data)
      .then(response => {
        setMessage("Обновление прошло успешно");
      })
      .catch(e => {
        console.log(e);
      });
    };
    console.log("удаление:" + currentRole);
    console.log("добавление:" + role);
    console.log(selectedPosition);
    UserDataService.deleterole(currentUser.email, currentUser.roles);
    UserDataService.addrole(currentUser.email, role);
  };
  const goBack = () => {
    navigate("/user");
  };
  return (
    <div>
      {currentUser && selectedDepartment && selectedFaculty ? (
        <div className="edit-form">
          <h4>Пользователь</h4>
          <Form ref={form} onSubmit={updateUser}>
          <div className="form-group">
              <label htmlFor="name">Имя</label>
              <Input
                type="text"
                className="form-control"
                name="name"
                value={currentUser.name}
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
                value={currentUser.lastName}
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
                value={currentUser.surname}
                onChange={handleInputChange}
                validations={[required]}
              />
            </div>
            <div className="form-group">
              <label htmlFor="facultyId">Факультет</label>
              <Dropdown onSelect={(e) => setFaculty(e) }  >
                <Dropdown.Toggle variant="secondary" id="dropdown-basic" className="form-control">
                {selectedFaculty?.name}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {facultyList &&
                    facultyList.map((faculty) => (
                      <Dropdown.Item value={faculty.id} eventKey={faculty.id} >{faculty.name}</Dropdown.Item>
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
          <CheckButton style={{ display: "none" }} ref={checkBtn} />
          </Form>
          <button className="m-3 btn btn-outline-secondary" onClick={goBack}>
            Назад
          </button>
          <button
            type="submit"
            className="m-3 btn btn-outline-secondary"
            onClick={updateUser}
          >
            Обновить
          </button>
          
          <p>{message}</p>
        </div>
      ) : (
        <div>
          <br />
          <p>Выбирите пользователя...</p>
        </div>
      )}
    </div>
  );
};
export default User;