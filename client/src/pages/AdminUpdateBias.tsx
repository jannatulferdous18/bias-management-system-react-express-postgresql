import React, { useState, useEffect } from 'react';
import {
  MDBContainer,
  MDBInput,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBDropdown,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBDropdownItem,
  MDBBtn,
  MDBBadge,
  MDBCard,
  MDBCardBody
} from 'mdb-react-ui-kit';
import AdminNavBar from '../components/AdminNavBar.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import UpdateBiasForm from './UpdateBiasForm.tsx';
import PageLayout from '../layouts/PageLayout.tsx';

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

const AdminUpdateBias: React.FC = () => {
  const { user } = useAuth();
  const username = user?.user_name || '';

  const [biases, setBiases] = useState<Bias[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [selectedBias, setSelectedBias] = useState<Bias | null>(null);

  const fetchBiases = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/biases?search=${encodeURIComponent(searchTerm)}&severity=${encodeURIComponent(severityFilter)}&type=${encodeURIComponent(typeFilter)}`);
      const data = await res.json();
      if (data.success) {
        setBiases(data.biases);
      }
    } catch (error) {
      console.error('Error fetching biases:', error);
    }
  };

  useEffect(() => {
    fetchBiases();
  }, []);

  return (
<PageLayout>
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <AdminNavBar username={username} />
      <MDBContainer className="py-4"  style={{ backgroundColor: '#fccb90'}}>
        {!selectedBias ? (
          <>
            <MDBCard className="shadow-4 mb-4">
              <MDBCardBody>
                <h4 className="mb-4">Search & Filter Biases</h4>
                <div className="d-flex gap-3 flex-wrap mb-4">
                  <MDBInput label="Search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />

                  <MDBDropdown>
                    <MDBDropdownToggle color="secondary">Severity</MDBDropdownToggle>
                    <MDBDropdownMenu>
                      <MDBDropdownItem link onClick={() => setSeverityFilter('')}>All</MDBDropdownItem>
                      <MDBDropdownItem link onClick={() => setSeverityFilter('High')}>High</MDBDropdownItem>
                      <MDBDropdownItem link onClick={() => setSeverityFilter('Critical')}>Critical</MDBDropdownItem>
                    </MDBDropdownMenu>
                  </MDBDropdown>

                  <MDBBtn color='danger' onClick={fetchBiases}>Search</MDBBtn>
                </div>
              </MDBCardBody>
            </MDBCard>

            <MDBTable align="middle" responsive bordered hover>
              <MDBTableHead style={{ background: 'linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)', color: 'white' }}>
                <tr>
                  <th>Type</th>
                  <th>Source</th>
                  <th>Description</th>
                  <th>Severity</th>
                  <th>Strategy</th>
                  <th>Submitted By</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {biases.map(bias => (
                  <tr key={bias.bias_id} style={{ cursor: 'pointer' }} onClick={() => setSelectedBias(bias)}>
                    <td>{bias.bias_type}</td>
                    <td>{bias.bias_source}</td>
                    <td>{bias.bias_description}</td>
                    <td>
                      <MDBBadge color={bias.severity_score === 'High' ? 'danger' : bias.severity_score === 'Critical' ? 'warning' : 'success'} pill>
                        {bias.severity_score}
                      </MDBBadge>
                    </td>
                    <td>{bias.m_strategy_description}</td>
                    <td>{bias.submitted_by}</td>
                  </tr>
                ))}
              </MDBTableBody>
            </MDBTable>
          </>
        ) : (
        <UpdateBiasForm
            bias={selectedBias}
            onCancel={() => setSelectedBias(null)}
            onUpdated={() => {
            fetchBiases();      
            setSelectedBias(null); 
            }}
        />
          
        )}
      </MDBContainer>
    </div>
</PageLayout>
  );
};

export default AdminUpdateBias;
