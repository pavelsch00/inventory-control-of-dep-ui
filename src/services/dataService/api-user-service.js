import http from "./http-common";

const controllerName = "user";

const getAll = () => {
  return http.get(`/${controllerName}`);
};
const get = email => {
  return http.get(`/${controllerName}/${email}`);
};
const getById = (id) => {
  return http.get(`/${controllerName}/getbyid/${id}`);
};
const update = (email, data) => {
  return http.put(`/${controllerName}/${email}`, data);
};
const changepassword = (email, data) => {
  return http.put(`/${controllerName}/${email}/changePassword`, data);
};
const addrole = (email, data) => {
  return http.put(`/${controllerName}/${email}/addrole`, data);
};
const remove = email => {
  return http.delete(`/${controllerName}/${email}`);
};
const deleterole = (email, data) => {
    return http.delete(`/${controllerName}/${email}/deleterole`, data);
  };
const UserService = {
  getAll,
  getById,
  changepassword,
  get,
  addrole,
  update,
  remove,
  deleterole
};

export default UserService;