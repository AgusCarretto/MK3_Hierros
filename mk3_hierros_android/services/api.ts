const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${API_URL}/categories`);
    return response.json();
  }
};