import { IndexQueryType } from "../../types/filters/RecipeFilters";
import { populateSelectOptions } from "../../utils/populateSelectOptions";

type PopulateKey = keyof typeof populateSelectOptions;

export const populate = (req: IndexQueryType) => {
  const { populate } = req;

  const populateObj = (populate ?? [])
    .filter((item): item is PopulateKey => item in populateSelectOptions)
    .map((item) => ({
      path: item,
      select: populateSelectOptions[item],
    }));
  return populateObj;
};
