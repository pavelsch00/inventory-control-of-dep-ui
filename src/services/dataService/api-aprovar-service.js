import http from "./http-common";

const controllerName = "aprovar";

const getAll = (userId) => {
  return http.get(`/${controllerName}/userId/${userId}`);
};
const get = id => {
  return http.get(`/${controllerName}/${id}`);
};
const getById = id => {
  return http.get(`/${controllerName}/getaprovarbyinventorybookidid/${id}`);
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
const AprovarService = {
  getAll,
  get,
  create,
  update,
  remove,
  getById
};

export default AprovarService;