import axios from "axios";
import { VITE_API_URL } from "../config/config";
import { getTasks } from "./taskService";

export async function createColumn(boardId, title) {
    const token = localStorage.getItem("access_token");
  
    try {
      const response = await axios.post(
        `${VITE_API_URL}/column`,
        {
          board_id: boardId,
          title
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
  
      if (response.status === 200 && response.data?.id) {
        return {
          success: true,
          column: {
            id: String(response.data.id),
            title: response.data.title,
            cards: []
          }
        };
      } else {
        return {
          success: false,
          message: response.data?.message || "Erro ao criar coluna"
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.detail || "Erro inesperado"
      };
    }
  }  

  export async function updateColumn(boardId, columnId, title) {
    const token = localStorage.getItem("access_token");
  
    try {
      const cleanedBoardId = boardId.toString().replace('col-', '');
      const cleanedColumnId = columnId.toString().replace('col-', '');

      const response = await axios.put(
        `${VITE_API_URL}/column/${cleanedBoardId}`,
        {
          column_id: cleanedColumnId,
          title
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
  
      if (response.status === 200 && response.data.success) {
        return { success: true };
      } else {
        return {
          success: false,
          message: response.data.message || "Falha ao renomear coluna."
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.detail || "Erro inesperado"
      };
    }
  }  

  export async function deleteColumn(boardId, columnId) {
    const token = localStorage.getItem("access_token");
  
    try {
      const cleanedColumnId = columnId.replace('col-', '');
      const response = await axios.delete(`${VITE_API_URL}/column`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: {
          id: cleanedColumnId,
          board_id: boardId
        }
      });
  
      if (response.status === 200 && response.data.success) {
        return { success: true };
      } else {
        return {
          success: false,
          message: response.data.message || "Erro ao deletar coluna."
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.detail || "Erro inesperado"
      };
    }
  }

  const getToken = () => localStorage.getItem("access_token");

  export async function getBoardColumns(boardId) {
    try {
      const columnsData = await axios.get(`${VITE_API_URL}/column/${boardId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const columns = columnsData.data.columns || [];

      const columnsWithTasks = await Promise.all(
        columns.map(async (column) => {
          try {
            const tasks = await getTasks(boardId, column.id);
            return {
              ...column,
              cards: tasks || []
            };
          } catch (taskError) {
            return { ...column, cards: [] };
          }
        })
      );

      columnsWithTasks.sort((a, b) => {
        return new Date(a.created_at) - new Date(b.created_at);
      });

      return columnsWithTasks;

    } catch (error) {
      throw error;
    }
  }