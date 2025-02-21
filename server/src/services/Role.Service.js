const Role = require('../models/Role.Model');
const User = require('../models/User.Model');
const ActivityLogService = require('./ActivityLog.Service');

class RoleService {
    static async createRole(roleData, userId) {
        try {
            const existingRole = await Role.findByName(roleData.name);
            if (existingRole) {
                throw new Error('Bu rol adı zaten kullanılıyor');
            }
            const result = await Role.create(roleData);

            await ActivityLogService.logActivity(
                userId,
                'CREATE',
                'roles',
                result.insertId,
                `Yeni rol oluşturuldu: ${roleData.role_name}`
            );

            return { id: result.insertId, ...roleData };
        } catch (error) {
            throw new Error('Rol oluşturma hatası: ' + error.message);
        }
    }

    static async getRoleById(roleId) {
        try {
            const role = await Role.findById(roleId);
            if (!role) {
                throw new Error('Rol bulunamadı');
            }
            return role;
        } catch (error) {
            throw new Error('Rol alma hatası: ' + error.message);
        }
    }

    static async getAllRoles() {
        try {
            return await Role.findAll();
        } catch (error) {
            throw new Error('Rolleri alma hatası: ' + error.message);
        }
    }

    static async updateRole(roleId, roleData) {
        try {
            const role = await Role.findById(roleId);
            if (!role) {
                throw new Error('Rol bulunamadı');
            }

            if (roleData.name !== role.name) {
                const existingRole = await Role.findByName(roleData.name);
                if (existingRole) {
                    throw new Error('Bu rol adı zaten kullanılıyor');
                }
            }

            await Role.update(roleId, roleData);
            return await Role.findById(roleId);
        } catch (error) {
            throw new Error('Rol güncelleme hatası: ' + error.message);
        }
    }

    static async deleteRole(roleId) {
        try {
            const role = await Role.findById(roleId);
            if (!role) {
                throw new Error('Rol bulunamadı');
            }

            // Varsayılan rolü silmeye çalışıyorsa engelle
            if (role.name === 'user') {
                throw new Error('Varsayılan rol silinemez');
            }

            await Role.delete(roleId);
            return true;
        } catch (error) {
            throw new Error('Rol silme hatası: ' + error.message);
        }
    }

    static async assignRoleToUser(targetUserId, roleId, adminUserId) {
        try {
            const user = await User.findById(targetUserId);
            if (!user) {
                throw new Error('Kullanıcı bulunamadı');
            }

            const role = await Role.findById(roleId);
            if (!role) {
                throw new Error('Rol bulunamadı');
            }

            await Role.assignToUser(targetUserId, roleId);

            await ActivityLogService.logActivity(
                adminUserId,
                'UPDATE',
                'users',
                targetUserId,
                `Kullanıcıya yeni rol atandı: ${role.role_name}`
            );

            return await Role.getUserRole(targetUserId);
        } catch (error) {
            throw new Error('Rol atama hatası: ' + error.message);
        }
    }

    static async getUserRole(userId) {
        try {
            const role = await Role.getUserRole(userId);
            if (!role) {
                throw new Error('Kullanıcının rolü bulunamadı');
            }
            return role;
        } catch (error) {
            throw new Error('Kullanıcı rolü alma hatası: ' + error.message);
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
                        userCount
                    };
                })
            );
            return stats;
        } catch (error) {
            throw new Error('Rol istatistikleri alma hatası: ' + error.message);
        }
    }
}

module.exports = RoleService;