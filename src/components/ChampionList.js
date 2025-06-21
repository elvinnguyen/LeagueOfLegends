import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MenuBar from "./MenuBar";

const ChampionList = () => {
  const [champions, setChampions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  useEffect(() => {
    const fetchChampions = async () => {
      const res = await fetch(
        "https://ddragon.leagueoflegends.com/cdn/15.12.1/data/en_US/champion.json"
      );
      const data = await res.json();
      const champArray = Object.values(data.data);
      setChampions(champArray);
    };

    fetchChampions();
  }, []);

  const handleTagFilter = (tag) => {
    setSelectedTag(tag);
  };

  return (
    <div className="page">
      <MenuBar onSearchChange={setSearchTerm} />
      <div className="content">
        <div className="button-container">
          <button className="filter-button" onClick={() => handleTagFilter("")}>
            All
          </button>
          <button
            className="filter-button"
            onClick={() => handleTagFilter("Assassin")}>
            Assassin
          </button>
          <button
            className="filter-button"
            onClick={() => handleTagFilter("Fighter")}>
            Fighter
          </button>
          <button
            className="filter-button"
            onClick={() => handleTagFilter("Mage")}>
            Mage
          </button>
          <button
            className="filter-button"
            onClick={() => handleTagFilter("Marksman")}>
            Marksman
          </button>
          <button
            className="filter-button"
            onClick={() => handleTagFilter("Support")}>
            Support
          </button>
          <button
            className="filter-button"
            onClick={() => handleTagFilter("Tank")}>
            Tank
          </button>
        </div>

        <div className="champion-grid">
          {champions
            .filter((champ) =>
              champ.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .filter(
              (champ) => selectedTag === "" || champ.tags.includes(selectedTag)
            )
            .map((champ) => (
              <Link
                key={champ.id}
                to={`/champion/${champ.id}`}
                className="champion-card">
                <img
                  className="champion-image"
                  src={`https://ddragon.leagueoflegends.com/cdn/15.5.1/img/champion/${champ.image.full}`}
                  alt={champ.name}
                />
                <div className="champion-card-name">{champ.name}</div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ChampionList;
