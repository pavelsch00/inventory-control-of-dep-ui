import axios from "axios";
import jwt from 'jwt-decode'

const API_URL = "https://inventory-control-of-dep.herokuapp.com/api/v1/authorization/";

class AuthService {
  login(email, password) {
    return axios
      .post(API_URL + "login", {
        email,
        password
      })
      .then(response => {
        if (response.data) {
            const user = jwt(response.data);
            var roles = Object.entries(user);
            user.roles = roles[5][1];
            user.accessToken = response.data;
            console.log(user);
          localStorage.setItem("user", JSON.stringify(user));
        }
        return response.data;
      });
  }
  logout() {
    localStorage.removeItem("user");
  }
  register(username, email, password) {
    return axios.post(API_URL + "registration", {
      username,
      email,
      password
    });
  }
  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));;
  }
}
export default new AuthService();