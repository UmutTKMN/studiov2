const Role = require("../models/Role.Model");
const User = require("../models/User.Model");
const ActivityLogService = require("./ActivityLog.Service");

class RoleService {
  static async createRole(roleData, userId) {
    try {
      const existingRole = await Role.findByIdOrName(roleData.name);
      if (existingRole) {
        throw new Error("Bu rol adı zaten kullanılıyor");
      }

      const result = await Role.create(roleData);

      await ActivityLogService.logActivity(
        userId,
        "CREATE",
        "roles",
        result.insertId,
        `Yeni rol oluşturuldu: ${roleData.name}`
      );

      return await Role.findByIdOrName(result.insertId);
    } catch (error) {
      throw new Error("Rol oluşturma hatası: " + error.message);
    }
  }

  static async getRole(identifier) {
    try {
      const role = await Role.findByIdOrName(identifier);
      if (!role) throw new Error("Rol bulunamadı");
      return role;
    } catch (error) {
      throw new Error("Rol alma hatası: " + error.message);
    }
  }

  static async getAllRoles() {
    try {
      return await Role.findAll();
    } catch (error) {
      throw new Error("Rolleri alma hatası: " + error.message);
    }
  }

  static async updateRole(identifier, roleData, userId) {
    try {
      const role = await Role.findByIdOrName(identifier);
      if (!role) throw new Error("Rol bulunamadı");

      if (roleData.name && roleData.name !== role.role_name) {
        const existingRole = await Role.findByIdOrName(roleData.name);
        if (existingRole) throw new Error("Bu rol adı zaten kullanılıyor");
      }

      await Role.update(identifier, roleData);

      await ActivityLogService.logActivity(
        userId,
        "UPDATE",
        "roles",
        role.role_id,
        `Rol güncellendi: ${roleData.name || role.role_name}`
      );

      return await Role.findByIdOrName(identifier);
    } catch (error) {
      throw new Error("Rol güncelleme hatası: " + error.message);
    }
  }

  static async deleteRole(identifier, userId) {
    try {
      const role = await Role.findByIdOrName(identifier);
      if (!role) throw new Error("Rol bulunamadı");

      if (role.role_name === "admin" || role.role_name === "user") {
        throw new Error("Sistem rolleri silinemez");
      }

      await Role.delete(identifier);

      await ActivityLogService.logActivity(
        userId,
        "DELETE",
        "roles",
        role.role_id,
        `Rol silindi: ${role.role_name}`
      );

      return true;
    } catch (error) {
      throw new Error("Rol silme hatası: " + error.message);
    }
  }

  static async assignRoleToUser(targetUserId, roleId, adminUserId) {
    try {
      const [user, role] = await Promise.all([
        User.findById(targetUserId),
        Role.findByIdOrName(roleId),
      ]);

      if (!user) throw new Error("Kullanıcı bulunamadı");
      if (!role) throw new Error("Rol bulunamadı");

      await Role.assignToUser(targetUserId, roleId);

      await ActivityLogService.logActivity(
        adminUserId,
        "UPDATE",
        "users",
        targetUserId,
        `Kullanıcıya yeni rol atandı: ${role.role_name}`
      );

      return await Role.getUserRole(targetUserId);
    } catch (error) {
      throw new Error("Rol atama hatası: " + error.message);
    }
  }

  static async getUserRole(userId) {
    try {
      const role = await Role.getUserRole(userId);
      if (!role) {
        throw new Error("Kullanıcının rolü bulunamadı");
      }
      return role;
    } catch (error) {
      throw new Error("Kullanıcı rolü alma hatası: " + error.message);
    }
  }

  static async getRoleStats() {
    try {
      const roles = await Role.findAll();
      const stats = await Promise.all(
        roles.map(async (role) => {
          const userCount = await Role.getUserCount(role.id);
          return {
            id: role.id,
            name: role.name,
            userCount,
          };
        })
      );
      return stats;
    } catch (error) {
      throw new Error("Rol istatistikleri alma hatası: " + error.message);
    }
  }
}

module.exports = RoleService;
