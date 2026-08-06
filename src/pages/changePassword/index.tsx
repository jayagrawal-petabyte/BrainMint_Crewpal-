import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";

export const ChangePassword = () => {
  const navigate = useNavigate();
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const validate = () => {
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    let valid = true;

    if (!currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required.";
      valid = false;
    }

    if (!newPassword.trim()) {
      newErrors.newPassword = "New password is required.";
      valid = false;
    } else if (
      !/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(newPassword)
    ) {
      newErrors.newPassword =
        "Password must be at least 8 characters with 1 uppercase, 1 number and 1 special character.";
      valid = false;
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password.";
      valid = false;
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      valid = false;
    }

    setErrors(newErrors);

    return valid;
  };

  const handleSubmit = () => {
  if (!validate()) return;

  setLoading(true);

  setTimeout(() => {
    setLoading(false);
    setShowSuccess(true);

    setTimeout(() => {
      navigate(-1);
    }, 1800);
  }, 1500);
};

    return (
    <div className="min-h-screen bg-[#F6F8F3] py-10 px-6">

      <div className="max-w-3xl mx-auto">

        {/* Back Button */}

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#073B2E] hover:text-[#0D556D] transition mb-8"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back</span>
        </button>

        {/* Card */}

        <div className="bg-white rounded-[32px] shadow-xl border border-gray-100 p-10">

          {/* Header */}

          <div className="flex items-center gap-4 mb-10">

            <div className="w-14 h-14 rounded-2xl bg-[#EDF7F3] flex items-center justify-center">

              <ShieldCheck
                size={30}
                className="text-[#073B2E]"
              />

            </div>

            <div>

              <h1 className="text-3xl font-bold text-[#073B2E]">
                Change Password
              </h1>

              <p className="text-gray-500 mt-1">
                Keep your account secure by updating your password.
              </p>

            </div>

          </div>

          {/* Current Password */}

          <div className="mb-7">

            <label className="block text-sm font-semibold text-[#073B2E] mb-2">
              Current Password
            </label>

            <div className="relative">

              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) =>
                  setCurrentPassword(e.target.value)
                }
                className="w-full border rounded-xl pl-12 pr-12 py-3 focus:ring-2 focus:ring-[#073B2E] outline-none"
                placeholder="Enter current password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowCurrent(!showCurrent)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showCurrent ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>

            {errors.currentPassword && (
              <p className="text-red-500 text-sm mt-2">
                {errors.currentPassword}
              </p>
            )}

          </div>

          {/* New Password */}

          <div className="mb-7">

            <label className="block text-sm font-semibold text-[#073B2E] mb-2">
              New Password
            </label>

            <div className="relative">

              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                className="w-full border rounded-xl pl-12 pr-12 py-3 focus:ring-2 focus:ring-[#073B2E] outline-none"
                placeholder="Enter new password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowNew(!showNew)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showNew ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>

            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-2">
                {errors.newPassword}
              </p>
            )}

          </div>

          {/* Confirm Password */}

          <div className="mb-8">

            <label className="block text-sm font-semibold text-[#073B2E] mb-2">
              Confirm Password
            </label>

            <div className="relative">

              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                className="w-full border rounded-xl pl-12 pr-12 py-3 focus:ring-2 focus:ring-[#073B2E] outline-none"
                placeholder="Confirm new password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirm(!showConfirm)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showConfirm ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>

            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-2">
                {errors.confirmPassword}
              </p>
            )}

          </div>

                    {/* Password Requirements */}

          <div className="bg-[#EDF7F3] rounded-2xl p-6 mb-10 border border-[#D6ECE4]">

            <h3 className="font-semibold text-[#073B2E] mb-4">
              Password Requirements
            </h3>

            <ul className="space-y-3 text-sm text-gray-700">

              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#073B2E]" />
                Minimum 8 characters
              </li>

              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#073B2E]" />
                At least one uppercase letter
              </li>

              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#073B2E]" />
                At least one number
              </li>

              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#073B2E]" />
                At least one special character
              </li>

            </ul>

          </div>

          {/* Action Buttons */}

          <div className="flex justify-end gap-4">

            <button
              onClick={() => navigate(-1)}
              className="
                px-6
                py-3
                rounded-xl
                border
                border-gray-300
                text-gray-700
                hover:bg-gray-100
                transition
              "
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="
                min-w-[180px]
                px-8
                py-3
                rounded-xl
                bg-[#073B2E]
                text-white
                font-semibold
                hover:bg-[#0B4A3A]
                transition
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >

              {loading ? (
                <div className="flex items-center justify-center gap-3">

                  <div className="
                    w-5
                    h-5
                    border-2
                    border-white
                    border-t-transparent
                    rounded-full
                    animate-spin
                  " />

                  Updating...

                </div>
              ) : (
                "Update Password"
              )}

            </button>

          </div>

        </div>

      </div>

    {showSuccess && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

    <div className="bg-white rounded-3xl shadow-2xl w-[420px] p-8 text-center">

      <div
        className="
          w-20
          h-20
          rounded-full
          bg-[#EDF7F3]
          flex
          items-center
          justify-center
          mx-auto
          mb-6
        "
      >
        <ShieldCheck
          size={42}
          className="text-[#0D556D]"
        />
      </div>

      <h2 className="text-2xl font-bold text-[#073B2E]">
        Password Updated
      </h2>

      <p className="text-gray-500 mt-3">
        Your password has been updated successfully.
      </p>

      <div className="mt-7">

        <button
          onClick={() => {
            setShowSuccess(false);
            navigate(-1);
          }}
          className="
            bg-[#073B2E]
            hover:bg-[#0B4A39]
            text-white
            px-8
            py-3
            rounded-xl
            font-medium
            transition
          "
        >
          Continue
        </button>

      </div>

    </div>

  </div>
)}
    </div>
  );
};

export default ChangePassword;