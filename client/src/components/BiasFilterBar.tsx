import React from "react";
import {
  MDBInput,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from "mdb-react-ui-kit";

interface Props {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  severityFilter: string;
  setSeverityFilter: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  componentTypeFilter: string;
  setComponentTypeFilter: (value: string) => void;
  biasTypes: string[];
  clearFilters: () => void;
}

const BiasFilterBar: React.FC<Props> = ({
  searchTerm,
  setSearchTerm,
  severityFilter,
  setSeverityFilter,
  typeFilter,
  setTypeFilter,
  biasTypes,
  setComponentTypeFilter,
  clearFilters,
}) => {
  return (
    <div className="d-flex gap-3 flex-wrap mb-4">
      <MDBInput
        label="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <MDBDropdown>
        <MDBDropdownToggle color="secondary">
          Filter: Severity
        </MDBDropdownToggle>
        <MDBDropdownMenu>
          <MDBDropdownItem link onClick={() => setSeverityFilter("")}>
            All
          </MDBDropdownItem>
          <MDBDropdownItem link onClick={() => setSeverityFilter("High")}>
            High
          </MDBDropdownItem>
          <MDBDropdownItem link onClick={() => setSeverityFilter("Medium")}>
            Medium
          </MDBDropdownItem>
          <MDBDropdownItem link onClick={() => setSeverityFilter("Low")}>
            Low
          </MDBDropdownItem>
        </MDBDropdownMenu>
      </MDBDropdown>

      <MDBDropdown>
        <MDBDropdownToggle color="info">Filter: Bias Type</MDBDropdownToggle>
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

      <MDBDropdown>
        <MDBDropdownToggle color="primary">Filter: Source</MDBDropdownToggle>
        <MDBDropdownMenu>
          <MDBDropdownItem link onClick={() => setComponentTypeFilter("")}>
            All
          </MDBDropdownItem>
          <MDBDropdownItem
            link
            onClick={() => setComponentTypeFilter("Algorithm")}
          >
            Algorithm
          </MDBDropdownItem>
          <MDBDropdownItem
            link
            onClick={() => setComponentTypeFilter("Dataset")}
          >
            Dataset
          </MDBDropdownItem>
        </MDBDropdownMenu>
      </MDBDropdown>

      <button
        className="btn btn-outline-danger d-flex align-items-center gap-2"
        onClick={clearFilters}
      >
        Clear Filters
      </button>
    </div>
  );
};

export default BiasFilterBar;
