import axios from 'axios';
import { VITE_API_URL } from '../core/config/config';

export async function getTasks(board_id, column_id) {
  try {
    const token = localStorage.getItem('access_token');
    const response = await axios.get(`${VITE_API_URL}/movies/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        board_id,
        column_id,
      },
    });
    return response.data.tasks;
  } catch (error) {
    console.error('Erro ao buscar tarefas de filmes:', error);
    throw error;
  }
}

export async function createTask(taskData) {
  try {
    const token = localStorage.getItem('access_token');
    const response = await axios.post(`${VITE_API_URL}/movies/tasks`, taskData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar tarefa de filme:', error);
    throw error;
  }
}

export async function updateTask(taskData) {
  try {
    const token = localStorage.getItem('access_token');
    const response = await axios.put(`${VITE_API_URL}/movies/tasks`, taskData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar tarefa de filme:', error);
    throw error;
  }
}

export async function deleteTask(taskData) {
  try {
    const token = localStorage.getItem('access_token');
    const response = await axios.delete(`${VITE_API_URL}/movies/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: taskData, // Para requisições DELETE com body
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao deletar tarefa de filme:', error);
    throw error;
  }
} 