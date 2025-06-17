import { Recipe } from "../../models/RecipeSchema";
import { IndexQueryType } from "../../types/filters/RecipeFilters";
import { fields } from "./fields";
import { filter } from "./filters";
import { populate } from "./populate";
import { sort } from "./sort";

export const buildQuery = async (query: IndexQueryType) => {
  const selectedFields = fields(query);
  const advancedSort = sort(query);
  const queryFilter = filter(query);
  const populateObj = populate(query);

  const options = {
    page: query.page,
    limit: query.limit,
    sort: advancedSort,
    select: selectedFields,
    populate: populateObj,
  };

  return await Recipe.paginate(queryFilter, options);
};
