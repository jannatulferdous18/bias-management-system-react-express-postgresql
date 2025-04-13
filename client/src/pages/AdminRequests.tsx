import React, { useEffect, useState } from "react";
import {
  MDBContainer,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBtn,
  MDBSpinner,
} from "mdb-react-ui-kit";
import { useAuth } from "../context/AuthContext.tsx";
import AdminNavBar from "../components/AdminNavBar.tsx";
import PageLayout from "../layouts/PageLayout.tsx";

interface PendingBias {
  bias_request_id: number;
  bias_type: string;
  bias_source: string;
  bias_description: string;
  severity_score: string;
  affected_groups: string;
  submitted_by: string;
  m_strategy_description: string;
}

const AdminRequests: React.FC = () => {
  const { user } = useAuth();
  const username = user?.user_name || "";
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

  const handleAction = async (id: number, action: "approve" | "decline") => {
    const endpoint = `http://localhost:4000/admin/${action}-bias`;
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const result = await res.json();
      if (result.success) {
        alert(result.message);
        setPendingBiases((prev) =>
          prev.filter((bias) => bias.bias_request_id !== id)
        );
      }
    } catch (err) {
      console.error(`${action} failed:`, err);
    }
  };

  useEffect(() => {
    fetchPendingBiases();
  }, []);

  return (
    <PageLayout>
      <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
        <AdminNavBar username={username} />
        <MDBContainer className="py-5" style={{ backgroundColor: "#fccb90" }}>
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
            <MDBTable align="middle" responsive bordered small>
              <MDBTableHead
                style={{
                  background:
                    "linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)",
                  color: "white",
                }}
              >
                <tr>
                  <th>Type</th>
                  <th>Source</th>
                  <th>Description</th>
                  <th>Severity</th>
                  <th>Affected Groups</th>
                  <th>Mitigation Strategy</th>
                  <th>Submitted By</th>
                  <th>Actions</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {pendingBiases.map((bias) => (
                  <tr key={bias.bias_request_id}>
                    <td>{bias.bias_type}</td>
                    <td>{bias.bias_source}</td>
                    <td>{bias.bias_description}</td>
                    <td>{bias.severity_score}</td>
                    <td>{bias.affected_groups}</td>
                    <td>{bias.m_strategy_description}</td>
                    <td>{bias.submitted_by}</td>
                    <td className="d-flex gap-2">
                      <MDBBtn
                        color="success"
                        size="sm"
                        onClick={() =>
                          handleAction(bias.bias_request_id, "approve")
                        }
                      >
                        Approve
                      </MDBBtn>
                      <MDBBtn
                        color="danger"
                        size="sm"
                        onClick={() =>
                          handleAction(bias.bias_request_id, "decline")
                        }
                      >
                        Decline
                      </MDBBtn>
                    </td>
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
