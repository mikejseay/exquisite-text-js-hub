export enum Role {
    activeEditor = "activeEditor",
    inactiveEditor = "inactiveEditor",
    spectator = "spectator",
  }

export interface IUserInfo {
  id: string;
  name: string;
  color: string;
  turn: number;
  role: Role;
  turnsAway: number;
};

export interface ILines {
  [id: string]: ILine;
}

export interface ILine {
  id: string;
  user: IUserInfo;
  value: string;
  time: number;
}
