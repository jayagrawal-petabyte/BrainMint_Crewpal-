import { useState, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, User, Upload, Check, X, Eye, EyeOff } from "lucide-react";

const USER_DATA = {
    id: 1,
    name: "Shanti Biswas",
    registration: "RA231156402364",
    designation: "Frontend Intern",
    duration: "6 months",
    projectCount: 2,
    domain: "Frontend",

    department: "CINTEL",
    batchYear: "2025 - 2029",
    github: "https://github.com/shantibiswas",
    email: "sb3547@srmist.edu.in",
};

export const UpdateProfile = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const savedUser = localStorage.getItem(
  `user-${id}`
);

    const currentUser = savedUser ? JSON.parse(savedUser) : USER_DATA;

    const [department, setDepartment] = useState(currentUser.department);
    const [batchYear, setBatchYear] = useState(currentUser.batchYear);
    const [github, setGithub] = useState(currentUser.github);
    const [email, setEmail] = useState(currentUser.email);
    const [showEmail, setShowEmail] = useState(false);

    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    const [showSuccess, setShowSuccess] = useState(false);
    const [githubError, setGithubError] = useState("");
const [emailError, setEmailError] = useState("");

const [message, setMessage] = useState("");
const [messageType, setMessageType] = useState<"success" | "warning">("success");

    const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        const file = e.target.files[0];

        setPhoto(file);

        const imageUrl = URL.createObjectURL(file);

        setPhotoPreview(imageUrl);
    };

    const removePhoto = () => {
        setPhoto(null);
        setPhotoPreview(null);
    };

    const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidGithub = (url: string) => {
  return /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+\/?$/.test(url);
};

const handleEmailChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const value = e.target.value;

  setEmail(value);

  if (emailError && isValidEmail(value)) {
    setEmailError("");
  }
};

const handleGithubChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const value = e.target.value;

  setGithub(value);

  if (githubError && isValidGithub(value)) {
    setGithubError("");
  }
};

    const handleSubmit = () => {

  if (!isValidEmail(email)) {
  setEmailError("Please enter a valid SRM email address.");
  return;
}

  if (!isValidGithub(github)) {
  setGithubError("Please enter a valid GitHub profile URL.");
  return;
}

  const updatedUser = {
  ...currentUser,
  department,
  batchYear,
  github,
  email,
  profilePhoto: photoPreview,
};

  localStorage.setItem(
    `user-${USER_DATA.id}`,
    JSON.stringify(updatedUser)
  );

  setMessage("Profile updated successfully.");
  setMessageType("success");
  setShowSuccess(true);

  setTimeout(() => {
    setShowSuccess(false);
  }, 3000);
};
    return (
        <div className="px-8 py-6">
            <button
                onClick={() => navigate(`/teams/${id}`)}
                className="
          flex
          items-center
          gap-2
          text-forest-900
          font-medium
          hover:text-forest-700
          transition
        "
            >
                <ArrowLeft size={20} />
                Back
            </button>

            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-forest-900">
                    Update your profile
                </h1>

                <div
                    className="
            bg-[#E7ECC6]
            rounded-3xl
            mt-4
            p-7
          "
                >
                    <h2 className="text-xl font-bold text-[#0D556D] mb-8">
                        Profile Photo
                    </h2>

                    <div className="flex items-start gap-12">
                        <div className="flex items-center gap-5">
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
                                {photoPreview ? (
                                    <img
                                        src={photoPreview}
                                        alt="Profile Preview"
                                        className="
        w-full
        h-full
        object-cover
      "
                                    />
                                ) : (
                                    <User
                                        size={36}
                                        className="text-[#0D556D]"
                                    />
                                )}
                            </div>

                            <div className="flex flex-col items-center">
                                <label
                                    htmlFor="profilePhoto"
                                    className="
      inline-flex
      items-center
      gap-2
      border-2
      border-[#0D556D]
      px-6
      py-3
      rounded-lg
      cursor-pointer
      font-medium
      hover:bg-[#F3F6E2]
      transition
    "
                                >
                                    <Upload size={18} />
                                    Upload Photo
                                </label>

                                <input
                                    id="profilePhoto"
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={handlePhotoUpload}
                                />

                                {photo && (
                                    <button
                                        type="button"
                                        onClick={removePhoto}
                                        className="
        mt-2
        text-[13px]
        text-[#0D556D]
        hover:underline
        hover:text-[#083C4F]
        transition-all
      "
                                    >
                                        remove
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="text-sm text-[#0D556D] ml-6">
                            <p className="font-semibold text-base mb-2">
                                Image requirements:
                            </p>

                            <ul className="space-y-1.5 leading-7 list-decimal list-inside">
                                <li>Min. 400 × 400 px</li>

                                <li>Max. 2MB</li>

                                <li>Your face or company logo</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-xl font-bold text-[#0D556D] mb-4">
                            User Details
                        </h2>

                        <div className="grid grid-cols-2 gap-x-10 gap-y-6">
                            <div>
                                <p className="text-sm text-[#0D556D] mb-2">
                                    Duration: {USER_DATA.duration}
                                </p>

                                <p className="text-sm text-[#0D556D]">
                                    No of Project Allocated:{" "}
                                    {USER_DATA.projectCount}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-[#0D556D]">
                                    Domain: {USER_DATA.domain}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                                <div>
                                    <label className="block text-sm font-medium text-[#0D556D] mb-2">
                                        Department
                                    </label>

                                    <input
                                        type="text"
                                        value={department}
                                        onChange={(e) =>
                                            setDepartment(e.target.value)
                                        }
                                        placeholder="Enter Department"
                                        className="
                      w-full
                      bg-[#F5F5F5]
                      border-0
                      border-b-2
                      border-[#0D556D]
                      px-3
                      py-2
                      outline-none
                      placeholder:text-gray-400
                      placeholder:font-normal
                      placeholder:opacity-70
                      focus:border-forest-900
                      transition
                    "
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#0D556D] mb-2">
                                        Batch Year
                                    </label>

                                    <input
                                        type="text"
                                        value={batchYear}
                                        onChange={(e) =>
                                            setBatchYear(e.target.value)
                                        }
                                        placeholder="Enter Batch Year"
                                        className="
                      w-full
                      bg-[#F5F5F5]
                      border-0
                      border-b-2
                      border-[#0D556D]
                      px-3
                      py-2
                      outline-none
                      placeholder:text-gray-400
                      placeholder:font-normal
                      placeholder:opacity-70
                      focus:border-forest-900
                      transition
                    "
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-[#0D556D] mb-2">
                                        Github Link
                                    </label>

                                    <input
                                        type="text"
                                        value={github}
                                        onChange={handleGithubChange}
                                        placeholder="Enter Github Link"
                                        className="
                      w-full
                      bg-[#F5F5F5]
                      border-0
                      border-b-2
                      border-[#0D556D]
                      px-3
                      py-2
                      outline-none
                      placeholder:text-gray-400
                      placeholder:font-normal
                      placeholder:opacity-70
                      focus:border-forest-900
                      transition
                    "
                                    />
                                    {githubError && (
  <p className="mt-2 text-sm text-red-500">
    {githubError}
  </p>
)}
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-[#0D556D] mb-2">
                                        SRM Mail ID
                                    </label>

                                    <div className="relative">
                                        <input
                                            type={
                                                showEmail ? "text" : "password"
                                            }
                                            value={email}
                                            onChange={handleEmailChange}
                                            placeholder="Enter SRM Mail ID"
                                            className="
                        w-full
                        bg-[#F5F5F5]
                        border-0
                        border-b-2
                        border-[#0D556D]
                        px-3
                        py-2
                        pr-12
                        outline-none
                        placeholder:text-gray-400
                        placeholder:font-normal
                        placeholder:opacity-70
                        focus:border-forest-900
                        transition
                      "
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowEmail(!showEmail)
                                            }
                                            className="
    absolute
    right-3
    top-1/2
    -translate-y-1/2
    text-[#0D556D]
    hover:text-[#083C4F]
    transition-colors
  "
                                        >
                                            {showEmail ? (
                                                <Eye size={18} />
                                            ) : (
                                                <EyeOff size={18} />
                                            )}
                                        </button>
                                    </div>
                                     {emailError && (
  <p className="mt-2 text-sm text-red-500">
    {emailError}
  </p>
)}
                                </div>
                            </div>

                            <div className="flex justify-end mt-10">
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="
                    bg-forest-900
                    hover:bg-forest-800
                    text-white
                    px-7
                    py-2.5
                    rounded-xl
                    font-medium
                    transition
                  "
                                >
                                    Update Profile
                                </button>
                            </div>
                        </div>

                        {showSuccess && (
                            <div
                                className="
                  mt-8
                  rounded-2xl
                  border
                  border-green-300
                  bg-green-50
                  p-5
                  flex
                  items-start
                  gap-4
                "
                            >
                                <div
                                    className={`
    w-10
    h-10
    rounded-full
    flex
    items-center
    justify-center
    ${messageType === "success" ? "bg-green-500" : "bg-yellow-500"}
  `}
                                >
                                    <Check size={20} className="text-white" />
                                </div>

                                <div className="flex-1">
                                    <h3
                                        className={`font-semibold ${
                                            messageType === "success"
                                                ? "text-green-700"
                                                : "text-yellow-700"
                                        }`}
                                    >
                                        {messageType === "success"
                                            ? "Successfully Saved."
                                            : "No Changes"}
                                    </h3>

                                    <p
                                        className={`text-sm mt-1 ${
                                            messageType === "success"
                                                ? "text-green-600"
                                                : "text-yellow-700"
                                        }`}
                                    >
                                        {message}
                                    </p>
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateProfile;
