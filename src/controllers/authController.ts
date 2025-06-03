import { User } from "#models/UserSchema.js";
import { catchAsync } from "#utils/catchAsync.js";

export const signup = catchAsync(async (req, res, _next) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: "success",
    data: newUser,
  });
});
