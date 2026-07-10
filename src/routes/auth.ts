"use strict";

import express, { Request, Response, NextFunction } from "express"
import { userDB } from "../db/users"
import { signToken } from "../middleware/auth"
import bcrypt from "bcrypt"

const router = express.Router()
const SALT_ROUNDS = 12

// Helper middleware to get user from token
const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token manquant" })
    }

    const token = authHeader.split(" ")[1]
    const payload = await verifyToken(token)

    // Find user by ID
    const user = await userDB.findById(payload.id)
    if (!user) {
      return res.status(401).json({ error: "Utilisateur non trouvé" })
    }

    req.user = user
    next()
  } catch (e) {
    return res.status(403).json({ error: "Token invalide" })
  }
}

// Login endpoint
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis" })
    }

    // Find user
    const user = await userDB.findByEmail(email)
    if (!user) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" })
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" })
    }

    // Check user status
    if (user.status === "SUSPENDED") {
      return res.status(403).json({ error: "Compte suspendu. Contactez l'administrateur." })
    }

    if (user.status === "INACTIVE") {
      return res.status(403).json({ error: "Compte désactivé. Contactez l'administrateur." })
    }

    // Generate token
    const token = await signToken({ id: user.id, role: user.role })

    // Update last login
    await userDB.update(user.id, { lastLogin: new Date().toISOString() })

    // Return user data (without password)
    const { password: _, ...safeUser } = user

    res.json({
      message: "Connexion réussie",
      token,
      user: safeUser
    })
  } catch (e) {
    console.error("Login error:", e)
    res.status(500).json({ error: "Erreur serveur" })
  }
})

// Register endpoint
router.post("/register", async (req: Request, res: Response) => {
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
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

    // Create user
    const newUser = await userDB.create({
      email,
      firstName,
      lastName,
      phone,
      password: passwordHash,
      role,
      status: role === "MERCHANT" || role === "SHOP_MANAGER" ? "PENDING_VERIFICATION" : "ACTIVE"
    })

    const { password: _, ...safeUser } = newUser
    res.status(201).json({
      message: "Compte créé avec succès",
      user: safeUser
    })
  } catch (e) {
    console.error("Register error:", e)
    res.status(500).json({ error: "Erreur serveur" })
  }
})

// Get current user
router.get("/me", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { password: _, ...safeUser } = req.user!
    res.json(safeUser)
  } catch (e) {
    res.status(500).json({ error: "Erreur serveur" })
  }
})

// Logout endpoint
router.post("/logout", authenticateToken, async (req: Request, res: Response) => {
  try {
    res.json({ message: "Déconnexion réussie" })
  } catch (e) {
    res.status(500).json({ error: "Erreur serveur" })
  }
})

// Admin-only middleware
const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!
    const adminRoles = ["SUPER_ADMIN", "ADMIN", "MODERATOR"]
    if (!adminRoles.includes(user.role)) {
      return res.status(403).json({ error: "Accès non autorisé" })
    }
    next()
  } catch (e) {
    res.status(500).json({ error: "Erreur serveur" })
  }
}

// Super admin only middleware
const requireSuperAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!
    if (user.role !== "SUPER_ADMIN") {
      return res.status(403).json({ error: "Accès non autorisé - Super Admin seulement" })
    }
    next()
  } catch (e) {
    res.status(500).json({ error: "Erreur serveur" })
  }
}

export { authenticateToken, requireAdmin, requireSuperAdmin }
export default router
