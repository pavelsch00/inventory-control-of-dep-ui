import React, { useState, useRef } from "react";
import DepartmentDataService from "../../services/dataService/api-department-service";
import { useNavigate } from 'react-router-dom';

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

const AddDepartment = () => {
  let navigate = useNavigate();
  const form = useRef();
  const checkBtn = useRef();
  const initialDepartmentState = {
    id: null,
    name: ""
  };
  const [Department, setDepartment] = useState(initialDepartmentState);
  const [message, setMessage] = useState("");
  const handleInputChange = event => {
    const { name, value } = event.target;
    setDepartment({ ...Department, [name]: value });
  };
  const saveDepartment = () => {
    form.current.validateAll();
    if (checkBtn.current.context._errors.length === 0) {
    setMessage("Пожалуйста подождите");
    var data = {
      name: Department.name
    };
    DepartmentDataService.create(data)
      .then(response => {
        setMessage("Создание прошло успешно");
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
    <div className="submit-form">
      <h4>Специальность</h4>
      <div>
        <div className="form-group">
        <Form ref={form}>
          <label htmlFor="name">Название</label>
          <Input
            type="text"
            className="form-control"
            id="name"
            required
            value={Department.name}
            onChange={handleInputChange}
            name="name"
            validations={[required]}
          />
          <CheckButton style={{ display: "none" }} ref={checkBtn} />
          </Form>
        </div>
        <button className="m-3 btn btn-outline-secondary" onClick={goBack}>
          Назад
        </button>
        <button onClick={saveDepartment} className="m-3 btn btn-outline-secondary">
          Добавить
        </button>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default AddDepartment;