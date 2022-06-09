import axios from "axios";
import authHeader from '../authService/auth-header';

export default axios.create({  
  baseURL: "http://inventory-control-of-dep.herokuapp.com/api/v1/",
  headers: authHeader(),
});