// Hooks
import { useState } from "react";
import { useApiErrorHandler } from "./useApiErrorHandler";
// Models
import { User } from "../models/User";
// API
import { api, AxiosError } from "../api";

const useSearchUsers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const { handleApiError } = useApiErrorHandler();

  // Search users
  const handleSearchUsers = async (e: React.FormEvent, excludeIds: number[]) => {
    e.preventDefault();

    try {
      const response = await api.get(
        `/search/users?query=${searchQuery}&exclude=${JSON.stringify(
          excludeIds
        )}`
      );

      if (response.status === 200) {
        setSearchResults(response.data.users);
        setHasSearched(true);
      }
    } catch (error) {
      handleApiError(error as AxiosError);
    }
  };

  // Select user
  const handleSelectUser = (user: User) => {
    if (selectedUsers.some((selected) => selected.id === user.id)) {
      setSelectedUsers(selectedUsers.filter((u) => u !== user));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    selectedUsers,
    setSelectedUsers,
    hasSearched,
    setHasSearched,
    handleSearchUsers,
    handleSelectUser,
  };
};

export default useSearchUsers;
