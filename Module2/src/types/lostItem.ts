export type LostItemCategory = 'ID Card' | 'Book' | 'Gadget' | 'Accessory' | 'Misc';
export type LostItemStatus = 'open' | 'found' | 'closed';

export interface LostItem {
  id: string;
  user_id: string | null;
  item_name: string;
  description: string;
  last_seen_location: string;
  category: LostItemCategory;
  image_url: string | null;
  status: LostItemStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateLostItemPayload {
  itemName: string;
  description: string;
  lastSeenLocation: string;
  category: LostItemCategory;
  imageUrl?: string;
  status?: LostItemStatus;
}

export interface UpdateLostItemPayload extends CreateLostItemPayload {}

export interface LostItemsResponse {
  data: LostItem[];
  count: number;
  page: number;
  totalPages: number;
}

export interface LostItemFilters {
  keyword?: string;
  category?: LostItemCategory;
  status?: LostItemStatus;
  page?: number;
  limit?: number;
}
