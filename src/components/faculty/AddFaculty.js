import React, { useState, useRef } from "react";
import FacultyDataService from "../../services/dataService/api-faculty-service";
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


const AddFaculty = () => {
  let navigate = useNavigate();
  const form = useRef();
  const checkBtn = useRef();

  const initialFacultyState = {
    id: null,
    name: ""
  };
  const [Faculty, setFaculty] = useState(initialFacultyState);
  const [message, setMessage] = useState("");
  const handleInputChange = event => {
    const { name, value } = event.target;
    setFaculty({ ...Faculty, [name]: value });
  };
  const saveFaculty = () => {
    form.current.validateAll();
    if (checkBtn.current.context._errors.length === 0) {
    setMessage("Пожалуйста подождите");
    var data = {
      name: Faculty.name
    };
    FacultyDataService.create(data)
      .then(response => {
        setMessage("Создание прошло успешно");
      })
      .catch(e => {
        console.log(e);
      });
    };
  };
  const goBack = () => {
    navigate("/faculty");
  };
  return (
    <div className="submit-form">
      <h4>Факультет</h4>
      <div>
      <Form ref={form} onSubmit={saveFaculty}>
        <div className="form-group">
          <label htmlFor="name">Название</label>
          <Input
            type="text"
            className="form-control"
            id="name"
            value={Faculty.name}
            onChange={handleInputChange}
            name="name"
            validations={[required]}
          />
          <CheckButton style={{ display: "none" }} ref={checkBtn} />
        </div>
        </Form>
        <button className="m-3 btn btn-outline-secondary" onClick={goBack}>
          Назад
        </button>
        <button onClick={saveFaculty} className="m-3 btn btn-outline-secondary">
          Добавить
        </button>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default AddFaculty;