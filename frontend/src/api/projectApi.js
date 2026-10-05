import axiosClient from './axiosClient';
import { mockProjects, mockCategories } from './mockData';

export const projectApi = {
  /**
   * List active projects with category and search filter
   */
  async listProjects(params = {}) {
    try {
      const response = await axiosClient.get('/projects', { params });
      return response;
    } catch (error) {
      if (error.isNetworkError || error.status === 404 || error.status >= 500) {
        let filtered = [...mockProjects];
        if (params.category && params.category !== 'all') {
          filtered = filtered.filter(p => p.categoryId === params.category || p.category === params.category);
        }
        if (params.search) {
          const q = params.search.toLowerCase();
          filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q));
        }
        return {
          success: true,
          message: 'Projects loaded (mock)',
          data: filtered,
          meta: { total: filtered.length, page: 1, limit: 10 }
        };
      }
      throw error;
    }
  },

  /**
   * Get single project by ID or slug
   */
  async getProject(id) {
    try {
      const response = await axiosClient.get(`/projects/${id}`);
      return response;
    } catch (error) {
      if (error.isNetworkError || error.status === 404 || error.status >= 500) {
        const found = mockProjects.find(p => p.id === id || p.slug === id) || mockProjects[0];
        return {
          success: true,
          data: found
        };
      }
      throw error;
    }
  },

  /**
   * List all trust project categories
   */
  async listCategories() {
    try {
      const response = await axiosClient.get('/categories');
      return response;
    } catch (error) {
      if (error.isNetworkError || error.status === 404 || error.status >= 500) {
        return {
          success: true,
          data: mockCategories
        };
      }
      throw error;
    }
  },

  /**
   * Admin: Create new project
   */
  async createProject(projectData) {
    return await axiosClient.post('/projects', projectData);
  },

  /**
   * Admin: Update existing project
   */
  async updateProject(id, projectData) {
    return await axiosClient.put(`/projects/${id}`, projectData);
  },

  /**
   * Admin: Delete project
   */
  async deleteProject(id) {
    return await axiosClient.delete(`/projects/${id}`);
  }
};
