import React, { useState, useEffect, useRef } from "react";
import MaterialValueDataService from "../../services/dataService/api-materialvalue-service";
import { useNavigate } from 'react-router-dom';
import RoomDataService from "../../services/dataService/api-room-service";
import CategoryDataService from "../../services/dataService/api-category-service";
import Dropdown from 'react-bootstrap/Dropdown'
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const AddMaterialValue = () => {
  let navigate = useNavigate();
  const form = useRef();
  const checkBtn = useRef();

  const initialMaterialValueState = {
    id: 0,
    categoryId: 0,
    name: "",
    dateOfIssue: "",
    description: "",
    factoryNumber: "",
    inventoryNumber: "",
    nomenclatureNumber: "",
    passportNumber: "",
    price: 0,
    roomId: 0,
    writeOffDate: "",
  };
  const [MaterialValue, setMaterialValue] = useState(initialMaterialValueState);
  const [categoryList, setCategoryList] = useState([]);
  const [roomList, setRoomList] = useState([]);


  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [message, setMessage] = useState("");

  useEffect(() => {
    getRoomList();
    getCategoryList();

    if(categoryList.length !== 0 && roomList.length !== 0 ) {
      console.log(categoryList[0].id);

      setCategory(categoryList[0].id);
      setRoom(roomList[0].id);
    }

  }, [categoryList.length, roomList.length]);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setMaterialValue({ ...MaterialValue, [name]: value });
  };
  const setCategory = id => {
    setSelectedCategory(categoryList.find(x => x.id === parseInt(id)));
  };
  const setRoom = id => {
    setSelectedRoom(roomList.find(x => x.id === parseInt(id)));
  };

  const getRoomList = ()  => {
    RoomDataService.getAll()
      .then(response => {
        setRoomList(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };
  const getCategoryList = ()  => {
    CategoryDataService.getAll()
      .then(response => {
        setCategoryList(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const saveMaterialValue = () => {
    form.current.validateAll();
    if (checkBtn.current.context._errors.length === 0) {
    setMessage("Пожалуйста подождите");
    var data = {
      categoryId: selectedCategory.id,
      dateOfIssue: MaterialValue.dateOfIssue,
      description: MaterialValue.description,
      factoryNumber: MaterialValue.factoryNumber,
      inventoryNumber: MaterialValue.inventoryNumber,
      nomenclatureNumber: MaterialValue.nomenclatureNumber,
      passportNumber: MaterialValue.passportNumber,
      price: MaterialValue.price,
      roomId: selectedRoom.id,
      writeOffDate: MaterialValue.writeOffDate,
      name: MaterialValue.name
    };
    MaterialValueDataService.create(data)
      .then(response => {

        console.log(response.data);
        setMessage("Создание прошло успешно");
      })
      .catch(e => {
        console.log(e);
      });
  }};
  const goBack = () => {
    navigate("/materialvalue");
  };
  return (
    <div>
      { selectedCategory && selectedRoom ? (
        <div className="edit-form">
          <h4>Материальная ценность</h4>
          <Form ref={form} onSubmit={saveMaterialValue}>
          <div className="form-group">
              <label htmlFor="name">Название</label>
              <Input
                type="text"
                className="form-control"
                name="name"
                value={MaterialValue.name}
                onChange={handleInputChange}
                validations={[required]}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Описание</label>
              <Input
                type="text"
                className="form-control"
                name="description"
                value={MaterialValue.description}
                onChange={handleInputChange}
                validations={[required]}
              />
            </div>
            <div className="form-group">
              <label htmlFor="price">Цена</label>
              <Input
                type="text"
                className="form-control"
                id="price"
                name="price"
                value={MaterialValue.price}
                onChange={handleInputChange}
                validations={[required]}
              />
            </div>
            <div className="form-group">
              <label htmlFor="categoryId">Категория</label>
              <Dropdown onSelect={(e) => setCategory(e) }  >
                <Dropdown.Toggle variant="secondary" id="dropdown-basic" className="form-control">
                {selectedCategory?.name}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {categoryList &&
                    categoryList.map((category) => (
                      <Dropdown.Item value={category.id} eventKey={category.id} >{category.name}</Dropdown.Item>
                    ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="form-group">
              <label htmlFor="roomId">Аудитория</label>
              <Dropdown onSelect={(e) => setRoom(e)} >
                <Dropdown.Toggle variant="secondary" id="dropdown-basic" className="form-control">
                {selectedRoom?.name} -  {selectedRoom?.number}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {roomList &&
                    roomList.map((room, index) => (
                      <Dropdown.Item eventKey={room.id} >{room.name} - {room.number}</Dropdown.Item>
                    ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="form-group">
              <label htmlFor="dateOfIssue">Дата создания</label>
              <Input
                type="datetime-local"
                className="form-control"
                id="dateOfIssue"
                name="dateOfIssue"
                value={MaterialValue.dateOfIssue}
                onChange={handleInputChange}
                validations={[required]}
              />
            </div>
            <div className="form-group">
              <label htmlFor="writeOffDate">Дата списание</label>
              <Input
                type="datetime-local"
                className="form-control"
                id="writeOffDate"
                name="writeOffDate"
                value={MaterialValue.writeOffDate}
                onChange={handleInputChange}
                validations={[required]}
              />
            </div>
            <div className="form-group">
              <label htmlFor="factoryNumber">Заводской номер</label>
              <input
                type="text"
                className="form-control"
                id="factoryNumber"
                name="factoryNumber"
                value={MaterialValue.factoryNumber}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="inventoryNumber">Инвентарный номер</label>
              <input
                type="text"
                className="form-control"
                id="inventoryNumber"
                name="inventoryNumber"
                value={MaterialValue.inventoryNumber}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="nomenclatureNumber">Номенклатурный номер</label>
              <input
                type="text"
                className="form-control"
                id="nomenclatureNumber"
                name="nomenclatureNumber"
                value={MaterialValue.nomenclatureNumber}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="passportNumber">Паспортный номер</label>
              <input
                type="text"
                className="form-control"
                id="passportNumber"
                name="passportNumber"
                value={MaterialValue.passportNumber}
                onChange={handleInputChange}
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
            onClick={saveMaterialValue}
          >
            Создать
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

export default AddMaterialValue;