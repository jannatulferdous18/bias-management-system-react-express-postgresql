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

  // Common button style
  const buttonStyle = {
    backgroundColor: "transparent",
    color: "white",
    border: "1px solid white",
    borderRadius: "8px",
    padding: "6px 12px",
  };

  return (
    <MDBNavbar
      dark
      style={{ backgroundColor: "#54b4d3" }}
      expand="lg"
      className="mb-4"
    >
      <MDBContainer fluid>
        <MDBNavbarNav className="d-flex flex-row gap-2">
          <MDBNavbarItem>
            <MDBBtn
              style={buttonStyle}
              size="sm"
              onClick={() => navigate("/admin")}
            >
              Home
            </MDBBtn>
          </MDBNavbarItem>
          <MDBNavbarItem>
            <MDBBtn
              style={buttonStyle}
              size="sm"
              onClick={() => navigate("/admin-submit")}
            >
              Add Bias
            </MDBBtn>
          </MDBNavbarItem>
          <MDBNavbarItem>
            <MDBBtn
              style={buttonStyle}
              size="sm"
              onClick={() => navigate("/admin-search")}
            >
              Search Bias
            </MDBBtn>
          </MDBNavbarItem>
          <MDBNavbarItem>
            <MDBBtn
              style={buttonStyle}
              size="sm"
              onClick={() => navigate("/user-list")}
            >
              User List
            </MDBBtn>
          </MDBNavbarItem>
          <MDBNavbarItem>
            <MDBBtn
              style={buttonStyle}
              size="sm"
              onClick={() => navigate("/remove-bias")}
            >
              Remove Bias
            </MDBBtn>
          </MDBNavbarItem>
          <MDBNavbarItem>
            <MDBBtn
              style={buttonStyle}
              size="sm"
              onClick={() => navigate("/update-bias")}
            >
              Update Bias
            </MDBBtn>
          </MDBNavbarItem>
          <MDBNavbarItem>
            <MDBBtn
              style={buttonStyle}
              size="sm"
              onClick={() => navigate("/admin-requests")}
            >
              Pending Requests
            </MDBBtn>
          </MDBNavbarItem>
          <MDBNavbarItem>
            <MDBBtn
              style={buttonStyle}
              size="sm"
              onClick={() =>
                window.open("https://wameditor.vercel.app/", "_blank")
              }
            >
              Editor
            </MDBBtn>
          </MDBNavbarItem>
          <MDBNavbarItem>
            <MDBBtn style={buttonStyle} size="sm" onClick={handleLogout}>
              Logout
            </MDBBtn>
          </MDBNavbarItem>
        </MDBNavbarNav>
      </MDBContainer>
    </MDBNavbar>
  );
};

export default AdminNavBar;
