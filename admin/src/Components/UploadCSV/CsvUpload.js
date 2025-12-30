import "./CsvUploadStyles.css";
import { useState, useContext } from "react";
import { AdminData } from "../../Context/AdminContext";

const CsvUpload = ({ close }) => {
  const { importCsvLeads, assignImportedLeads } = useContext(AdminData);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const [step, setStep] = useState(""); 

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      alert("Please upload a CSV file only");
      return;
    }

    e.target.value = null; 
    setFileName(file.name);
    setUploading(true);
    setProgress(0);

    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const csvText = event.target.result;

        await importCsvLeads(csvText, setProgress);

        setUploading(false);
        setStep("IMPORTED"); 
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "Import failed");
        setUploading(false);
      }
    };

    reader.readAsText(file);
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
          <button className="close-btn" onClick={close}>
            Cancel
          </button>

          {step === "IMPORTED" && (
            <button
              className="next-btn"
              onClick={async () => {
                try {
                  setUploading(true);
                  await assignImportedLeads();
                  setUploading(false);
                  close();
                } catch (err) {
                  setUploading(false);
                  alert(err.response?.data?.message || "Assignment failed");
                }
              }}
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
