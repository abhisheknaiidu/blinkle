export enum BLINK_TYPE {
  FUNDRAISER = "FUNDRAISER",
  GITHUB = "GITHUB",
  DRIP = "DRIP",
}

export type GitHubBlink = {
  id: string;
  title: string;
  description: string;
  avatar: string;
  image?: string;
  raised: number;
  type: BLINK_TYPE.GITHUB;
};

export type DripBlink = {
  id: string;
  title: string;
  description: string;
  avatar: string;
  image?: string;
  raised: number;
  type: BLINK_TYPE.DRIP;
};

export type FundraiserBlink = {
  id: string;
  title: string;
  description: string;
  image?: string;
  raised: number;
  type: BLINK_TYPE.FUNDRAISER;
};

export type Blink = GitHubBlink | DripBlink | FundraiserBlink;

export type User = {
  blinks: {
    [id: string]: Blink;
  };
  address: string;
};
