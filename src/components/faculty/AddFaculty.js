import React, { useState } from "react";
import FacultyDataService from "../../services/dataService/api-faculty-service";
import { useNavigate } from 'react-router-dom';

const AddFaculty = () => {
  let navigate = useNavigate();
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
    var data = {
      name: Faculty.name
    };
    FacultyDataService.create(data)
      .then(response => {
        setFaculty({
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
    navigate("/faculty");
  };
  return (
    <div className="submit-form">
      <h4>Факультет</h4>
      <div>
        <div className="form-group">
          <label htmlFor="name">Название</label>
          <input
            type="text"
            className="form-control"
            id="name"
            required
            value={Faculty.name}
            onChange={handleInputChange}
            name="name"
          />
        </div>
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