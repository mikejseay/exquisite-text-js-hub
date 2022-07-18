export enum Role {
    activeEditor = "activeEditor",
    inactiveEditor = "inactiveEditor",
    spectator = "spectator",
  }

export type UserInfo = {
  id: string;
  name: string;
  color: string;
  turn: number;
  role: Role;
  turnsAway: number;
};
