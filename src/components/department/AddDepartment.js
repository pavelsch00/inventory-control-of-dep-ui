import React, { useState } from "react";
import DepartmentDataService from "../../services/dataService/api-department-service";
import { useNavigate } from 'react-router-dom';

const AddDepartment = () => {
  let navigate = useNavigate();
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
    var data = {
      name: Department.name
    };
    DepartmentDataService.create(data)
      .then(response => {
        setDepartment({
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
    navigate("/department");
  };
  return (
    <div className="submit-form">
      <h4>Кафедра</h4>
      <div>
        <div className="form-group">
          <label htmlFor="name">Название</label>
          <input
            type="text"
            className="form-control"
            id="name"
            required
            value={Department.name}
            onChange={handleInputChange}
            name="name"
          />
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