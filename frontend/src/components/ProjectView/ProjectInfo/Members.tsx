// Libraries
import { useState } from "react";
import { Link } from "react-router-dom";
// Icons
import { IoSettingsOutline } from "react-icons/io5";
import { BiSolidUserDetail } from "react-icons/bi";
// Files
import defaultProfilePicture from "../../../assets/default-profile-picture.png";
// Components
import ManageMemberModal from "../../Modals/ManageProjectMember/ManageMemberModal";
// Custom hooks
import { useTasks } from "../../../hooks/TaskContext";

const Members = () => {
  const { projectMembers, userCanPerform } = useTasks();
  const [showManageMemberModal, setShowManageMemberModal] =
    useState<boolean>(false);

  const openManageMemberModal = () => setShowManageMemberModal(true);

  return (
    <>
      <div className="project-members">
        <h2>
          Members
          {userCanPerform("manageMembers") ? (
            <button
              type="button"
              className="btn-icon"
              onClick={openManageMemberModal}
            >
              <IoSettingsOutline size={20} />
            </button>
          ) : (
            <button
              type="button"
              className="btn-icon"
              onClick={openManageMemberModal}
            >
              <BiSolidUserDetail size={20} />
            </button>
          )}
        </h2>

        {projectMembers.map((user) => (
          <div className="member" key={user.id}>
            <Link to={`/profile/${user.username}`} className="profile-link">
              <img
                src={user.profilePicture || defaultProfilePicture}
                alt="User Avatar"
              />
              <p>{user.name}</p>
            </Link>
          </div>
        ))}
      </div>

      <ManageMemberModal
        showModal={showManageMemberModal}
        setShowModal={setShowManageMemberModal}
      />
    </>
  );
};

export default Members;
