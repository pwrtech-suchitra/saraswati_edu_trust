import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { projectApi } from '../../api/projectApi';
import { formatINR, calculateProgress } from '../../utils/formatters';
import { Spinner } from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useNotification } from '../../hooks/useNotification';

export default function AdminProjectsPage() {
  const { showSuccess, showError } = useNotification();
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    categoryId: '1',
    targetAmount: '',
    shortDescription: '',
    imageUrl: '',
  });

  useEffect(() => {
    let cancelled = false;

    Promise.all([
        projectApi.listProjects(),
        projectApi.listCategories(),
      ])
      .then(([projRes, catRes]) => {
        if (cancelled) return;
        if (projRes.success) setProjects(projRes.data || []);
        if (catRes.success) setCategories(catRes.data || []);
      })
      .catch(() => {
        if (!cancelled) showError('Failed to load project records');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [showError]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      title: '',
      categoryId: categories[0]?.id || '1',
      targetAmount: '',
      shortDescription: '',
      imageUrl: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (proj) => {
    setEditingId(proj.id);
    setFormData({
      title: proj.title,
      categoryId: proj.categoryId || '1',
      targetAmount: proj.targetAmount,
      shortDescription: proj.shortDescription,
      imageUrl: proj.imageUrl || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this project?')) return;
    try {
      await projectApi.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      showSuccess('Project record deactivated successfully in database');
    } catch (err) {
      showError(err.message || 'Failed to deactivate project from database');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.targetAmount) {
      showError('Please fill in required fields');
      return;
    }

    try {
      if (editingId) {
        await projectApi.updateProject(editingId, {
          title: formData.title,
          summary: formData.shortDescription,
          description: formData.shortDescription,
          target_amount: Number(formData.targetAmount),
          category_id: formData.categoryId ? Number(formData.categoryId) : undefined,
          hero_image_url: formData.imageUrl
        });
        showSuccess('Project updated successfully in database');
      } else {
        await projectApi.createProject({
          title: formData.title,
          summary: formData.shortDescription,
          description: formData.shortDescription,
          target_amount: Number(formData.targetAmount),
          category_id: formData.categoryId ? Number(formData.categoryId) : 1,
          hero_image_url: formData.imageUrl || 'https://thumbs.dreamstime.com/b/group-students-community-members-gathers-outside-school-solar-panels-its-roof-sustainable-finance-project-349517027.jpg',
          location: 'Odisha'
        });
        showSuccess('New initiative created successfully in database');
      }
      setModalOpen(false);
      const res = await projectApi.listProjects();
      if (res && res.data) setProjects(res.data);
    } catch (err) {
      showError(err.message || 'Database operation failed');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--color-slate-900)' }}>Project Management</h2>
          <p style={{ color: 'var(--color-slate-500)', fontSize: '0.9rem' }}>
            Create and maintain community campaigns, funding targets, and progress counters.
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={handleOpenCreate}>
          Add Project
        </Button>
      </div>

      {loading ? (
        <Spinner text="Loading projects..." />
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Project Title</th>
                <th>Category</th>
                <th>Target Goal</th>
                <th>Raised</th>
                <th>Progress</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => {
                const prog = calculateProgress(p.raisedAmount, p.targetAmount);
                return (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--color-slate-900)' }}>{p.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-slate-400)' }}>{p.id}</div>
                    </td>
                    <td>
                      <span className="badge badge-emerald">{p.category}</span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{formatINR(p.targetAmount)}</td>
                    <td style={{ fontWeight: 700, color: 'var(--color-primary-700)' }}>{formatINR(p.raisedAmount)}</td>
                    <td style={{ minWidth: '120px' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.2rem' }}>{prog}%</div>
                      <div className="progress-bar-wrap" style={{ margin: 0, height: '6px' }}>
                        <div className="progress-bar-fill" style={{ width: `${prog}%` }} />
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-success">{p.status || 'ACTIVE'}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '0.35rem 0.55rem' }}
                          title="Edit Project"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '0.35rem 0.55rem', color: 'var(--color-danger)' }}
                          title="Deactivate"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Project Form Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Project Details' : 'Create New Community Project'}
        maxWidth="620px"
      >
        <form onSubmit={handleFormSubmit}>
          <Input
            label="Project Title"
            placeholder="e.g. Clean Solar Drinking Water for 20 Villages"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Target Funding Amount (INR ₹)"
            type="number"
            placeholder="e.g. 1000000"
            value={formData.targetAmount}
            onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
            required
          />

          <Input
            label="Image URL (Unsplash or CDN)"
            placeholder="https://images.unsplash.com/..."
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          />

          <div className="form-group">
            <label className="form-label">Short Description</label>
            <textarea
              rows="3"
              className="form-textarea"
              placeholder="Explain the objective and expected community benefits..."
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingId ? 'Save Changes' : 'Publish Project'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
