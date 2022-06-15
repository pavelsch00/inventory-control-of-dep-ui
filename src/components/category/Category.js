import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import CategoryDataService from "../../services/dataService/api-category-service";

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

const Category = props => {
  const { id }= useParams();
  let navigate = useNavigate();
        
  const form = useRef();
  const checkBtn = useRef();

  const initialCategoryState = {
    id: id,
    name: ""
  };
  const [currentCategory, setCurrentCategory] = useState(initialCategoryState);
  const [message, setMessage] = useState("");
  const getCategory = id => {
    CategoryDataService.get(id)
      .then(response => {
        setCurrentCategory(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };
  useEffect(() => {
    if (id)
      getCategory(id);
  }, [id]);
  const handleInputChange = event => {
    const { name, value } = event.target;
    setCurrentCategory({ ...currentCategory, [name]: value });
  };
  const updateCategory = () => {
    form.current.validateAll();
    if (checkBtn.current.context._errors.length === 0) {
    setMessage("Пожалуйста подождите");
    CategoryDataService.update(currentCategory.id, currentCategory)
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
    navigate("/category");
  };
  return (
    <div>
      {currentCategory ? (
        <div className="edit-form">
          <h4>Категория</h4>
          <Form  ref={form}>
            <div className="form-group">
              <label htmlFor="name">Название</label>
              <Input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={currentCategory.name}
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
            onClick={updateCategory}
          >
            Обновить
          </button>
          <p>{message}</p>
        </div>
      ) : (
        <div>
          <br />
          <p>Выберите категория...</p>
        </div>
      )}
    </div>
  );
};
export default Category;