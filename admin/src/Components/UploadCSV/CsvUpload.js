import "./CsvUploadStyles.css";
import { useState, useContext } from "react";
import { AdminData } from "../../Context/AdminContext";

const CsvUpload = ({ close }) => {
  const { importCsvLeads, assignImportedLeads } = useContext(AdminData);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const [step, setStep] = useState("IMPORT"); // IMPORT -> IMPORTED -> ASSIGNED

  // Handle file browse & import
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setUploading(true);
    setProgress(0);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const csvText = event.target.result;

        // Import leads only
        await importCsvLeads(csvText, setProgress);

        setUploading(false);
        setStep("IMPORTED"); // stop after import
      } catch (err) {
        console.error(err);
        alert("CSV import failed");
        setUploading(false);
      }
    };
    reader.readAsText(file);
  };

  // Assign imported leads
  const handleAssign = async () => {
    setUploading(true);
    setProgress(0);
    try {
      await assignImportedLeads((p) => setProgress(p));
      setStep("ASSIGNED");
      alert("Leads assigned successfully!");
      close();
    } catch (err) {
      console.error(err);
      alert("Lead assignment failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={close}>
      <div className="csv-upload" onClick={(e) => e.stopPropagation()}>
        <div className="upload-title-close">
          <div className="upload-title">
            <p>CSV Upload</p>
            <p>Add your documents here</p>
          </div>
          <img
            src="close-icon.png"
            alt="close"
            className="close-icon"
            onClick={close}
          />
        </div>

        <div className="browse-div">
          {!uploading ? (
            <>
              <div className="upload-img-title">
                <img src="upload.png" alt="upload" className="upload-icon" />
                <p className="drag">Drag your file(s) to start uploading</p>
                <div className="or">
                  <img src="long-line.png" alt="line" className="b-line" />
                  <p className="or-p">OR</p>
                  <img src="long-line.png" alt="line" className="b-line" />
                </div>
              </div>

              <div className="browse">
                <label htmlFor="csvUpload" className="upload-btn">
                  Browse files
                  <input
                    id="csvUpload"
                    type="file"
                    accept=".csv"
                    hidden
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </>
          ) : (
            <div className="upload-loader">
              <p className="file-name">{fileName}</p>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="progress-text">{progress}% Uploading...</p>
            </div>
          )}
        </div>

        <div className="cancel-next">
          <button className="close-btn" onClick={close} disabled={uploading}>
            Cancel
          </button>

          {step === "IMPORTED" && (
            <button
              className="next-btn"
              disabled={uploading}
              onClick={handleAssign}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CsvUpload;
