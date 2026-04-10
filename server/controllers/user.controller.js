import * as userService from "../services/user.service.js";

export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, jobTitle, sortBy } = req.query;

    const users = userService.getAllUsers({
      page: Number(page),
      limit: Number(limit),
      search,
      jobTitle,
      sortBy,
    });
    res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const user = userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, jobTitle } = req.body;
    const user = { firstName, lastName, email, jobTitle };

    if (!user.firstName || !user.email || !user.lastName || !user.jobTitle) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const createdUser = await userService.createUser(user);
    return res.status(201).json(createdUser);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const { firstName, lastName, email, jobTitle } = req.body;
    const user = { firstName, lastName, email, jobTitle };

    const payload = {};
    if (firstName !== undefined) payload.firstName = firstName;
    if (lastName !== undefined) payload.lastName = lastName;
    if (email !== undefined) payload.email = email;
    if (jobTitle !== undefined) payload.jobTitle = jobTitle;

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    const updatedUser = await userService.updateUser(userId, payload);
    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const success = userService.deleteUser(userId);
    if (!success) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
