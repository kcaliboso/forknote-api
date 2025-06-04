import { Recipe } from "#models/RecipeSchema.js";
import { Role } from "#types/enums/Role.js";
import { UserDocument } from "#types/models/User.js";
import { AppErrorClass } from "#utils/appErrorClass.js";
import type { Request, Response, NextFunction } from "express";

// this could've been in the same file as isAuthenticated
// but we can do this if we need more control of the models
export const isAuthorized = (...roles: Role[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const user = req.user as UserDocument;

    // check if user has enough authorization
    if (!roles.includes(user.role)) {
      next(new AppErrorClass("Forbidden Access", 403));
      return;
    }

    const { id } = req.params;

    // in here, we only allow the update and delete of the recipe
    // if the owner is the same as the current logged in user
    if (id) {
      console.log(id);
      const recipe = await Recipe.findById(id);

      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      if (recipe?.owner.toString() !== user.id) {
        next(new AppErrorClass("You don't have access to this resource", 403));
        return;
      }
    }

    // Only allow admins and customers to access the other parts
    // of crud. We can remove this, if all roles can access CRUD.
    // and will create more granular changes on the authorization
    next();
  };
};
