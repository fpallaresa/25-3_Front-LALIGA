import { useState, useEffect } from "react";
import shield from "../../../assets/shield.png";
import "./StandingTable.scss";

interface TeamStanding {
  position: number
  teamName: string
  points: number
  played: number
  wins: number
  draws: number
  losses: number
}

const StandingTable = (): JSX.Element => {
  const API_URL_STANDING = `${process.env.REACT_APP_API_URL as string}/standing`;
  const [standing, setStanding] = useState<TeamStanding[]>([]);

  useEffect(() => {
    fetchStanding();
  }, []);

  const fetchStanding = (): void => {
    fetch(API_URL_STANDING, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        if (response.status !== 200) {
          alert("Ha ocurrido un error en la petición");
          return;
        }
        return await response.json();
      })
      .then((responseParsed) => {
        setStanding(responseParsed);
      })
      .catch((error) => {
        console.error(error);
        alert("Ha ocurrido un error en la petición");
      });
  };

  return (
    <div className="standing-table">
      <h3 className="standing-table__title">CLASIFICACIÓN</h3>
      <table className="standing-table__table">
        <thead className="standing-table__thead">
          <tr>
            <th>POS</th>
            <th className="standing-table__tteam">EQUIPO</th>
            <th>PTS</th>
            <th>PG</th>
            <th>PE</th>
            <th>PP</th>
          </tr>
        </thead>
        <tbody className="standing-table__tbody">
          {standing.map((team) => (
            <tr key={team.position}>
              <td className="standing-table__tposition">{team.position}</td>
              <td className="standing-table__tteam">
                <img src={shield} alt={`${team.teamName} shield`} />
                {team.teamName}
              </td>
              <td>{team.points}</td>
              <td>{team.wins}</td>
              <td>{team.draws}</td>
              <td>{team.losses}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StandingTable;
