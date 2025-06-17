const SearchBar = ({ onSearchChange }) => {
  const handleChange = (event) => {
    onSearchChange(event.target.value);
  };

  return (
    <div className="search-bar">
      <input type="text" placeholder="Search..." onChange={handleChange} />
    </div>
  );
};

export default SearchBar;
