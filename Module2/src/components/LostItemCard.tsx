import { Calendar, MapPin, Tag } from 'lucide-react';
import type { LostItem } from '../types/lostItem';

interface LostItemCardProps {
  item: LostItem;
  onClick: () => void;
}

export default function LostItemCard({ item, onClick }: LostItemCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'found':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
    >
      {item.image_url && (
        <div className="h-48 overflow-hidden bg-gray-200">
          <img
            src={item.image_url}
            alt={item.item_name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {item.item_name}
          </h3>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              item.status
            )}`}
          >
            {item.status}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {item.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="line-clamp-1">{item.last_seen_location}</span>
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <Tag className="w-4 h-4 mr-2" />
            <span>{item.category}</span>
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{formatDate(item.created_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
