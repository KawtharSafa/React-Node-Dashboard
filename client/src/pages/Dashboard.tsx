import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  Plus,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Filter,
  X,
} from "lucide-react";

import { useUsers, useDeleteUser } from "../features/users/users.hooks";
import { useAuth } from "../features/auth/auth.context";
import type { User } from "../features/users/users.api";

// ui imports
import { UserCard } from "../components/userCard";
import { UserForm } from "../pages/UserForm";
import { Modal } from "../components/modal";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const LIMIT = 6;

//modal states (null is for closed modal)
type ModalState = { mode: "create" } | { mode: "edit"; userId: string } | null;

export const Dashboard = () => {
  const { logout } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1");
  const search = searchParams.get("search") ?? "";
  const jobTitle = searchParams.get("jobTitle") ?? "";
  const sortBy = (searchParams.get("sortBy") ?? "asc") as "asc" | "desc";

  const [searchInput, setSearchInput] = useState(search);
  const [jobTitleInput, setJobTitleInput] = useState(jobTitle);
  const [modal, setModal] = useState<ModalState>(null);

  const { data, isLoading, isError } = useUsers({
    page,
    limit: LIMIT,
    search: search || undefined,
    jobTitle: jobTitle || undefined,
    sortBy,
  });

  const deleteMutation = useDeleteUser();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const handleDelete = (id: string) => {
    setDeletingId(id);
    deleteMutation.mutate(id, {
      onSettled: () => setDeletingId(null),
    });
  };

  const handleEdit = (user: User) => {
    setModal({ mode: "edit", userId: user.id });
  };

  const handleSearch = (value: string) => {
    setSearchInput(value);
    //reset to page 1 on new search
    setSearchParams({ page: "1", ...(value ? { search: value } : {}) });
  };

  const handlePageChange = (newPage: number) => {
    const current: Record<string, string> = {};
    searchParams.forEach((val, key) => {
      current[key] = val;
    });
    setSearchParams({ ...current, page: String(newPage) });
  };

  const handleJobTitleFilter = (value: string) => {
    setJobTitleInput(value);
    updateParams({ jobTitle: value });
  };

  const handleSortToggle = () => {
    updateParams({ sortBy: sortBy === "asc" ? "desc" : "asc" });
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setJobTitleInput("");
    setSearchParams({ page: "1" });
  };

  const updateParams = (updates: Record<string, string>) => {
    const current: Record<string, string> = {};
    searchParams.forEach((val, key) => {
      current[key] = val;
    });
    const next: Record<string, string> = { ...current, ...updates, page: "1" };
    //clean empty values
    Object.keys(next).forEach((k) => {
      if (!next[k]) delete next[k];
    });
    setSearchParams(next);
  };

  const hasActiveFilters = !!search || !!jobTitle || sortBy !== "asc";

  return (
    <div className="min-h-screen bg-muted/40">
      {/* HEADER */}
      {/* HEADER */}
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        {/* TOP ROW */}
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-2">
          <h1 className="text-lg font-semibold shrink-0">User Management</h1>

          <div className="flex items-center gap-2">
            {/* Search — hidden on very small, visible from sm up */}
            <div className="relative hidden sm:block w-48 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9 h-9 text-sm"
                placeholder="Search users..."
                value={searchInput}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            {/* Add User */}
            <Button
              size="sm"
              className="gap-1.5 bg-blue-700 hover:bg-blue-600 text-white shrink-0"
              onClick={() => setModal({ mode: "create" })}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden xs:inline sm:inline">Add User</span>
            </Button>

            {/* Logout */}
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 shrink-0"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>

        {/* MOBILE SEARCH ROW — only visible on small screens */}
        <div className="sm:hidden px-4 pb-2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9 h-9 text-sm w-full"
              placeholder="Search users..."
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="mx-auto max-w-7xl px-4 py-2 flex flex-wrap items-center gap-2 border-t">
          {/* Job Title Filter */}
          <div className="relative w-full max-w-[180px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              className="pl-8 h-8 text-xs"
              placeholder="Filter by job title..."
              value={jobTitleInput}
              onChange={(e) => handleJobTitleFilter(e.target.value)}
            />
          </div>

          {/* Sort Toggle */}
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 h-8 text-xs shrink-0"
            onClick={handleSortToggle}
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            <span>Name: {sortBy === "asc" ? "A → Z" : "Z → A"}</span>
          </Button>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 h-8 text-xs text-muted-foreground shrink-0"
              onClick={handleClearFilters}
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </Button>
          )}

          {/* Results count */}
          {data && (
            <span className="ml-auto text-xs text-muted-foreground shrink-0">
              {data.total} {data.total === 1 ? "user" : "users"} found
            </span>
          )}
        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: LIMIT }).map((_, i) => (
              <div
                key={i}
                className="h-56 rounded-2xl bg-muted animate-pulse"
              />
            ))}
          </div>
        )}

        {isError && (
          <div className="text-center py-16 text-destructive text-sm">
            Failed to load users. Please try again.
          </div>
        )}

        {!isLoading && !isError && data?.data.length === 0 && (
          <div className="text-center py-16 text-muted-foreground text-sm">
            No users found.
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="ml-1 underline text-blue-600 hover:text-blue-500"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {!isLoading && !isError && data && data.data.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.data.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isDeleting={deletingId === user.id}
                />
              ))}
            </div>

            <div className="mt-10 flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <span className="text-sm text-muted-foreground">
                Page {page} of {data.totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                disabled={page >= data.totalPages}
                onClick={() => handlePageChange(page + 1)}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </main>

      {/* MODAL */}
      {modal && (
        <Modal
          title={modal.mode === "create" ? "Add New User" : "Edit User"}
          onClose={() => setModal(null)}
        >
          <UserForm
            userId={modal.mode === "edit" ? modal.userId : undefined}
            onClose={() => setModal(null)}
          />
        </Modal>
      )}
    </div>
  );
};
