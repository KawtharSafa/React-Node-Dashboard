import {
  fetchUsers,
  fetchUserById,
  createUser,
  updateUser,
  deleteUser,
} from "./users.api";

import {
  type User,
  type UsersParams,
  type UsersResponse,
  type CreateUserInput,
  type UpdateUserInput,
} from "./users.api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useUsers = (params: UsersParams) => {
  return useQuery<UsersResponse>({
    queryKey: ["users", params],
    queryFn: () => fetchUsers(params), // this will be called when the query runs
    placeholderData: (prev) => prev, // keep old data while fetching new data
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUser = (id: string) => {
  return useQuery<User>({
    queryKey: ["user", id],
    queryFn: () => fetchUserById(id), // this will be called when the query runs
    enabled: !!id, // only run this query if id is truthy
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: CreateUserInput) => createUser(req),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, req}: { id: string; req: UpdateUserInput }) =>
      updateUser(id, req),

    onSuccess: (updatedUser) => {
      //update user details in the cache
      queryClient.setQueryData(["users", updatedUser.id], updatedUser);

      //refresh the users list to reflect the updated user details
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,

    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });

      const previousData = queryClient.getQueriesData<UsersResponse>({
        queryKey: ["users"],
      });

      queryClient.setQueriesData<UsersResponse>(
        { queryKey: ["users"] },
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: oldData.data.filter((user: any) => user.id !== id),
          };
        },
      );
      return { previousData };
    },

    onError: (_err, _id, context) => {
      context?.previousData.forEach(([key, value]) => {
        queryClient.setQueryData(key, value);
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

// todo: explaining this file in a comment
// This file defines custom React hooks for interacting with the users API.
// It uses the react-query library to manage server state and caching.
// The hooks include useUsers for fetching a list of users, useUser for
// fetching a single user by ID, useCreateUser for creating a new user,
// useUpdateUser for updating an existing user, and useDeleteUser for
// deleting a user. Each hook uses the corresponding API function defined
// in users.api.ts and handles caching and invalidation of queries to
// ensure the UI stays up to date with the latest data from the server.
