import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import MaterialValueDataService from "../../services/dataService/api-materialvalue-service";

const MaterialValue = props => {
  const { id }= useParams();
  let navigate = useNavigate();
  const initialMaterialValueState = {
    id: id,
    name: "",
    number: ""
  };
  const [currentMaterialValue, setCurrentMaterialValue] = useState(initialMaterialValueState);
  const [message, setMessage] = useState("");
  const getMaterialValue = id => {
    MaterialValueDataService.get(id)
      .then(response => {
        setCurrentMaterialValue(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };
  useEffect(() => {
    if (id)
      getMaterialValue(id);
  }, [id]);
  const handleInputChange = event => {
    const { name, value } = event.target;
    setCurrentMaterialValue({ ...currentMaterialValue, [name]: value });
  };
  const updateMaterialValue = () => {
    setMessage("Пожалуйста подождите");
    MaterialValueDataService.update(currentMaterialValue.id, currentMaterialValue)
      .then(response => {
        console.log(response.data);
        setMessage("Обновление прошло успешно");
      })
      .catch(e => {
        console.log(e);
      });
  };
  const goBack = () => {
    navigate("/materialvalue");
  };
  return (
    <div>
      {currentMaterialValue ? (
        <div className="edit-form">
          <h4>Аудитория</h4>
          <form>
            <div className="form-group">
              <label htmlFor="name">Название</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={currentMaterialValue.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="number">Номер</label>
              <input
                type="text"
                className="form-control"
                id="number"
                name="number"
                value={currentMaterialValue.number}
                onChange={handleInputChange}
              />
            </div>
          </form>
          <button className="m-3 btn btn-outline-secondary" onClick={goBack}>
            Назад
          </button>
          <button
            type="submit"
            className="m-3 btn btn-outline-secondary"
            onClick={updateMaterialValue}
          >
            Обновить
          </button>
          <p>{message}</p>
        </div>
      ) : (
        <div>
          <br />
          <p>Выбирите материальную ценность...</p>
        </div>
      )}
    </div>
  );
};
export default MaterialValue;