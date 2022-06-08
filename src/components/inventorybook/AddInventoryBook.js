import React, { useState, useEffect, useRef } from "react";
import InventoryBookDataService from "../../services/dataService/api-inventorybook-service";
import { useNavigate } from 'react-router-dom';
import OperationtypeDataService from "../../services/dataService/api-operationstype-service";
import MaterialValueDataService from "../../services/dataService/api-materialvalue-service";
import Dropdown from 'react-bootstrap/Dropdown'
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import AuthService from "../../services/authService/auth.service";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const AddInventoryBook = () => {
  let navigate = useNavigate();
  const form = useRef();
  const checkBtn = useRef();
  const currentUser = AuthService.getCurrentUser();
  const userInfo = currentUser.Surname + " " + currentUser.Name + " " + currentUser.LastName;

  const initialInventoryBookState = {
    id: 0,
    materialValueId: 0,
    userId: currentUser.UserId,
    operationTypeId: 0,
    comment: "",
    date: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 19)
  };
  const [InventoryBook, setInventoryBook] = useState(initialInventoryBookState);
  const [materialvalueList, setMaterialValueList] = useState([]);
  const [operationtypeList, setOperationtypeList] = useState([]);

  const [selectedOperationtype, setSelectedOperationtype] = useState(null);
  const [selectedMaterialValue, setSelectedMaterialValue] = useState(null);

  const [message, setMessage] = useState("");

  useEffect(() => {
    getOperationtypeList();
    getInventoryBookList();

    if(materialvalueList.length !== 0 && operationtypeList.length !== 0 ) {
      setMaterialValue(materialvalueList[0].id);
      setOperationtype(operationtypeList[0].id);
    }

  }, [materialvalueList.length, operationtypeList.length ]);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setInventoryBook({ ...InventoryBook, [name]: value });
  };
  const setMaterialValue = id => {
    setSelectedMaterialValue(materialvalueList.find(x => x.id === parseInt(id)));
  };
  const setOperationtype = id => {
    setSelectedOperationtype(operationtypeList.find(x => x.name === "Закупка"));
  };

  const getOperationtypeList = ()  => {
    OperationtypeDataService.getAll()
      .then(response => {
        setOperationtypeList(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };
  const getInventoryBookList = ()  => {
    MaterialValueDataService.getAll()
      .then(response => {
        setMaterialValueList(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const saveInventoryBook = () => {
    form.current.validateAll();
    if (checkBtn.current.context._errors.length === 0) {
    setMessage("Пожалуйста подождите");
    var data = {
        materialValueId: selectedMaterialValue.id,
        userId: currentUser.UserId,
        operationTypeId: selectedOperationtype.id,
        comment: InventoryBook.comment,
        date: InventoryBook.date,
    };
    console.log(data);
    InventoryBookDataService.create(data)
      .then(response => {

        console.log(response.data);
        setMessage("Создание прошло успешно");
      })
      .catch(e => {
        console.log(e);
      });
  }};
  const goBack = () => {
    navigate("/inventorybook");
  };
  return (
    <div>
      { selectedMaterialValue && selectedOperationtype && currentUser ? (
        <div className="edit-form">
          <h4>Материальная ценность</h4>
          <Form ref={form} onSubmit={saveInventoryBook}>
          <div className="form-group">
              <label htmlFor="factoryNumber">Сотрудник</label>
              <input
                type="text"
                readOnly="readOnly"
                className="form-control"
                id="user"
                name="user"
                value={userInfo}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="materialvalueId" >Материальная ценность</label>
              <Dropdown onSelect={(e) => setMaterialValue(e) }  >
                <Dropdown.Toggle variant="secondary" id="dropdown-basic" className="form-control">
                {selectedMaterialValue?.name}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {materialvalueList &&
                    materialvalueList.map((materialvalue) => (
                      <Dropdown.Item value={materialvalue.id} eventKey={materialvalue.id} >{materialvalue.name}</Dropdown.Item>
                    ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="form-group">
              <label htmlFor="operationtypeId">Тип операции</label>
              <Dropdown onSelect={(e) => setOperationtype(e)} >
                <Dropdown.Toggle variant="secondary" id="dropdown-basic" className="form-control">
                {selectedOperationtype?.name}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {operationtypeList &&
                    operationtypeList.map((operationtype, index) => (
                      <Dropdown.Item disabled="true" eventKey={operationtype.id} >{operationtype.name}</Dropdown.Item>
                    ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="form-group">
              <label htmlFor="comment">Примечание</label>
              <input
                type="text"
                className="form-control"
                id="comment"
                name="comment"
                value={InventoryBook.comment}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="date">Дата</label>
              <Input
                type="datetime-local"
                className="form-control"
                id="date"
                name="date"
                value={InventoryBook.date}
                onChange={handleInputChange}
                validations={[required]}
              />
            </div>
          <CheckButton style={{ display: "none" }} ref={checkBtn} />
          </Form>
          <button className="m-3 btn btn-outline-secondary" onClick={goBack}>
            Назад
          </button>
          <button
            type="submit"
            className="m-3 btn btn-outline-secondary"
            onClick={saveInventoryBook}
          >
            Добавить
          </button>
          
          <p>{message}</p>
        </div>
      ) : (
        <div>
          <br />
          <p>Выбирите материальную ценность...</p>
        </div>
      )}
    </div>
  );
};

export default AddInventoryBook;