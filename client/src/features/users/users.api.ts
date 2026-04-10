import api from "../../api/client";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  avatar: string;
  createdAt: string;
};

export type UsersResponse = {
  data: User[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type UsersParams = {
  page: number;
  search?: string;
  limit?: number;
  jobTitle?: string;
  sortBy?: "asc" | "desc";
};

export type CreateUserInput = {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
};

export type UpdateUserInput = Partial<CreateUserInput>;

export const fetchUsers = async (
  params: UsersParams,
): Promise<UsersResponse> => {
  const res = await api.get<UsersResponse>("/users", { params });
  return res.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`);
};

export const updateUser = async (
  id: string,
  data: UpdateUserInput,
): Promise<User> => {
  const res = await api.patch<User>(`/users/${id}`, data);
  return res.data;
};

export const createUser = async (data: CreateUserInput): Promise<User> => {
  const res = await api.post<User>("/users", data);
  return res.data;
};

export const fetchUserById = async (id: string): Promise<User> => {
  const res = await api.get<User>(`/users/${id}`);
  return res.data;
};

// This file defines the API functions for interacting with the
// users endpoint of the backend API. It includes functions to
// fetch a list of users, fetch a single user by ID, create a
// new user, update an existing user, and delete a user.
// Each function uses the `api` client to make HTTP requests
// to the appropriate endpoints and returns the response data.
// The types for the user data and response structures are also
// defined in this file.
