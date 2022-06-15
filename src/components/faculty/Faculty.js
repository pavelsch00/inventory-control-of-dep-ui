import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import FacultyDataService from "../../services/dataService/api-faculty-service";

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

const Faculty = props => {
  const { id }= useParams();
  let navigate = useNavigate();
  const form = useRef();
  const checkBtn = useRef();

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
    form.current.validateAll();
    if (checkBtn.current.context._errors.length === 0) {
    setMessage("Пожалуйста подождите");
    FacultyDataService.update(currentFaculty.id, currentFaculty)
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
    navigate("/faculty");
  };
  return (
    <div>
      {currentFaculty ? (
        <div className="edit-form">
          <h4>Факультет</h4>
          <Form ref={form} onSubmit={updateFaculty}>
            <div className="form-group">
              <label htmlFor="name">Название</label>
              <Input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={currentFaculty.name}
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
            onClick={updateFaculty}
          >
            Обновить
          </button>
          <p>{message}</p>
        </div>
      ) : (
        <div>
          <br />
          <p>Выберите кафедру...</p>
        </div>
      )}
    </div>
  );
};
export default Faculty;