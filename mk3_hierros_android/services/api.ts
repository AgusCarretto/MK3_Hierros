const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${API_URL}/categorias`);
    return response.json();
  }
};

export const workService = {
  async getWorks(): Promise<Work[]> {
    const response = await fetch(`${API_URL}/trabajo`);
    return response.json();
  }
};