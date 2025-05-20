import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Usertable.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';


const API_URL = 'https://682abf55ab2b5004cb379014.mockapi.io/User';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const data = await res.json();
      setUsers(data); 
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    localStorage.setItem('editUser', JSON.stringify(user));
    navigate('/formdata');
  };

  const confirmDelete = (user) => {
    setUserToDelete(user);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await fetch(`${API_URL}/${userToDelete.id}`, { method: 'DELETE' });
      setShowModal(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
    setUserToDelete(null);
  };

  const addUser = () => {
    navigate('/formdata');
  };

  return (
    <div style={{ padding: '10px' }}>
      <h2 style={{textAlign:"center", fontFamily:"algeria", fontWeight:"bold", marginTop:"70px" }}><b>USER TABLE DETAILES</b></h2>
      <div className="btn-add">
      <button className='btn-adduser' onClick={addUser} >ADD USER</button>
      </div> 
        <div className="user-table-container">
          <table border="1" cellPadding="10" width="100%" className="user-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Age</th>
                <th>DOB</th>
                <th>Gender</th>
                <th>Address</th>
                <th>Pincode</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, index) => (
                <tr key={u.id}>
                  <td>{index + 1}</td>
                  <td>{u.fullName}</td>
                  <td>{u.email}</td>
                  <td>{u.age}</td>
                 <td>{new Date(u.dob).toLocaleDateString('en-GB').replace(/\//g, '-')}</td>
                  <td>{u.gender}</td>
                  <td>{`${u.address}, ${u.city}, ${u.country}`}</td>
                  <td>{u.pincode}</td>
                 <td>
                   <button className="btn icon-btn-edit" onClick={() => handleEdit(u)}>
                      <FontAwesomeIcon icon={faEdit} />
                      </button>
                     <button className="btn icon-btn" onClick={() => confirmDelete(u)} style={{ marginLeft: '5px' }}>
                      <FontAwesomeIcon icon={faTrash} />
                   </button>
                 </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center' }}>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
    

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete <strong>{userToDelete.fullName}</strong>?</p>
            <div className="modal-buttons ">
              <button className="btn delete" onClick={handleDelete}>Delete</button>
              <button className="btn cancel" onClick={cancelDelete}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
