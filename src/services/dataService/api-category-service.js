import http from "./http-common";

const controllerName = "category";

const getAll = () => {
  return http.get(`/${controllerName}`);
};
const get = id => {
  return http.get(`/${controllerName}/${id}`);
};
const create = data => {
  return http.post(`/${controllerName}`, data);
};
const update = (id, data) => {
  return http.put(`/${controllerName}/${id}`, data);
};
const remove = id => {
  return http.delete(`/${controllerName}/${id}`);
};
const CategoryService = {
  getAll,
  get,
  create,
  update,
  remove
};

export default CategoryService;