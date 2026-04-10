import { Trash2, Pencil, Mail, Briefcase } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import type { User } from "../features/users/users.api";

type UserCardProps = {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
};

export const UserCard = ({
  user,
  onEdit,
  onDelete,
  isDeleting,
}: UserCardProps) => {
  return (
    <Card className="rounded-2xl border bg-card shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5 flex flex-col items-center text-center gap-3">
        {/* Avatar */}
        <img
          src={user.avatar}
          alt={`${user.firstName} ${user.lastName}`}
          className="h-16 w-16 rounded-full border-2 border-muted object-cover"
        />

        {/* Name */}
        <div>
          <p className="font-semibold text-sm leading-tight">
            {user.firstName} {user.lastName}
          </p>
        </div>

        {/* Job Title */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Briefcase className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate max-w-[140px]">{user.jobTitle}</span>
        </div>

        {/* Email */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Mail className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate max-w-[160px]">{user.email}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-1 w-full">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5"
            onClick={() => onEdit(user)}
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>

          <Button
            variant="destructive"
            size="sm"
            className="flex-1 gap-1.5"
            onClick={() => onDelete(user.id)}
            disabled={isDeleting}
          >
            <Trash2 className="h-3.5 w-3.5" />
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
