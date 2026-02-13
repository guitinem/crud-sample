import axios from "axios";
import Cookies from "js-cookie";

class UserService {
  constructor() {
    this.baseURL = "http://localhost:3000";
  }

  // Configura o header de autenticação
  getAuthHeader() {
    const token = Cookies.get("auth_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async list() {
    try {
      const response = await axios.get(`${this.baseURL}/users`, {
        headers: this.getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
      throw error;
    }
  }

  async get(id) {
    try {
      const response = await axios.get(`${this.baseURL}/users/${id}`, {
        headers: this.getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      throw error;
    }
  }

  async create(data) {
    try {
      const response = await axios.post(`${this.baseURL}/users`, data, {
        headers: this.getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      const response = await axios.put(`${this.baseURL}/users/${id}`, data, {
        headers: this.getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const response = await axios.delete(`${this.baseURL}/users/${id}`, {
        headers: this.getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      throw error;
    }
  }
}

export default new UserService();
