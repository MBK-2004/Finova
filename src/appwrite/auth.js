import { Client, Account, ID } from "appwrite";
import conf from "../config/config";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.account = new Account(this.client);
  }

  // ======================
  // 🔐 SIGNUP
  // ======================
  async createAccount({ email, password, name }) {
    try {
      const user = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );

      if (user) {
        return await this.login({ email, password });
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  // ======================
  // 🔐 LOGIN (FIXED)
  // ======================
  async login({ email, password }) {
    try {
      // 🔥 IMPORTANT: remove old sessions first
      await this.account.deleteSessions().catch(() => {});

      return await this.account.createEmailPasswordSession(
        email,
        password
      );
    } catch (error) {
      throw error;
    }
  }

  // ======================
  // 👤 GET CURRENT USER
  // ======================
  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      return null;
    }
  }

  // ======================
  // 🚪 LOGOUT
  // ======================
  async logout() {
    try {
      await this.account.deleteSessions();
    } catch (error) {
      console.log("Logout error:", error);
    }
  }
}

const authService = new AuthService();
export default authService;