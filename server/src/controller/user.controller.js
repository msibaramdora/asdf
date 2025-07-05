import userModel from "../model/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { registerSchema } from "../validator/auth.validator.js";

const registerUser = asyncHandler(async (req, res) => {
  const { data, error } = registerSchema.safeParse(req.body);

  if (error) {
    throw new ApiError(400, error[0].message, error[0].path);
  }

  const { username, email, password } = data;

  const existedUser = await userModel.findOne({ email });

  if (existedUser) {
    throw new ApiError(400, "User already exists");
  }

  const user = await userModel.create({
    username,
    email,
    password,
  });

  const createUser = {
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    jwtToken: user.createJwtToken(),
  };

  res
    .status(201)
    .json(new ApiResponse(201, createUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { data, error } = loginSchema.safeParse(req.body);

  if (error) {
    throw new ApiError(400, error[0].message, error[0].path);
  }

  const { email, password } = data;

  const user = await userModel.findOne({ email });

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    throw new ApiError(401, "Unauthorized");
  }

  const loginUser = {
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    jwtToken: user.createJwtToken(),
  };

  res
    .status(200)
    .json(new ApiResponse(200, loginUser, "User logged in successfully"));
});

export { registerUser, loginUser };
