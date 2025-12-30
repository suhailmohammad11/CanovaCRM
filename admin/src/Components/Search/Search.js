import "./SearchStyles.css";

const Search = ({ value, onChange }) => {
  return (
    <div className="search-comp">
      <div className="search">
        <img src="search.png" alt="search" className="search-icon" />
        <input
          type="text"
          placeholder="Search here..."
          className="search-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Search;
