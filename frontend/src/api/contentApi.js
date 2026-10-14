import axiosClient from './axiosClient';

function normalizeNews(n) {
  if (!n) return null;
  return {
    ...n,
    id: n.id,
    title: n.title,
    slug: n.slug,
    summary: n.summary || n.excerpt || '',
    content: n.content || n.excerpt || '',
    date: n.date || n.published_at || '',
    imageUrl: n.imageUrl || n.image_url || '/mission_sustainable_india.jpg',
    category: n.category || 'Initiative'
  };
}

function normalizeEvent(e) {
  if (!e) return null;
  return {
    ...e,
    id: e.id,
    title: e.title,
    slug: e.slug,
    description: e.description || '',
    date: e.date || e.event_date || '',
    time: e.time || '10:00 AM - 04:00 PM',
    location: e.location || 'Bhubaneswar, Odisha',
    seatsAvailable: e.seatsAvailable !== undefined ? e.seatsAvailable : (e.max_participants || 50),
    imageUrl: e.imageUrl || e.hero_image_url || ''
  };
}

function normalizeDocument(d) {
  if (!d) return null;
  return {
    ...d,
    id: d.id,
    title: d.title,
    year: d.year || '2025',
    type: d.type || (d.doc_type ? d.doc_type.replace(/_/g, ' ') : 'PDF'),
    size: d.size || (d.file_size_kb ? `${(d.file_size_kb / 1024).toFixed(1)} MB` : '1.2 MB'),
    fileUrl: d.fileUrl || d.file_url || '#'
  };
}

function normalizeGallery(m) {
  if (!m) return null;
  return {
    ...m,
    id: m.id,
    title: m.title,
    category: m.category || 'Initiative',
    imageUrl: m.imageUrl || m.file_url || '',
    caption: m.caption || ''
  };
}

export const contentApi = {
  /**
   * Get News and Press Releases directly from database
   */
  async getNews() {
    const res = await axiosClient.get('/news');
    if (res && Array.isArray(res.data)) {
      res.data = res.data.map(normalizeNews);
    }
    return res;
  },

  /**
   * Get Upcoming Events directly from database
   */
  async getEvents() {
    const res = await axiosClient.get('/events');
    if (res && Array.isArray(res.data)) {
      res.data = res.data.map(normalizeEvent);
    }
    return res;
  },

  /**
   * Register for an event directly in database
   */
  async registerForEvent(eventId, userData) {
    return await axiosClient.post(`/events/${eventId}/register`, userData);
  },

  /**
   * Get Photo Gallery directly from database
   */
  async getGallery() {
    const res = await axiosClient.get('/media');
    if (res && Array.isArray(res.data)) {
      res.data = res.data.map(normalizeGallery);
    }
    return res;
  },

  /**
   * Get Compliance & Audit Documents directly from database
   */
  async getDocuments() {
    const res = await axiosClient.get('/documents');
    if (res && Array.isArray(res.data)) {
      res.data = res.data.map(normalizeDocument);
    }
    return res;
  }
};
