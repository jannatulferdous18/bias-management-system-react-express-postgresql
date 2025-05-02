import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBBadge,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBSpinner,
} from "mdb-react-ui-kit";
import { toast } from "react-toastify";
import PageLayout from "../layouts/PageLayout.tsx";
import AdminNavBar from "../components/AdminNavBar.tsx";
import { useAuth } from "../context/AuthContext.tsx";

interface PendingBias {
  request_id: number;
  bias_type: string;
  type: string;
  name?: string;
  domain: string;
  description: string;
  severity: string;
  technique?: string;
  bias_identification?: string;
  dataset_version?: string;
  published_date?: string;
  size?: string;
  format?: string;
  bias_version_range?: string;
  mitigation_strategies: string;
  submitted_by: string;
  created_at: string;
}

const PendingBiasDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bias, setBias] = useState<PendingBias | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBiasDetail = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/admin/pending-bias/${id}`
        );
        const data = await res.json();
        if (data.success) {
          setBias(data.bias);
        }
      } catch (err) {
        console.error("Error fetching pending bias:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBiasDetail();
  }, [id]);

  const handleAction = async (action: "approve" | "decline") => {
    const endpoint = `http://localhost:4000/admin/${action}-bias`;
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: bias?.request_id }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success(`Bias successfully ${action}d.`);
        setTimeout(() => {
          navigate("/admin-requests");
        }, 2000);
      } else {
        alert(result.message || `${action} failed`);
      }
    } catch (err) {
      console.error(`${action} failed:`, err);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <MDBSpinner role="status">
          <span className="visually-hidden">Loading...</span>
        </MDBSpinner>
      </div>
    );
  }

  if (!bias) {
    return <div className="text-center mt-5">Bias not found.</div>;
  }

  const severityColor =
    bias.severity === "High"
      ? "danger"
      : bias.severity === "Medium"
      ? "warning"
      : "success";

  return (
    <PageLayout>
      <AdminNavBar username={user?.user_name || ""} />
      <MDBContainer className="py-4">
        <h3 className="mb-3">
          <strong>Bias Details:</strong>{" "}
          <span style={{ color: "#0d6efd" }}>AIBID{bias.request_id}</span>
        </h3>

        <p className="mb-4 text-muted">{bias.description}</p>

        <MDBRow className="mb-4">
          <MDBCol md="6">
            <div className="border p-3 rounded bg-light">
              <strong>Bias Type:</strong> {bias.bias_type} <br />
              <strong>Affected Component:</strong> {bias.type} <br />
              <strong>Affected Component Name:</strong> {bias.name || "—"}{" "}
              <br />
            </div>
          </MDBCol>

          <MDBCol md="6">
            <div className="border p-3 rounded bg-light">
              <strong>Severity:</strong>{" "}
              <MDBBadge color={severityColor}>{bias.severity}</MDBBadge> <br />
              <strong>Domain:</strong> {bias.domain} <br />
              {bias.type === "Algorithm" && (
                <>
                  {bias.technique && (
                    <>
                      <strong>Technique:</strong> {bias.technique} <br />
                    </>
                  )}
                  {bias.bias_identification && (
                    <>
                      <strong>Bias Identification:</strong>{" "}
                      {bias.bias_identification} <br />
                    </>
                  )}
                </>
              )}
              {bias.type === "Dataset" && (
                <>
                  {bias.dataset_version && (
                    <>
                      <strong>Dataset Version:</strong> {bias.dataset_version}{" "}
                      <br />
                    </>
                  )}
                  {bias.published_date && (
                    <>
                      <strong>Published Date:</strong> {bias.published_date}{" "}
                      <br />
                    </>
                  )}
                  {bias.size && (
                    <>
                      <strong>Size:</strong> {bias.size} <br />
                    </>
                  )}
                  {bias.format && (
                    <>
                      <strong>Format:</strong> {bias.format} <br />
                    </>
                  )}
                  {bias.bias_version_range && (
                    <>
                      <strong>Bias Version Range:</strong>{" "}
                      {bias.bias_version_range} <br />
                    </>
                  )}
                </>
              )}
            </div>
          </MDBCol>
        </MDBRow>

        <MDBCard className="mb-4">
          <MDBCardBody>
            <h5>Mitigation Strategy</h5>
            <p>{bias.mitigation_strategies}</p>
          </MDBCardBody>
        </MDBCard>

        <MDBCard className="mb-4">
          <MDBCardBody>
            <h6 className="text-muted mb-2">Submission Metadata</h6>
            <p>
              <strong>Submitted By:</strong> {bias.submitted_by} <br />
              <strong>Submitted At:</strong>{" "}
              {new Date(bias.created_at).toLocaleString()}
            </p>
          </MDBCardBody>
        </MDBCard>

        <div className="d-flex gap-3">
          <MDBBtn color="success" onClick={() => handleAction("approve")}>
            Approve
          </MDBBtn>
          <MDBBtn color="danger" onClick={() => handleAction("decline")}>
            Decline
          </MDBBtn>
        </div>
      </MDBContainer>
    </PageLayout>
  );
};

export default PendingBiasDetail;
