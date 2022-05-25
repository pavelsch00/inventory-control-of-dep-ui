import axios from 'axios';
import authHeader from './auth-header';
const API_URL = 'http://inventory-control-of-dep.herokuapp.com/api/v1/category';
class UserService {
  getPublicContent() {
    return axios.get(API_URL, { headers: authHeader() });
  }
  getUserBoard() {
    return axios.get(API_URL, { headers: authHeader() });
  }
  getModeratorBoard() {
    return axios.get(API_URL, { headers: authHeader() });
  }
  getAdminBoard() {
    return axios.get(API_URL, { headers: authHeader() });
  }
}
export default new UserService();