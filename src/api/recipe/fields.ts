import type { IndexQueryType } from "../../types/filters/RecipeFilters";

export const fields = (req: IndexQueryType) => {
  const { fields } = req;

  let selectFields = "-__v";

  if (fields) {
    selectFields = fields.split(",").join(" ");
  }

  return selectFields;
};
