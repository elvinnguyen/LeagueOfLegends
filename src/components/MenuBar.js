import SearchBar from "./SearchBar";

const MenuBar = ({ onSearchChange }) => {
  return (
    <div className="menu-bar">
      <div className="spacer"></div>
      <h1 className="title">Select a Champion</h1>
      <div className="search-bar">
        <SearchBar onSearchChange={onSearchChange} />
      </div>
    </div>
  );
};

export default MenuBar;
