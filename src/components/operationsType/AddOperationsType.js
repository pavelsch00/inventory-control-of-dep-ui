import React, { useState, useRef } from "react";
import OperationsTypeDataService from "../../services/dataService/api-operationstype-service";
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

const AddOperationsType = () => {
  let navigate = useNavigate();
        
  const form = useRef();
  const checkBtn = useRef();

  const initialOperationsTypeState = {
    id: null,
    name: ""
  };
  const [OperationsType, setOperationsType] = useState(initialOperationsTypeState);
  const [message, setMessage] = useState("");
  const handleInputChange = event => {
    const { name, value } = event.target;
    setOperationsType({ ...OperationsType, [name]: value });
  };
  const saveOperationsType = () => {
    form.current.validateAll();
    if (checkBtn.current.context._errors.length === 0) {
    setMessage("Пожалуйста подождите");
    var data = {
      name: OperationsType.name
    };
    OperationsTypeDataService.create(data)
      .then(response => {
        setMessage("Создание прошло успешно");
      })
      .catch(e => {
        console.log(e);
      });
    }
  };
  const goBack = () => {
    navigate("/operationsType");
  };
  return (
    <div className="submit-form">
      <h4>Тип операции</h4>
      <div>
      <Form ref={form}>
        <div className="form-group">
          <label htmlFor="name">Название</label>
          <Input
            type="text"
            className="form-control"
            id="name"
            required
            value={OperationsType.name}
            onChange={handleInputChange}
            name="name"
            validations={[required]}
          />
        </div>
        <CheckButton style={{ display: "none" }} ref={checkBtn} />
        </Form>
        <button className="m-3 btn btn-outline-secondary" onClick={goBack}>
          Назад
        </button>
        <button onClick={saveOperationsType} className="m-3 btn btn-outline-secondary">
          Добавить
        </button>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default AddOperationsType;