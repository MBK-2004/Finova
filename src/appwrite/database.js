import { Client, Databases, ID, Query } from "appwrite";
import conf from "../config/config";

export class DatabaseService {
  client = new Client();
  databases;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.databases = new Databases(this.client);
  }

  // ================= GROUP =================
  async createGroup({ name, userId }) {
    return await this.databases.createDocument(
      conf.appwriteDatabaseId,
      conf.appwriteGroupsCollectionId,
      ID.unique(),
      {
        name,
        userId,
        members: JSON.stringify([]),
        createdAt: new Date().toISOString(),
      }
    );
  }

  async getGroups(userId) {
    return await this.databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteGroupsCollectionId,
      [Query.equal("userId", userId)]
    );
  }

  async updateGroup(id, data) {
  return await this.databases.updateDocument(
    conf.appwriteDatabaseId,
    conf.appwriteGroupsCollectionId,
    id,
    data
  );
}

  // ================= EXPENSE =================
  async createExpense({
  title,
  amount,
  paidBy,
  splitBetween,
  groupId,
  category,
}) {
  return await this.databases.createDocument(
    conf.appwriteDatabaseId,
    conf.appwriteExpensesCollectionId,
    ID.unique(),
    {
      title,
      amount,
      paidBy,
      splitBetween: JSON.stringify(splitBetween),
      groupId,
      category,
      settled: false,
      createdAt: new Date().toISOString(),
    }
  );
}

  async getExpenses(groupId) {
    return await this.databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteExpensesCollectionId,
      [Query.equal("groupId", groupId)]
    );

  }
  async updateExpense(expenseId, data) {
  return await this.databases.updateDocument(
    conf.appwriteDatabaseId,
    conf.appwriteExpensesCollectionId,
    expenseId,
    data
  );
}

async deleteExpense(expenseId) {
  return await this.databases.deleteDocument(
    conf.appwriteDatabaseId,
    conf.appwriteExpensesCollectionId,
    expenseId
  );
}

  async deleteGroup(groupId) {
  return await this.databases.deleteDocument(
    conf.appwriteDatabaseId,
    conf.appwriteGroupsCollectionId,
    groupId
  );
}

  async getAllExpenses() {
    return await this.databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteExpensesCollectionId
    );
  }
}

const databaseService = new DatabaseService();
export default databaseService;