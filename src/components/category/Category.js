import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import CategoryDataService from "../../services/dataService/api-category-service";

const Category = props => {
  const { id }= useParams();
  let navigate = useNavigate();
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
    setMessage("Пожалуйста подождите");
    CategoryDataService.update(currentCategory.id, currentCategory)
      .then(response => {
        console.log(response.data);
        setMessage("Обновление прошло успешно");
      })
      .catch(e => {
        console.log(e);
      });
  };
  const goBack = () => {
    navigate("/category");
  };
  return (
    <div>
      {currentCategory ? (
        <div className="edit-form">
          <h4>Категория</h4>
          <form>
            <div className="form-group">
              <label htmlFor="name">Название</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={currentCategory.name}
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
            onClick={updateCategory}
          >
            Обновить
          </button>
          <p>{message}</p>
        </div>
      ) : (
        <div>
          <br />
          <p>Выбирите категория...</p>
        </div>
      )}
    </div>
  );
};
export default Category;