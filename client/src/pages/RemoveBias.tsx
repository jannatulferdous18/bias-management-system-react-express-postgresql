import React, { useEffect, useState } from "react";
import {
  MDBContainer,
  MDBInput,
  MDBDropdown,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBDropdownItem,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBadge,
  MDBBtn,
} from "mdb-react-ui-kit";
import AdminNavBar from "../components/AdminNavBar.tsx";
import { useAuth } from "../context/AuthContext.tsx";
import PageLayout from "../layouts/PageLayout.tsx";

interface Bias {
  bias_id: number;
  bias_type: string;
  bias_source: string;
  bias_description: string;
  severity_score: string;
  affected_groups: string;
  submitted_by: string;
  m_strategy_description: string;
}

const RemoveBias: React.FC = () => {
  const { user } = useAuth();
  const username = user?.user_name || "";

  const [biases, setBiases] = useState<Bias[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [biasTypes, setBiasTypes] = useState<string[]>([]);

  const fetchBiases = async () => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/biases?search=${encodeURIComponent(
          searchTerm
        )}&severity=${encodeURIComponent(
          severityFilter
        )}&type=${encodeURIComponent(typeFilter)}`
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
  }, []);

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

  const handleDelete = async (biasId: number) => {
    if (!window.confirm("Are you sure you want to delete this bias?")) return;

    try {
      const res = await fetch(`http://localhost:4000/admin/biases/${biasId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        alert("Bias deleted.");
        fetchBiases(); // Refresh list
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete bias.");
    }
  };

  return (
    <PageLayout>
      <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
        <AdminNavBar username={username} />
        <MDBContainer className="py-4">
          <h4 className="mb-3">Remove Bias</h4>

          <div className="d-flex gap-3 flex-wrap mb-4">
            <MDBInput
              label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <MDBDropdown>
              <MDBDropdownToggle color="secondary">Severity</MDBDropdownToggle>
              <MDBDropdownMenu>
                <MDBDropdownItem link onClick={() => setSeverityFilter("")}>
                  All
                </MDBDropdownItem>
                <MDBDropdownItem link onClick={() => setSeverityFilter("High")}>
                  High
                </MDBDropdownItem>
                <MDBDropdownItem
                  link
                  onClick={() => setSeverityFilter("Critical")}
                >
                  Critical
                </MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
            <MDBDropdown>
              <MDBDropdownToggle color="info">Type</MDBDropdownToggle>
              <MDBDropdownMenu>
                <>
                  <MDBDropdownItem link onClick={() => setTypeFilter("")}>
                    All
                  </MDBDropdownItem>
                  {biasTypes.map((type) => (
                    <MDBDropdownItem
                      key={type}
                      link
                      onClick={() => setTypeFilter(type)}
                    >
                      {type}
                    </MDBDropdownItem>
                  ))}
                </>
              </MDBDropdownMenu>
            </MDBDropdown>
            <MDBBtn onClick={fetchBiases}>Search</MDBBtn>
          </div>

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
                <th>Type</th>
                <th>Source</th>
                <th>Description</th>
                <th>Severity</th>
                <th>Strategy</th>
                <th>Submitted By</th>
                <th>Actions</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {biases.map((bias) => (
                <tr key={bias.bias_id} className="table-row">
                  <td>{bias.bias_type}</td>
                  <td>{bias.bias_source}</td>
                  <td>{bias.bias_description}</td>
                  <td>
                    <MDBBadge
                      color={
                        bias.severity_score === "High" ? "danger" : "warning"
                      }
                      pill
                    >
                      {bias.severity_score}
                    </MDBBadge>
                  </td>
                  <td>{bias.m_strategy_description}</td>
                  <td>{bias.submitted_by}</td>
                  <td>
                    <MDBBtn
                      size="sm"
                      color="danger"
                      onClick={() => handleDelete(bias.bias_id)}
                    >
                      Delete
                    </MDBBtn>
                  </td>
                </tr>
              ))}
            </MDBTableBody>
          </MDBTable>
        </MDBContainer>
      </div>
    </PageLayout>
  );
};

export default RemoveBias;
