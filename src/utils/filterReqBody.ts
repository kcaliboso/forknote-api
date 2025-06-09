export const filterReqBody = <SourceReqBody extends Record<string, unknown>, AllowedKeys extends keyof SourceReqBody>(
  req: SourceReqBody,
  fields: AllowedKeys[],
): Pick<SourceReqBody, AllowedKeys> => {
  const result = {} as Pick<SourceReqBody, AllowedKeys>;

  for (const key of fields) {
    if (key in req) {
      result[key] = req[key];
    }
  }

  return result;
};
