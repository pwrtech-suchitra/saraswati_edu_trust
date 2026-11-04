import axiosClient from './axiosClient';

export const contactApi = {
  /**
   * Submit general public contact inquiry
   * @param {{ name: string, email: string, phone: string, subject: string, message: string }} inquiryData 
   */
  async submitInquiry(inquiryData) {
    return await axiosClient.post('/contact', inquiryData);
  }
};
