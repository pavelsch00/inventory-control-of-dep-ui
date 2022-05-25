import React, { useState, useEffect } from "react";
import CategoryDataService from "../../services/dataService/api-category-service";
import { Link } from "react-router-dom";

const CategoryList = () => {
  const [Category, setCategory] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchId, setSearchName] = useState("");
  
  useEffect(() => {
    retrieveCategory();
  }, []);
  const onChangeSearchName = e => {
    const searchId = e.target.value;
    setSearchName(searchId);
    console.log(searchId);
  };
  const retrieveCategory = () => {
    CategoryDataService.getAll()
      .then(response => {
        setCategory(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };
  const refreshList = () => {
    retrieveCategory();
    setCurrentCategory(null);
    setCurrentIndex(-1);
  };
  const setActiveCategory = (Category, index) => {
    setCurrentCategory(Category);
    setCurrentIndex(index);
  };
  const deleteCategory = () => {
    CategoryDataService.remove(currentCategory.id)
      .then(response => {
        console.log(response.data);
        refreshList();
      })
      .catch(e => {
        console.log(e);
      });
  };
  const findById = () => {
      CategoryDataService.getAll()
      .then(response => {
        setCategory(response.data.filter(x => x.name.includes(searchId)));
      })
      .catch(e => {
        console.log(e);
      });
  };
  return (
    <div className="list row">
      <div className="col-md-8">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Поиск по названию"
            value={searchId}
            onChange={onChangeSearchName}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findById}
            >
              Поиск
            </button>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <h4>Список категорий</h4>
        <ul className="list-group">
          {Category &&
            Category.map((Category, index) => (
              <li
                className={
                  "list-group-item " + (index === currentIndex ? "active" : "")
                }
                onClick={() => setActiveCategory(Category, index)}
                key={index}
              >
                {Category.name}
              </li>
            ))}
        </ul>
        <Link
          to={"/add-category"}
          className="m-3 btn btn-outline-secondary" >Добавить  
        </Link>
      </div>
      <div className="col-md-6">
        {currentCategory ? (
          <div>
            <h4>Категория</h4>
            <div>
              <label>
                <strong>Название:</strong>
              </label>{" "}
              {currentCategory.name}
            </div>
            <Link
              to={"/category/" + currentCategory.id}
              className="m-3 btn btn-outline-secondary"
            >
              Редактировать
            </Link>
            <button className="m-3 btn btn-outline-secondary" onClick={deleteCategory}>
              Удалить
            </button>
          </div>
        ) : (
          <div>
            <br />
            <p>Выберите категорию...</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default CategoryList;