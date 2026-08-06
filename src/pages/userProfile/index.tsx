import { User } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { UserRole } from "../../types/roles";

const USERS = [
    {
        id: 1,
        avatar: "SB",
        name: "Shanti Biswas",
        registration: "RA231156402364",
        designation: "Frontend Intern",
        department: "CINTEL",
        batch: "2025 - 2029",
        email: "sb3547@srmist.edu.in",
        github: "https://github.com/shantibiswas",
        position: "Intern",
        duration: "6 months",
        domain: "Frontend",
        task: "Notification Panel",
        project: "School ERP Project",
        projectCount: 2,
        projects: ["School ERP Project", "Management Project"],
        profilePhoto: "",
    },
    {
        id: 2,
        avatar: "AA",
        name: "Arush Ashrut",
        registration: "RA231156402364",
        designation: "Backend Intern",
        department: "CINTEL",
        batch: "2025 - 2029",
        email: "arush@srmist.edu.in",
        github: "https://github.com/arush",
        position: "Intern - Lead",
        duration: "2 months",
        domain: "Backend",
        task: "Assignment Module",
        project: "Management Project",
        projectCount: 2,
        projects: ["Management Project", "CrewPal"],
        profilePhoto: "",
    },
    {
        id: 3,
        avatar: "NM",
        name: "Nirmal Mehta",
        registration: "RA231156402364",
        designation: "UI/UX Intern",
        department: "CINTEL",
        batch: "2025 - 2029",
        email: "nirmal@srmist.edu.in",
        github: "https://github.com/nirmal",
        position: "Intern",
        duration: "1 project",
        domain: "UI/UX",
        task: "Authorisation Module",
        project: "School Mobile App",
        projectCount: 1,
        projects: ["School Mobile App"],
        profilePhoto: "",
    },
    {
        id: 4,
        avatar: "PJ",
        name: "P Jaishwari",
        registration: "RA231156402364",
        designation: "HR Intern",
        department: "CINTEL",
        batch: "2025 - 2029",
        email: "jaishwari@srmist.edu.in",
        github: "https://github.com/jaishwari",
        position: "Intern - Lead",
        duration: "3 months",
        domain: "HR",
        task: "Assignment Module",
        project: "School ERP Project",
        projectCount: 2,
        projects: ["School ERP Project", "Attendance Portal"],
        profilePhoto: "",
    },
    {
        id: 5,
        avatar: "ST",
        name: "Sagar T A",
        registration: "RA231156402364",
        designation: "Frontend Intern",
        department: "CINTEL",
        batch: "2025 - 2029",
        email: "sagar@srmist.edu.in",
        github: "https://github.com/sagar",
        position: "Intern",
        duration: "6 months",
        domain: "Frontend",
        task: "Exam Module",
        project: "Management Project",
        projectCount: 4,
        projects: ["Management Project", "Exam Portal", "CrewPal", "Attendance System",],
        profilePhoto: "",
    },
];

export const UserProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user: loggedInUser } = useAuth();

  // Members added through Add Member page
  const savedMembers = JSON.parse(
    localStorage.getItem("teamMembers") || "[]"
  );

  // Combine default users + added users
  const allUsers = [...USERS, ...savedMembers];

  // If a profile was updated, prefer that version
  const savedUser = localStorage.getItem(`user-${id}`);

  const user = savedUser
    ? JSON.parse(savedUser)
    : allUsers.find(
        (member) => member.id === Number(id)
      );

  const isAdminOrManager =
    loggedInUser?.role === UserRole.ADMIN ||
    loggedInUser?.role === UserRole.MANAGER;

  const isOwnProfile =
    loggedInUser?.email?.toLowerCase() ===
    user?.email?.toLowerCase();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-forest-900">
            User not found
          </h2>

          <button
            onClick={() => navigate("/teams")}
            className="mt-6 bg-forest-900 text-white px-6 py-3 rounded-xl"
          >
            Back to Team
          </button>
        </div>
      </div>
    );
  }

    if (!user) {
        return (
            <div className="flex items-center justify-center h-[70vh]">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-forest-900">
                        User not found
                    </h2>

                    <button
                        onClick={() => navigate("/teams")}
                        className="mt-6 bg-forest-900 text-white px-6 py-3 rounded-xl"
                    >
                        Back to Team
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="px-10 py-8">
            <div className="max-w-5xl mx-auto">
                <div className="bg-[#E6E9C8] rounded-3xl p-5 max-w-5xl mx-auto shadow-sm">
                    <h2 className="text-xl font-bold text-[#0D556D] mb-6 px-6">
                        USER PROFILE
                    </h2>

                    <div className="bg-[#F9E8DE] rounded-3xl p-7 flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-[#D79B93] flex items-center justify-center">
                            <div
    className="
        w-24
        h-24
        rounded-full
        overflow-hidden
        bg-[#D79B93]
        flex
        items-center
        justify-center
    "
>
    {user.profilePhoto ? (
        <img
            src={user.profilePhoto}
            alt={user.name}
            className="w-full h-full object-cover"
        />
    ) : (
        <User
            size={34}
            className="text-[#0D556D]"
        />
    )}
</div>
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold text-forest-900">
                                {user.name}
                            </h1>

                            <p className="text-gray-500 mt-1">
                                {user.registration}
                            </p>

                            <p className="text-[#0D556D] mt-1">
                                {user.designation}
                            </p>
                        </div>
                    </div>

                    <div className="bg-[#F9E8DE] rounded-3xl mt-6 p-8">
                        <h2 className="text-xl font-bold text-[#0D556D] mb-6">
                            User Details
                        </h2>

                        <div className="grid grid-cols-2 gap-x-16 gap-y-3">
                            <div>
                                <p className="text-sm">
                                    <span className="font-semibold">
                                        Department:
                                    </span>{" "}
                                    {user.department}
                                </p>

                                <p className="text-sm mt-3">
                                    <span className="font-semibold">
                                        SRM Mail:
                                    </span>{" "}
                                    {user.email}
                                </p>

                                <p className="text-sm mt-3">
                                    <span className="font-semibold">
                                        Github Link:
                                    </span>{" "}
                                    <a
                                        href={user.github}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[#0D556D] hover:text-[#0A455A] transition-colors"
                                    >
                                        {user.github}
                                    </a>
                                </p>

                                <p className="text-sm mt-3">
                                    <span className="font-semibold">
                                        Position:
                                    </span>{" "}
                                    {user.position}
                                </p>

                                <p className="text-sm mt-3">
                                    <span className="font-semibold">
                                        Duration:
                                    </span>{" "}
                                    {user.duration}
                                </p>

                                <p className="text-sm mt-3">
                                    <span className="font-semibold">
                                        No of Project Allocated:
                                    </span>{" "}
                                    {user.projects?.length ?? 0}
                                </p>

                                <div className="mt-5">
                                    <p className="font-semibold">
                                        Projects Allocated:
                                    </p>

                                    <div className="mt-2 space-y-1">
                                        {(user.projects ?? []).map((project: string) => (
                                            <p
                                                key={project}
                                                className="text-[#0D556D] font-semibold text-lg"
                                            >
                                                {project}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm">
                                    <span className="font-semibold">
                                        Batch Year:
                                    </span>{" "}
                                    {user.batch}
                                </p>

                                <p className="text-sm mt-3">
                                    <span className="font-semibold">
                                        Domain:
                                    </span>{" "}
                                    {user.domain}
                                </p>

                                <p className="text-sm mt-3">
                                    <span className="font-semibold">
                                        Current Task:
                                    </span>{" "}
                                    {user.task}
                                </p>

                                <p className="text-sm mt-3">
                                    <span className="font-semibold">
                                        Current Project:
                                    </span>{" "}
                                    {user.project}
                                </p>

                                <p className="text-sm mt-3">
                                    <span className="font-semibold">
                                        Employee ID:
                                    </span>{" "}
                                    {user.registration}
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 mt-10">
                            {(isAdminOrManager || isOwnProfile) && (
                            <button
                                onClick={() =>
                                    navigate(`/update-profile/${user.id}`)
                                }
                                className="
                                bg-[#0D556D]
                                hover:bg-[#084659]
                                text-white
                                px-8
                                py-3
                                rounded-xl
                                font-medium
                                transition-all
                                duration-200
                                "
                            >
                                Update Profile
                            </button>
                            )}

                            <button
                                onClick={() => navigate("/teams")}
                                className="
                                bg-forest-900
                                hover:bg-forest-800
                                text-white
                                px-8
                                py-3
                                rounded-xl
                                font-medium
                                transition-all
                                duration-200
                                "
                            >
                                Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
