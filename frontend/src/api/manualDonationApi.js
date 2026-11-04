import axiosClient from './axiosClient';

export const manualDonationApi = {
  async submit(payload) {
    return axiosClient.post('/donations/manual', payload);
  }
};