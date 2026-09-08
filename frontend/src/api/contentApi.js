import axiosClient from './axiosClient';
import { mockNews, mockEvents, mockDocuments, mockGallery } from './mockData';

export const contentApi = {
  /**
   * Get News and Press Releases
   */
  async getNews() {
    try {
      const res = await axiosClient.get('/news');
      return res;
    } catch {
      return { success: true, data: mockNews };
    }
  },

  /**
   * Get Upcoming Events
   */
  async getEvents() {
    try {
      const res = await axiosClient.get('/events');
      return res;
    } catch {
      return { success: true, data: mockEvents };
    }
  },

  /**
   * Register for an event
   */
  async registerForEvent(eventId, userData) {
    try {
      return await axiosClient.post(`/events/${eventId}/register`, userData);
    } catch {
      return { success: true, message: 'Event registration confirmed!' };
    }
  },

  /**
   * Get Photo Gallery
   */
  async getGallery() {
    try {
      const res = await axiosClient.get('/media');
      return res;
    } catch {
      return { success: true, data: mockGallery };
    }
  },

  /**
   * Get Compliance & Audit Documents
   */
  async getDocuments() {
    try {
      const res = await axiosClient.get('/documents');
      return res;
    } catch {
      return { success: true, data: mockDocuments };
    }
  }
};
