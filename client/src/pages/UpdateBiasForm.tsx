import React, { useState } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBTextArea,
  MDBBtn,
} from "mdb-react-ui-kit";

interface Bias {
  created_at: string;
  bias_id: number;
  type: string;
  name: string;
  domain: string;
  description: string;
  bias_type: string;
  severity: string;
  dataset_algorithm_version: string;
  published_date: string;
  size: string;
  format: string;
  key_characteristic: string;
  reference: string;
  bias_version_range: string;
  technique: string;
  bias_identification: string;
  mitigation_strategy: string; // from joined mitigation_strategy.strategy_description
}

interface Props {
  bias: Bias;
  onCancel: () => void;
  onUpdated: () => void;
}

const UpdateBiasForm: React.FC<Props> = ({ bias, onCancel, onUpdated }) => {
  const [formData, setFormData] = useState({
    type: bias.type,
    name: bias.name,
    domain: bias.domain,
    description: bias.description,
    bias_type: bias.bias_type,
    severity: bias.severity,
    dataset_algorithm_version: bias.dataset_algorithm_version,
    published_date: bias.published_date,
    size: bias.size,
    format: bias.format,
    key_characteristic: bias.key_characteristic,
    reference: bias.reference,
    bias_version_range: bias.bias_version_range,
    technique: bias.technique,
    bias_identification: bias.bias_identification,
    mitigation_strategy: bias.mitigation_strategy,
  });

  const domainOptions = [
    "Child Welfare Services",
    "Commonsense Knowledge Bases",
    "Computer Vision",
    "Content Moderation",
    "Criminal Justice",
    "Digital Advertising",
    "Facial Recognition and Voice Analysis",
    "Finance",
    "Healthcare",
    "Human Resources / Recruitment",
    "Image Captioning",
    "Law Enforcement",
    "Media Bias Detection",
    "Media Bias and Disinformation",
    "Media Consumption",
    "Multimodal (Image-Text)",
    "Natural Language Processing",
    "News Media Analysis",
    "NLP / Organizational Communication",
    "Object Detection, Image Captioning",
    "Professional Networking",
    "Real Estate",
    "Sentiment Analysis",
    "Social Media",
    "Social Services",
    "Sociology / Fairness in Machine Learning",
    "Transportation",
  ].sort();

  const formatOptions = [
    "CSV, TXT",
    "CSV, JPEG",
    "JPEG images, JSON captions",
    "JPEG images, XML annotations",
    "JPEG, JSON annotations",
    "JSON, CSV",
    "JSON, JPEG",
    "MP4, CSV metadata",
    "Binary image files",
    "CSV",
    "JSON",
    "Text files",
  ].sort();

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(
        `http://localhost:4000/admin/biases/${bias.bias_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();

      if (data.success) {
        setMessage(data.message);
        setError("");
        onUpdated();
        onCancel();
      } else {
        setError(data.message);
        setMessage("");
      }
    } catch (err) {
      console.error(err);
      setError("Update failed.");
    }
  };

  return (
    <MDBCard className="shadow-4">
      <MDBCardBody>
        <h4 className="mb-4">
          Update Bias:
          {bias.bias_id
            ? `AIB-${new Date(bias.created_at).getFullYear()}-${String(
                bias.bias_id
              ).padStart(4, "0")}`
            : "—"}
        </h4>

        <MDBInput
          className="mb-3"
          label="Type"
          name="type"
          value={formData.type}
          disabled
        />

        <MDBInput
          className="mb-3"
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <MDBInput
          className="mb-3"
          label="Version"
          name="dataset_algorithm_version"
          value={formData.dataset_algorithm_version}
          onChange={handleChange}
        />

        <div className="mb-3">
          <label className="form-label">Domain</label>
          <select
            className="form-select"
            name="domain"
            value={formData.domain}
            onChange={handleChange}
          >
            <option value="">-- Select Domain --</option>
            {domainOptions.map((domain) => (
              <option key={domain} value={domain}>
                {domain}
              </option>
            ))}
          </select>
        </div>

        <MDBTextArea
          className="mb-3"
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
        />
        <MDBTextArea
          className="mb-3"
          label="Reference"
          name="reference"
          value={formData.reference}
          onChange={handleChange}
        />

        {formData.type === "Dataset" && (
          <>
            <MDBInput
              className="mb-3"
              label="Size"
              name="size"
              value={formData.size}
              onChange={handleChange}
            />
            <div className="mb-3">
              <label className="form-label">Format</label>
              <select
                className="form-select"
                name="format"
                value={formData.format}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Format --</option>
                {formatOptions.map((format) => (
                  <option key={format} value={format}>
                    {format}
                  </option>
                ))}
              </select>
            </div>{" "}
            <MDBInput
              className="mb-3"
              label="Published Date"
              name="published_date"
              value={formData.published_date}
              onChange={handleChange}
            />
            <MDBInput
              className="mb-3"
              label="Key Characteristic"
              name="key_characteristic"
              value={formData.key_characteristic}
              onChange={handleChange}
            />
          </>
        )}

        {formData.type === "Algorithm" && (
          <>
            <MDBInput
              className="mb-3"
              label="Model Type"
              name="technique"
              value={formData.technique}
              onChange={handleChange}
            />
            <MDBInput
              className="mb-3"
              label="Bias Identification"
              name="bias_identification"
              value={formData.bias_identification}
              onChange={handleChange}
            />
          </>
        )}

        <MDBInput
          className="mb-3"
          label="Bias Type"
          name="bias_type"
          value={formData.bias_type}
          onChange={handleChange}
        />

        <MDBInput
          className="mb-3"
          label="Bias Version Range"
          name="bias_version_range"
          value={formData.bias_version_range}
          onChange={handleChange}
        />

        <div className="mb-3">
          <label className="form-label">Severity Level</label>
          <br />
          <MDBBtn
            outline={formData.severity !== "High"}
            color="danger"
            size="sm"
            onClick={() => setFormData({ ...formData, severity: "High" })}
            className="me-2"
          >
            High
          </MDBBtn>
          <MDBBtn
            outline={formData.severity !== "Medium"}
            color="warning"
            size="sm"
            onClick={() => setFormData({ ...formData, severity: "Medium" })}
            className="me-2"
          >
            Medium
          </MDBBtn>
          <MDBBtn
            outline={formData.severity !== "Low"}
            color="success"
            size="sm"
            onClick={() => setFormData({ ...formData, severity: "Low" })}
          >
            Low
          </MDBBtn>
        </div>

        <MDBTextArea
          className="mb-3"
          label="Mitigation Strategy"
          name="mitigation_strategy"
          value={formData.mitigation_strategy}
          onChange={handleChange}
          rows={2}
        />

        {message && <p className="text-success small">{message}</p>}
        {error && <p className="text-danger small">{error}</p>}

        <div className="d-flex justify-content-end gap-3">
          <MDBBtn color="secondary" onClick={onCancel}>
            Cancel
          </MDBBtn>
          <MDBBtn color="primary" onClick={handleUpdate}>
            Save Changes
          </MDBBtn>
        </div>
      </MDBCardBody>
    </MDBCard>
  );
};

export default UpdateBiasForm;
