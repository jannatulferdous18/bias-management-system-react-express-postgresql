import React, { useState } from 'react';
import {
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBTextArea,
  MDBBtn,
  MDBRow,
  MDBCol
} from 'mdb-react-ui-kit';

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

interface Props {
  bias: Bias;
  onCancel: () => void;
  onUpdated: () => void;
}

const UpdateBiasForm: React.FC<Props> = ({ bias, onCancel, onUpdated }) => {
    const [formData, setFormData] = useState({
        ...bias,
        bias_type: bias.bias_type || '',
        bias_source: bias.bias_source || '',
        bias_description: bias.bias_description || '',
        severity_score: bias.severity_score || '',
        affected_groups: bias.affected_groups || '',
        m_strategy_description: bias.m_strategy_description || '',
      });
      
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:4000/admin/biases/${bias.bias_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        setMessage(data.message);
        setError('');
        onUpdated();
        onCancel();
      } else {
        setError(data.message);
        setMessage('');
      }
    } catch (err) {
      console.error(err);
      setError('Update failed.');
    }
  };

  return (
    <MDBCard className="shadow-4">
      <MDBCardBody>
        <h4 className="mb-4">Update Bias #{bias.bias_id}</h4>
        <MDBRow className="mb-3">
          <MDBCol md="6">
            <MDBInput
              label="Bias Type"
              name="bias_type"
              value={formData.bias_type}
              onChange={handleChange}
            />
          </MDBCol>
          <MDBCol md="6">
            <MDBInput
              label="Bias Source"
              name="bias_source"
              value={formData.bias_source}
              onChange={handleChange}
            />
          </MDBCol>
        </MDBRow>

        <MDBTextArea
          label="Description"
          name="bias_description"
          value={formData.bias_description}
          onChange={handleChange}
          className="mb-3"
          rows={3}
        />

        <MDBRow className="mb-3">
          <MDBCol md="6">
            <MDBInput
              label="Severity"
              name="severity_score"
              value={formData.severity_score}
              onChange={handleChange}
            />
          </MDBCol>
          <MDBCol md="6">
            <MDBInput
              label="Affected Groups"
              name="affected_groups"
              value={formData.affected_groups}
              onChange={handleChange}
            />
          </MDBCol>
        </MDBRow>

        <MDBTextArea
          label="Mitigation Strategy"
          name="m_strategy_description"
          value={formData.m_strategy_description}
          onChange={handleChange}
          rows={2}
          className="mb-3"
        />

        {message && <p className="text-success small">{message}</p>}
        {error && <p className="text-danger small">{error}</p>}

        <div className="d-flex justify-content-end gap-3">
          <MDBBtn color="secondary" onClick={onCancel}>Cancel</MDBBtn>
          <MDBBtn color="primary" onClick={handleUpdate}>Save Changes</MDBBtn>
        </div>
      </MDBCardBody>
    </MDBCard>
  );
};

export default UpdateBiasForm;
