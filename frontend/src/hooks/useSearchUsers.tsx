// Hooks
import { useState } from "react";
import { useApiErrorHandler } from "./useApiErrorHandler";
// Models
import { User } from "../models/User";
// API
import { api, AxiosError } from "../api";

const useSearchUsers = () => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [searched, setSearched] = useState<boolean>(false);
  const { handleApiError } = useApiErrorHandler();

  // Search users
  const handleSearch = async (e: React.FormEvent, excludeIds: number[]) => {
    e.preventDefault();
    console.log(excludeIds);
    try {
      const response = await api.get(
        `/search/users?query=${query}&exclude=${JSON.stringify(excludeIds)}`
      );

      if (response.status === 200) {
        setResults(response.data.users);
        setSearched(true);
      }
    } catch (error) {
      handleApiError(error as AxiosError);
    }
  };

  // Select user
  const handleSelect = (user: User) => {
    if (selectedUsers.some((selected) => selected.id === user.id)) {
      setSelectedUsers(selectedUsers.filter((u) => u !== user));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  return {
    query,
    setQuery,
    results,
    setResults,
    selectedUsers,
    setSelectedUsers,
    searched,
    setSearched,
    handleSearch,
    handleSelect,
  };
};

export default useSearchUsers;
