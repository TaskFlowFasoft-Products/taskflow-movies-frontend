import axios from "axios";
import { VITE_API_URL } from "../config/config";

const getToken = () => localStorage.getItem("access_token");

export async function createTask({ board_id, column_id, title, description, due_date }) {
  try {
    const response = await axios.post(
      `${VITE_API_URL}/tasks`,
      { board_id, column_id, title, description, due_date },
      { headers: { Authorization: `Bearer ${getToken()}` } }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getTasks(boardId, columnId) {
  if (!boardId || !columnId) {
    return [];
  }

  try {
    const response = await axios.get(
      `${VITE_API_URL}/tasks?board_id=${boardId}&column_id=${columnId}`,
      { headers: { Authorization: `Bearer ${getToken()}` } }
    );
    return response.data.tasks || [];
  } catch (error) {
    if (error.response?.status === 400) {
      return [];
    }
    return [];
  }
}

export async function updateTask({ board_id, column_id, old_column_id, task_id, title, description, due_date }) {
  try {
    const cleanedBoardId = board_id.toString().replace('col-', '');
    const cleanedColumnId = column_id.toString().replace('col-', '');
    const cleanedOldColumnId = old_column_id.toString().replace('col-', '');
    const cleanedTaskId = task_id.toString().replace('card-', '');

    const response = await axios.put(
      `${VITE_API_URL}/tasks`,
      { board_id: cleanedBoardId, column_id: cleanedColumnId, old_column_id: cleanedOldColumnId, task_id: cleanedTaskId, title, description, due_date },
      { headers: { Authorization: `Bearer ${getToken()}` } }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteTask({ board_id, column_id, task_id }) {
  try {
    const cleanedBoardId = board_id.toString().replace('col-', '');
    const cleanedColumnId = column_id.toString().replace('col-', '');
    const cleanedTaskId = task_id.toString().replace('card-', '');

    const response = await axios.delete(`${VITE_API_URL}/tasks`, {
      headers: { Authorization: `Bearer ${getToken()}` },
      data: { board_id: cleanedBoardId, column_id: cleanedColumnId, task_id: cleanedTaskId },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
