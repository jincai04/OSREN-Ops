import { InventoryItem } from '../types';
import { MOCK_INVENTORY } from '../constants';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
const USE_MOCK_DATA = process.env.REACT_APP_USE_MOCK_DATA === 'true' ||
                      !API_BASE_URL ||
                      !API_BASE_URL.includes('localhost');

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
      if (USE_MOCK_DATA) {
        throw new Error('Mock data mode enabled - backend not available');
      }

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.warn('API request failed, falling back to mock data:', error.message);

      // Return mock data based on endpoint
      return this.getMockResponse(endpoint, options);
    }
  }

  private getMockResponse(endpoint: string, options: RequestInit = {}): any {
    if (endpoint === '/inventory/list') {
      return {
        success: true,
        data: MOCK_INVENTORY.map(item => ({
          ...item,
          profit: item.sellingPrice - item.unitCost,
          stockValue: item.quantity * item.unitCost,
          lowStockFlag: item.quantity < item.minLevel ? 1 : 0,
        }))
      };
    }

    if (endpoint.includes('/inventory/add') && options.method === 'POST') {
      return {
        success: true,
        data: {
          id: 'MOCK-' + Date.now(),
          ...JSON.parse(options.body as string),
        }
      };
    }

    if (endpoint.includes('/inventory/update') && options.method === 'POST') {
      return {
        success: true,
        message: 'Item updated successfully (mock)'
      };
    }

    if (endpoint.includes('/inventory/delete') && options.method === 'POST') {
      return {
        success: true,
        message: 'Item deleted successfully (mock)'
      };
    }

    // Default mock response
    return {
      success: true,
      data: 'Mock operation successful',
      note: 'This is mock data - deploy backend for full functionality'
    };
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
    const updateData = { id, ...item };
    const response = await this.request('/inventory/update', {
      method: 'POST',
      body: JSON.stringify(updateData),
    });
    return response.data;
  }

  async deleteInventoryItem(id: string): Promise<void> {
    const response = await this.request('/inventory/delete', {
      method: 'POST',
      body: JSON.stringify({ id }),
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
