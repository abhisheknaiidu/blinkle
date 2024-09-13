export enum BLINK_TYPE {
  FUNDRAISER = "FUNDRAISER",
  GITHUB = "GITHUB",
  DRIP = "DRIP",
}

export type GitHubBlink = {
  id: string;
  title: string;
  description: string;
  renderDescription: string;
  avatar: string;
  image?: string;
  raised: number;
  type: BLINK_TYPE.GITHUB;
  views: number;
};

export type DripBlink = {
  id: string;
  title: string;
  description: string;
  avatar: string;
  image?: string;
  raised: number;
  type: BLINK_TYPE.DRIP;
  views: number;
};

export type FundraiserBlink = {
  id: string;
  title: string;
  description: string;
  image?: string;
  raised: number;
  type: BLINK_TYPE.FUNDRAISER;
  views: number;
};

export type Blink = GitHubBlink | DripBlink | FundraiserBlink;

export type User = {
  blinks: {
    [id: string]: Blink;
  };
  address: string;
};
