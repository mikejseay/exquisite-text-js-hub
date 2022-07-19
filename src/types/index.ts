import { Key } from "react";

export enum Role {
  activeEditor = "activeEditor",
  inactiveEditor = "inactiveEditor",
  spectator = "spectator",
}

export interface IUserInfo {
  id: Key;
  name: string;
  color: string;
  turn: number;
  role: Role;
  turnsAway: number;
}

export interface ILines {
  [id: string]: ILine;
}

export interface ILine {
  id: Key;
  user: IUserInfo;
  value: string;
  time: number;
}

export interface IPoems {
  [id: string]: IPoem;
}

export interface IPoem {
  id: Key;
  content: string;
  time: number;
  title: string;
}