import axiosClient from './axiosClient';

const defaultProjectImage = 'https://thumbs.dreamstime.com/b/group-students-community-members-gathers-outside-school-solar-panels-its-roof-sustainable-finance-project-349517027.jpg';
const replacedProjectImage = 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80';

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
    raisedAmount: Number(p.raisedAmount || p.raised_amount || 0),
    targetAmount: Number(p.targetAmount || p.target_amount || 0),
    imageUrl: !projectImage || projectImage === replacedProjectImage ? defaultProjectImage : projectImage,
    category: p.category || p.category_name || 'General',
    categoryId: p.categoryId || p.category_id || '',
    donorCount: p.donorCount || 0,
    impactMetrics: p.impactMetrics || [
      { label: 'Beneficiaries', value: p.beneficiaries || 'Local Community' },
      { label: 'Location', value: p.location || 'Odisha' },
      { label: 'Status', value: p.status || 'ACTIVE' }
    ]
  };
}

export const projectApi = {
  /**
   * List active projects with category and search filter directly from database
   */
  async listProjects(params = {}) {
    const response = await axiosClient.get('/projects', { params });
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
