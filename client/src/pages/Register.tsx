import React, { useState } from 'react';
import axios from '../api/axios.ts'; 
import {
  MDBContainer,
  MDBInput,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBRow,
  MDBCol
} from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../layouts/PageLayout.tsx';
import backgroundImage from '../assets/background_img.jpg'; 

const Register: React.FC = () => {
  const [user_name, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await axios.post('/register', {
        user_name,
        password
      });

      if (res.data.success) {
        setMessage(res.data.message);
        setError('');
        setUserName('');
        setPassword('');
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setError(res.data.message);
        setMessage('');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Something went wrong');
      setMessage('');
    }
  };

  return (
    <PageLayout>
      <div style={{ 
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        }}
        >
      <MDBContainer className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <MDBRow className="w-100 justify-content-center">
          <MDBCol md="6" lg="5">
            <MDBCard className="shadow-4" style={{ minWidth: '500px'}}>
              <MDBCardBody className="p-4" style={{ backgroundColor: '#fccb90'}}>
                <MDBCardTitle className="text-center mb-4">Register</MDBCardTitle>
                <MDBInput
                  className="mb-4"
                  label="Username"
                  value={user_name}
                  onChange={(e) => setUserName(e.target.value)}
                />
                <MDBInput
                  className="mb-4"
                  type="password"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {message && <p className="text-success text-center small mb-2">{message}</p>}
                {error && <p className="text-danger text-center small mb-2">{error}</p>}

                <MDBBtn block color="danger" onClick={handleRegister}>Register</MDBBtn>
                <MDBBtn block color="secondary" onClick={() => navigate('/')}>Back to Login</MDBBtn>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      </div>
    </PageLayout>
  );
};

export default Register;
