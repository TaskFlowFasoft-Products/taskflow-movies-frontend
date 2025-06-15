import axios from 'axios';
import { VITE_API_URL } from '../core/config/config';

export const moviesTemplateService = {
  async getTemplates() {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${VITE_API_URL}/movies/boards/templates`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.templates;
    } catch (error) {
      console.error('Erro ao buscar templates de filmes:', error);
      throw error;
    }
  }
}; 