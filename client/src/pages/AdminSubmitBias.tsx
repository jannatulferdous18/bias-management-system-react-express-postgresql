import React, { useState } from 'react';
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBTextArea,
  MDBBtn
} from 'mdb-react-ui-kit';
import AdminNavBar from '../components/AdminNavBar.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import Footer from '../components/Footer.tsx';
import PageLayout from '../layouts/PageLayout.tsx';

const AdminSubmitBias: React.FC = () => {
  const { user } = useAuth();
  const username = user?.user_name || '';
  const [formData, setFormData] = useState({
    biasType: '',
    biasSource: '',
    description: '',
    severity: '',
    affectedGroups: '',
    mitigationStrategies: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username) {
      alert("You must be logged in as admin to submit a bias.");
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/api/biases/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData,
          submittedBy: username
        }),
      });

      if (!res.ok) throw new Error('Submission failed');

      const result = await res.json();
      alert('Bias inserted into the database!');
      console.log('Server response:', result);

      setFormData({
        biasType: '',
        biasSource: '',
        description: '',
        severity: '',
        affectedGroups: '',
        mitigationStrategies: '',
      });
    } catch (err) {
      console.error(err);
      alert('Failed to submit bias.');
    }
  };

  return (
    <PageLayout>
      <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <AdminNavBar username={username} />
        <MDBContainer className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
          <MDBCard className="w-100 shadow-4" style={{ background: '#ffeeba', maxWidth: '1200px', borderRadius: '12px' }}>
            <MDBCardBody>
              <h4 className="mb-4 text-center">Admin: Submit a New Bias</h4>
              <form onSubmit={handleSubmit}>
                <MDBInput
                  className='mb-4'
                  label='Bias Type'
                  name='biasType'
                  value={formData.biasType}
                  onChange={handleChange}
                  required
                />
                <MDBInput
                  className='mb-4'
                  label='Bias Source'
                  name='biasSource'
                  value={formData.biasSource}
                  onChange={handleChange}
                  required
                />
                <MDBTextArea
                  className='mb-4'
                  label='Description'
                  name='description'
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
                <MDBInput
                  className='mb-4'
                  label='Severity'
                  name='severity'
                  value={formData.severity}
                  onChange={handleChange}
                  required
                />
                <MDBInput
                  className='mb-4'
                  label='Affected Groups'
                  name='affectedGroups'
                  value={formData.affectedGroups}
                  onChange={handleChange}
                  required
                />
                <MDBInput
                  className='mb-4'
                  label='Mitigation Strategy'
                  name='mitigationStrategies'
                  value={formData.mitigationStrategies}
                  onChange={handleChange}
                  required
                />
                <MDBBtn type='submit' block color='danger'>Submit</MDBBtn>
              </form>
            </MDBCardBody>
          </MDBCard>
        </MDBContainer>
      </div>
    </PageLayout>
  );
};

export default AdminSubmitBias;
