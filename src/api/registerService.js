import axios from 'axios';

const VITE_API_URL = import.meta.env.VITE_API_URL; 

export const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${VITE_API_URL}/auth/register`, {
      username,
      email,
      password
    });

    if (response.status === 200) {
      return {
        success: true,
        message: 'Cadastro realizado com sucesso!',
      };
    } else {
      return {
        success: false,
        message: response.data.detail || 'Erro no cadastro.',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response ? error.response.data.message : 'Erro desconhecido ao tentar registrar.',
    };
  }
};
