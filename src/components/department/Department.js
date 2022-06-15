import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import DepartmentDataService from "../../services/dataService/api-department-service";

import Input from "react-validation/build/input";
import Form from "react-validation/build/form";
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

const Department = props => {
  const { id }= useParams();
  let navigate = useNavigate();

  const form = useRef();
  const checkBtn = useRef();

  const initialDepartmentState = {
    id: id,
    name: ""
  };
  const [currentDepartment, setCurrentDepartment] = useState(initialDepartmentState);
  const [message, setMessage] = useState("");
  const getDepartment = id => {
    DepartmentDataService.get(id)
      .then(response => {
        setCurrentDepartment(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };
  useEffect(() => {
    if (id)
      getDepartment(id);
  }, [id]);
  const handleInputChange = event => {
    const { name, value } = event.target;
    setCurrentDepartment({ ...currentDepartment, [name]: value });
  };
  const updateDepartment = () => {
    form.current.validateAll();
    if (checkBtn.current.context._errors.length === 0) {
    setMessage("Пожалуйста подождите");
    DepartmentDataService.update(currentDepartment.id, currentDepartment)
      .then(response => {
        console.log(response.data);
        setMessage("Обновление прошло успешно");
      })
      .catch(e => {
        console.log(e);
      });
    }
  };
  const goBack = () => {
    navigate("/department");
  };
  return (
    <div>
      {currentDepartment ? (
        <div className="edit-form">
          <h4>Специальность</h4>
          <Form ref={form}>
            <div className="form-group">
              <label htmlFor="name">Название</label>
              <Input
                type="text"
                className="form-control"
                id="name"
                name="name"
                required
                value={currentDepartment.name}
                onChange={handleInputChange}
                validations={[required]}
              />
            </div>
            <CheckButton style={{ display: "none" }} ref={checkBtn} />
          </Form>
          <button className="m-3 btn btn-outline-secondary" onClick={goBack}>
            Назад
          </button>
          <button
            type="submit"
            className="m-3 btn btn-outline-secondary"
            onClick={updateDepartment}
          >
            Обновить
          </button>
          <p>{message}</p>
        </div>
      ) : (
        <div>
          <br />
          <p>Выберите кафедру...</p>
        </div>
      )}
    </div>
  );
};
export default Department;