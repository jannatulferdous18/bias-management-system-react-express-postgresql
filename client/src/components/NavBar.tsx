import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MDBNavbar, MDBContainer, MDBNavbarBrand, MDBBtn, MDBNavbarNav, MDBNavbarItem } from 'mdb-react-ui-kit';
import { useAuth } from '../context/AuthContext.tsx';

const NavBar: React.FC<{ username: string }> = ({ username }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const isAdmin = username?.toLowerCase() === 'admin';

  return (
    <MDBNavbar light bgColor='light' expand='lg' className="mb-4">
      <MDBContainer fluid>
        <MDBNavbarNav className="d-flex flex-row gap-2">
            <MDBNavbarItem>
                <MDBBtn color='success' size='sm' onClick={() => navigate('/user')}>
                    Home
                </MDBBtn>
            </MDBNavbarItem>
          <MDBNavbarItem>
            <MDBBtn color='primary' size='sm' onClick={() => navigate('/submit')}>
              Submit Bias
            </MDBBtn>
          </MDBNavbarItem>
          <MDBNavbarItem>
            <MDBBtn color='info' size='sm' onClick={() => navigate('/search')}>
              Search Bias
            </MDBBtn>
          </MDBNavbarItem>
            <MDBNavbarItem>
                <MDBBtn
                    color='warning'
                    size='sm'
                    onClick={() => window.open('https://wamflow.vercel.app/homePage', '_blank')}
                    >
                    Editor
                </MDBBtn>
            </MDBNavbarItem>

          <MDBNavbarItem>
            <MDBBtn color='danger' size='sm' onClick={() => { logout(); navigate('/'); }}>
              Logout
            </MDBBtn>
          </MDBNavbarItem>
        </MDBNavbarNav>
      </MDBContainer>
    </MDBNavbar>
  );
};

export default NavBar;
