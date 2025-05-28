import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";


const ChampionList = () => {
  const [champions, setChampions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchChampions = async () => {
      const res = await fetch(
        "https://ddragon.leagueoflegends.com/cdn/15.5.1/data/en_US/champion.json"
      );
      const data = await res.json();
      const champArray = Object.values(data.data);
      setChampions(champArray);
    };

    fetchChampions();
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <SearchBar onSearchChange={setSearchTerm} />
      <h1>Select a Champion</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {champions
          .filter((champ) =>
            champ.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((champ) => (
            <Link
              key={champ.id}
              to={`/champion/${champ.id}`}
              style={{
                textDecoration: "none",
                color: "black",
                border: "1px solid #ccc",
                padding: "1rem",
                borderRadius: "8px",
                width: "150px",
                textAlign: "center",
              }}>
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/15.5.1/img/champion/${champ.image.full}`}
                alt={champ.name}
                style={{ width: "100%" }}
              />
              <div>{champ.name}</div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default ChampionList;
