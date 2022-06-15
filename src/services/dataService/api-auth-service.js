import http from "./http-common";

const controllerName = "authorization";

const create = data => {
  return http.post(`/${controllerName}/registration`, data);
};

const AuthService = {
    create
};

export default AuthService;