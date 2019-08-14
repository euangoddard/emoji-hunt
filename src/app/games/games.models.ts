export interface GameChoice {
  label: string;
  emoji: string;
}

export interface Game {
  name: string;
  id: string;
  choices: GameChoice[];
}

export type Games = readonly Game[];
export type GameChoices = readonly GameChoice[];
