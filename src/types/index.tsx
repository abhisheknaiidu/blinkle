export type Fundraiser = {
  id: string;
  title: string;
  description: string;
  image: string;
  raised: number;
  goal: number;
  options: number[];
};

export type User = {
  funds: {
    [id: string]: Fundraiser;
  };
  address: string;
};
