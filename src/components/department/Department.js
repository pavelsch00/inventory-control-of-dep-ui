import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import DepartmentDataService from "../../services/dataService/api-department-service";

const Department = props => {
  const { id }= useParams();
  let navigate = useNavigate();
  const initialDepartmentState = {
    id: id,
    name: ""
  };
  const [currentDepartment, setCurrentDepartment] = useState(initialDepartmentState);
  const [message, setMessage] = useState("");
  const getDepartment = id => {
    DepartmentDataService.get(id)
      .then(response => {
        setCurrentDepartment(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };
  useEffect(() => {
    if (id)
      getDepartment(id);
  }, [id]);
  const handleInputChange = event => {
    const { name, value } = event.target;
    setCurrentDepartment({ ...currentDepartment, [name]: value });
  };
  const updateDepartment = () => {
    setMessage("Пожалуйста подождите");
    DepartmentDataService.update(currentDepartment.id, currentDepartment)
      .then(response => {
        console.log(response.data);
        setMessage("Обновление прошло успешно");
      })
      .catch(e => {
        console.log(e);
      });
  };
  const goBack = () => {
    navigate("/department");
  };
  return (
    <div>
      {currentDepartment ? (
        <div className="edit-form">
          <h4>Кафедра</h4>
          <form>
            <div className="form-group">
              <label htmlFor="name">Название</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={currentDepartment.name}
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
            onClick={updateDepartment}
          >
            Обновить
          </button>
          <p>{message}</p>
        </div>
      ) : (
        <div>
          <br />
          <p>Выбирите кафедру...</p>
        </div>
      )}
    </div>
  );
};
export default Department;