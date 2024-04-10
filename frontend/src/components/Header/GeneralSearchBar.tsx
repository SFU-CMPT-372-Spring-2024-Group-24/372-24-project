// Hooks
import { useState, useEffect, useRef } from "react";
import { useUser } from "../../hooks/UserContext";
import { useTasks } from "../../hooks/TaskContext";
// Models
import { User } from "../../models/User";
import { FileModel as File } from "../../models/FileModel";
import { Task } from "../../models/Task";
import { Project } from "../../models/Project";
import { Role } from "../../models/ProjectRole";
// Components
import PreviewFileModal from "../Modals/PreviewFile/PreviewFileModal";
import TaskModal from "../Modals/TaskModal/TaskModal";
// Icons
import { IoSearch } from "react-icons/io5";
// API
import { api } from "../../api";

interface Props {
  placeholder: string;
}

const GeneralSearchBar = ({ placeholder = "Search" }: Props) => {
  const pathname = window.location.pathname.split("/");
  const projectId = parseInt(pathname[2]);

  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<{ users: User[], files: File[], tasks: Task[], projects: Project[], otherProjects: Project[] }>({ users: [], files: [], tasks: [], projects: [], otherProjects: [] });
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const searchInputRef = useRef(null);
  const searchResultsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !(searchInputRef.current as HTMLInputElement).contains(event.target as Node)
      ) {
        setIsResultsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchTermChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    setSearchTerm(value);
    setIsResultsVisible(true);

    if (value.trim().length === 0) {
      setResults({ users: [], files: [], tasks: [], projects: [], otherProjects: [] });
      return;
    } else if (value.trim().length <= 1) {
      return;
    }
    await search();
  };

  const search = async () => {
    // Search for the term everywhere
    try {
      const userResponse = await api.get(`search/users?query=${searchTerm}`);
      const projectResponse = await api.get(`search/projects?query=${searchTerm}`);
      // const otherProjectResponse = await api.get(`search/projects/other?query=${searchTerm}`);
      setResults({
        users: userResponse.data.users,
        files: [],
        tasks: [],
        projects: projectResponse.data.projects,
        otherProjects: []
      });
    } catch (error) {
      console.error(error);
    }
  }

  const isResultsEmpty = results.users.length === 0 && results.files.length === 0 && results.tasks.length === 0 && results.projects.length === 0 && results.otherProjects.length === 0;

  const content = (
    <div className="search-bar">
      <IoSearch size={20} className="search-icon" />
      <input
        ref={searchInputRef}
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearchTermChange}
        onFocus={() => setIsResultsVisible(true)}
      />
      {searchTerm.trim().length !== 0 &&
        isResultsVisible && (
          <div className="search-results" ref={searchResultsRef}>
            {results.users.length > 0 && (
              <>
                <div className="search-result-header">
                  <b>Users</b>
                </div>
                {results.users.map(user => (
                  <div
                    key={user.id}
                    className="search-result"
                    onClick={() => open(`/profile/${user.username}`, "_self")}
                  >
                    <b>{user.name}</b>
                    <p>@{user.username}</p>
                  </div>
                ))}
              </>
            )}
            {results.projects.length > 0 && (
              <>
                <div className="search-result-header">
                  <b>Projects</b>
                </div>
                {results.projects.map(project => (
                  <div
                    key={project.id}
                    className="search-result"
                    onClick={() => open(`/projects/${project.id}`, "_self")}
                  >
                    <b>{project.name}</b>
                    <p>{project.description}</p>
                  </div>
                ))}
              </>
            )}
            {results.otherProjects.length > 0 && (
              <>
                <div className="search-result-header">
                  <b>Other projects</b>
                </div>
                {results.otherProjects.map(project => (
                  <div key={project.id} className="search-result">
                    <p>{project.name}</p>
                  </div>
                ))}
              </>
            )}
            {searchTerm.trim().length <= 1 ? (
              <div className="search-result">
                <p>Type more to search</p>
              </div>
            ) : isResultsEmpty && (
              <div className="search-result">
                <p>No results found</p>
              </div>
            )}
          </div>
        )}

    </div>
  );

  return content;
};

export default GeneralSearchBar;