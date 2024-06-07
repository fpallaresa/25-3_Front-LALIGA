import { MatchResponse } from "./Match";

export interface MatchdayCreate {
  matchdayNumber: number;
  date: Date;
  matches: string;
}

export interface MatchdayResponse {
  _id: string;
  matchdayNumber: number;
  date: Date;
  matches: MatchResponse;
}
