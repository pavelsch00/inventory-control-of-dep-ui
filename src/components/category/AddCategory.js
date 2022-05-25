import React, { useState } from "react";
import CategoryDataService from "../../services/dataService/api-category-service";
import { useNavigate } from 'react-router-dom';

const AddCategory = () => {
  let navigate = useNavigate();
  const initialCategoryState = {
    id: null,
    name: ""
  };
  const [Category, setCategory] = useState(initialCategoryState);
  const [message, setMessage] = useState("");
  const handleInputChange = event => {
    const { name, value } = event.target;
    setCategory({ ...Category, [name]: value });
  };
  const saveCategory = () => {
    var data = {
      name: Category.name
    };
    CategoryDataService.create(data)
      .then(response => {
        setCategory({
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
    navigate("/category");
  };
  return (
    <div className="submit-form">
      <h4>Категория</h4>
      <div>
        <div className="form-group">
          <label htmlFor="name">Название</label>
          <input
            type="text"
            className="form-control"
            id="name"
            required
            value={Category.name}
            onChange={handleInputChange}
            name="name"
          />
        </div>
        <button className="m-3 btn btn-outline-secondary" onClick={goBack}>
          Назад
        </button>
        <button onClick={saveCategory} className="m-3 btn btn-outline-secondary">
          Добавить
        </button>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default AddCategory;