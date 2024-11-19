import React from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import './UserItem.css'

const UserItem = ({ user, onDeleteUser, onEditUser }) => {
  const { id, firstName, lastName, email, department } = user;

  return (
    <tr>
      <td>{`${firstName} ${lastName}`}</td>
      <td>{email}</td>
      <td>{department}</td>
      <td>
        <button onClick={() => onEditUser(user)} className="action-btn edit-btn">
          <FaEdit />  Edit
        </button>
        <button onClick={() => onDeleteUser(id)} className="action-btn delete-btn">
          <FaTrashAlt />  Delete
        </button>
      </td>
    </tr>
  );
};

export default UserItem;
