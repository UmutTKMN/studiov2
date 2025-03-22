const RoleService = require('../services/Role.Service');
const { ErrorHandler } = require('../middleware/error');

class RoleController {
    static async createRole(req, res, next) {
        try {
            const newRole = await RoleService.createRole(req.body, req.user.id);
            res.status(201).json({
                success: true,
                message: 'Rol başarıyla oluşturuldu',
                role: newRole
            });
        } catch (error) {
            next(new ErrorHandler(error.message, 400));
        }
    }

    static async getRole(req, res, next) {
        try {
            const role = await RoleService.getRole(req.params.identifier);
            res.status(200).json({
                success: true,
                role
            });
        } catch (error) {
            next(new ErrorHandler(error.message, 404));
        }
    }

    static async getAllRoles(req, res, next) {
        try {
            const roles = await RoleService.getAllRoles();
            res.status(200).json({
                success: true,
                roles
            });
        } catch (error) {
            next(new ErrorHandler(error.message, 400));
        }
    }

    static async updateRole(req, res, next) {
        try {
            const updatedRole = await RoleService.updateRole(
                req.params.identifier,
                req.body,
                req.user.id
            );
            res.status(200).json({
                success: true,
                message: 'Rol başarıyla güncellendi',
                role: updatedRole
            });
        } catch (error) {
            next(new ErrorHandler(error.message, 400));
        }
    }

    static async deleteRole(req, res, next) {
        try {
            await RoleService.deleteRole(req.params.identifier, req.user.id);
            res.status(200).json({
                success: true,
                message: 'Rol başarıyla silindi'
            });
        } catch (error) {
            next(new ErrorHandler(error.message, 400));
        }
    }

    static async assignRole(req, res, next) {
        try {
            const role = await RoleService.assignRoleToUser(
                req.params.userId,
                req.body.roleId,
                req.user.id
            );
            res.status(200).json({
                success: true,
                message: 'Rol başarıyla atandı',
                role
            });
        } catch (error) {
            next(new ErrorHandler(error.message, 400));
        }
    }

    static async getUserRole(req, res, next) {
        try {
            const role = await RoleService.getUserRole(req.params.userId);
            res.status(200).json({
                success: true,
                role
            });
        } catch (error) {
            next(new ErrorHandler(error.message, 400));
        }
    }

    static async getRoleStats(req, res, next) {
        try {
            const stats = await RoleService.getRoleStats();
            res.status(200).json({
                success: true,
                stats
            });
        } catch (error) {
            next(new ErrorHandler(error.message, 400));
        }
    }
}

module.exports = RoleController;