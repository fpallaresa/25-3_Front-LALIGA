import { TeamResponse } from "./Team";

export enum MATCHSTATUS {
  "NODISPUTADO" = "NO DISPUTADO",
  "FINALIZADO" = "FINALIZADO",
}

export interface MatchCreate {
  homeTeam: string;
  awayTeam: string;
  homeGoals: Number;
  awayGoals: Number;
  status: string;
}

export interface MatchResponse {
  [x: string]: any;
  _id: string;
  homeTeam: TeamResponse;
  awayTeam: TeamResponse;
  homeGoals: Number;
  awayGoals: Number;
  status: string;
}
