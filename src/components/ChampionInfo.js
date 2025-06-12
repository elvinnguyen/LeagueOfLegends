import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const fillTooltip = (tooltip, effectBurn = [], vars = []) => {
  if (!tooltip) return "";

  const knownKeywordMap = {
    totaldamage: 1,
    tantrumdamage: 3,
    basedamage: 2,
    totalhealthdamage: 4,
    damage: 0,
    damagereduction: 5,
  };

  let filled = tooltip.replace(/{{\s*(.*?)\s*}}/g, (_, key) => {
    if (key.startsWith("e")) {
      const index = parseInt(key.slice(1));
      return effectBurn?.[index] || `[${key}]`;
    }

    const matchVar = vars?.find((v) => v?.key === key);
    if (matchVar) {
      const ratio = matchVar.coeff?.[0];
      const scale =
        matchVar.link === "spelldamage"
          ? "AP"
          : matchVar.link === "attackdamage"
          ? "AD"
          : matchVar.link;
      return ratio ? `+${ratio * 100}% ${scale}` : `[${key}]`;
    }
    console.warn("Unmapped keyword:", key);
    return `[${key}]`;
  });

  filled = filled.replace(/\[([^\]]+)\]/g, (_, key) => {
    const matchVar = vars?.find((v) => v?.key === key);
    if (matchVar?.effectIndex != null) {
      return effectBurn?.[matchVar.effectIndex] || `[${key}]`;
    }

    const knownIndex = knownKeywordMap[key];
    if (knownIndex != null) {
      return effectBurn?.[knownIndex] || `[${key}]`;
    }

    return `[${key}]`;
  });

  filled = filled.replace(/\[spellmodifierdescriptionappend\]/gi, "");
  return filled;
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

      <div className="artContainer">
        {currentSkin && (
          <img
            className="splashArt"
            src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${id}_${currentSkin.num}.jpg`}
            alt={currentSkin.name}
          />
        )}
      </div>

      <div className="leftArrContainer">
        <button className="leftArrow" onClick={prevSkin}></button>
      </div>

      <div className="rightArrContainer">
        <button className="rightArrow" onClick={nextSkin}></button>
      </div>

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
        <div className="passiveContainer">
          <img
            className="passiveImage"
            src={`https://ddragon.leagueoflegends.com/cdn/15.5.1/img/passive/${passive.image.full}`}
            alt={passive.name}
          />
          <h3 className="passiveName">{passive.name}</h3>
        </div>
        <p>{passive.description}</p>
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
            className="toolTip"
            dangerouslySetInnerHTML={{
              __html: fillTooltip(spell.tooltip, spell.effectBurn, spell.vars),
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
