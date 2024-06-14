const createError = require("http-errors");
const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { default: mongoose } = require("mongoose");
const { findWithId } = require("../services/findItem");
const bcrypt = require("bcryptjs");

const loginUser = async (req, res, next) => {
  console.log("req.body", req.body);
  try {
    const { phone, password, role } = req.body;
    const user = await User.findOne({ phone });
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        const userInfo = await User.findOne({ phone }).select("-password");

        return successResponse(res, {
          statusCode: 200,
          message: `Login Successfully`,
          payload: { userInfo },
        });
      } else {
        next(createError(500, "Incorrect password"));
      }
    } else {
      next(createError(500, "User not found"));
    }
  } catch (error) {
    next(error);
  }
};

const registerUser = async (req, res, next) => {
  try {
    const { name, email, phone, address, role, password } = req.body;
    // const userExists = await User.exists({ email: email });

    // if (userExists) {
    //   throw createError(409, "Email already exists. Please login");
    // }

    const newUser = {
      name,
      email,
      phone,
      address,
      role,
      password,
    };

    await User.create(newUser);

    const users = await User.find().select("-password");

    return successResponse(res, {
      statusCode: 200,
      message: "Successfully created a company",
      payload: { users },
    });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    if (!users) throw createError(404, "No users found");
    return successResponse(res, {
      statusCode: 200,
      message: "Users return successfully",
      payload: { users },
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findWithId(User, id, options);
    return successResponse(res, {
      statusCode: 200,
      message: "User return successfully",
      payload: { user },
    });
  } catch (error) {
    if (error instanceof mongoose.Error) {
      next(createError(400, "Invalid user id"));
      return;
    }
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const updates = req.body;
    const userId = req.params.id;

    const userExists = await User.findById(userId);

    if (!userExists) {
      throw createError(404, "User not found");
    }

    for (let key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (userExists[key] !== undefined) {
          userExists[key] = updates[key];
        }
      }
    }

    userExists.role = userExists.role;

    await userExists.save();

    const users = await User.find().select("-password");

    return successResponse(res, {
      statusCode: 200,
      message: "User information updated successfully",
      payload: { users },
    });
  } catch (error) {
    next(error);
  }
};

const deleteUserById = async (req, res, next) => {
  try {
    const id = req.params.id;

    await User.findByIdAndDelete({ _id: id });

    const users = await User.find().select("-password");

    return successResponse(res, {
      statusCode: 200,
      message: "User was deleted successfully",
      payload: { users },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loginUser,
  registerUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUserById,
};
