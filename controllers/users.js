import { v4 as uuidv4 } from "uuid";
import { check, validationResult } from "express-validator";

let users = [];
export const createUser = [
  // Middleware to validate incoming request data
  check("firstName").notEmpty().withMessage("First name is required"),
  check("age")
    .isInt({ min: 0 })
    .withMessage("Age must be a non-negative integer"),

  // The actual controller function that creates the user
  (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Return a 400 error with details of the validation issues
      return res.status(400).json({ errors: errors.array() });
    }

    // Proceed with creating the user if validation passes
    const user = req.body;
    users.push({ ...user, id: uuidv4() });
    res.send(`User with the name ${user.firstName} added to the database!`);
  },
];
export const getUsers = (req, res) => {
  res.send(users);
};

export const getUser = (req, res) => {
  const { id } = req.params;

  const foundUser = users.find((user) => user.id == id);
  if (!foundUser) {
    return res.status(404).send(`User with id ${id} not found`);
  }
  res.send(foundUser);
};

export const deleteUser = (req, res) => {
  const { id } = req.params;
  const user = users.find((user) => user.id == id);

  if (!user) {
    return res.status(404).send(`User with id ${id} not found`);
  }

  users = users.filter((user) => user.id != id);
  res.send(`User with the id ${id} deleted from the database`);
};

export const updateUser = (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, age } = req.body;
  const user = users.find((user) => user.id == id);

  if (!user) {
    return res.status(404).send(`User with id ${id} not found`);
  }

  if (firstName) {
    user.firstName = firstName;
  }

  if (lastName) {
    user.lastName = lastName;
  }

  if (age) {
    user.age = age;
  }

  res.send(`User with the id ${id} has been updated`);
};
