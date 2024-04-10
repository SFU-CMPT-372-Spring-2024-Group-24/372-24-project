// Hooks
import { useState, useEffect, useRef } from "react";
import { useUser } from "../../hooks/UserContext";
import { TaskProvider } from "../../hooks/TaskContext";
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

const SearchBar = ({ placeholder = "Search" }: Props) => {
  const pathname = window.location.pathname.split("/");
  const projectId = parseInt(pathname[2]);
  // TaskProvider
  const { user } = useUser();
  const [project, setProject] = useState<Project | null>(null);
  const [userRole, setUserRole] = useState<Role | null>(null);

  if (!isNaN(projectId)) {
    // Fetch project data
    useEffect(() => {
      const fetchProject = async () => {
        try {
          const response = await api.get(`/projects/${projectId}`);

          if (response.status === 200) {
            setProject(response.data);
          }
        } catch (error) {
          // open("/projects/notfound");
        }
      };

      fetchProject();
    }, []);

    // Fetch user role in project
    useEffect(() => {
      if (!project || !user) return;

      const fetchUserRole = async () => {
        try {
          const response = await api.get(`/roles/${project.id}`);
          setUserRole(response.data);
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      };

      fetchUserRole();
    }, [project]);

    // Fetch user role in project
    useEffect(() => {
      if (!project || !user) return;

      const fetchUserRole = async () => {
        try {
          const response = await api.get(`/roles/${project.id}`);
          setUserRole(response.data);
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      };

      fetchUserRole();
    }, [project]);
  }

  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<{ users: User[], files: File[], tasks: Task[], projects: Project[], otherProjects: Project[] }>({ users: [], files: [], tasks: [], projects: [], otherProjects: [] });
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const searchInputRef = useRef(null);
  const searchResultsRef = useRef<HTMLDivElement | null>(null);
  
  const [isShowingPreviewFileModal, setIsShowingPreviewFileModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [isShowingTaskModal, setIsShowingTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isShowingPreviewFileModal || isShowingTaskModal) return;

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
  }, [isShowingPreviewFileModal, isShowingTaskModal]);

  const handleSearchTermChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    setSearchTerm(value);
    setIsResultsVisible(true);

    if (value.trim().length === 0) {
      setResults({ users: [], files: [], tasks: [], projects: [], otherProjects: [] });
      return;
    }

    if (pathname[1] === "projects" && !isNaN(projectId)) {
      await searchInProject(projectId);
    } else {
      await search();
    }
  };

  const searchInProject = async (projectId: number) => {
    try {
      const userResponse = await api.get(`search/users/project/${projectId}?query=${searchTerm}`);
      const fileResponse = await api.get(`search/files/project/${projectId}?query=${searchTerm}`);
      const taskResponse = await api.get(`search/tasks/project/${projectId}?query=${searchTerm}`);
      setResults({
        users: userResponse.data.users,
        files: fileResponse.data.files,
        tasks: taskResponse.data.tasks,
        projects: [],
        otherProjects: []
      });
    } catch (error) {
      console.error(error);
    }
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

  const onFileClick = (file: File) => {
    setSelectedFile(file);
    setIsShowingPreviewFileModal(true);
  };

  const onTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsShowingTaskModal(true);
  };

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
            {results.files.length > 0 && (
              <>
                <div className="search-result-header">
                  <b>Files</b>
                </div>
                {results.files.map(file => (
                  <div
                    key={file.id}
                    className="search-result"
                    onClick={() => onFileClick(file)}
                  >
                    <p>{file.name}</p>
                  </div>
                ))}
              </>
            )}
            {results.tasks.length > 0 && (
              <>
                <div className="search-result-header">
                  <b>Tasks</b>
                </div>
                {results.tasks.map(task => (
                  <div
                    key={task.id}
                    className="search-result"
                    onClick={() => onTaskClick(task)}
                  >
                    <p>{task.name}</p>
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
            {isResultsEmpty && (
              <div className="search-result">
                <p>No results found</p>
              </div>
            )}
          </div>
        )}

    </div>
  );

  if (!isNaN(projectId)) {
    return (<>
      {project && userRole &&
        <TaskProvider
          project={project}
          setProject={setProject}
          userRole={userRole}
          setUserRole={setUserRole}
        >
          {content}
          <PreviewFileModal
            showPreviewFileModal={isShowingPreviewFileModal}
            setShowPreviewFileModal={setIsShowingPreviewFileModal}
            selectedFile={selectedFile}
          />
          <TaskModal
            isShowing={isShowingTaskModal}
            setIsShowing={setIsShowingTaskModal}
            task={selectedTask!}
          />
        </TaskProvider>
      }
    </>);
  } else {
    return content;
  }
};

export default SearchBar;