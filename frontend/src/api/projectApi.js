import axiosClient from './axiosClient';

function normalizeProject(p) {
  if (!p) return null;
  const projectImage = p.imageUrl || p.hero_image_url;
  return {
    ...p,
    id: p.id,
    title: p.title,
    slug: p.slug,
    shortDescription: p.shortDescription || p.summary || '',
    description: p.description || p.summary || '',
    imageUrl: projectImage || '',
    category: p.category || p.category_name || '',
    categoryId: p.categoryId || p.category_id || '',
    impactMetrics: p.impactMetrics || p.impact_metrics || []
  };
}

export const projectApi = {
  /**
   * List active projects with category and search filter directly from database
   */
  async listProjects(params = {}) {
    const { category, ...filters } = params;
    const queryParams = category && category !== 'all'
      ? { ...filters, category }
      : filters;
    const response = await axiosClient.get('/projects', { params: queryParams });
    if (response && Array.isArray(response.data)) {
      response.data = response.data.map(normalizeProject);
    }
    return response;
  },

  /**
   * Get single project by ID or slug directly from database
   */
  async getProject(id) {
    const response = await axiosClient.get(`/projects/${id}`);
    if (response && response.data) {
      response.data = normalizeProject(response.data);
    }
    return response;
  },

  /**
   * List all trust project categories directly from database
   */
  async listCategories() {
    return await axiosClient.get('/categories');
  },

  /**
   * Admin: Create new project in database
   */
  async createProject(projectData) {
    return await axiosClient.post('/projects', projectData);
  },

  /**
   * Admin: Update existing project in database
   */
  async updateProject(id, projectData) {
    return await axiosClient.put(`/projects/${id}`, projectData);
  },

  /**
   * Admin: Delete project in database
   */
  async deleteProject(id) {
    return await axiosClient.delete(`/projects/${id}`);
  }
};
