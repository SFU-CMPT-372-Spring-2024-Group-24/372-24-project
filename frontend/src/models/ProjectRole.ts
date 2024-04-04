export interface Role {
  id: number;
  name: string;
}

export const Roles: Role[] = [
  { id: 1, name: "Owner" },
  { id: 2, name: "Editor" },
  { id: 3, name: "Viewer" },
];

export const RolePermissions: { [key: string]: string[] } = {
  Viewer: [
    "read",
  ],
  Editor: [
    "read", 
    "manageTasks",
    "manageFiles",
  ],
  Owner: [
    "read",
    "manageTasks",
    "manageFiles",
    "manageProject",
    "manageMembers",
  ],
};
