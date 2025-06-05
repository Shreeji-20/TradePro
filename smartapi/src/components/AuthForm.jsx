import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { register, login } from "./Functions";
const AuthForm = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    clientId: "",
    apikey: "",
    totp: "",
    name: "",
    pin: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!isLogin && !formData.name) {
      newErrors.name = "Name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    
    const response = await (isLogin ? login(formData) : register(formData));

    console.log(await response.status)
    if (response.status) {
      
      toast.success(
        `${isLogin ? "Login" : "Registration"} successful! Welcome${
          !isLogin ? `, ${formData.name}` : ""
        }`,
        { duration: 3000 }
       
      );
      navigate("/dashboard")
    } else {
      navigate("/login");
      toast.error(response.error || "Authentication failed", {
        duration: 3000,
      });
    }

    if (!isLogin) {
      setFormData({
        email: "",
        password: "",
        name: "",
        rememberMe: false,
      });
      setIsLogin(true);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg transition-all duration-300 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          {isLogin
            ? "Please sign in to your account"
            : "Sign up to get started with our service"}
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700 block"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={`pl-10 w-full py-2 border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* AngelOne Client ID */}
            <div className="space-y-2">
              <label
                htmlFor="clientId"
                className="text-sm font-medium text-gray-700 block"
              >
                AngelOne Client ID
              </label>
              <input
                id="clientId"
                name="clientId"
                type="text"
                value={formData.clientId}
                onChange={handleChange}
                className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="Enter your AngelOne client ID"
              />
            </div>

            {/* AngelOne Password */}
            <div className="space-y-2">
              <label
                htmlFor="pin"
                className="text-sm font-medium text-gray-700 block"
              >
                AngelOne Password
              </label>
              <input
                id="pin"
                name="pin"
                type="password"
                value={formData.pin}
                onChange={handleChange}
                className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="Enter your AngelOne password"
              />
            </div>

            {/* AngelOne API Key */}
            <div className="space-y-2">
              <label
                htmlFor="apikey"
                className="text-sm font-medium text-gray-700 block"
              >
                AngelOne API Key
              </label>
              <input
                id="apikey"
                name="apikey"
                type="text"
                value={formData.apikey}
                onChange={handleChange}
                className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="Enter your AngelOne API key"
              />
            </div>

            {/* AngelOne TOTP */}
            <div className="space-y-2">
              <label
                htmlFor="totp"
                className="text-sm font-medium text-gray-700 block"
              >
                AngelOne TOTP
              </label>
              <input
                id="totp"
                name="totp"
                type="text"
                value={formData.totp}
                onChange={handleChange}
                className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="Enter your AngelOne TOTP"
              />
            </div>
          </>
        )}

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-gray-700 block"
          >
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`pl-10 w-full py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all`}
              placeholder="you@example.com"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-700 block"
          >
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              className={`pl-10 w-full py-2 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all`}
              placeholder="••••••••"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          {isLogin && (
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>
          )}

          {isLogin && (
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot password?
              </a>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-[1.01]"
        >
          {isLogin ? "Sign In" : "Sign Up"}
        </button>
      </form>

      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
