import React from "react";
import {
  MDBNavbar,
  MDBContainer,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBBtn,
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";

const AdminNavBar: React.FC<{ username: string }> = ({ username }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <MDBNavbar expand="lg" light bgColor="light" className="mb-4 shadow-sm">
      <MDBContainer fluid>
        <MDBNavbarNav className="d-flex flex-row gap-2">
          <MDBNavbarItem>
            <MDBBtn
              color="success"
              size="sm"
              onClick={() => navigate("/admin")}
            >
              Home
            </MDBBtn>
          </MDBNavbarItem>
          <MDBNavbarItem>
            <MDBBtn
              color="primary"
              size="sm"
              onClick={() => navigate("/admin-submit")}
            >
              Add Bias
            </MDBBtn>
          </MDBNavbarItem>
          <MDBNavbarItem>
            <MDBBtn
              color="info"
              size="sm"
              onClick={() => navigate("/admin-search")}
            >
              Search Bias
            </MDBBtn>
          </MDBNavbarItem>
          <MDBNavbarItem>
            <MDBBtn
              color="dark"
              size="sm"
              onClick={() => navigate("/user-list")}
            >
              User List
            </MDBBtn>
          </MDBNavbarItem>
          <MDBNavbarItem>
            <MDBBtn
              color="light"
              size="sm"
              onClick={() => navigate("/remove-bias")}
            >
              Remove Bias
            </MDBBtn>
          </MDBNavbarItem>
          <MDBNavbarItem>
            <MDBBtn
              color="warning"
              size="sm"
              onClick={() => navigate("/update-bias")}
            >
              Update Bias
            </MDBBtn>
          </MDBNavbarItem>
          <MDBNavbarItem>
            <MDBBtn
              color="secondary"
              size="sm"
              onClick={() => navigate("/admin-requests")}
            >
              Pending Requests
            </MDBBtn>
          </MDBNavbarItem>
          <MDBNavbarItem>
            <MDBBtn color="danger" size="sm" onClick={handleLogout}>
              Logout
            </MDBBtn>
          </MDBNavbarItem>
        </MDBNavbarNav>
      </MDBContainer>
    </MDBNavbar>
  );
};

export default AdminNavBar;
