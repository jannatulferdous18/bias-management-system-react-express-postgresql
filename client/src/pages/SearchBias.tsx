import React, { useState, useEffect } from "react";
import {
  MDBContainer,
  MDBInput,
  MDBDropdown,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBDropdownItem,
  MDBPagination,
  MDBPaginationItem,
  MDBPaginationLink,
} from "mdb-react-ui-kit";
import NavBar from "../components/NavBar.tsx";
import { useAuth } from "../context/AuthContext.tsx";
import BiasTable, { Bias } from "../components/BiasTable.tsx";
import "../styles/SearchBias.css";
import PageLayout from "../layouts/PageLayout.tsx";
import { useNavigate } from "react-router-dom";
import BiasFilterBar from "../components/BiasFilterBar.tsx";

const SearchBias: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [biases, setBiases] = useState<Bias[]>([]);
  const [severityFilter, setSeverityFilter] = useState<string>("");
  const [biasTypeFilter, setBiasTypeFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [biasTypes, setBiasTypes] = useState<string[]>([]);
  const [componentTypeFilter, setComponentTypeFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const navigate = useNavigate();
  const handleRowClick = (biasId: number) => {
    navigate(`/bias/${biasId}`);
  };

  useEffect(() => {
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
          setCurrentPage(1);
        }
      } catch (error) {
        console.error("Error fetching biases:", error);
      }
    };

    fetchBiases();
  }, [searchTerm, severityFilter, typeFilter, componentTypeFilter]);

  useEffect(() => {
    const fetchBiasTypes = async () => {
      const response = await fetch("http://localhost:4000/api/bias-types");
      const data = await response.json();
      if (data.success) {
        setBiasTypes(data.types);
      }
    };
    fetchBiasTypes();
  }, []);

  const totalPages = Math.ceil(biases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBiases = biases.slice(startIndex, startIndex + itemsPerPage);

  return (
    <PageLayout>
      <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
        <NavBar username={user?.user_name || ""} />
        <MDBContainer className="py-4">
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

          <BiasTable biases={currentBiases} onRowClick={handleRowClick} />

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

export default SearchBias;
