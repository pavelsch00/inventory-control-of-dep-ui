import React, { useState } from "react";
import OperationsTypeDataService from "../../services/dataService/api-operationstype-service";
import { useNavigate } from 'react-router-dom';

const AddOperationsType = () => {
  let navigate = useNavigate();
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
    var data = {
      name: OperationsType.name
    };
    OperationsTypeDataService.create(data)
      .then(response => {
        setOperationsType({
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
    navigate("/operationsType");
  };
  return (
    <div className="submit-form">
      <h4>Тип операции</h4>
      <div>
        <div className="form-group">
          <label htmlFor="name">Название</label>
          <input
            type="text"
            className="form-control"
            id="name"
            required
            value={OperationsType.name}
            onChange={handleInputChange}
            name="name"
          />
        </div>
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