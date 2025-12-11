import { InventoryItem } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

class ApiService {
  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Inventory API
  async getInventory(): Promise<InventoryItem[]> {
    const response = await this.request('/inventory/list');
    return response.data;
  }

  async addInventoryItem(item: Omit<InventoryItem, 'id' | 'lastMovement'>): Promise<InventoryItem> {
    const response = await this.request('/inventory/add', {
      method: 'POST',
      body: JSON.stringify(item),
    });
    return response.data;
  }

  async updateInventoryItem(id: string, item: Partial<InventoryItem>): Promise<InventoryItem> {
    const response = await this.request(`/inventory/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    });
    return response.data;
  }

  async deleteInventoryItem(id: string): Promise<void> {
    await this.request(`/inventory/delete/${id}`, {
      method: 'DELETE',
    });
  }

  async searchInventory(query: string): Promise<InventoryItem[]> {
    const response = await this.request(`/inventory/search?query=${encodeURIComponent(query)}`);
    return response.data;
  }

  async syncInventory(inventory: InventoryItem[]): Promise<void> {
    await this.request('/inventory/sync', {
      method: 'POST',
      body: JSON.stringify(inventory),
    });
  }

  // Calendar API
  async createCalendarEvent(event: {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    timeZone?: string;
  }): Promise<{ id: string; link: string }> {
    const response = await this.request('/calendar/create-event', {
      method: 'POST',
      body: JSON.stringify(event),
    });
    return response.data;
  }

  async getCalendarEvents(timeMin?: string, timeMax?: string): Promise<any[]> {
    const params = new URLSearchParams();
    if (timeMin) params.append('timeMin', timeMin);
    if (timeMax) params.append('timeMax', timeMax);

    const response = await this.request(`/calendar/events?${params.toString()}`);
    return response.data;
  }

  // Drive API
  async syncDrive(): Promise<void> {
    await this.request('/drive/sync', {
      method: 'POST',
    });
  }
}

const apiService = new ApiService();
export default apiService;
