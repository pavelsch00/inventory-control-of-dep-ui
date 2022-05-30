import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import MaterialValueDataService from "../../services/dataService/api-materialvalue-service";
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

const MaterialValue = props => {
  const { id }= useParams();
  let navigate = useNavigate();
  const form = useRef();
  const checkBtn = useRef();

  const initialMaterialValueState = {
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
  const [currentMaterialValue, setCurrentMaterialValue] = useState(initialMaterialValueState);
  const [message, setMessage] = useState("");
  const [roomList, setRoomList] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const getMaterialValue = id => {
    MaterialValueDataService.get(id)
      .then(response => {
        setCurrentMaterialValue(response.data);
        getRoomById(response.data.roomId);
        getRoomList();
        getCategoryById(response.data.categoryId);
        getCategoryList();
      })
      .catch(e => {
        console.log(e);
      });
  };
  useEffect(() => {
    if (id)
      getMaterialValue(id);
  }, [id]);
  
  const handleInputChange = event => {
    const { name, value } = event.target;

    setCurrentMaterialValue({ ...currentMaterialValue, [name]: value });
  };

  const setRoom = id => {
    setSelectedRoom(roomList.find(x => x.id === parseInt(id)));

    currentMaterialValue.roomId = parseInt(selectedRoom.id);
  };
  const getRoomById = id  => {
    RoomDataService.get(id)
      .then(response => {
        setSelectedRoom(response.data);
      })
      .catch(e => {
        console.log(e);
      });
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

  const setCategory = id => {
    setSelectedCategory(categoryList.find(x => x.id === parseInt(id)));
  };
  const getCategoryById = id  => {
    CategoryDataService.get(id)
      .then(response => {
        setSelectedCategory(response.data);
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

  const updateMaterialValue = () => {
    form.current.validateAll();
    if (checkBtn.current.context._errors.length === 0) {
    setMessage("Пожалуйста подождите");
    var data = {
      categoryId: selectedCategory.id,
      dateOfIssue: currentMaterialValue.dateOfIssue,
      description: currentMaterialValue.description,
      factoryNumber: currentMaterialValue.factoryNumber,
      inventoryNumber: currentMaterialValue.inventoryNumber,
      nomenclatureNumber: currentMaterialValue.nomenclatureNumber,
      passportNumber: currentMaterialValue.passportNumber,
      price: currentMaterialValue.price,
      roomId: selectedRoom.id,
      writeOffDate: currentMaterialValue.writeOffDate,
      name: currentMaterialValue.name
    };

    MaterialValueDataService.update(currentMaterialValue.id, data)
      .then(response => {
        setMessage("Обновление прошло успешно");
      })
      .catch(e => {
        console.log(e);
      });
    };
  };
  const goBack = () => {
    navigate("/materialvalue");
  };
  return (
    <div>
      {currentMaterialValue && selectedRoom && selectedCategory ? (
        <div className="edit-form">
          <h4>Материальная ценность</h4>
          <Form ref={form} onSubmit={updateMaterialValue}>
          <div className="form-group">
              <label htmlFor="name">Название</label>
              <Input
                type="text"
                className="form-control"
                name="name"
                value={currentMaterialValue.name}
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
                value={currentMaterialValue.description}
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
                value={currentMaterialValue.price}
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
                type="datetime"
                className="form-control"
                id="dateOfIssue"
                name="dateOfIssue"
                value={currentMaterialValue.dateOfIssue}
                onChange={handleInputChange}
                validations={[required]}
              />
            </div>
            <div className="form-group">
              <label htmlFor="writeOffDate">Дата списание</label>
              <Input
                type="datetime"
                className="form-control"
                id="writeOffDate"
                name="writeOffDate"
                value={currentMaterialValue.writeOffDate}
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
                value={currentMaterialValue.factoryNumber}
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
                value={currentMaterialValue.inventoryNumber}
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
                value={currentMaterialValue.nomenclatureNumber}
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
                value={currentMaterialValue.passportNumber}
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
            onClick={updateMaterialValue}
          >
            Обновить
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
export default MaterialValue;