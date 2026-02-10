"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
      credentials: "include",
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error)
      return
    }

    // langsung ke dashboard siswa
    window.location.href = "/dashboard/siswa"
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mt-20">
      <h1 className="text-xl font-bold">Register Siswa</h1>

      {error && <p className="text-red-500">{error}</p>}

      <Input placeholder="Nama" value={name} onChange={e => setName(e.target.value)} />
      <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />

      <Button type="submit" className="w-full">Daftar</Button>
    </form>
  )
}
