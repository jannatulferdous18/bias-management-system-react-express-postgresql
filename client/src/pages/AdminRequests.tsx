import React, { useEffect, useState } from "react";
import {
  MDBContainer,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBSpinner,
  MDBBadge,
} from "mdb-react-ui-kit";
import { useAuth } from "../context/AuthContext.tsx";
import AdminNavBar from "../components/AdminNavBar.tsx";
import PageLayout from "../layouts/PageLayout.tsx";
import { useNavigate } from "react-router-dom";

interface PendingBias {
  request_id: number;
  bias_type: string;
  severity: string;
  type: string;
  domain: string;
}

const AdminRequests: React.FC = () => {
  const { user } = useAuth();
  const username = user?.user_name || "";
  const navigate = useNavigate();
  const [pendingBiases, setPendingBiases] = useState<PendingBias[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingBiases = async () => {
    try {
      const res = await fetch("http://localhost:4000/admin/pending-biases");
      const data = await res.json();
      if (data.success) {
        setPendingBiases(data.biases);
      }
    } catch (err) {
      console.error("Error fetching biases:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (requestId: number) => {
    navigate(`/admin/pending/${requestId}`);
  };

  useEffect(() => {
    fetchPendingBiases();
  }, []);

  return (
    <PageLayout>
      <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
        <AdminNavBar username={username} />
        <MDBContainer className="py-5">
          <h2 className="mb-4 text-center">Pending Bias Requests</h2>

          {loading ? (
            <div className="text-center">
              <MDBSpinner role="status">
                <span className="visually-hidden">Loading...</span>
              </MDBSpinner>
            </div>
          ) : pendingBiases.length === 0 ? (
            <p className="text-center">No pending submissions.</p>
          ) : (
            <MDBTable align="middle" responsive bordered small hover>
              <MDBTableHead style={{ color: "black" }}>
                <tr>
                  <th>Bias ID</th>
                  <th>Bias Type</th>
                  <th>Severity</th>
                  <th>Source</th>
                  <th>Domain</th>
                </tr>
              </MDBTableHead>

              <MDBTableBody>
                {pendingBiases.map((bias) => (
                  <tr
                    key={bias.request_id}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleRowClick(bias.request_id)}
                  >
                    <td>AIBID{bias.request_id}</td>
                    <td>{bias.bias_type}</td>
                    <td>
                      <MDBBadge
                        color={
                          bias.severity === "High"
                            ? "danger"
                            : bias.severity === "Medium"
                            ? "warning"
                            : "success"
                        }
                        pill
                      >
                        {bias.severity}
                      </MDBBadge>
                    </td>
                    <td>{bias.type}</td>
                    <td>{bias.domain}</td>
                  </tr>
                ))}
              </MDBTableBody>
            </MDBTable>
          )}
        </MDBContainer>
      </div>
    </PageLayout>
  );
};

export default AdminRequests;
