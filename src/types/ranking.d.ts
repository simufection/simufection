type Scoredata = {
  urName: string;
  score: number;
};
type RankingData = {
  [version: string]: {
    all: Scoredata[];
    today: ScoreData[];
  };
};
