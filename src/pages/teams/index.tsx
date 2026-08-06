import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { UserRole } from "../../types/roles";

import {
  Search,
  User,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Users as UsersIcon,
} from "lucide-react";

const TEAM_MEMBERS = [
  {
    id: 1,
    avatar: "SB",
    name: "Shanti Biswas",
    registration: "RA231156402364",
    email: "sb3547@srmist.edu.in",
    department: "Frontend",
    task: "Notification Panel",
    project: "School ERP Project",
    assignedTime: "1 week",
    availability: "Available",
  },
  {
    id: 2,
    avatar: "AA",
    name: "Arush Ashrut",
    registration: "RA231156402364",
    email: "arush@srmist.edu.in",
    department: "Backend",
    task: "Assignment Module",
    project: "Management Project",
    assignedTime: "3 days",
    availability: "Fully Occupied",
  },
  {
    id: 3,
    avatar: "NM",
    name: "Nirmal Mehta",
    registration: "RA231156402364",
    email: "nirmal@srmist.edu.in",
    department: "UI/UX Designer",
    task: "Authorisation Module",
    project: "School Mobile App",
    assignedTime: "2 days",
    availability: "StandBy",
  },
  {
    id: 4,
    avatar: "PJ",
    name: "P Jaishwari",
    registration: "RA231156402364",
    email: "jaishwari@srmist.edu.in",
    department: "HR",
    task: "Assignment Module",
    project: "School ERP Project",
    assignedTime: "5 days",
    availability: "On Leave",
  },
  {
    id: 5,
    avatar: "ST",
    name: "Sagar T A",
    registration: "RA231156402364",
    email: "sagar@srmist.edu.in",
    department: "Frontend",
    task: "Exam Module",
    project: "Management Project",
    assignedTime: "1 day",
    availability: "Available",
  },
];

export const Teams = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activeDepartment, setActiveDepartment] = useState("All");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  const departments = [
    "All",
    "UI/UX Designer",
    "Frontend",
    "Backend",
    "Cybersecurity",
    "HR",
    "...",
  ];

  const savedMembers = JSON.parse(
    localStorage.getItem("teamMembers") || "[]"
  );

  const members = [
    ...TEAM_MEMBERS,
    ...savedMembers,
  ];

    const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch = member.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesDepartment =
        activeDepartment === "All" ||
        member.department === activeDepartment;

      let matchesExtraFilter = true;

      switch (selectedFilter) {
        case "3 months":
          matchesExtraFilter = member.duration === "3 months";
          break;

        case "6 months":
          matchesExtraFilter = member.duration === "6 months";
          break;

        case "Lead":
          matchesExtraFilter =
            member.position?.toLowerCase().includes("lead") ??
            false;
          break;

        case "Available":
          matchesExtraFilter =
            member.availability === "Available";
          break;

        case "On Leave":
          matchesExtraFilter =
            member.availability === "On Leave";
          break;

        default:
          matchesExtraFilter = true;
      }

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesExtraFilter
      );
    });
  }, [
    members,
    search,
    activeDepartment,
    selectedFilter,
  ]);

  const toggleMember = (id: number) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter(
            (memberId) => memberId !== id
          )
        : [...prev, id]
    );
  };

  const toggleAllMembers = () => {
    if (
      selectedMembers.length ===
      filteredMembers.length
    ) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(
        filteredMembers.map(
          (member) => member.id
        )
      );
    }
  };

  const handleDelete = (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this member?"
    );

    if (!confirmed) return;

    const savedMembers = JSON.parse(
      localStorage.getItem("teamMembers") ||
        "[]"
    );

    const updatedMembers =
      savedMembers.filter(
        (member: any) => member.id !== id
      );

    localStorage.setItem(
      "teamMembers",
      JSON.stringify(updatedMembers)
    );

    window.location.reload();
  };

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node
        )
      ) {
        setMenuOpenId(null);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

    return (
    <div className="px-8 py-6 space-y-10">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-forest-900">
            Team
          </h1>

          <p className="mt-2 text-sm text-forest-500">
            Manage team members and their information.
          </p>
        </div>

        {user?.role !== UserRole.EMPLOYEE && (
          <button
            onClick={() => navigate("/add-member")}
            className="
              bg-forest-800
              hover:bg-forest-900
              text-white
              rounded-full
              px-6
              py-3
              font-medium
              transition
            "
          >
            + New Member
          </button>
        )}

      </div>

      {/* Department Tabs */}

      <div className="space-y-6">

        <div className="flex items-end justify-between gap-8">

          <div className="flex flex-1 items-center gap-8 border-b border-cream-300">

            {departments.map((department) => {

              if (department === "...") {
                return (
                  <button
                    key="more"
                    type="button"
                    onClick={() =>
                      setShowFilters((prev) => !prev)
                    }
                    className={`pb-4 text-sm font-semibold transition ${
                      showFilters
                        ? "text-forest-900"
                        : "text-forest-600 hover:text-forest-900"
                    }`}
                  >
                    ...
                  </button>
                );
              }

              return (
                <button
                  key={department}
                  type="button"
                  onClick={() =>
                    setActiveDepartment(department)
                  }
                  className={`pb-4 text-sm font-semibold border-b-[3px] transition-all ${
                    activeDepartment === department
                      ? "border-forest-800 text-forest-900"
                      : "border-transparent text-forest-600 hover:text-forest-900"
                  }`}
                >
                  {department}
                </button>
              );
            })}

          </div>

          {/* Search */}

          <div
            className="
              w-[260px]
              flex
              items-center
              rounded-full
              border
              border-[#D9C2B7]
              bg-[#FAE8E3]
              px-5
              py-3
              shrink-0
            "
          >

            <Search
              size={18}
              className="text-gray-500"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search"
              className="
                ml-3
                flex-1
                bg-transparent
                outline-none
                text-sm
                placeholder:text-gray-500
              "
            />

          </div>

        </div>

        {/* Extra Filters */}

        {showFilters && (

          <div className="flex items-center gap-4">

            <span className="text-sm font-medium text-forest-700">
              Filters:
            </span>

            {[
              "Clear",
              "3 months",
              "6 months",
              "Lead",
              "Available",
              "On Leave",
            ].map((filter) => (

              <button
                key={filter}
                type="button"
                onClick={() => {
                  if (filter === "Clear") {
                    setSelectedFilter("");
                  } else {
                    setSelectedFilter(
                      selectedFilter === filter
                        ? ""
                        : filter
                    );
                  }
                }}
                className={`
                  px-4
                  py-1
                  rounded-full
                  border
                  text-xs
                  transition

                  ${
                    filter === "Clear"
                      ? "border-red-300 text-red-600 hover:bg-red-50"
                      : selectedFilter === filter
                      ? "bg-[#0D556D] text-white border-[#0D556D]"
                      : "border-[#E6D7B2] bg-[#FFF8EA] hover:bg-[#F6EFD8]"
                  }
                `}
              >
                {filter === "Clear"
                  ? "✕ Clear"
                  : filter}
              </button>

            ))}

          </div>

        )}

      </div>

      {/* Table Container */}

      <div
        className="
          bg-[#FFFDF8]
          rounded-3xl
          border
          border-cream-200
          shadow-sm
          overflow-hidden
        "
      >

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr className="text-xs uppercase tracking-wider text-forest-600">

              <th className="w-14 px-6 py-5">

                <input
                  type="checkbox"
                  checked={
                    filteredMembers.length > 0 &&
                    selectedMembers.length ===
                      filteredMembers.length
                  }
                  onClick={(e) =>
                    e.stopPropagation()
                  }
                  onChange={toggleAllMembers}
                  className="w-4 h-4 cursor-pointer"
                />

              </th>

              <th className="px-6 py-5 text-left">
                NAME
              </th>

              <th className="px-6 py-5 text-left">
                TASK DIVIDED
              </th>

              <th className="px-6 py-5 text-left">
                CURRENT PROJECT
              </th>

              <th className="px-6 py-5 text-center">
                ASSIGNED TIME
              </th>

              <th className="px-6 py-5 text-left">
                AVAILABILITY
              </th>

              <th className="px-6 py-5 text-center"></th>

            </tr>

          </thead>

          <tbody>

                        {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <tr
                  key={member.id}
                  onClick={() => {
                    if (user?.role !== UserRole.EMPLOYEE) {
                      navigate(`/teams/${member.id}`, {
                        state: { member },
                      });
                    }
                  }}
                  className="
                    border-t
                    border-cream-200
                    hover:bg-[#FFF8EE]
                    transition
                    cursor-pointer
                  "
                >
                  {/* Checkbox */}

                  <td className="px-6 py-5">
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(member.id)}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleMember(member.id);
                      }}
                      className="w-4 h-4 cursor-pointer"
                    />
                  </td>

                  {/* Name */}

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">

                      <div
                        className="
                          w-10
                          h-10
                          rounded-full
                          bg-[#F4E2DD]
                          flex
                          items-center
                          justify-center
                        "
                      >
                        <User
                          size={18}
                          className="text-forest-700"
                        />
                      </div>

                      <div>

                        <p className="font-semibold text-forest-900">
                          {member.name}
                        </p>

                        <p className="text-xs text-forest-500">
                          {member.registration}
                        </p>

                      </div>

                    </div>
                  </td>

                  {/* Task */}

                  <td className="px-6 py-5">

                    <span className="text-sm text-forest-700">
                      {member.task}
                    </span>

                  </td>

                  {/* Project */}

                  <td className="px-6 py-5">

                    <span className="text-sm text-forest-700">
                      {member.project}
                    </span>

                  </td>

                  {/* Assigned Time */}

                  <td className="px-6 py-5 text-center">

                    <span className="text-sm text-forest-700">
                      {member.assignedTime}
                    </span>

                  </td>

                  {/* Availability */}

                  <td className="px-6 py-5">

                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        member.availability === "Available"
                          ? "bg-green-100 text-green-700"
                          : member.availability === "On Leave"
                          ? "bg-red-100 text-red-700"
                          : member.availability === "StandBy"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {member.availability}
                    </span>

                  </td>

                  {/* Actions */}

                  <td className="relative px-6 py-5">

                    {user?.role !== UserRole.EMPLOYEE && (

                      <button
                        onClick={(e) => {
                          e.stopPropagation();

                          setMenuOpenId(
                            menuOpenId === member.id
                              ? null
                              : member.id
                          );
                        }}
                        className="
                          p-2
                          rounded-lg
                          hover:bg-gray-100
                          transition
                          cursor-pointer
                        "
                      >
                        <MoreHorizontal size={18} />
                      </button>

                    )}

                    {user?.role !== UserRole.EMPLOYEE &&
                      menuOpenId === member.id && (

                        <div
                          ref={menuRef}
                          className="
                            absolute
                            right-5
                            mt-2
                            w-44
                            rounded-xl
                            bg-white
                            shadow-xl
                            border
                            z-50
                          "
                        >

                          <button
                            onClick={(e) => {
                              e.stopPropagation();

                              navigate(
                                `/update-profile/${member.id}`
                              );
                            }}
                            className="
                              w-full
                              text-left
                              px-4
                              py-3
                              hover:bg-gray-50
                              flex
                              items-center
                              gap-3
                            "
                          >
                            ✏️ Edit Member
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(member.id);
                            }}
                            className="
                              w-full
                              text-left
                              px-4
                              py-3
                              hover:bg-red-50
                              text-red-600
                              flex
                              items-center
                              gap-3
                            "
                          >
                            🗑 Delete Member
                          </button>

                        </div>

                    )}

                  </td>

                </tr>
              ))
            ) : (

                            <tr>
                <td
                  colSpan={7}
                  className="py-20 text-center"
                >
                  <UsersIcon
                    size={46}
                    className="mx-auto mb-3 text-forest-300"
                  />

                  <h3 className="text-lg font-semibold text-forest-700">
                    No Team Members Found
                  </h3>

                  <p className="mt-2 text-sm text-forest-500">
                    Try another search or department.
                  </p>
                </td>
              </tr>
            )}
          </tbody>

        </table>

        {/* Pagination */}

        <div
          className="
            flex
            items-center
            justify-between
            px-8
            py-5
            border-t
            border-cream-200
            bg-[#FCFAF5]
          "
        >

          <button
            type="button"
            className="
              flex
              items-center
              gap-2
              px-5
              py-2.5
              rounded-xl
              border
              border-cream-300
              hover:bg-cream-100
              transition
              text-sm
              font-medium
            "
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          <div className="flex items-center gap-2">

            <button
              className="
                w-10
                h-10
                rounded-xl
                border
                border-cream-300
                hover:bg-cream-100
                transition
              "
            >
              1
            </button>

            <button
              className="
                w-10
                h-10
                rounded-xl
                bg-[#A9C4FF]
                text-forest-900
                font-bold
              "
            >
              2
            </button>

            <button
              className="
                w-10
                h-10
                rounded-xl
                border
                border-cream-300
                hover:bg-cream-100
                transition
              "
            >
              3
            </button>

            <button
              className="
                w-10
                h-10
                rounded-xl
                border
                border-cream-300
                hover:bg-cream-100
                transition
              "
            >
              4
            </button>

            <span className="px-2 text-forest-500">
              ...
            </span>

            <button
              className="
                w-10
                h-10
                rounded-xl
                border
                border-cream-300
                hover:bg-cream-100
                transition
              "
            >
              11
            </button>

          </div>

          <button
            type="button"
            className="
              flex
              items-center
              gap-2
              px-5
              py-2.5
              rounded-xl
              border
              border-cream-300
              hover:bg-cream-100
              transition
              text-sm
              font-medium
            "
          >
            Next
            <ChevronRight size={16} />
          </button>

        </div>

      </div>

    </div>
  );
};

export default Teams;