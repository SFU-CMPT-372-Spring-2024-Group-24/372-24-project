import { useState, useEffect } from 'react';

const Adminpage = () => {

    interface Project {
        id: number;
        name: string;
        // Add other properties if needed
    }

    const [projects, setProjects] = useState<Project[]>([]); // Define projects as an array of Project interface
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {

        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users');
                const userData = await response.json();
                setUsers(userData);
            } catch (error) {
                console.error('Error fetching users', error);
            }
        };

        const fetchAllProjects = async () => {
            try {
                const response = await fetch("/api/projects/all");
                const projectsData: Project[] = await response.json(); // Define projectsData as Project[]
                setProjects(projectsData);
                console.log("All Projects:", projectsData); // Log all projects
                projectsData.forEach(project => {
                    console.log("Project Name:", project.name); // Log each project's name
                });
            } catch (error) {
                console.error("Error fetching projects", error);
            }
        };

        fetchUsers();
        fetchAllProjects();

    }, []);

    return (
        <div>
            <h1>Admin Page</h1>

            <h2>All Users In Database</h2>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {user.name} - {user.email}
                    </li>
                ))}
            </ul>
            <h2>All Projects In Database</h2>
            <ul>
                {/* {projects.map((project) => ( // Now 'project' will be of type Project
                    <li key={project.id}>
                        <strong>{project.name}</strong> - {project.description}
                    </li>
                ))} */}
            </ul>
        </div>
    );
};

export default Adminpage;
