import axios from "axios";
import authHeader from '../authService/auth-header';

const controllerName = "pdfcreator";

const http = axios.create({  
  baseURL: "http://inventory-control-of-dep.herokuapp.com/api/v1/",
  headers: authHeader(),
  responseType: "blob",
});

const get = data => {
  return http.post(`/${controllerName}`, data);
};
const PdfCreatorService = {
  get
};

export default PdfCreatorService;