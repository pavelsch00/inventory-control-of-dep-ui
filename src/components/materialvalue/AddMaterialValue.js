import React, { useState } from "react";
import MaterialValueDataService from "../../services/dataService/api-materialvalue-service";
import { useNavigate } from 'react-router-dom';

const AddMaterialValue = () => {
  let navigate = useNavigate();
  const initialMaterialValueState = {
    id: null,
    name: "",
    number: ""
  };
  const [MaterialValue, setMaterialValue] = useState(initialMaterialValueState);
  const [message, setMessage] = useState("");
  const handleInputChange = event => {
    const { name, value } = event.target;
    setMaterialValue({ ...MaterialValue, [name]: value });
  };
  const saveMaterialValue = () => {
    var data = {
      name: MaterialValue.name,
      number: MaterialValue.number
    };
    MaterialValueDataService.create(data)
      .then(response => {
        setMaterialValue({
          id: response.data.id,
          name: response.data.name,
          number: response.data.number,
        });
        console.log(response.data);
        setMessage("Создание прошло успешно");
      })
      .catch(e => {
        console.log(e);
      });
  };
  const goBack = () => {
    navigate("/materialvalue");
  };
  return (
    <div className="submit-form">
      <h4>Материальная ценность</h4>
      <div>
        <div className="form-group">
          <label htmlFor="name">Название</label>
          <input
            type="text"
            className="form-control"
            id="name"
            required
            value={MaterialValue.name}
            onChange={handleInputChange}
            name="name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="number">Номер</label>
          <input
            type="text"
            className="form-control"
            id="number"
            required
            value={MaterialValue.number}
            onChange={handleInputChange}
            name="number"
          />
        </div>
        <button className="m-3 btn btn-outline-secondary" onClick={goBack}>
          Назад
        </button>
        <button onClick={saveMaterialValue} className="m-3 btn btn-outline-secondary">
          Добавить
        </button>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default AddMaterialValue;