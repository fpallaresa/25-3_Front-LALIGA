import { useState, useEffect } from "react";
import Slider from "react-slick";
import shield from "../../../assets/shield.png";
import "./MatchdayTable.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface Team {
  _id: string;
  name: string;
  alias: string;
}

interface Match {
  _id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeGoals: number;
  awayGoals: number;
  status: string;
}

interface Matchday {
  _id: string;
  matchdayNumber: number;
  date: string;
  matches: Match[];
}

const MatchdayTable = (): JSX.Element => {
  const API_URL_MATCHDAY = `${process.env.REACT_APP_API_URL as string}/matchday`;
  const [matchdays, setMatchdays] = useState<Matchday[]>([]);

  useEffect(() => {
    fetchMatchdays();
  }, []);

  const fetchMatchdays = (): void => {
    fetch(API_URL_MATCHDAY, {
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
        setMatchdays(responseParsed.data);
      })
      .catch((error) => {
        console.error(error);
        alert("Ha ocurrido un error en la petición");
      });
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="matchday-table">
      <h3 className="matchday-table__title">PARTIDOS</h3>
      <Slider {...settings}>
        {matchdays.map((matchday) => (
          <div key={matchday._id} className="matchday-carousel__item">
            <h4 className="matchday-table__subtitle">JORNADA {matchday.matchdayNumber}</h4>
            <table className="matchday-table__table">
              <tbody className="matchday-table__tbody">
                {matchday.matches.map((match) => (
                  <tr key={match._id}>
                    <td className="matchday-table__home-team">
                      {match.homeTeam.alias}
                      <img className="matchday-table__home-team-image" src={shield} alt={`${match.homeTeam.name} shield`} />
                    </td>
                    <td className="matchday-table__status">
                      {match.status === "NO DISPUTADO" ? "NO DISPUTADO" : `${match.homeGoals} - ${match.awayGoals}`}</td>
                    <td className="matchday-table__away-team">
                      <img className="matchday-table__away-team-image" src={shield} alt={`${match.awayTeam.name} shield`} />
                      {match.awayTeam.alias}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default MatchdayTable;
