import React, { useState, useEffect } from "react";
import {
  MDBContainer,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBadge,
  MDBCard,
  MDBCardBody,
  MDBPagination,
  MDBPaginationItem,
  MDBPaginationLink,
} from "mdb-react-ui-kit";
import AdminNavBar from "../components/AdminNavBar.tsx";
import { useAuth } from "../context/AuthContext.tsx";
import UpdateBiasForm from "./UpdateBiasForm.tsx";
import PageLayout from "../layouts/PageLayout.tsx";
import { useNavigate, useParams } from "react-router-dom";
import BiasFilterBar from "../components/BiasFilterBar.tsx";

interface Bias {
  bias_id: number;
  type: string;
  name: string;
  domain: string;
  description: string;
  bias_type: string;
  severity: string;
  mitigation_strategies: string; // from API
  mitigation_strategy: string; // for UpdateBiasForm
  submitted_by: string;
  submitted_by_name: string;
  dataset_algorithm_version: string;
  published_date: string;
  size: string;
  format: string;
  key_characteristic: string;
  bias_version_range: string;
  technique: string;
  bias_identification: string;
  reference: string;
  created_at: string;
}
const AdminUpdateBias: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const username = user?.user_name || "";
  const navigate = useNavigate();

  const [biases, setBiases] = useState<Bias[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedBias, setSelectedBias] = useState<Bias | null>(null);
  const [biasTypeFilter, setBiasTypeFilter] = useState<string>("");
  const [componentTypeFilter, setComponentTypeFilter] = useState<string>("");
  const [biasTypes, setBiasTypes] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
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

  useEffect(() => {
    if (id) {
      const fetchBiasById = async () => {
        try {
          const res = await fetch(`http://localhost:4000/api/biases/${id}`);
          const data = await res.json();
          if (data.success) {
            const transformedBias = {
              ...data.bias,
              mitigation_strategy: data.bias.mitigation_strategies,
            };
            setSelectedBias(transformedBias);
          } else {
            console.error("Bias not found");
          }
        } catch (err) {
          console.error("Failed to load bias:", err);
        }
      };
      fetchBiasById();
    }
  }, [id]);

  const totalPages = Math.ceil(biases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBiases = biases.slice(startIndex, startIndex + itemsPerPage);
  return (
    <PageLayout>
      <div style={{ minHeight: "100vh" }}>
        <AdminNavBar username={username} />
        <MDBContainer className="py-4" style={{ minWidth: "1500px" }}>
          {!selectedBias ? (
            <>
              <MDBCard className="shadow-4 mb-4">
                <MDBCardBody>
                  <h4 className="mb-4">Update a Bias</h4>
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
                </MDBCardBody>
              </MDBCard>

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
                    <th style={{ width: "120px" }}>Bias ID</th>
                    <th>Bias Type</th>
                    <th>Domain</th>
                    <th>Severity</th>
                    <th>Mitigation Strategy</th>
                  </tr>
                </MDBTableHead>

                <MDBTableBody>
                  {currentBiases.map((bias) => (
                    <tr
                      key={bias.bias_id}
                      className="table-row"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        navigate(`/admin/update-bias/${bias.bias_id}`)
                      }
                    >
                      <td>
                        {bias.bias_id
                          ? `AIB-${new Date(bias.created_at).getFullYear()}-
            ${String(bias.bias_id).padStart(4, "0")}`
                          : "—"}
                      </td>
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
            </>
          ) : (
            <UpdateBiasForm
              bias={selectedBias}
              onCancel={() => setSelectedBias(null)}
              onUpdated={() => {
                fetchBiases();
                setSelectedBias(null);
                navigate("/admin/update-bias");
              }}
            />
          )}
        </MDBContainer>
      </div>
    </PageLayout>
  );
};

export default AdminUpdateBias;
