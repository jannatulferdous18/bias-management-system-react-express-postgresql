import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBBadge,
  MDBRow,
  MDBCol,
} from "mdb-react-ui-kit";
import PageLayout from "../layouts/PageLayout.tsx";
import { useAuth } from "../context/AuthContext.tsx";
import AdminNavBar from "../components/AdminNavBar.tsx";

interface BiasDetailData {
  bias_id: number;
  type: string;
  name: string;
  domain: string;
  description: string;
  bias_type: string;
  severity: string;
  mitigation_strategies: string;
  submitted_by_name: string;
  dataset_algorithm_version?: string;
  published_date?: string;
  size?: string;
  format?: string;
  key_characteristic?: string;
  bias_version_range?: string;
  technique?: string;
  bias_identification?: string;
  created_at: string;
  reference: string;
  occurrence_count: number;
}

const AdminBiasDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [bias, setBias] = useState<BiasDetailData | null>(null);

  useEffect(() => {
    const fetchBiasDetail = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/biases/${id}`);
        const data = await res.json();
        if (data.success) {
          setBias(data.bias);
        }
      } catch (err) {
        console.error("Error fetching bias detail:", err);
      }
    };

    fetchBiasDetail();
  }, [id]);

  if (!bias) return <div>Loading...</div>;

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
          <a href="#" style={{ color: "#0d6efd", textDecoration: "none" }}>
            AIB-{new Date(bias.created_at).getFullYear()}-
            {String(bias.bias_id).padStart(4, "0")}
          </a>
        </h3>

        <p className="mb-4 text-muted">{bias.description}</p>

        <MDBRow className="mb-4">
          <MDBCol md="6">
            <div className="border p-3 rounded bg-light">
              <strong>Bias Type:</strong> {bias.bias_type} <br />
              {bias.bias_version_range && (
                <>
                  <strong>Bias Version Range:</strong> {bias.bias_version_range}
                  <br />
                </>
              )}
              <strong>Severity: </strong>
              <MDBBadge color={severityColor}>{bias.severity}</MDBBadge> <br />
              <strong>Reference:</strong> {bias.reference} <br />
              <strong>Occurrence Count: </strong>
              <MDBBadge color="danger" pill>
                {bias.occurrence_count}
              </MDBBadge>{" "}
              <br />
            </div>
          </MDBCol>

          <MDBCol md="6">
            <div className="border p-3 rounded bg-light">
              <strong>Affected Source:</strong> {bias.type} <br />
              <strong>Affected {bias.type} Name:</strong> {bias.name} <br />
              <strong>Domain:</strong> {bias.domain} <br />
              {bias.dataset_algorithm_version && (
                <>
                  <strong>Version:</strong> {bias.dataset_algorithm_version}
                  <br />
                </>
              )}
              {bias.size && (
                <>
                  <strong>Size:</strong> {bias.size}
                  <br />
                </>
              )}
              {bias.format && (
                <>
                  <strong>Format:</strong> {bias.format}
                  <br />
                </>
              )}
              {bias.technique && (
                <>
                  <strong>Model Type:</strong> {bias.technique} <br />
                </>
              )}
              {bias.bias_identification && (
                <>
                  <strong>Bias Identification:</strong>{" "}
                  {bias.bias_identification}
                  <br />
                </>
              )}
              {bias.published_date && (
                <>
                  <strong>Published Date:</strong> {bias.published_date}
                  <br />
                </>
              )}{" "}
              {bias.key_characteristic && (
                <>
                  <strong>Key Characteristic:</strong> {bias.key_characteristic}
                  <br />
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

        <MDBCard>
          <MDBCardBody>
            <h6 className="text-muted mb-2">Submission Metadata</h6>
            <p>
              <strong>Submitted By:</strong> {bias.submitted_by_name} <br />
              <strong>Submitted At:</strong>{" "}
              {new Date(bias.created_at).toLocaleString()}
            </p>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </PageLayout>
  );
};

export default AdminBiasDetail;
