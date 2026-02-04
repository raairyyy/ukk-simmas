"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"


export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()


const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()

  try {
    const res = await fetch("/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ email, password }),
  credentials: "include", // 🔥 WAJIB
})

    const data = await res.json()

    if (!res.ok) {
      alert(data.error || "Login failed")
      return
    }


// Ganti router.push dengan ini agar browser melakukan full reload 
// dan mengirim cookie terbaru ke middleware
if (data.role === "admin") {
  window.location.href = "/dashboard/admin"
} else if (data.role === "guru") {
  window.location.href = "/dashboard/guru"
} else if (data.role === "siswa") {
  window.location.href = "/dashboard/siswa"
}



  } catch (err) {
    console.error("Login error:", err)
    alert("Server error")
  }
}


  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#eef3ff] via-[#f5f8ff] to-[#eef3ff]">

      {/* Glass background effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_40%),radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.15),transparent_40%)]"></div>

      {/* Card */}
      <div className="relative w-full max-w-md rounded-2xl bg-white/70 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-white/40 p-8">

        {/* Icon circle */}
        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
            <User className="w-7 h-7 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Welcome Back
        </h1>
        <p className="text-sm text-gray-500 text-center mt-1 mb-7">
          Sign in to your account
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              <Input
                type="email"
                placeholder="Enter your email"
                className="pl-10 h-11 rounded-lg bg-white/80 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pl-10 pr-10 h-11 rounded-lg bg-white/80 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Button */}
          <Button
            type="submit"
            className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-md transition-all duration-200"
          >
            Sign In
          </Button>
        </form>

        {/* Register */}
        <p className="text-center text-sm text-gray-600 mt-5">
          Don&apos;t have an account?{" "}
          <span className="text-blue-600 font-medium cursor-pointer hover:underline">
            Sign up
          </span>
        </p>

        {/* Terms */}
        <p className="text-center text-xs text-gray-400 mt-6">
          By signing in, you agree to our{" "}
          <span className="text-blue-600 cursor-pointer hover:underline">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="text-blue-600 cursor-pointer hover:underline">
            Privacy Policy
          </span>
        </p>

      </div>
    </div>
  )
}
