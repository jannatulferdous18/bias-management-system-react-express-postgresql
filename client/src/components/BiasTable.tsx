import React from 'react';
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBadge
} from 'mdb-react-ui-kit';
import '../styles/BiasTable.css';

export interface Bias {
  bias_id: number;
  bias_type: string;
  bias_source: string;
  bias_description: string;
  severity_score: string;
  affected_groups: string;
  submitted_by: string;
  m_strategy_description: string;
}

interface BiasTableProps {
  biases: Bias[];
}

const BiasTable: React.FC<BiasTableProps> = ({ biases }) => {
  return (
    <MDBTable align='middle' responsive bordered small hover className="styled-table">
      <MDBTableHead>
        <tr className="table-header">
          <th>Type</th>
          <th>Source</th>
          <th>Description</th>
          <th>Severity</th>
          <th>Affected Groups</th>
          <th>Mitigation Strategy</th>
          <th>Submitted By</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {biases.map((bias) => (
          <tr key={bias.bias_id} className="table-row">
            <td>{bias.bias_type}</td>
            <td>{bias.bias_source}</td>
            <td>{bias.bias_description}</td>
            <td>
              <MDBBadge color={
                bias.severity_score === 'High' ? 'danger' :
                bias.severity_score === 'Critical' ? 'success' : 'success'
              } pill>
                {bias.severity_score}
              </MDBBadge>
            </td>
            <td>{bias.affected_groups}</td>
            <td>{bias.m_strategy_description}</td>
            <td>{bias.submitted_by}</td>
          </tr>
        ))}
      </MDBTableBody>
    </MDBTable>
  );
};

export default BiasTable;