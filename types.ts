
export interface Person {
  id: string;
  name: string;
}

export enum AppTab {
  NAME_LIST = 'NAME_LIST',
  LUCKY_DRAW = 'LUCKY_DRAW',
  GROUPING = 'GROUPING'
}

export interface Group {
  id: number;
  name: string;
  members: Person[];
}

export interface DrawResult {
  timestamp: number;
  winner: Person;
}
