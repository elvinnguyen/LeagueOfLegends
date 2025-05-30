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
    <div className="page">
      <h1>Select a Champion</h1>
      <SearchBar onSearchChange={setSearchTerm} />
      <div className="championGrid">
        {champions
          .filter((champ) =>
            champ.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((champ) => (
            <Link
              key={champ.id}
              to={`/champion/${champ.id}`}
              className="championCard">
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/15.5.1/img/champion/${champ.image.full}`}
                alt={champ.name}
              />
              <div>{champ.name}</div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default ChampionList;
