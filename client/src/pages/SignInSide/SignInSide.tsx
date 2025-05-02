import React, { useState } from "react";
import "./SignInSide.css";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
} from "mdb-react-ui-kit";
import wamflowLogo from "../../assets/flowLogo.png";
import api from "../../api/axios.ts";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.tsx";
import PageLayout from "../../layouts/PageLayout.tsx";

const SignInSide: React.FC = () => {
  const [user_name, setuser_name] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setAuthUser } = useAuth();

  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      const res = await api.post("/login", {
        user_name,
        password,
      });

      if (res.data.success) {
        const user = res.data.user || res.data.users;
        setAuthUser({ user_name: user.user_name, user_id: user.user_id });
        if (user.user_name === "admin") {
          navigate("/admin");
        } else {
          navigate("/user");
        }
      } else {
        setError(res.data.message || "Login failed");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Server error. Try again.");
    }
  };

  return (
    <PageLayout>
      <MDBContainer className="my-5 gradient-form">
        <MDBRow>
          <MDBCol col="6" className="mb-5">
            <div className="d-flex flex-column ms-5">
              <div className="text-center">
                <img
                  src={wamflowLogo}
                  alt="Wamflow Logo"
                  style={{ width: "100px" }}
                />
                <h4 className="mt-1 mb-5 pb-1">Bias Management System</h4>
              </div>

              <p>Please login to your account</p>

              <MDBInput
                wrapperClass="mb-4"
                label="Username"
                id="form1"
                type="text"
                value={user_name}
                onChange={(e) => setuser_name(e.target.value)}
              />

              <MDBInput
                wrapperClass="mb-4"
                label="Password"
                id="form2"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className="text-center pt-1 mb-5 pb-1">
                <MDBBtn
                  className="mb-4 w-100 gradient-custom-2"
                  onClick={handleLogin}
                >
                  Sign in
                </MDBBtn>
              </div>

              <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4">
                <p className="mb-0">Don't have an account?</p>
                <MDBBtn
                  outline
                  className="mx-2"
                  color="info"
                  onClick={() => navigate("/register")}
                >
                  Register
                </MDBBtn>
              </div>
            </div>
          </MDBCol>

          <MDBCol col="6" className="mb-5">
            <div
              className="d-flex flex-column justify-content-center h-100 mb-4"
              style={{ background: "#54B4D3" }}
            >
              <div className="text-black px-3 py-4 p-md-5 mx-md-4">
                <h4 className="mb-4">
                  Revolutionize the way you design and implement web-based
                  applications
                </h4>
                <p className="small mb-0">
                  Graphical notation that provides a UML-like notation that is
                  specifically tailored to the needs of inter-organizational
                  web-based applications. Empower your team, visualize, design,
                  and collaborate effortlessly, bridging the gap between concept
                  and implementation.
                </p>
              </div>
            </div>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </PageLayout>
  );
};

export default SignInSide;
