export interface RatingFilter {
  gte?: string;
  lte?: string;
}

interface IndexFilterType {
  name?: string;
  ratings?: RatingFilter;
  // add more here if needed
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
  page?: number; // this is the .skip() on mongoose
  limit?: number;
  populate?: string[];
}

// .skip() means, if we have 30 items in our database
// and we want to take the items 11-20 (since out limit is 10 for example)
// we will need skip(10). if 1-10 is needed skip is 0 and skip is 20
// if we need to get 21-30
