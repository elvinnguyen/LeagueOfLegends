const SearchBar = ({ onSearchChange }) => {
  const handleChange = (event) => {
    onSearchChange(event.target.value);
  };

  return (
    <div>
      <input type="text" placeholder="Search..." onChange={handleChange} />
    </div>
  );
};

export default SearchBar;
