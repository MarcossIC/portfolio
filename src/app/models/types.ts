export type Directions = {
  LEFT: 'LEFT';
  RIGHT: 'RIGHT';
};

export interface Header {
  ID: string;
  LABEL: string;
  PATH: string;
  FRAGMENT: string;
}

export type LinksHeaderArray = Header[];
