import React, { useState } from "react";
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBTextArea,
  MDBBtn,
  MDBRadio,
} from "mdb-react-ui-kit";
import AdminNavBar from "../components/AdminNavBar.tsx";
import { useAuth } from "../context/AuthContext.tsx";
import PageLayout from "../layouts/PageLayout.tsx";

const AdminSubmitBias: React.FC = () => {
  const { user } = useAuth();
  const [biasType, setBiasType] = useState<string>("");
  const [formData, setFormData] = useState<any>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.user_id) {
      setModalMessage("You must be logged in to submit a bias.");
      setModalOpen(true);
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/biases/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: biasType,
          name: formData.name,
          domain: formData.domain,
          description: formData.description,
          biasType: formData.biasType,
          biasIdentification: formData.biasIdentification,
          severity: formData.severity,
          mitigationStrategies: formData.mitigationStrategies,
          submittedBy: user.user_id,
          version: formData.version,
          publishedDate: formData.publishedDate,
          size: formData.size,
          format: formData.format,
          biasVersionRange: formData.biasVersionRange,
          technique: formData.technique,
          key_characteristic: formData.key_characteristic,
          reference: formData.reference,
        }),
      });

      const result = await res.json();

      if (res.status === 409) {
        setModalMessage(result.message || "This bias already exists!");
        setModalOpen(true);
        return;
      }

      if (!res.ok) {
        setModalMessage(result.message || "Submission failed");
        setModalOpen(true);
        return;
      }

      setModalMessage("Bias entered successfully!");
      setModalOpen(true);
      setFormData({});
      setBiasType("");
    } catch (err: any) {
      console.error(err);
      setModalMessage("Failed to enter bias.");
      setModalOpen(true);
    }
  };

  const renderFields = () => {
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

    const domainDropdown = (
      <div className="mb-3">
        <select
          className="form-select"
          name="domain"
          onChange={handleChange}
          required
        >
          <option value="">-- Select Domain --</option>
          {domainOptions.map((domain) => (
            <option key={domain} value={domain}>
              {domain}
            </option>
          ))}
        </select>
      </div>
    );

    const formatDropdown = (
      <div className="mb-3">
        <select
          className="form-select"
          name="format"
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
      </div>
    );

    if (biasType === "Dataset") {
      return (
        <>
          <MDBInput
            className="mb-3"
            label="Dataset Name"
            name="name"
            onChange={handleChange}
            required
          />
          <MDBInput
            className="mb-3"
            label="Dataset Version"
            name="version"
            onChange={handleChange}
            required
          />
          <MDBInput
            className="mb-3"
            label="Dataset Published Date"
            name="publishedDate"
            onChange={handleChange}
            required
          />
          {domainDropdown}
          <MDBInput
            className="mb-3"
            label="Key Characteristic"
            name="key_characteristic"
            onChange={handleChange}
            required
          />
          <MDBTextArea
            className="mb-3"
            label="Description"
            name="description"
            onChange={handleChange}
            required
            rows={3}
          />
          <MDBInput
            className="mb-3"
            label="Size"
            name="size"
            onChange={handleChange}
            required
          />
          {formatDropdown}
          <MDBInput
            className="mb-3"
            label="Reference"
            name="reference"
            onChange={handleChange}
            required
          />
          <MDBInput
            className="mb-3"
            label="Bias Type"
            name="biasType"
            onChange={handleChange}
            required
          />
          <MDBInput
            className="mb-3"
            label="Bias Version Range"
            name="biasVersionRange"
            onChange={handleChange}
            required
          />
          <div className="mb-3">
            <label className="form-label">Severity Level</label>
            <br />
            <MDBRadio
              name="severity"
              label="High"
              value="High"
              inline
              onChange={handleChange}
            />
            <MDBRadio
              name="severity"
              label="Medium"
              value="Medium"
              inline
              onChange={handleChange}
            />
            <MDBRadio
              name="severity"
              label="Low"
              value="Low"
              inline
              onChange={handleChange}
            />
          </div>
          <MDBTextArea
            className="mb-3"
            label="Mitigation Strategies"
            name="mitigationStrategies"
            onChange={handleChange}
            rows={3}
            required
          />
        </>
      );
    } else if (biasType === "Algorithm") {
      return (
        <>
          <MDBInput
            className="mb-3"
            label="Algorithm Name"
            name="name"
            onChange={handleChange}
            required
          />
          <MDBInput
            className="mb-3"
            label="Algorithm Version"
            name="version"
            onChange={handleChange}
            required
          />
          {domainDropdown}
          <MDBTextArea
            className="mb-3"
            label="Description"
            name="description"
            onChange={handleChange}
            rows={3}
            required
          />
          <MDBInput
            className="mb-3"
            label="Model Type"
            name="technique"
            onChange={handleChange}
            required
          />{" "}
          <MDBInput
            className="mb-3"
            label="Reference"
            name="reference"
            onChange={handleChange}
            required
          />
          <MDBInput
            className="mb-3"
            label="Bias Type"
            name="biasType"
            onChange={handleChange}
            required
          />{" "}
          <MDBInput
            className="mb-3"
            label="Bias Version Range"
            name="biasVersionRange"
            onChange={handleChange}
            required
          />
          <MDBInput
            className="mb-3"
            label="Bias Identification"
            name="biasIdentification"
            onChange={handleChange}
            required
          />
          <div className="mb-3">
            <label className="form-label">Severity Level</label>
            <br />
            <MDBRadio
              name="severity"
              label="High"
              value="High"
              inline
              onChange={handleChange}
            />
            <MDBRadio
              name="severity"
              label="Medium"
              value="Medium"
              inline
              onChange={handleChange}
            />
            <MDBRadio
              name="severity"
              label="Low"
              value="Low"
              inline
              onChange={handleChange}
            />
          </div>
          <MDBTextArea
            className="mb-3"
            label="Mitigation Strategies"
            name="mitigationStrategies"
            onChange={handleChange}
            rows={3}
            required
          />
        </>
      );
    }
    return null;
  };

  return (
    <PageLayout>
      {modalOpen && (
        <div className="custom-modal-backdrop">
          <div className="custom-modal-content">
            <h5>{modalMessage}</h5>
            <MDBBtn color="info" onClick={() => setModalOpen(false)}>
              OK
            </MDBBtn>
          </div>
        </div>
      )}

      <div style={{ minHeight: "100vh" }}>
        <AdminNavBar username={user?.user_name || ""} />
        <MDBContainer
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "80vh" }}
        >
          <MDBCard
            className="w-100 shadow-4"
            style={{ maxWidth: "1000px", borderRadius: "12px" }}
          >
            <MDBCardBody>
              <h4 className="mb-4 text-center">Submit a New Bias</h4>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label">Select Source</label>
                  <select
                    className="form-select"
                    value={biasType}
                    onChange={(e) => setBiasType(e.target.value)}
                    required
                  >
                    <option value="">-- Select --</option>
                    <option value="Dataset">Dataset</option>
                    <option value="Algorithm">Algorithm</option>
                  </select>
                </div>
                {renderFields()}
                <MDBBtn type="submit" block color="info">
                  Submit
                </MDBBtn>
              </form>
            </MDBCardBody>
          </MDBCard>
        </MDBContainer>
      </div>
    </PageLayout>
  );
};

export default AdminSubmitBias;
