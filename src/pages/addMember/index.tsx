import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  X,
} from "lucide-react";

interface Member {
  id: number;
  name: string;
  registration: string;
  department: string;
  task: string;
  project: string;
  assignedTime: string;
  availability: string;
  duration: string;
  domain: string;
  projectCount: number;
  projects: string[];
  profilePhoto?: string;
}

const DOMAIN_OPTIONS = [
  "Frontend",
  "Backend",
  "UI/UX",
  "HR",
  "Cybersecurity",
];

export const AddMember = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [registration, setRegistration] = useState("");
  const [duration, setDuration] = useState("");
  const [domain, setDomain] = useState("");
  const [projectCount, setProjectCount] = useState("");
  const [projects, setProjects] = useState("");

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    registration: "",
    duration: "",
    domain: "",
    projectCount: "",
    projects: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const clearErrors = () => {
    setErrors({
      firstName: "",
      lastName: "",
      registration: "",
      duration: "",
      domain: "",
      projectCount: "",
      projects: "",
    });
  };

  const validate = () => {
    const newErrors = {
      firstName: "",
      lastName: "",
      registration: "",
      duration: "",
      domain: "",
      projectCount: "",
      projects: "",
    };

    let valid = true;

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required.";
      valid = false;
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required.";
      valid = false;
    }

    if(!/^RA\d{11,13}$/.test(registration)){
      newErrors.registration = "Registration number must be in SRM format.";
      valid = false;
    }

    if (!duration.trim()) {
      newErrors.duration = "Duration is required.";
      valid = false;
    }

    if (!domain) {
      newErrors.domain = "Please select a domain.";
      valid = false;
    }

    if (!projectCount.trim()) {
      newErrors.projectCount = "Enter number of projects.";
      valid = false;
    }

    if (!projects.trim()) {
      newErrors.projects = "Enter allocated projects.";
      valid = false;
    }

    if (projectCount.trim() && projects.trim()) {
    const projectList = projects
      .split(",")
      .map((project) => project.trim())
      .filter(Boolean);

    if (Number(projectCount) !== projectList.length) {
      newErrors.projectCount =
        "Number of projects must match the projects allocated.";
      valid = false;
    }
  }


    setErrors(newErrors);

    return valid;
  };

  const handleSubmit = () => {
    clearErrors();

    if (!validate()) return;

    const projectList = projects
  .split(",")
  .map((project) => project.trim())
  .filter(Boolean);

const newMember: Member = {
  id: Date.now(),
  name: `${firstName} ${lastName}`,
  registration,
  department: domain,
  task: "Not Assigned",
  project: projectList[0] || "Not Assigned",
  assignedTime: "-",
  availability: "Available",
  duration,
  domain,
  projectCount: Number(projectCount),
  projects: projectList,
  profilePhoto: "",
};

    const existingMembers = JSON.parse(
  localStorage.getItem("teamMembers") || "[]"
);

existingMembers.push(newMember);

localStorage.setItem(
  "teamMembers",
  JSON.stringify(existingMembers)
);

setShowSuccess(true);

setTimeout(() => {

  navigate("/teams");

},1500);
  };

  return (
    <div className="px-10 py-8">

      <button
        onClick={() => navigate("/teams")}
        className="flex items-center gap-2 text-[#0D556D] font-medium hover:text-[#083C4F] transition-colors"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="max-w-5xl mx-auto mt-4">

        <h1 className="text-4xl font-bold text-forest-900">
          Add Profile
        </h1>

        <p className="text-[#0D556D] mt-2">
          Add a new team member to CrewPal.
        </p>

        <div className="mt-10">

          <h2 className="text-xl font-bold text-[#0D556D] mb-8">
            User Details
          </h2>

          <div className="grid grid-cols-2 gap-x-12 gap-y-8">
            {/* First Name */}

<div>
  <label className="block text-sm font-medium text-[#0D556D] mb-2">
    First Name
  </label>

  <input
    type="text"
    value={firstName}
    onChange={(e) => {
      setFirstName(e.target.value);
      if (errors.firstName) {
        setErrors({ ...errors, firstName: "" });
      }
    }}
    placeholder="Enter First Name"
    className="
      w-full
      bg-[#F9E8DE]
      border-0
      border-b-2
      border-[#0D556D]
      px-4
      py-3
      outline-none
      placeholder:text-gray-400
    "
  />

  {errors.firstName && (
    <p className="mt-2 text-sm text-red-500">
      {errors.firstName}
    </p>
  )}
</div>

{/* Last Name */}

<div>
  <label className="block text-sm font-medium text-[#0D556D] mb-2">
    Last Name
  </label>

  <input
    type="text"
    value={lastName}
    onChange={(e) => {
      setLastName(e.target.value);
      if (errors.lastName) {
        setErrors({ ...errors, lastName: "" });
      }
    }}
    placeholder="Enter Last Name"
    className="
      w-full
      bg-[#F9E8DE]
      border-0
      border-b-2
      border-[#0D556D]
      px-4
      py-3
      outline-none
      placeholder:text-gray-400
    "
  />

  {errors.lastName && (
    <p className="mt-2 text-sm text-red-500">
      {errors.lastName}
    </p>
  )}
</div>

{/* Registration Number */}

<div className="col-span-2">
  <label className="block text-sm font-medium text-[#0D556D] mb-2">
    Registration Number
  </label>

  <input
    type="text"
    value={registration}
    onChange={(e) => {
      setRegistration(e.target.value.toUpperCase());
      if (errors.registration) {
        setErrors({ ...errors, registration: "" });
      }
    }}
    placeholder="RA..."
    className="
      w-full
      bg-[#F9E8DE]
      border-0
      border-b-2
      border-[#0D556D]
      px-4
      py-3
      outline-none
      placeholder:text-gray-400
    "
  />

  {errors.registration && (
    <p className="mt-2 text-sm text-red-500">
      {errors.registration}
    </p>
  )}
</div>

{/* Duration */}

<div>
  <label className="block text-sm font-medium text-[#0D556D] mb-2">
    Duration
  </label>

  <input
    type="text"
    value={duration}
    onChange={(e) => {
      setDuration(e.target.value);
      if (errors.duration) {
        setErrors({ ...errors, duration: "" });
      }
    }}
    placeholder="Enter Duration"
    className="
      w-full
      bg-[#F9E8DE]
      border-0
      border-b-2
      border-[#0D556D]
      px-4
      py-3
      outline-none
      placeholder:text-gray-400
    "
  />

  {errors.duration && (
    <p className="mt-2 text-sm text-red-500">
      {errors.duration}
    </p>
  )}
</div>

{/* Domain */}

<div>
  <label className="block text-sm font-medium text-[#0D556D] mb-2">
    Domain
  </label>

  <select
    value={domain}
    onChange={(e) => {
      setDomain(e.target.value);
      if (errors.domain) {
        setErrors({ ...errors, domain: "" });
      }
    }}
    className="
      w-full
      bg-[#F9E8DE]
      border-0
      border-b-2
      border-[#0D556D]
      px-4
      py-3
      outline-none
      text-[#0D556D]
    "
  >
    <option value="">Select Domain</option>

    {DOMAIN_OPTIONS.map((item) => (
      <option key={item} value={item}>
        {item}
      </option>
    ))}
  </select>

  {errors.domain && (
    <p className="mt-2 text-sm text-red-500">
      {errors.domain}
    </p>
  )}
</div>

{/* Number of Projects */}

<div className="col-span-2">
  <label className="block text-sm font-medium text-[#0D556D] mb-2">
    No. of Projects
  </label>

  <input
    type="number"
    min={0}
    value={projectCount}
    onChange={(e) => {
      setProjectCount(e.target.value);

      if (errors.projectCount) {
        setErrors({
          ...errors,
          projectCount: "",
        });
      }
    }}
    placeholder="Enter number of projects"
    className="
      w-full
      bg-[#F9E8DE]
      border-0
      border-b-2
      border-[#0D556D]
      px-4
      py-3
      outline-none
      placeholder:text-gray-400
    "
  />

  {errors.projectCount && (
    <p className="mt-2 text-sm text-red-500">
      {errors.projectCount}
    </p>
  )}
</div>

{/* Projects Allocated */}

<div className="col-span-2">
  <label className="block text-sm font-medium text-[#0D556D] mb-2">
    Projects Allocated
  </label>

  <textarea
    rows={3}
    value={projects}
    onChange={(e) => {
      setProjects(e.target.value);

      if (errors.projects) {
        setErrors({
          ...errors,
          projects: "",
        });
      }
    }}
    placeholder="Enter project names separated by commas"
    className="
      w-full
      resize-none
      bg-[#F9E8DE]
      border-0
      border-b-2
      border-[#0D556D]
      px-4
      py-3
      outline-none
      placeholder:text-gray-400
    "
  />

  <p className="mt-2 text-xs text-gray-500">
    Example: School ERP Project, CrewPal, Attendance Portal
  </p>

  {errors.projects && (
    <p className="mt-2 text-sm text-red-500">
      {errors.projects}
    </p>
  )}
</div>

</div>

{/* Success Message */}

{showSuccess && (
  <div
    className="
      mt-10
      rounded-2xl
      border
      border-green-300
      bg-green-50
      p-5
      flex
      items-start
      justify-between
    "
  >
    <div className="flex items-start gap-4">

      <div
        className="
          w-10
          h-10
          rounded-full
          bg-green-500
          flex
          items-center
          justify-center
          text-white
        "
      >
        <Check size={18} />
      </div>

      <div>
        <h3 className="font-semibold text-green-700">
          Member Added Successfully
        </h3>

        <p className="text-sm text-green-600 mt-1">
          The new team member has been added.
        </p>
      </div>

    </div>

    <button
      type="button"
      onClick={() => setShowSuccess(false)}
      className="text-green-700 hover:text-green-900"
    >
      <X size={18} />
    </button>
  </div>
)}

{/* Action Buttons */}

<div className="flex justify-end gap-4 mt-10">

  <button
    type="button"
    onClick={() => navigate("/teams")}
    className="
      px-8
      py-3
      rounded-xl
      border
      border-[#0D556D]
      text-[#0D556D]
      font-medium
      hover:bg-[#F3F6E2]
      transition-all
      duration-200
    "
  >
    Cancel
  </button>

  <button
    type="button"
    onClick={handleSubmit}
    className="
      px-8
      py-3
      rounded-xl
      bg-[#0D556D]
      text-white
      font-medium
      hover:bg-[#083C4F]
      transition-all
      duration-200
    "
  >
    Add Member
  </button>

</div>

        </div>

      </div>

    </div>

  );
};

export default AddMember;