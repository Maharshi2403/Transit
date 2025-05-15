const express = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config");
const bycrypt = require("bcrypt");
const userRouter = express.Router();
const { User } = require("../database");
const asyncHandler = require("express-async-handler");

async function auth(req, res, next) {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith("Bearer ")) {
    res.status(403).send({
      msg: "Token not found.",
    });
  }

  const token = bearer.split(" ")[1];

  try {
    const decode = await jwt.verify(token, JWT_SECRET);

    req.userId = decode.userId;
    next();
  } catch (err) {
    if (err) {
      console.log("Error in verifing token!");
      res.status(411).send({
        msg: "Token not varified!",
      });
    }
  }
}
async function hashPassword(plainPassword) {
  const saltRound = 10;
  const salt = await bycrypt.genSalt(saltRound);
  return await bycrypt.hash(plainPassword, salt);
}

async function varifyPassword(hashedPassword, givenPassword) {
  return await bycrypt.compare(givenPassword, hashedPassword);
}
const signUpSchema = zod.object({
  username: zod.string().email(),
  password: zod.string(),
  firstname: zod.string(),
  lastname: zod.string(),
});
userRouter.post(
  "/signup",
  asyncHandler(async (req, res) => {
    const { success } = signUpSchema.safeParse(req.body);

    if (!success) {
      console.log("Invalid body!");
      res.send({
        msg: "Invalid inputs.",
      });
    }

    const find = await User.findOne({
      username: req.body.username,
    });

    if (find) {
      console.log("Another user found with same username.");
      res.status(404).send({
        msg: "Username already taken!",
      });
    }
    try {
      const newuser = User.create({
        username: req.body.username,
        password: await hashPassword(req.body.password),
        firstname: req.body.firstname,
        lastname: req.body.lastname,
      });

      const token = jwt.sign(
        {
          userId: newuser._id,
        },
        JWT_SECRET
      );

      console.log("User created successfully!!");

      res.status(200).send({
        token: token,
      });
    } catch (err) {
      console.log("Error creating new user!");
      res.status(411).send({
        msg: "Error creating new user to database!",
      });
    }
  })
);

userRouter.post(
  "/signin",
  auth,
  asyncHandler(async (req, res) => {
    const user = await User.findOne({
      _id: req.userId,
    });
    if (!user) {
      console.log("User does not exist!");
      res.status(411).send({
        msg: "User not found!",
      });
    }

    const verify = await varifyPassword(req.body.password, user.password);

    if (verify) {
      console.log("Verification succsess!");
      res.status(200).send({
        msg: "Login Succsess!",
      });
    }
  })
);

module.exports = userRouter;
