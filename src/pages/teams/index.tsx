import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { UserRole } from "../../types/roles";
import { teamsService, type BackendUser } from "../../services/teamsService";
import { Search, MoreHorizontal, Users as UsersIcon } from "lucide-react";
export const Teams = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activeDepartment, setActiveDepartment] = useState("All");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [members, setMembers] = useState<BackendUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const departments = [
    "All",
    "Super Admin",
    "Admin",
    "Project Admin",
    "Manager",
    "Team Lead",
    "Designer",
    "QA Tester",
    "Client",
    "Employee",
  ];
  const roleMap: Record<number, string> = {
    1: "Super Admin",
    2: "Admin",
    3: "Project Admin",
    4: "Manager",
    5: "Team Lead",
    6: "Designer",
    7: "QA Tester",
    8: "Client",
    9: "Employee",
  };
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await teamsService.getUsers();
        console.log("Users API response:", response);
        const users = Array.isArray(response)
          ? response
          : response.users || response.data || [];
        setMembers(users);
      } catch (err) {
        console.error("Unable to fetch team members:", err);
        setError("Unable to load team members");
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);
  const filteredMembers = members.filter((member) => {
    const matchesSearch = (member.name || "")
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesRole =
      activeDepartment === "All" ||
      roleMap[member.role_id] === activeDepartment;
    const matchesStatus =
      selectedFilter === "" ||
      (selectedFilter === "Available" && member.is_active) ||
      (selectedFilter === "Inactive" && !member.is_active);
    return matchesSearch && matchesRole && matchesStatus;
  });
  if (loading) {
    return <div className="p-8 text-center">Loading team members...</div>;
  }
  const handleSelectAll = () => {
    if (
      selectedMembers.length === filteredMembers.length &&
      filteredMembers.length > 0
    ) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(filteredMembers.map((member) => member.id));
    }
  };
  const handleSelectMember = (id: number) => {
    setSelectedMembers((prev) => {
      if (prev.includes(id)) {
        return prev.filter((memberId) => memberId !== id);
      }
      return [...prev, id];
    });
  };
  const handleDeactivate = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate this member?",
    );
    if (!confirmed) return;
    try {
      await teamsService.deactivateUser(id);
      setMembers((prev) =>
        prev.map((member) =>
          member.id === id
            ? {
                ...member,
                is_active: false,
              }
            : member,
        ),
      );
      setMenuOpenId(null);
    } catch (error) {
      console.error(error);
      alert("Unable to deactivate member");
    }
  };
  const handleMemberClick = (id: number) => {
    navigate(`/teams/${id}`);
  };
  return (
    <div
      className="
        min-h-screen
        bg-cream-100
        p-6
        text-forest-900
      "
    >
      {}
      <div
        className="
          flex
          items-center
          justify-between
          mb-8
        "
      >
        <div>
          <h1
            className="
              text-4xl
              font-bold
              text-forest-900
            "
          >
            Teams
          </h1>
          <p
            className="
              text-sm
              text-forest-500
              mt-1
            "
          >
            Manage your organization members
          </p>
        </div>
        {user?.role === UserRole.ADMIN && (
          <button
            onClick={() => navigate("/add-member")}
            className="
                bg-forest-900
                text-white
                px-5
                py-3
                rounded-xl
                font-medium
                hover:bg-forest-800
                transition
              "
          >
            Add Member
          </button>
        )}
      </div>
      {}
      <div
        className="
          bg-white
          rounded-3xl
          border
          border-cream-200
          p-5
          mb-6
        "
      >
        <div
          className="
            flex
            gap-4
            items-center
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
              bg-cream-50
              border
              border-cream-200
              rounded-xl
              px-4
              py-3
              flex-1
            "
          >
            <Search
              className="
                w-5
                h-5
                text-forest-400
              "
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="
                Search team members...
              "
              className="
                bg-transparent
                outline-none
                w-full
                text-sm
              "
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="
              px-5
              py-3
              rounded-xl
              border
              border-cream-300
              hover:bg-cream-100
              transition
            "
          >
            Filters
          </button>
        </div>
        {showFilters && (
          <div
            className="
                mt-5
                flex
                flex-wrap
                gap-3
              "
          >
            {departments.map((department) => (
              <button
                key={department}
                onClick={() => setActiveDepartment(department)}
                className={`
                        px-4
                        py-2
                        rounded-full
                        text-sm
                        transition
                        ${
                          activeDepartment === department
                            ? "bg-forest-900 text-white"
                            : "bg-cream-100 text-forest-700"
                        }
                      `}
              >
                {department}
              </button>
            ))}
            <button
              onClick={() =>
                setSelectedFilter(
                  selectedFilter === "Available" ? "" : "Available",
                )
              }
              className={`
                  px-4
                  py-2
                  rounded-full
                  text-sm
                  ${
                    selectedFilter === "Available"
                      ? "bg-green-600 text-white"
                      : "bg-cream-100"
                  }
                `}
            >
              Available
            </button>
            <button
              onClick={() =>
                setSelectedFilter(
                  selectedFilter === "Inactive" ? "" : "Inactive",
                )
              }
              className={`
                  px-4
                  py-2
                  rounded-full
                  text-sm
                  ${
                    selectedFilter === "Inactive"
                      ? "bg-red-600 text-white"
                      : "bg-cream-100"
                  }
                `}
            >
              Inactive
            </button>
          </div>
        )}
      </div>
      {}
      {error && <div className="text-center text-red-500 py-4">{error}</div>}
      <div
        className="
          bg-white
          rounded-3xl
          border
          border-cream-200
          overflow-hidden
        "
      >
        <div
          className="
            overflow-x-auto
          "
        >
          <table
            className="
              w-full
              text-sm
            "
          >
            <thead
              className="
                bg-cream-50
                text-forest-700
              "
            >
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedMembers.length === filteredMembers.length &&
                      filteredMembers.length > 0
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th
                  className="
                    px-6
                    py-4
                    text-left
                    font-semibold
                  "
                >
                  Member
                </th>
                <th
                  className="
                    px-6
                    py-4
                    text-left
                    font-semibold
                  "
                >
                  Member ID
                </th>
                <th
                  className="
                    px-6
                    py-4
                    text-left
                    font-semibold
                  "
                >
                  Role
                </th>
                <th
                  className="
                    px-6
                    py-4
                    text-left
                    font-semibold
                  "
                >
                  Email
                </th>
                <th
                  className="
                    px-6
                    py-4
                    text-left
                    font-semibold
                  "
                >
                  Availability
                </th>
                <th
                  className="
                    px-6
                    py-4
                    text-left
                    font-semibold
                  "
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr
                  key={member.id}
                  className="
                        border-t
                        border-cream-200
                        hover:bg-cream-50
                        transition
                      "
                >
                  {}
                  <td className="px-6 py-5">
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(member.id)}
                      onChange={() => handleSelectMember(member.id)}
                    />
                  </td>
                  {}
                  <td className="px-6 py-5">
                    <button
                      onClick={() => handleMemberClick(member.id)}
                      className="
                            flex
                            items-center
                            gap-3
                            text-left
                          "
                    >
                      <div
                        className="
                              w-10
                              h-10
                              rounded-full
                              bg-forest-900
                              text-white
                              flex
                              items-center
                              justify-center
                            "
                      >
                        {member.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <p
                          className="
                                font-semibold
                                text-forest-900
                              "
                        >
                          {member.name}
                        </p>
                        <p
                          className="
                                text-xs
                                text-forest-500
                              "
                        >
                          {member.email}
                        </p>
                      </div>
                    </button>
                  </td>
                  {}
                  <td
                    className="
                          px-6
                          py-5
                          text-forest-700
                        "
                  >
                    {member.id}
                  </td>
                  {}
                  <td
                    className="
                          px-6
                          py-5
                          text-forest-700
                        "
                  >
                    {roleMap[member.role_id] ?? `Role ID ${member.role_id}`}
                  </td>
                  {}
                  <td
                    className="
                          px-6
                          py-5
                          text-forest-700
                        "
                  >
                    {member.email}
                  </td>
                  {}
                  <td className="px-6 py-5">
                    <span
                      className={`
                            inline-flex
                            px-3
                            py-1
                            rounded-full
                            text-xs
                            font-medium
                            ${
                              member.is_active
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }
                          `}
                    >
                      {member.is_active ? "Available" : "Inactive"}
                    </span>
                  </td>
                  {}
                  <td
                    className="
                          px-6
                          py-5
                          relative
                        "
                  >
                    <button
                      onClick={() =>
                        setMenuOpenId(
                          menuOpenId === member.id ? null : member.id,
                        )
                      }
                      className="
                            p-2
                            rounded-lg
                            hover:bg-cream-100
                          "
                    >
                      <MoreHorizontal size={20} />
                    </button>
                    {menuOpenId === member.id && (
                      <div
                        className="
                                absolute
                                right-6
                                top-12
                                bg-white
                                border
                                border-cream-200
                                rounded-xl
                                shadow-lg
                                p-2
                                z-20
                              "
                      >
                        <button
                          onClick={() => navigate(`/teams/${member.id}`)}
                          className="
                                  block
                                  w-full
                                  px-4
                                  py-2
                                  text-left
                                  rounded-lg
                                  hover:bg-cream-100
                                "
                        >
                          View Profile
                        </button>
                        <button
                          onClick={() => handleDeactivate(member.id)}
                          disabled={!member.is_active}
                          className="
                                  block
                                  w-full
                                  px-4
                                  py-2
                                  text-left
                                  rounded-lg
                                  text-red-600
                                  hover:bg-red-50
                                  disabled:opacity-40
                                "
                        >
                          Deactivate Member
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredMembers.length === 0 && (
          <div
            className="
                py-12
                text-center
                text-forest-500
              "
          >
            <UsersIcon
              className="
                  mx-auto
                  mb-3
                  opacity-50
                "
            />
            No team members found.
          </div>
        )}
      </div>
    </div>
  );
};