import "./MatchdayTable.scss";
import { MatchdayResponse } from "../../../models/Matchday";

interface MatchdayTableProps {
  matchday: MatchdayResponse | null
}

const MatchdayTable = ({ matchday }: MatchdayTableProps): JSX.Element => {
  return (
    <div className="matchday-table">
      <h3 className="matchday-table__title">PARTIDOS</h3>
      <div className="matchday-table__container">
        <table className="matchday-table__table">
          <tbody className="matchday-table__tbody"></tbody>
        </table>
      </div>
    </div>
  );
};

export default MatchdayTable;
