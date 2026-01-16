const API_URL = 'https://mk3hierros-production.up.railway.app';

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
  },

  async uploadWorkImages(workId: string, imageUris: string[]): Promise<void> {
    const formData = new FormData();

    imageUris.forEach((uri, index) => {
      formData.append('images', {
        uri: uri,
        type: 'image/jpeg',
        name: `image_${index}.jpg`,
      } as any);
    });

    const response = await fetch(`${API_URL}/trabajo/${workId}/images`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.ok) {
      throw new Error('Error uploading images');
    }
  },

  async getWorkImages(workId: string): Promise<WorkImage[]> {
    const response = await fetch(`${API_URL}/trabajo/${workId}/images`);

    if (!response.ok) {
      throw new Error('Error fetching work images');
    }

    return response.json();
  },

  getWorkImageUrl(workId: string,imageId: string): string {
    return `${API_URL}/trabajo/${workId}/images/${imageId}`;
  },

  async deleteWorkImage(imageId: string): Promise<void> {
    const response = await fetch(`${API_URL}/trabajo/images/${imageId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Error deleting image');
    }
  },

};

