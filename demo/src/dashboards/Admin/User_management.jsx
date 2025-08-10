import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import "./User_management.css"; // Create this file for styling

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const token=localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);


  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get("/api/users/",{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      setUsers(res.data.filter(user => user.role === 'user'));
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  }, []);


  const deleteUser = useCallback(async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`/api/users/${id}`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  }, [fetchUsers]);


  const totalPages = useMemo(() => Math.ceil(users.length / usersPerPage), [users]);
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = useMemo(() => users.slice(indexOfFirst, indexOfLast), [users, indexOfFirst, indexOfLast]);

  return (
    <div className="admin-user-management">
      <h2 className="dashboard-title">👥 User Management</h2>

      {loading ? (
        <p>Loading users...</p>
      ) : currentUsers.length === 0 ? (
        <p>No users found</p>
      ) : (
        <>
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile No.</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.firstname+" "+user.middlename+" "+user.lastname}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.role}</td>
                  <td>
                    <button className="delete-btn" onClick={() => deleteUser(user._id)}>
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={page === currentPage ? "active" : ""}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default UserManagement;
