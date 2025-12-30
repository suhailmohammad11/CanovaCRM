import "./CsvUploadStyles.css";
import { useState, useContext } from "react";
import { AdminData } from "../../Context/AdminContext";

const CsvUpload = ({ close }) => {
  const { uploadCsvAndProcessLeads } = useContext(AdminData);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");

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

        await uploadCsvAndProcessLeads(csvText, setProgress);

        alert("CSV imported & leads assigned");
        setUploading(false);
        close?.();
      } catch (err) {
        console.error(err);
        alert("Import failed");
        setUploading(false);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="csv-upload">
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

      {!uploading && (
        <div className="cancel-next">
          <button className="close-btn" onClick={close}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default CsvUpload;
