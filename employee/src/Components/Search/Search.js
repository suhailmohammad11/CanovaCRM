import "./SearchStyles.css";
import { useLocation } from "react-router-dom";
const Search = ({ onSearch, onFilter }) => {
  const location = useLocation();
  const handleSearch = (e) => {
    onSearch(e.target.value);
  };
  return (
    <div className="search-comp">
      <div className="search-title">
        <img src="search-icon.png" alt="search" className="search-img" />
        <input
          placeholder="Search"
          type="text"
          className="search-input"
          onChange={handleSearch}
        />
      </div>
      {onFilter && (
        <div
          className={
            location.pathname === "/leads" ? "no-filter-div" : "filter-icon"
          }
          onClick={onFilter}
        >
          <img src="filter.png" alt="filter" className="filter" />
        </div>
      )}
    </div>
  );
};

export default Search;
