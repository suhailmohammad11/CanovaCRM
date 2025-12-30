import { useEmployee } from "../../../Hooks/useEmployee";
import "./ChangeTypeFormStyles.css";

const ChangeTypeForm = ({ leadId, close }) => {
  const { changeType } = useEmployee();

  const handleSelect = (type) => {
    changeType(leadId, type);
    close();
  };

  return (
    <div className="change-type-form">
      <p className="type-title">Type</p>

      <button
        type="button"
        className="type-option hot"
        onClick={() => handleSelect("Hot")}
      >
        Hot
      </button>

      <button
        type="button"
        className="type-option warm"
        onClick={() => handleSelect("Warm")}
      >
        Warm
      </button>

      <button
        type="button"
        className="type-option cold"
        onClick={() => handleSelect("Cold")}
      >
        Cold
      </button>
    </div>
  );
};

export default ChangeTypeForm;
