import React from "react";
import { MDBContainer, MDBCard, MDBCardBody } from "mdb-react-ui-kit";
import AdminNavBar from "../components/AdminNavBar.tsx";
import Footer from "../components/Footer.tsx";
import { useAuth } from "../context/AuthContext.tsx";
import backgroundImage from "../assets/background_img.jpg";
import PageLayout from "../layouts/PageLayout.tsx";

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const username = user?.user_name || "Admin";

  return (
    <PageLayout>
      <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
        <AdminNavBar username={username} />
        <MDBContainer
          className="d-flex justify-content-center align-items-center"
          style={{
            minHeight: "80vh",
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div
            className="text-center text-white p-4"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              borderRadius: "12px",
            }}
          >
            <h1 className="mb-4">Welcome to AIBDB!</h1>
            <p className="lead">
              Use the menu to manage, review, and update bias submissions,{" "}
              {user?.user_name &&
                user.user_name.charAt(0).toUpperCase() +
                  user.user_name.slice(1)}
            </p>
          </div>
        </MDBContainer>
      </div>
    </PageLayout>
  );
};

export default AdminPage;
