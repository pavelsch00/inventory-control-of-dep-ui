import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import OperationsTypeDataService from "../../services/dataService/api-operationstype-service";

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

const OperationsType = props => {
  const { id }= useParams();
  let navigate = useNavigate();
          
  const form = useRef();
  const checkBtn = useRef();

  const initialOperationsTypeState = {
    id: id,
    name: ""
  };
  const [currentOperationsType, setCurrentOperationsType] = useState(initialOperationsTypeState);
  const [message, setMessage] = useState("");
  const getOperationsType = id => {
    OperationsTypeDataService.get(id)
      .then(response => {
        setCurrentOperationsType(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };
  useEffect(() => {
    if (id)
      getOperationsType(id);
  }, [id]);
  const handleInputChange = event => {
    const { name, value } = event.target;
    setCurrentOperationsType({ ...currentOperationsType, [name]: value });
  };
  const updateOperationsType = () => {
    form.current.validateAll();
    if (checkBtn.current.context._errors.length === 0) {
    setMessage("Пожалуйста подождите");
    OperationsTypeDataService.update(currentOperationsType.id, currentOperationsType)
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
    navigate("/operationsType");
  };
  return (
    <div>
      {currentOperationsType ? (
        <div className="edit-form">
          <h4>Тип операции</h4>
          <Form ref={form}>
            <div className="form-group">
              <label htmlFor="name">Название</label>
              <Input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={currentOperationsType.name}
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
            onClick={updateOperationsType}
          >
            Обновить
          </button>
          <p>{message}</p>
        </div>
      ) : (
        <div>
          <br />
          <p>Выберите тип операции...</p>
        </div>
      )}
    </div>
  );
};
export default OperationsType;