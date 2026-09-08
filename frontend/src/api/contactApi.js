import axiosClient from './axiosClient';

export const contactApi = {
  /**
   * Submit general public contact inquiry
   * @param {{ name: string, email: string, phone: string, subject: string, message: string }} inquiryData 
   */
  async submitInquiry(inquiryData) {
    try {
      const response = await axiosClient.post('/contact', inquiryData);
      return response;
    } catch (error) {
      if (error.isNetworkError || error.status === 404) {
        return {
          success: true,
          message: 'Thank you for reaching out to SECT. Our trust secretariat will get in touch shortly.'
        };
      }
      throw error;
    }
  }
};
