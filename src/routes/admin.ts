"use strict";

import express, { Request, Response } from "express"
import { authenticateToken, requireAdmin, requireSuperAdmin } from "./routes/auth"
import { userDB } from "../db/users"

const router = express.Router()

// Get all users - admin only
router.get("/users", authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const users = await userDB.getAll()
    const safeUsers = users.map(user => {
      const { password, ...safe } = user
      return safe
    })
    res.json(safeUsers)
  } catch (e) {
    res.status(500).json({ error: "Erreur serveur" })
  }
})

// Create user - admin only
router.post("/users", authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, phone, role = "CLIENT" } = req.body

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: "Champs obligatoires manquants" })
    }

    // Check if user already exists
    const existingUser = await userDB.findByEmail(email)
    if (existingUser) {
      return res.status(409).json({ error: "Un compte avec cet email existe déjà" })
    }

    // Hash password
    const bcrypt = eval('require("bcrypt")')
    const passwordHash = await bcrypt.hash(password, 12)

    // Create user
    const newUser = await userDB.create({
      email,
      firstName,
      lastName,
      phone,
      password: passwordHash,
      role,
      status: "ACTIVE"
    })

    const { password: _, ...safeUser } = newUser
    res.status(201).json(safeUser)
  } catch (e) {
    console.error("Create user error:", e)
    res.status(500).json({ error: "Erreur serveur" })
  }
})

// Update user - admin only
router.put("/users/:id", authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updates = req.body

    const updatedUser = await userDB.update(id, updates)
    if (!updatedUser) {
      return res.status(404).json({ error: "Utilisateur non trouvé" })
    }

    const { password: _, ...safeUser } = updatedUser
    res.json(safeUser)
  } catch (e) {
    res.status(500).json({ error: "Erreur serveur" })
  }
})

// Delete user - admin only
router.delete("/users/:id", authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const deleted = await userDB.delete(id)
    if (!deleted) {
      return res.status(404).json({ error: "Utilisateur non trouvé" })
    }

    res.json({ message: "Utilisateur supprimé" })
  } catch (e) {
    res.status(500).json({ error: "Erreur serveur" })
  }
})

// Super admin only endpoints
router.get("/stats", authenticateToken, requireSuperAdmin, async (req: Request, res: Response) => {
  try {
    const users = await userDB.getAll()

    const stats = {
      totalUsers: users.length,
      adminCount: users.filter(u => ["SUPER_ADMIN", "ADMIN", "MODERATOR"].includes(u.role)).length,
      merchantCount: users.filter(u => u.role === "MERCHANT").length,
      shopManagerCount: users.filter(u => u.role === "SHOP_MANAGER").length,
      clientCount: users.filter(u => u.role === "CLIENT").length,
      activeUsers: users.filter(u => u.status === "ACTIVE").length,
      suspendedUsers: users.filter(u => u.status === "SUSPENDED").length,
      pendingUsers: users.filter(u => u.status === "PENDING_VERIFICATION").length
    }

    res.json(stats)
  } catch (e) {
    res.status(500).json({ error: "Erreur serveur" })
  }
})

export default router
