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
  },

  async getWorkById(id:string): Promise<Work> {
      const response = await fetch(`${API_URL}/trabajo/${id}`);
      return response.json();
  },

  async updateWorkById(id:string, workData: Work): Promise<Work> {
      const response = await fetch(`${API_URL}/trabajo/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              // 'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(workData),
          });
      const updatedWork: Work = await response.json();
      return updatedWork;
  },

  async createWork(workData: Work): Promise<Work> {
    const response = await fetch(`${API_URL}/trabajo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(workData),
      });
    const newWork: Work = await response.json();
    return newWork;
  }
};
