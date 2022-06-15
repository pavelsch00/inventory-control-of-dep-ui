import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import PositionDataService from "../../services/dataService/api-position-service";

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

const Position = props => {
  const { id }= useParams();
  let navigate = useNavigate();
  
  const form = useRef();
  const checkBtn = useRef();

  const initialPositionState = {
    id: id,
    name: ""
  };
  const [currentPosition, setCurrentPosition] = useState(initialPositionState);
  const [message, setMessage] = useState("");
  const getPosition = id => {
    PositionDataService.get(id)
      .then(response => {
        setCurrentPosition(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };
  useEffect(() => {
    if (id)
      getPosition(id);
  }, [id]);
  const handleInputChange = event => {
    const { name, value } = event.target;
    setCurrentPosition({ ...currentPosition, [name]: value });
  };
  const updatePosition = () => {
    form.current.validateAll();
    if (checkBtn.current.context._errors.length === 0) {
    setMessage("Пожалуйста подождите");
    PositionDataService.update(currentPosition.id, currentPosition)
      .then(response => {
        console.log(response.data);
        setMessage("Обновление прошло успешно");
      })
      .catch(e => {
        console.log(e);
      });
    };
  };
  const goBack = () => {
    navigate("/position");
  };
  return (
    <div>
      {currentPosition ? (
        <div className="edit-form">
          <h4>Должность</h4>
          <Form ref={form}>
            <div className="form-group">
              <label htmlFor="name">Название</label>
              <Input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={currentPosition.name}
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
            onClick={updatePosition}
          >
            Обновить
          </button>
          <p>{message}</p>
        </div>
      ) : (
        <div>
          <br />
          <p>Выберите должность...</p>
        </div>
      )}
    </div>
  );
};
export default Position;