import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import FacultyDataService from "../../services/dataService/api-faculty-service";

const Faculty = props => {
  const { id }= useParams();
  let navigate = useNavigate();
  const initialFacultyState = {
    id: id,
    name: ""
  };
  const [currentFaculty, setCurrentFaculty] = useState(initialFacultyState);
  const [message, setMessage] = useState("");
  const getFaculty = id => {
    FacultyDataService.get(id)
      .then(response => {
        setCurrentFaculty(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };
  useEffect(() => {
    if (id)
      getFaculty(id);
  }, [id]);
  const handleInputChange = event => {
    const { name, value } = event.target;
    setCurrentFaculty({ ...currentFaculty, [name]: value });
  };
  const updateFaculty = () => {
    setMessage("Пожалуйста подождите");
    FacultyDataService.update(currentFaculty.id, currentFaculty)
      .then(response => {
        console.log(response.data);
        setMessage("Обновление прошло успешно");
      })
      .catch(e => {
        console.log(e);
      });
  };
  const goBack = () => {
    navigate("/faculty");
  };
  return (
    <div>
      {currentFaculty ? (
        <div className="edit-form">
          <h4>Факультет</h4>
          <form>
            <div className="form-group">
              <label htmlFor="name">Название</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={currentFaculty.name}
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
            onClick={updateFaculty}
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
export default Faculty;