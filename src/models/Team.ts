export interface TeamCreate {
  name: string;
  alias: string;
}

export interface TeamResponse extends TeamCreate {
  _id: string;
  name: string;
  alias: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  players: Player[];
}

export interface Player {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  rol: string;
  team: string;
}