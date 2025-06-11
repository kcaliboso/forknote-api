import { AppErrorClass } from "./appErrorClass";

export const filterReqBody = <SourceReqBody extends Record<string, unknown>, AllowedKeys extends keyof SourceReqBody>(
  req: SourceReqBody,
  fields: AllowedKeys[],
): Pick<SourceReqBody, AllowedKeys> => {
  const result = {} as Pick<SourceReqBody, AllowedKeys>;

  try {
    for (const key of fields) {
      if (key in req) {
        result[key] = req[key];
      }
    }
  } catch (_error) {
    throw new AppErrorClass("Something went wrong. Please try again later.", 500);
  }

  return result;
};
