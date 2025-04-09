import React, { useEffect, useState } from 'react';
import {
  MDBContainer,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBSpinner,
  MDBCard,
  MDBCardBody,
  MDBBadge
} from 'mdb-react-ui-kit';
import AdminNavBar from '../components/AdminNavBar.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import Footer from '../components/Footer.tsx';
import PageLayout from '../layouts/PageLayout.tsx';

interface User {
  user_id: number;
  user_name: string;
  submission_count: number;
}

const AdminUserList: React.FC = () => {
  const { user } = useAuth();
  const username = user?.user_name || '';
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/users');
        const data = await res.json();
        if (data.success) {
          setUsers(data.users);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <PageLayout>
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <AdminNavBar username={username} />
      <MDBContainer className="py-5">
        <MDBCard className="shadow-4">
          <MDBCardBody style={{ backgroundColor: '#fccb90'}}>
            <h4 className="mb-4 text-center">Registered Users</h4>
            {loading ? (
              <div className="text-center">
                <MDBSpinner role="status">
                  <span className="visually-hidden">Loading...</span>
                </MDBSpinner>
              </div>
            ) : (
              <MDBTable align="middle" responsive bordered hover className="mb-0">
                <MDBTableHead style={{ background: 'linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)', color: 'white' }}>
                  <tr className="text-center">
                    <th>User ID</th>
                    <th>Username</th>
                    <th>Bias Submissions</th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody>
                  {users.map(user => (
                    <tr key={user.user_id} className="text-center">
                      <td><strong>{user.user_id}</strong></td>
                      <td>{user.user_name}</td>
                      <td>
                        <MDBBadge color={user.submission_count > 0 ? 'success' : 'secondary'} pill>
                          {user.submission_count}
                        </MDBBadge>
                      </td>
                    </tr>
                  ))}
                </MDBTableBody>
              </MDBTable>
            )}
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </div>
    </PageLayout>
  );
};

export default AdminUserList;
