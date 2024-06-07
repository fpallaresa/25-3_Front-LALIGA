import { TeamResponse } from "./Team";

export enum ROL {
  "PLAYER" = "PLAYER",
  "DELEGATE" = "DELEGATE",
  "ADMIN" = "ADMIN",
}

export interface UserCreate {
  email: string
  password: string
  firstName: string
  lastName: string
  image: string
  team?: string
  rol: ROL
}

export interface UserResponse {
  _id: string
  email: string
  password: string
  firstName: string
  lastName: string
  image: string
  team?: string | TeamResponse
  rol: ROL
}
export type { TeamResponse };
