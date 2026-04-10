import { v4 as uuidv4 } from "uuid";
import { readUsersFromFile, writeUsersToFile } from "../utils/file.utils.js";

let users = readUsersFromFile();

// get all users with pagination
export const getAllUsers = ({ page, limit, search, jobTitle, sortBy }) => {
  const start = (page - 1) * limit;
  const end = start + limit;

  // add filtering and sorting logic here
  // filter by name or sort by email

  let filtered = [...users];

  // search by name or job title
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter((user) =>
      `${user.firstName} ${user.lastName}${user.email || ""}`
        .toLowerCase()
        .includes(searchLower),
    );
  }

  // filter by job title
  if (jobTitle) {
    filtered = filtered.filter(
      (user) => user.jobTitle.toLowerCase() === jobTitle.toLowerCase(),
    );
  }

  // add sorting by name
  if (sortBy === "asc") {
    filtered = filtered.sort((a, b) =>
      `${a.firstName} ${a.lastName}`.localeCompare(
        `${b.firstName} ${b.lastName}`,
      ),
    );
  } else if (sortBy === "desc") {
    filtered = filtered.sort((a, b) =>
      `${b.firstName} ${b.lastName}`.localeCompare(
        `${a.firstName} ${a.lastName}`,
      ),
    );
  }

  const data = filtered.slice(start, end);

  return {
    data,
    page,
    limit,
    total: filtered.length,
    totalPages: Math.ceil(filtered.length / limit),
  };
};

// get user by id
export const getUserById = (id) => {
  return users.find((user) => user.id === id);
};

// create new user
export const createUser = (userPayload) => {
  const exists = users.some((user) => user.email === userPayload.email);
  if (exists) {
    throw new Error("User with this email already exists");
  }

  if (
    !userPayload.firstName ||
    !userPayload.email ||
    !userPayload.lastName ||
    !userPayload.jobTitle
  ) {
    throw new Error("First name, last name, email and job are required");
  }

  const newUser = {
    id: uuidv4(),
    ...userPayload,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userPayload.email}`,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  writeUsersToFile(users);
  return newUser;
};

// update user by id
export const updateUser = (id, userPayload) => {
  const userId = users.findIndex((user) => user.id === id);
  if (userId === -1) {
    throw new Error("User not found");
  }

  if (
    userPayload.email &&
    users.some((user) => user.email === userPayload.email && user.id !== id)
  ) {
    throw new Error("User with this email already exists");
  }

  users[userId] = {
    ...users[userId],
    ...userPayload,
  };

  writeUsersToFile(users);
  return users[userId];
};

// delete user by id
export const deleteUser = (id) => {
  const userId = users.findIndex((user) => user.id === id);
  if (userId === -1) {
    throw new Error("User not found");
  }
  users.splice(userId, 1)[0];
  writeUsersToFile(users);
  return true;
};
