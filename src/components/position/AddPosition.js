import React, { useState } from "react";
import PositionDataService from "../../services/dataService/api-position-service";
import { useNavigate } from 'react-router-dom';

const AddPosition = () => {
  let navigate = useNavigate();
  const initialPositionState = {
    id: null,
    name: ""
  };
  const [Position, setPosition] = useState(initialPositionState);
  const [message, setMessage] = useState("");
  const handleInputChange = event => {
    const { name, value } = event.target;
    setPosition({ ...Position, [name]: value });
  };
  const savePosition = () => {
    var data = {
      name: Position.name
    };
    PositionDataService.create(data)
      .then(response => {
        setPosition({
          id: response.data.id,
          name: response.data.name,
        });
        console.log(response.data);
        setMessage("Создание прошло успешно");
      })
      .catch(e => {
        console.log(e);
      });
  };
  const goBack = () => {
    navigate("/position");
  };
  return (
    <div className="submit-form">
      <h4>Должность</h4>
      <div>
        <div className="form-group">
          <label htmlFor="name">Название</label>
          <input
            type="text"
            className="form-control"
            id="name"
            required
            value={Position.name}
            onChange={handleInputChange}
            name="name"
          />
        </div>
        <button className="m-3 btn btn-outline-secondary" onClick={goBack}>
          Назад
        </button>
        <button onClick={savePosition} className="m-3 btn btn-outline-secondary">
          Добавить
        </button>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default AddPosition;