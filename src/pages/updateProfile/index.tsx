import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Building2,
  FolderKanban,
  CalendarDays,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { teamsService } from "../../services/teamsService";
export const UpdateProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    department: user?.department || "",
    project: user?.project || "",
    joiningDate: user?.joiningDate || "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const response = await teamsService.updateUser(user.id, {
        name: formData.name,
        email: formData.email,
        department: formData.department,
        project: formData.project,
        joiningDate: formData.joiningDate,
      });
      const updatedUser = {
        ...user,
        name: response.name ?? formData.name,
        email: response.email ?? formData.email,
      };
      login(updatedUser, localStorage.getItem("crewpal_access_token") || "");
      localStorage.setItem("user", JSON.stringify(updatedUser));
      navigate("/user-dashboard");
    } catch (error) {
      console.error("Profile update failed:", error);
      alert("Unable to update profile");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#F5F0E1] py-10 px-6">
      <div className="max-w-4xl mx-auto">
        {}
        <button
          onClick={() => navigate(-1)}
          className="
          flex
          items-center
          gap-2
          text-[#073B2E]
          mb-8
          hover:text-[#0D556D]
          "
        >
          <ArrowLeft size={20} />
          Back
        </button>
        {}
        <div className="mb-8">
          <h1
            className="
          text-4xl
          font-bold
          text-[#073B2E]
          "
          >
            Update Profile
          </h1>
          <p
            className="
          mt-2
          text-[#55706A]
          "
          >
            Update your personal information
          </p>
        </div>
        {}
        <div
          className="
        bg-[#F8F7EE]
        rounded-3xl
        border
        border-[#E5E8DD]
        p-10
        "
        >
          <div
            className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-6
          "
          >
            {}
            <div>
              <label
                className="
              block
              mb-2
              text-[#073B2E]
              font-medium
              "
              >
                Full Name
              </label>
              <div
                className="
              flex
              items-center
              bg-white
              border
              rounded-xl
              px-4
              "
              >
                <User size={18} className="text-[#073B2E]" />
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="
                  w-full
                  p-4
                  outline-none
                  bg-transparent
                  "
                />
              </div>
            </div>
            {}
            <div>
              <label
                className="
              block
              mb-2
              text-[#073B2E]
              font-medium
              "
              >
                Email
              </label>
              <div
                className="
              flex
              items-center
              bg-white
              border
              rounded-xl
              px-4
              "
              >
                <Mail size={18} className="text-[#073B2E]" />
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="
                  w-full
                  p-4
                  outline-none
                  bg-transparent
                  "
                />
              </div>
            </div>
            {}
            <div>
              <label
                className="
              block
              mb-2
              text-[#073B2E]
              font-medium
              "
              >
                Department
              </label>
              <div
                className="
              flex
              items-center
              bg-white
              border
              rounded-xl
              px-4
              "
              >
                <Building2 size={18} className="text-[#073B2E]" />
                <input
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="
                  w-full
                  p-4
                  outline-none
                  bg-transparent
                  "
                />
              </div>
            </div>
            {}
            <div>
              <label
                className="
              block
              mb-2
              text-[#073B2E]
              font-medium
              "
              >
                Current Project
              </label>
              <div
                className="
              flex
              items-center
              bg-white
              border
              rounded-xl
              px-4
              "
              >
                <FolderKanban size={18} className="text-[#073B2E]" />
                <input
                  name="project"
                  value={formData.project}
                  onChange={handleChange}
                  className="
                  w-full
                  p-4
                  outline-none
                  bg-transparent
                  "
                />
              </div>
            </div>
            {}
            <div className="md:col-span-2">
              <label
                className="
              block
              mb-2
              text-[#073B2E]
              font-medium
              "
              >
                Joining Date
              </label>
              <div
                className="
              flex
              items-center
              bg-white
              border
              rounded-xl
              px-4
              "
              >
                <CalendarDays size={18} className="text-[#073B2E]" />
                <input
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  className="
                  w-full
                  p-4
                  outline-none
                  bg-transparent
                  "
                />
              </div>
            </div>
          </div>
          {}
          <button
            onClick={handleSubmit}
            className="
            mt-10
            flex
            items-center
            justify-center
            gap-2
            bg-[#073B2E]
            text-white
            px-8
            py-3
            rounded-xl
            font-semibold
            hover:bg-[#0D556D]
            transition
            "
          >
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
export default UpdateProfile;