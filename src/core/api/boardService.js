import axios from "axios";
import { VITE_API_URL } from "../config/config";

export async function getBoards() {
  const token = localStorage.getItem("access_token");

  try {
    const boardResponse = await axios.get(`${VITE_API_URL}/boards`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const boards = boardResponse.data.boards;

    const boardsWithColumns = await Promise.all(
      boards.map(async (board) => {
        try {
          const colRes = await axios.get(`${VITE_API_URL}/column/${board.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          const rawColumns = colRes.data.columns || [];

          const columns = rawColumns.map((col) => ({
            id: String(col.id),
            name: col.title, 
            cards: [] 
          }));

          return {
            ...board,
            id: String(board.id),
            name: board.title,
            columns
          };
        } catch (err) {
          return {
            ...board,
            id: String(board.id),
            name: board.title,
            columns: []
          };
        }
      })
    );

    return boardsWithColumns;
  } catch (error) {
    return [];
  }
}


export async function createBoard(title) {
  const token = localStorage.getItem("access_token");

  try {
    const response = await axios.post(
      `${VITE_API_URL}/boards`,
      { title },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.status === 200) {
      return {
        success: true,
        board: {
          id: String(response.data.board_id),
          name: title,
          columns: [],
          created_at: response.data.created_at
        }
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.detail || "Erro ao criar quadro"
    };
  }
}

export async function deleteBoard(boardId) {
  const token = localStorage.getItem("access_token");

  try {
    const response = await axios.delete(`${VITE_API_URL}/boards/${boardId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.status === 200 && response.data.success) {
      return { success: true };
    } else {
      return { success: false, message: response.data.message || "Falha ao excluir." };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.detail || "Erro inesperado."
    };
  }
}

export async function updateBoard(boardId, newTitle) {
  const token = localStorage.getItem("access_token");
  try {
    const response = await axios.put(
      `${VITE_API_URL}/boards/${boardId}`,
      { title: newTitle },
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
        message: response.data.message || "Falha ao atualizar título."
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.detail || "Erro inesperado ao atualizar quadro."
    };
  }
}
