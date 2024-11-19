import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import UserItem from './components/UserItem';
import { v4 as uuidv4 } from 'uuid';
import { FaPlus } from 'react-icons/fa';

const API_URL = "https://jsonplaceholder.typicode.com/users";

class App extends Component {
  state = {
    usersList: [],
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    error: '',
    currentPage: 1,
    usersPerPage: 5,
    editingUserId: null,
    loading: false,
  };

  componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers = () => {
    this.setState({ loading: true });
    const { currentPage, usersPerPage } = this.state;
    axios.get(`${API_URL}?_page=${currentPage}&_limit=${usersPerPage}`)
      .then(response => this.setState({ usersList: response.data, loading: false }))
      .catch(error => this.setState({ error: "Error fetching users!", loading: false }));
  };

  onAddUser = event => {
    event.preventDefault();
    const { firstName, lastName, email, department } = this.state;

    if (!firstName || !lastName || !email || !department) {
      this.setState({ error: "All fields are required!" });
      return;
    }

    const newUser = {
      id: uuidv4(),
      firstName,
      lastName,
      email,
      department,
    };

    axios.post(API_URL, newUser)
      .then(response => {
        this.setState(prevState => ({
          usersList: [...prevState.usersList, response.data],
          firstName: '',
          lastName: '',
          email: '',
          department: '',
          error: '',
        }));
      })
      .catch(() => this.setState({ error: "Error adding user!" }));
  };

  onEditUser = user => {
    this.setState({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      department: user.department,
      editingUserId: user.id,
    });
  };

  onUpdateUser = event => {
    event.preventDefault();
    const { firstName, lastName, email, department, editingUserId } = this.state;

    if (!firstName || !lastName || !email || !department) {
      this.setState({ error: "All fields are required!" });
      return;
    }

    axios.put(`${API_URL}/${editingUserId}`, {
      id: editingUserId,
      firstName,
      lastName,
      email,
      department,
    })
      .then(response => {
        this.setState(prevState => ({
          usersList: prevState.usersList.map(user =>
            user.id === editingUserId ? response.data : user
          ),
          firstName: '',
          lastName: '',
          email: '',
          department: '',
          editingUserId: null,
          error: '',
        }));
      })
      .catch(() => this.setState({ error: "Error updating user!" }));
  };

  onDeleteUser = id => {
    axios.delete(`${API_URL}/${id}`)
      .then(() => {
        this.setState(prevState => ({
          usersList: prevState.usersList.filter(user => user.id !== id),
        }));
      })
      .catch(() => this.setState({ error: "Error deleting user!" }));
  };

  onNextPage = () => {
    this.setState(
      prevState => ({ currentPage: prevState.currentPage + 1 }),
      this.fetchUsers
    );
  };

  onPrevPage = () => {
    this.setState(
      prevState => ({ currentPage: Math.max(prevState.currentPage - 1, 1) }),
      this.fetchUsers
    );
  };

  onChangeField = (event, field) => {
    this.setState({ [field]: event.target.value });
  };

  render() {
    const { firstName, lastName, email, department, error, usersList, loading } = this.state;

    return (
      <div className="app-container">
        <h1 className="heading">User Management Dashboard</h1>

        {error && <div className="error-message">{error}</div>}

        <form className="user-form" onSubmit={this.state.editingUserId ? this.onUpdateUser : this.onAddUser}>
          <input
            value={firstName}
            onChange={e => this.onChangeField(e, 'firstName')}
            placeholder="First Name"
            className="input-field"
          />
          <input
            value={lastName}
            onChange={e => this.onChangeField(e, 'lastName')}
            placeholder="Last Name"
            className="input-field"
          />
          <input
            value={email}
            onChange={e => this.onChangeField(e, 'email')}
            placeholder="Email"
            className="input-field"
          />
          <input
            value={department}
            onChange={e => this.onChangeField(e, 'department')}
            placeholder="Department"
            className="input-field"
          />
          <button type="submit" className="submit-button">
            {this.state.editingUserId ? "Update User" : <><FaPlus /> Add User</>}
          </button>
        </form>

        {loading ? <div className="loading">Loading...</div> : (
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map(user => (
                <UserItem
                  key={user.id}
                  user={user}
                  onDeleteUser={this.onDeleteUser}
                  onEditUser={this.onEditUser}
                />
              ))}
            </tbody>
          </table>
        )}

        <div className="pagination">
          <button onClick={this.onPrevPage} disabled={this.state.currentPage === 1}>Prev</button>
          <button onClick={this.onNextPage}>Next</button>
        </div>
      </div>
    );
  }
}

export default App;
