export interface RatingFilter {
  gte?: string;
  lte?: string;
}

interface IndexFilterType {
  name?: string;
  ratings?: RatingFilter;
}

export interface ShowFilterType {
  fields?: {
    include?: string;
  };
}

export interface IndexQueryType {
  filter?: IndexFilterType;
  sort?: string;
  fields?: string;
}
