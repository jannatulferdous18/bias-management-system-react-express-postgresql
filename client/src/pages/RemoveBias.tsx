import React, { useEffect, useState } from "react";
import {
  MDBContainer,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBadge,
  MDBBtn,
  MDBPagination,
  MDBPaginationItem,
  MDBPaginationLink,
} from "mdb-react-ui-kit";
import AdminNavBar from "../components/AdminNavBar.tsx";
import { useAuth } from "../context/AuthContext.tsx";
import PageLayout from "../layouts/PageLayout.tsx";
import BiasFilterBar from "../components/BiasFilterBar.tsx";

interface Bias {
  bias_id: number;
  type: string;
  name: string;
  domain: string;
  description: string;
  bias_type: string;
  severity: string;
  mitigation_strategy: string;
  submitted_by: string;
  submitted_by_name: string;
  dataset_version: string;
  published_date: string;
  size: string;
  format: string;
  bias_version_range: string;
  technique: string;
  bias_identification: string;
  created_at: string;
}

const RemoveBias: React.FC = () => {
  const { user } = useAuth();
  const username = user?.user_name || "";

  const [biases, setBiases] = useState<Bias[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [biasTypes, setBiasTypes] = useState<string[]>([]);
  const [biasTypeFilter, setBiasTypeFilter] = useState<string>("");
  const [componentTypeFilter, setComponentTypeFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const itemsPerPage = 15;

  const fetchBiases = async () => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/biases?search=${encodeURIComponent(
          searchTerm
        )}&severity=${encodeURIComponent(
          severityFilter
        )}&biasType=${encodeURIComponent(
          typeFilter
        )}&componentType=${encodeURIComponent(componentTypeFilter)}`
      );

      const data = await res.json();
      if (data.success) {
        setBiases(data.biases);
      }
    } catch (error) {
      console.error("Error fetching biases:", error);
    }
  };

  useEffect(() => {
    fetchBiases();
  }, [searchTerm, severityFilter, typeFilter, componentTypeFilter]);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/bias-types");
        const data = await res.json();
        if (data.success) {
          setBiasTypes(data.types);
        }
      } catch (err) {
        console.error("Failed to fetch types:", err);
      }
    };
    fetchTypes();
  }, []);

  const deleteBias = async (biasId: number) => {
    try {
      const res = await fetch(`http://localhost:4000/admin/biases/${biasId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (data.success) {
        setShowSuccess(true); // Show popup
        fetchBiases(); // Refresh table
      } else {
        alert(`Failed to delete: ${data.message}`);
      }
    } catch (err) {
      console.error("Delete failed", err);
      alert("Server error during deletion.");
    }
  };

  const totalPages = Math.ceil(biases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBiases = biases.slice(startIndex, startIndex + itemsPerPage);

  return (
    <PageLayout>
      <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
        <AdminNavBar username={username} />
        <MDBContainer className="py-4">
          <h4 className="mb-3">Remove Bias</h4>

          <BiasFilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            severityFilter={severityFilter}
            setSeverityFilter={setSeverityFilter}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            biasTypes={biasTypes}
            componentTypeFilter={componentTypeFilter}
            setComponentTypeFilter={setComponentTypeFilter}
            clearFilters={() => {
              setSearchTerm("");
              setSeverityFilter("");
              setTypeFilter("");
              setComponentTypeFilter("");
            }}
          />
          {showSuccess && (
            <div
              style={{
                backgroundColor: "#d4edda",
                color: "#155724",
                border: "1px solid #c3e6cb",
                padding: "15px",
                borderRadius: "5px",
                marginBottom: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>Bias successfully deleted.</span>
              <MDBBtn
                size="sm"
                color="success"
                onClick={() => setShowSuccess(false)}
              >
                OK
              </MDBBtn>
            </div>
          )}

          <MDBTable
            align="middle"
            responsive
            bordered
            small
            hover
            className="styled-table"
          >
            <MDBTableHead>
              <tr className="table-header">
                <th>Bias ID</th>
                <th>Bias Type</th>
                <th>Domain</th>
                <th>Severity</th>
                <th>Strategy</th>
                <th>Actions</th>
              </tr>
            </MDBTableHead>

            <MDBTableBody>
              {currentBiases.map((bias) => (
                <tr key={bias.bias_id} className="table-row">
                  <td>{bias.bias_id ? `AIBID${bias.bias_id}` : "—"}</td>
                  <td>{bias.bias_type}</td>
                  <td>{bias.domain}</td>
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
                  <td>{bias.mitigation_strategy}</td>
                  <td>
                    <MDBBtn
                      size="sm"
                      color="danger"
                      onClick={() => deleteBias(bias.bias_id)}
                    >
                      Delete
                    </MDBBtn>
                  </td>
                </tr>
              ))}
            </MDBTableBody>
          </MDBTable>
          {biases.length > 0 && (
            <MDBPagination className="mb-0 justify-content-center mt-4">
              {[...Array(totalPages)].map((_, i) => (
                <MDBPaginationItem key={i} active={i + 1 === currentPage}>
                  <MDBPaginationLink
                    href="#"
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </MDBPaginationLink>
                </MDBPaginationItem>
              ))}
            </MDBPagination>
          )}
        </MDBContainer>
      </div>
    </PageLayout>
  );
};

export default RemoveBias;
