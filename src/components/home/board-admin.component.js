import React, { Component } from "react";
import UserService from "../../services/authService/user.service";

export default class BoardAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: ""
    };
  }
  componentDidMount() {
    UserService.getAdminBoard().then(
      response => {
        this.setState({
          content: response.data[0]
        });
      },
      error => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        });
      }
    );
  }
  render() {
    return (
      <div className="container">
        <header className="jumbotron">
          <h3>{this.state.content.name}</h3>
        </header>
      </div>
    );
  }
}