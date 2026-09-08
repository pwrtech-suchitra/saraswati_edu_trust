/**
 * Projects & Categories Controller
 * Author: Suchitra (Backend & Database Developer)
 */

const projectService = require('../services/projectService');
const db = require('../config/db');
const ApiResponse = require('../utils/apiResponse');

async function listProjects(req, res, next) {
  try {
    const { category, status, search, page = 1, limit = 9 } = req.query;
    const { projects, meta } = await projectService.getProjects({ category, status, search, page, limit });
    return ApiResponse.success(res, 'Projects retrieved successfully', projects, meta);
  } catch (err) {
    next(err);
  }
}

async function getProject(req, res, next) {
  try {
    const project = await projectService.getProjectByIdOrSlug(req.params.id);
    return ApiResponse.success(res, 'Project details retrieved', project);
  } catch (err) {
    next(err);
  }
}

async function createProject(req, res, next) {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.hero_image_url = `/uploads/projects/${req.file.filename}`;
    }
    const project = await projectService.createProject(data, req.user ? req.user.id : null);
    return ApiResponse.created(res, 'Project created successfully', project);
  } catch (err) {
    next(err);
  }
}

async function updateProject(req, res, next) {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.hero_image_url = `/uploads/projects/${req.file.filename}`;
    }
    const project = await projectService.updateProject(req.params.id, data);
    return ApiResponse.success(res, 'Project updated successfully', project);
  } catch (err) {
    next(err);
  }
}

async function deleteProject(req, res, next) {
  try {
    const result = await projectService.deleteProject(req.params.id);
    return ApiResponse.success(res, 'Project deleted successfully', result);
  } catch (err) {
    next(err);
  }
}

async function listCategories(req, res, next) {
  try {
    const result = await db.query('SELECT * FROM categories ORDER BY id ASC');
    return ApiResponse.success(res, 'Categories retrieved', result.rows);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  listCategories
};
