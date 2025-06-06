import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const fillTooltip = (tooltip, vars, effectBurn) => {
  return tooltip.replace(/{{\s*(\w+)\s*}}/g, (_, varName) => {
    const found = vars?.find((v) => v.key === varName);
    if (found && found.coeff) {
      return Array.isArray(found.coeff)
        ? found.coeff.join("/")
        : found.coeff.toString();
    }
    return `[${varName}]`;
  });
};

const ChampionInfo = () => {
  const { id } = useParams();
  const [champion, setChampion] = useState(null);
  const [skinIndex, setSkinIndex] = useState(0);

  useEffect(() => {
    const fetchChampion = async () => {
      try {
        const res = await fetch(
          `https://ddragon.leagueoflegends.com/cdn/15.5.1/data/en_US/champion/${id}.json`
        );
        const data = await res.json();
        setChampion(data.data[id]);
      } catch (err) {
        console.error("Failed to load champion data:", err);
      }
    };

    fetchChampion();
  }, [id]);

  const nextSkin = () => {
    if (skinIndex < champion.skins.length - 1) {
      setSkinIndex(skinIndex + 1);
    } else {
      setSkinIndex(0);
    }
  };

  const prevSkin = () => {
    if (skinIndex === 0) {
      setSkinIndex(champion.skins.length - 1);
    } else {
      setSkinIndex(skinIndex - 1);
    }
  };

  if (!champion) return <p>Loading...</p>;

  const { name: champName, title, lore, stats, passive, spells } = champion;
  const skins = champion.skins;
  const currentSkin = skins[skinIndex];

  return (
    <div className="championPage">
      <h1>
        {champName} — {title}
      </h1>

      <div>{/* display skin carousel here */}</div>

      {currentSkin && (
        <img
          className="splashArt"
          src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${id}_${currentSkin.num}.jpg`}
          alt={currentSkin.name}
        />
      )}

      <button className="leftArrow" onClick={prevSkin}>
        &larr;
      </button>

      <button className="rightArrow" onClick={nextSkin}>
        &rarr;
      </button>

      <h2>Lore</h2>
      <p>{lore}</p>

      <h2>Base Stats</h2>
      <ul>
        <li>HP: {stats.hp}</li>
        <li>Attack Damage: {stats.attackdamage}</li>
        <li>Mana/Energy: {stats.mp}</li>
        <li>Armor: {stats.armor}</li>
        <li>Magic Resist: {stats.spellblock}</li>
        <li>Move Speed: {stats.movespeed}</li>
        <li>Attack Speed: {stats.attackspeed}</li>
        <li>Attack Range: {stats.attackrange}</li>
      </ul>

      <h2>Passive</h2>
      <div className="passive">
        <img
          className="passiveImage"
          src={`https://ddragon.leagueoflegends.com/cdn/15.5.1/img/passive/${passive.image.full}`}
          alt={passive.name}
        />
        <p>
          <strong>{passive.name}</strong>: {passive.description}
        </p>
      </div>

      <h2>Abilities</h2>
      {spells.map((spell) => (
        <div key={spell.id} className="spells">
          <div className="spellHeader">
            <img
              className="spellImage"
              src={`https://ddragon.leagueoflegends.com/cdn/15.5.1/img/spell/${spell.image.full}`}
              alt={spell.name}
            />
            <h3 className="spellName">{spell.name}</h3>
            <div className="spellCost">
              <strong>Cooldown:</strong> {spell.cooldownBurn} seconds
              <br />
              <strong>Cost:</strong>{" "}
              {spell.costBurn ? `${spell.costBurn} mana` : "No Cost"}
            </div>
          </div>
          <p
            className="tooltip"
            dangerouslySetInnerHTML={{
              __html: fillTooltip(spell.tooltip, spell.vars, spell.effectBurn),
            }}
          />
          <ul>
            {spell.effectBurn?.map((val, i) =>
              val && val !== "0" ? (
                <li key={i}>
                  <strong>Effect {i}:</strong> {val}
                </li>
              ) : null
            )}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ChampionInfo;
