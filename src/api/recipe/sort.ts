import type { IndexQueryType } from "#types/filters/RecipeFilters.js";

export const sort = (req: IndexQueryType) => {
  const { sort } = req;

  let advancedSort;

  if (sort) {
    // This will get the sort
    // e.g ratings (will make it asc) -ratings (will make it desc)
    // if you have a comma separated sort (ratings,name)
    // this will sort the ratings, and if there are the same ratings, sort it by name
    // also using -name on the second param will sort it desc while the ratings is asc
    advancedSort = req.sort?.split(",").join(" ");
  } else {
    // fallback, without sort, this will sort all recipes from newest to oldest
    advancedSort = "-createdAt";
  }

  return advancedSort;
};
