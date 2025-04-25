import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/api";
import { toast, ToastContainer } from "react-toastify";
import { RegisterForm } from "../types/dtos";

const Register = () => {
  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSigninNavigation = () => {
    navigate("/login");
  };

  const disableButton = () => {
    return (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.password.trim() ||
      !form.phone.trim()
    );
  };

  const validate = () => {
    const newErrors: Partial<typeof form> = {};
    if (!form.name) newErrors.name = "Name is required.";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Valid email is required.";
    }
    if (!form.password || form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    if (!form.phone || !/^01[0-2,5]{1}[0-9]{8}$/.test(form.phone)) {
      newErrors.phone = "Enter a valid Egyptian phone number.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await register(form.name, form.email, form.password, form.phone);
      toast.success("Registered successfully!");
      handleSigninNavigation();
    } catch (err: any) {
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
      return;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Sign up
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone}</p>
            )}
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={disableButton()}
            className={`w-full text-white font-semibold py-3 rounded-lg transition
              ${
                disableButton()
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-amber-400 hover:bg-amber-500 cursor-pointer"
              }`}
          >
            Sign up
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a
            className="text-amber-500 font-medium hover:underline hover:cursor-pointer"
            onClick={handleSigninNavigation}
          >
            Sign in
          </a>
        </p>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Register;
