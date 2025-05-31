import { IndexQueryType, RatingFilter } from "#types/filters/RecipeFilters.js";
import { RecipeDocument } from "#types/models/Recipe.js";
import { FilterQuery } from "mongoose";

export const filter = (req: IndexQueryType) => {
  const filter: FilterQuery<RecipeDocument> = {};

  const { name, ratings } = req.filter ?? {};

  if (name) {
    filter.name = { $regex: name, $options: "i" };
  }

  if (ratings) {
    // gets the ratings objects and let's convert it to string
    let convertRatings = JSON.stringify(ratings);

    // /.../ - means regex
    // \b - word boundary meaning, it should match the position of the word we give
    //      in this example, only match gte and lte
    // (gte|lte) - are the words we are matching | means OR
    // g - means all occurances of the pattern (gte or lte)
    // this captures every gte or lte in the string and adds $ in the beginning
    convertRatings = convertRatings.replace(/\b(gte|lte)\b/g, (match) => `$${match}`);

    filter.ratings = JSON.parse(convertRatings) as RatingFilter;
  }

  // Because Recipe.find() returns a Query.prototype we can chain it later on
  // return Recipe.find(filter).sort(advancedSort).select(selectFields);
  return filter;
};
