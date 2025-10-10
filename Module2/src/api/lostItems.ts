import { supabase } from '../lib/supabase';
import type {
  LostItem,
  CreateLostItemPayload,
  UpdateLostItemPayload,
  LostItemsResponse,
  LostItemFilters
} from '../types/lostItem';

const API_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/lost-items`;

const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession();

  return {
    'Content-Type': 'application/json',
    'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
    ...(session?.access_token && { 'Authorization': `Bearer ${session.access_token}` }),
  };
};

export const lostItemsApi = {
  async getAll(filters: LostItemFilters = {}): Promise<LostItemsResponse> {
    const params = new URLSearchParams();
    if (filters.keyword) params.append('keyword', filters.keyword);
    if (filters.category) params.append('category', filters.category);
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}?${params}`, { headers });

    if (!response.ok) {
      throw new Error('Failed to fetch lost items');
    }

    return response.json();
  },

  async getById(id: string): Promise<{ data: LostItem }> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/${id}`, { headers });

    if (!response.ok) {
      throw new Error('Failed to fetch lost item');
    }

    return response.json();
  },

  async getMyItems(): Promise<{ data: LostItem[] }> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/my`, { headers });

    if (!response.ok) {
      throw new Error('Failed to fetch your lost items');
    }

    return response.json();
  },

  async create(payload: CreateLostItemPayload): Promise<{ data: LostItem }> {
    const headers = await getAuthHeaders();
    const response = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create lost item');
    }

    return response.json();
  },

  async update(id: string, payload: UpdateLostItemPayload): Promise<{ data: LostItem }> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update lost item');
    }

    return response.json();
  },

  async delete(id: string): Promise<void> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to delete lost item');
    }
  },

  async uploadImage(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('lost-items')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw new Error('Failed to upload image');
    }

    const { data } = supabase.storage
      .from('lost-items')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },
};
