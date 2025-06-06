import React from "react";
import { MDBFooter, MDBContainer } from "mdb-react-ui-kit";

const Footer: React.FC = () => {
  return (
    <MDBFooter
      className="text-center text-lg-start text-muted bg-light shadow-sm"
      style={{ width: "100%" }}
    >
      <MDBContainer className="p-4 text-center">
        <small>© {new Date().getFullYear()} AIBDB. All rights reserved.</small>
      </MDBContainer>
    </MDBFooter>
  );
};

export default Footer;
