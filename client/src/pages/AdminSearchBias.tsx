import React, { useState, useEffect } from 'react';
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
} from 'mdb-react-ui-kit';
import AdminNavBar from '../components/AdminNavBar.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import BiasTable, { Bias } from '../components/BiasTable.tsx';
import '../styles/SearchBias.css';
import PageLayout from '../layouts/PageLayout.tsx';

const AdminSearchBias: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [biases, setBiases] = useState<Bias[]>([]);
  const [severityFilter, setSeverityFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [biasTypes, setBiasTypes] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchBiases = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/biases?search=${encodeURIComponent(
            searchTerm
          )}&severity=${encodeURIComponent(severityFilter)}&type=${encodeURIComponent(typeFilter)}`
        );
        const data = await res.json();
        if (data.success) {
          setBiases(data.biases);
          setCurrentPage(1);
        }
      } catch (error) {
        console.error('Error fetching biases:', error);
      }
    };

    fetchBiases();
  }, [searchTerm, severityFilter, typeFilter]);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/bias-types');
        const data = await res.json();
        if (data.success) {
          setBiasTypes(data.types);
        }
      } catch (err) {
        console.error('Failed to fetch bias types:', err);
      }
    };

    fetchTypes();
  }, []);

  const totalPages = Math.ceil(biases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBiases = biases.slice(startIndex, startIndex + itemsPerPage);

  return (
    <PageLayout>
      <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <AdminNavBar username={user?.user_name || ''} />
        <MDBContainer className="py-4">
          <div className="d-flex flex-column gap-3 mb-3">
            <MDBInput
              label="Search Biases"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ maxWidth: '300px' }}
              className="search-box"
            />

            <div className="d-flex gap-3">
              <MDBDropdown>
                <MDBDropdownToggle color="secondary">Filter: Severity</MDBDropdownToggle>
                <MDBDropdownMenu>
                  <MDBDropdownItem link onClick={() => setSeverityFilter('')}>All</MDBDropdownItem>
                  <MDBDropdownItem link onClick={() => setSeverityFilter('High')}>High</MDBDropdownItem>
                  <MDBDropdownItem link onClick={() => setSeverityFilter('Medium')}>Medium</MDBDropdownItem>
                  <MDBDropdownItem link onClick={() => setSeverityFilter('Critical')}>Critical</MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>

              <MDBDropdown>
                <MDBDropdownToggle color="info">Filter: Type</MDBDropdownToggle>
                <MDBDropdownMenu>
                  <>
                      <MDBDropdownItem link onClick={() => setTypeFilter('')}>
                      All
                      </MDBDropdownItem>

                      {biasTypes.map((type) => (
                      <MDBDropdownItem key={type} link onClick={() => setTypeFilter(type)}>
                          {type}
                      </MDBDropdownItem>
                      ))}
                  </>
              </MDBDropdownMenu>
              </MDBDropdown>
            </div>
          </div>

          <BiasTable biases={currentBiases} />

          <MDBPagination className="mb-0 justify-content-center mt-4">
            {[...Array(totalPages)].map((_, i) => (
              <MDBPaginationItem key={i} active={i + 1 === currentPage}>
                <MDBPaginationLink href="#" onClick={() => setCurrentPage(i + 1)}>
                  {i + 1}
                </MDBPaginationLink>
              </MDBPaginationItem>
            ))}
          </MDBPagination>
        </MDBContainer>
      </div>
    </PageLayout>
  );
};

export default AdminSearchBias;
