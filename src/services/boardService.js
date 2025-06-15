import axios from 'axios';
import { VITE_API_URL } from '../core/config/config';

export async function getBoards() {
  try {
    const token = localStorage.getItem('access_token');
    const response = await axios.get(`${VITE_API_URL}/movies/boards`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return Array.isArray(response.data?.boards) ? response.data.boards : [];
  } catch (error) {
    console.error('Erro ao buscar quadros de filmes:', error);
    return [];
  }
}

export async function getBoardTemplates() {
  try {
    const token = localStorage.getItem('access_token');
    const response = await axios.get(`${VITE_API_URL}/movies/boards/templates`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.templates;
  } catch (error) {
    console.error('Erro ao buscar modelos de quadros de filmes:', error);
    throw error;
  }
}

export async function createBoard(id) {
  try {
    const token = localStorage.getItem('access_token');
    const response = await axios.post(`${VITE_API_URL}/movies/boards`, 
      { id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { success: true, board: response.data };
  } catch (error) {
    console.error('Erro ao criar quadro de filmes:', error);
    return { success: false, message: error.response?.data?.message || 'Erro ao criar quadro.' };
  }
}

export async function deleteBoard(board_id) {
  try {
    const token = localStorage.getItem('access_token');
    const response = await axios.delete(`${VITE_API_URL}/movies/boards/${board_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { success: true, board_id: response.data.board_id, message: response.data.message };
  } catch (error) {
    console.error('Erro ao deletar quadro de filmes:', error);
    return { success: false, message: error.response?.data?.message || 'Erro ao deletar quadro.' };
  }
}

export async function updateBoard(board_id, newName) {
  // A documentação do backend não especifica a rota de atualização de quadro.
  // Assumindo que esta funcionalidade será para renomear o quadro, 
  // mas o backend não possui um endpoint PUT/PATCH para /movies/boards/{board_id} com um campo 'name'.
  // Se a atualização de nome de quadro não for suportada, ou for via outro endpoint, precisaremos ajustar aqui.
  console.warn('Função updateBoard para movies/boards chamada, mas a rota PUT/PATCH para renomear não está explícita na documentação do backend para /movies/boards/{board_id}.');
  return { success: false, message: 'Função de atualização de quadro não implementada no backend ou rota incorreta.' };
} 