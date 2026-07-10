"use strict";

import { writeFileSync, readFileSync, existsSync, mkdirSync } from "fs"
import path from "path"
import { verifyToken } from "./auth"

type User = {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  password: string
  role: UserRole
  status: UserStatus
  avatar?: string
  createdAt: string
  lastLogin?: string
}

type UserRole = 
  | "SUPER_ADMIN" 
  | "ADMIN" 
  | "MODERATOR" 
  | "MERCHANT" 
  | "SHOP_MANAGER" 
  | "CLIENT" 
  | "VISITOR"

type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION"

const dbPath = path.join(process.cwd(), "src", "db", "users.json")

class UserDatabase {
  constructor() {
    this.ensureFileExists()
  }

  private ensureFileExists() {
    if (!existsSync(path.dirname(dbPath))) {
      mkdirSync(path.dirname(dbPath), { recursive: true })
    }
    if (!existsSync(dbPath)) {
      this.save([])
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const users = this.getAll()
    return users.find(u => u.email === email) || null
  }

  async findById(id: string): Promise<User | null> {
    const users = this.getAll()
    return users.find(u => u.id === id) || null
  }

  async create(userData: Omit<User, "id" | "createdAt">): Promise<User> {
    const users = this.getAll()
    const newUser: User = {
      ...userData,
      id: this.generateId(),
      createdAt: new Date().toISOString()
    }
    users.push(newUser)
    this.save(users)
    return newUser
  }

  async update(id: string, updates: Partial<User>): Promise<User | null> {
    const users = this.getAll()
    const index = users.findIndex(u => u.id === id)
    if (index === -1) return null

    users[index] = { ...users[index], ...updates }
    this.save(users)
    return users[index]
  }

  async delete(id: string): Promise<boolean> {
    const users = this.getAll()
    const filtered = users.filter(u => u.id !== id)
    if (filtered.length === users.length) return false

    this.save(filtered)
    return true
  }

  getAll(): User[] {
    try {
      const data = readFileSync(dbPath, "utf8")
      return JSON.parse(data)
    } catch (e) {
      console.error("Failed to read users.json:", e)
      return []
    }
  }

  save(users: User[]): void {
    try {
      writeFileSync(dbPath, JSON.stringify(users, null, 2))
    } catch (e) {
      console.error("Failed to write users.json:", e)
    }
  }

  private generateId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

const userDB = new UserDatabase()
export default userDB

// Seed initial users
async function seed() {
  const superAdmin = await userDB.findByEmail("admin@congosoldes.cg")
  if (!superAdmin) {
    await userDB.create({
      email: "admin@congosoldes.cg",
      firstName: "Super",
      lastName: "Admin",
      phone: "+242000000001",
      password: "Admin@123",
      role: "SUPER_ADMIN",
      status: "ACTIVE"
    })

    console.log("✅ Seeded admin user")
  }

  const moderator = await userDB.findByEmail("moderateur@congosoldes.cg")
  if (!moderator) {
    await userDB.create({
      email: "moderateur@congosoldes.cg",
      firstName: "Modérateur",
      lastName: "Congo Soldes",
      phone: "+242000000002",
      password: "Modérateur@123",
      role: "MODERATOR",
      status: "ACTIVE"
    })

    console.log("✅ Seeded moderator user")
  }
}

seed()
