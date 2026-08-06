import {
  Calendar,
  Clock3,
  Edit,
  User,
  MessageCircle,
  LogOut,
  KeyRound,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export const UserDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /*const USERS = [
    {
      id: 1,
      name: "Shanti Biswas",
      designation: "Frontend Intern",
      registration: "RA231156402364",
      department: "Frontend",
      batch: "2025 - 2029",
      email: "sb3547@srmist.edu.in",
      github: "https://github.com/shantibiswas",
      duration: "6 Months",
      domain: "Frontend",
      task: "Notification Module",
      project: "School ERP",
      projectCount: 2,
      meetings: 3,
      projects: [
        "School ERP",
        "CrewPal",
      ],
      profilePhoto: "",
    },
  ];

  const savedMembers = JSON.parse(
    localStorage.getItem("teamMembers") || "[]"
  );*/

  const user = location.state?.member;

  if (!user) {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h2 className="text-3xl font-bold">
          User not found
        </h2>

        <button
          onClick={() => navigate("/teams")}
          className="mt-5 bg-[#073B2E] text-white px-6 py-3 rounded-xl"
        >
          Back to Teams
        </button>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-[#F6F8F3] px-10 py-8">

      {/* Back */}

      <button
        onClick={() => navigate("/teams")}
        className="text-[#0D556D] font-medium hover:underline"
      >
        ← Back
      </button>

      {/* Main Container */}

      <div className="max-w-7xl mx-auto mt-4">

        {/* Header */}

        <div className="
            bg-[#073B2E]
            rounded-[36px]
            p-10
            shadow-xl
        ">

          <div className="flex justify-between items-start">

            {/* Left */}

            <div className="flex gap-8">

              {/* Profile */}

              <div className="
                    w-32
                    h-32
                    rounded-full
                    overflow-hidden
                    bg-[#E4C2BA]
                    flex
                    items-center
                    justify-center
                    shadow-lg
              ">

                {user.profilePhoto ? (

                  <img
                    src={user.profilePhoto}
                    alt={user.name}
                    className="
                        w-full
                        h-full
                        object-cover
                    "
                  />

                ) : (

                  <User
                    size={48}
                    className="text-[#0D556D]"
                  />

                )}

              </div>

              {/* Details */}

              <div className="text-white">

                <h1 className="text-4xl font-bold">
                  {user.name}
                </h1>

                <p className="text-lg mt-2 text-gray-300">
                  {user.designation}
                </p>

                <p className="mt-4 text-gray-300">
                  {user.email}
                </p>

                <p className="text-gray-300">
                  {user.duration}
                </p>

              </div>

            </div>

            {/* Edit Button */}

            <button
              onClick={() =>
                navigate(`/update-profile/${user.id}`)
              }
              className="
                flex
                items-center
                gap-2
                bg-white
                text-[#073B2E]
                px-6
                py-3
                rounded-xl
                font-medium
                hover:bg-gray-100
                transition
              "
            >
              <Edit size={18} />
              Edit Profile
            </button>

          </div>

          {/* Statistics */}

          <div className="grid grid-cols-3 gap-6 mt-10">

            <div className="
                bg-[#1E5846]
                rounded-3xl
                p-6
                text-white
                shadow-lg
            ">

              <Calendar
                className="mb-5"
                size={26}
              />

              <h2 className="text-4xl font-bold">
                {user.projectCount}
              </h2>

              <p className="mt-2 text-gray-300">
                Ongoing Projects
              </p>

            </div>

            <div className="
                bg-[#1E5846]
                rounded-3xl
                p-6
                text-white
                shadow-lg
            ">

              <KeyRound size={26} />

              <h2 className="text-4xl font-bold">
                {user.duration}
              </h2>

              <p className="mt-2 text-gray-300">
                Internship Duration
              </p>

            </div>

            <div className="
                bg-[#1E5846]
                rounded-3xl
                p-6
                text-white
                shadow-lg
            ">

              <Calendar
                className="mb-5"
                size={26}
              />

              <h2 className="text-4xl font-bold">
                {user.meetings ?? 0}
              </h2>

              <p className="mt-2 text-gray-300">
                Meetings Today
              </p>

            </div>

          </div>

        </div>

                {/* Main Dashboard */}

        <div className="grid grid-cols-3 gap-8 mt-8">

          {/* ================= USER DETAILS ================= */}

          <div className="col-span-2">

            <div className="
                bg-white
                rounded-[32px]
                shadow-lg
                p-8
                border
                border-gray-100
            ">

              <h2 className="text-2xl font-bold text-[#073B2E] mb-8">
                User Details
              </h2>

              <div className="space-y-6">

                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <span className="font-semibold text-gray-600">
                    Registration Number
                  </span>

                  <span className="font-medium text-[#073B2E]">
                    {user.registration}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <span className="font-semibold text-gray-600">
                    Department
                  </span>

                  <span className="font-medium text-[#073B2E]">
                    {user.department}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <span className="font-semibold text-gray-600">
                    Batch
                  </span>

                  <span className="font-medium text-[#073B2E]">
                    {user.batch}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <span className="font-semibold text-gray-600">
                    SRM Mail
                  </span>

                  <span className="font-medium text-[#073B2E]">
                    {user.email}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <span className="font-semibold text-gray-600">
                    GitHub
                  </span>

                  <a
                    href={user.github}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      text-[#0D556D]
                      hover:underline
                    "
                  >
                    {user.github}
                  </a>
                </div>

                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <span className="font-semibold text-gray-600">
                    Domain
                  </span>

                  <span className="font-medium text-[#073B2E]">
                    {user.domain}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <span className="font-semibold text-gray-600">
                    Current Task
                  </span>

                  <span className="font-medium text-[#073B2E]">
                    {user.task}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2">
                  <span className="font-semibold text-gray-600">
                    Current Project
                  </span>

                  <span className="font-medium text-[#073B2E]">
                    {user.project}
                  </span>
                </div>

              </div>

              {/* Project List */}

              <div className="mt-10">

                <h3 className="font-semibold text-[#073B2E] mb-4">
                  Projects Allocated
                </h3>

                <div className="flex flex-wrap gap-3">

                  {user.projects?.map(
                    (
                      project: string,
                      index: number
                    ) => (

                      <div
                        key={index}
                        className="
                          px-5
                          py-2
                          rounded-full
                          bg-[#EDF7F3]
                          text-[#073B2E]
                          font-medium
                        "
                      >
                        {project}
                      </div>

                    )
                  )}

                </div>

              </div>

            </div>

          </div>

          {/* ================= TODAY'S SCHEDULE ================= */}

          <div>

            <div
              className="
                bg-white
                rounded-[32px]
                shadow-lg
                p-7
                border
                border-gray-100
              "
            >

              <h2 className="text-2xl font-bold text-[#073B2E] mb-6">
                Today's Schedule
              </h2>

              <div className="space-y-5">

                {[
                  {
                    title: "Daily Stand-up",
                    time: "09:30 AM",
                  },
                  {
                    title: "Project Review",
                    time: "12:00 PM",
                  },
                  {
                    title: "Client Discussion",
                    time: "03:30 PM",
                  },
                ].map((meeting, index) => (

                  <div
                    key={index}
                    className="
                      rounded-2xl
                      bg-[#EDF7F3]
                      p-5
                      hover:shadow-md
                      transition
                    "
                  >

                    <div className="flex items-center gap-4">

                      <div
                        className="
                          w-12
                          h-12
                          rounded-full
                          bg-[#073B2E]
                          flex
                          items-center
                          justify-center
                          text-white
                        "
                      >
                        <Calendar size={18} />
                      </div>

                      <div>

                        <h3 className="font-semibold text-[#073B2E]">
                          {meeting.title}
                        </h3>

                        <p className="text-sm text-gray-500">
                          {meeting.time}
                        </p>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            </div>

                        {/* ================= PENDING TASKS ================= */}

            <div
              className="
                bg-white
                rounded-[32px]
                shadow-lg
                p-7
                border
                border-gray-100
                mt-8
              "
            >

              <h2 className="text-2xl font-bold text-[#073B2E] mb-6">
                Pending Tasks
              </h2>

              <div className="space-y-4">

                {[
                  "Complete Notification Module",
                  "Review Team Pull Requests",
                  "Prepare Weekly Progress Report",
                  "Update Documentation",
                ].map((task, index) => (

                  <label
                    key={index}
                    className="
                      flex
                      items-center
                      gap-4
                      cursor-pointer
                      rounded-xl
                      px-4
                      py-3
                      hover:bg-[#EDF7F3]
                      transition
                    "
                  >

                    <input
                      type="checkbox"
                      className="
                        h-5
                        w-5
                        accent-[#0D556D]
                      "
                    />

                    <span className="text-[#073B2E] font-medium">
                      {task}
                    </span>

                  </label>

                ))}

              </div>

            </div>

          </div>

        </div>

        {/* ================= ACTION BUTTONS ================= */}

        <div className="mt-10">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

            {/* Messages */}

            <button
              onClick={() => navigate("/messages")}
              className="
                bg-[#073B2E]
                hover:bg-[#0A4A39]
                text-white
                rounded-2xl
                py-5
                flex
                flex-col
                items-center
                justify-center
                gap-3
                transition
                shadow-lg
              "
            >

              <MessageCircle size={26} />

              <span className="font-semibold">
                Messages
              </span>

            </button>

            {/* Schedule */}

            <button
              onClick={() => navigate("/meetings")}
              className="
                bg-[#0D556D]
                hover:bg-[#0A455A]
                text-white
                rounded-2xl
                py-5
                flex
                flex-col
                items-center
                justify-center
                gap-3
                transition
                shadow-lg
              "
            >

              <Calendar size={26} />

              <span className="font-semibold">
                Schedule Meeting
              </span>

            </button>

            {/* Change Password */}

            <button
              onClick={() =>
                navigate(`/change-password/${user.id}`)
              }
              className="
                bg-[#D9A441]
                hover:bg-[#C8912E]
                text-white
                rounded-2xl
                py-5
                flex
                flex-col
                items-center
                justify-center
                gap-3
                transition
                shadow-lg
              "
            >

              <Clock3 size={26} />

              <span className="font-semibold">
                Change Password
              </span>

            </button>

            {/* Logout */}

            <button
              onClick={() => {

                if (
                  window.confirm(
                    "Are you sure you want to logout?"
                  )
                ) {
                  navigate("/login");
                }

              }}
              className="
                bg-red-600
                hover:bg-red-700
                text-white
                rounded-2xl
                py-5
                flex
                flex-col
                items-center
                justify-center
                gap-3
                transition
                shadow-lg
              "
            >

              <LogOut size={26} />

              <span className="font-semibold">
                Logout
              </span>

            </button>

          </div>

        </div>

              </div>

    </div>
  );
};

export default UserDashboard;