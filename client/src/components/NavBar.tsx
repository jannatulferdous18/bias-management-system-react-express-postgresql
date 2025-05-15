import React from "react";
import { useNavigate } from "react-router-dom";
import {
  MDBNavbar,
  MDBContainer,
  MDBBtn,
  MDBNavbarNav,
  MDBNavbarItem,
} from "mdb-react-ui-kit";
import { useAuth } from "../context/AuthContext.tsx";

const NavBar: React.FC<{ username: string }> = ({ username }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const isAdmin = username?.toLowerCase() === "admin";

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
              onClick={() => navigate("/user")}
            >
              Home
            </MDBBtn>
          </MDBNavbarItem>

          <MDBNavbarItem>
            <MDBBtn
              style={buttonStyle}
              size="sm"
              onClick={() => navigate("/submit")}
            >
              Submit Bias
            </MDBBtn>
          </MDBNavbarItem>

          <MDBNavbarItem>
            <MDBBtn
              style={buttonStyle}
              size="sm"
              onClick={() => navigate("/search")}
            >
              Search Bias
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
            <MDBBtn
              style={buttonStyle}
              size="sm"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Logout
            </MDBBtn>
          </MDBNavbarItem>
        </MDBNavbarNav>
      </MDBContainer>
    </MDBNavbar>
  );
};

export default NavBar;
