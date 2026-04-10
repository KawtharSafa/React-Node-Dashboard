import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";

import {
  userSchema,
  type UserFormValues,
} from "../features/users/users.schema";
import {
  useUser,
  useCreateUser,
  useUpdateUser,
} from "../features/users/users.hooks";

// ui imports
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

type UserFormProps = {
  userId?: string; //this is nullable, if it exists -> admin wants to edit a user / if not -> admin wants to create a user
  onClose: () => void;
};

export const UserForm = ({ userId, onClose }: UserFormProps) => {
  const isEditMode = !!userId;
  const { data: existingUser, isLoading: isFetching } = useUser(userId ?? "");
  const createMutatuion = useCreateUser();
  const updateMutation = useUpdateUser();

  const isMutating = createMutatuion.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (existingUser) {
      reset({
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        email: existingUser.email,
        jobTitle: existingUser.jobTitle,
      });
    }
  }, [existingUser, reset]);

  const onSubmit = (data: UserFormValues) => {
    if (isEditMode && userId) {
      updateMutation.mutate({ id: userId, req: data }, { onSuccess: onClose });
    } else {
      createMutatuion.mutate(data, { onSuccess: onClose });
    }
  };

  if (isEditMode && isFetching) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  return (
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white">
        {/* First Name */}
        <div className="space-y-1.5">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" placeholder="John" {...register("firstName")} />
          {errors.firstName && (
            <p className="text-xs text-destructive">
              {errors.firstName.message}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-1.5">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" placeholder="Doe" {...register("lastName")} />
          {errors.lastName && (
            <p className="text-xs text-destructive">
              {errors.lastName.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Job Title */}
        <div className="space-y-1.5">
          <Label htmlFor="jobTitle">Job Title</Label>
          <Input
            id="jobTitle"
            placeholder="Software Engineer"
            {...register("jobTitle")}
          />
          {errors.jobTitle && (
            <p className="text-xs text-destructive">
              {errors.jobTitle.message}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={isMutating}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            className="flex-1 bg-blue-700 hover:bg-blue-600 text-white"
            disabled={!isValid || isMutating}
          >
            {isMutating ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {isEditMode ? "Saving..." : "Creating..."}
              </span>
            ) : isEditMode ? (
              "Save Changes"
            ) : (
              "Create User"
            )}
          </Button>
        </div>
      </form>
  );
};
