import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, AlertCircle, ArrowLeft } from 'lucide-react';
import { lostItemsApi } from '../api/lostItems';
import type { LostItemCategory, LostItemStatus, LostItem } from '../types/lostItem';

const categories: LostItemCategory[] = ['ID Card', 'Book', 'Gadget', 'Accessory', 'Misc'];
const statuses: LostItemStatus[] = ['open', 'found', 'closed'];

export default function EditLostItem() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [removeExistingImage, setRemoveExistingImage] = useState(false);

  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    lastSeenLocation: '',
    category: '' as LostItemCategory,
    status: 'open' as LostItemStatus,
    existingImageUrl: '',
  });

  useEffect(() => {
    if (id) {
      fetchItem();
    }
  }, [id]);

  const fetchItem = async () => {
    if (!id) return;

    setLoading(true);
    setError('');
    try {
      const response = await lostItemsApi.getById(id);
      const item: LostItem = response.data;

      setFormData({
        itemName: item.item_name,
        description: item.description,
        lastSeenLocation: item.last_seen_location,
        category: item.category,
        status: item.status,
        existingImageUrl: item.image_url || '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load item');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
      setError('Only JPG, PNG, and WebP images are allowed');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setRemoveExistingImage(true);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      if (!formData.itemName || !formData.description || !formData.lastSeenLocation || !formData.category) {
        setError('All fields are required');
        setSubmitting(false);
        return;
      }

      let imageUrl = formData.existingImageUrl;

      if (imageFile) {
        imageUrl = await lostItemsApi.uploadImage(imageFile);
      } else if (removeExistingImage) {
        imageUrl = '';
      }

      await lostItemsApi.update(id, {
        itemName: formData.itemName,
        description: formData.description,
        lastSeenLocation: formData.lastSeenLocation,
        category: formData.category,
        status: formData.status,
        imageUrl: imageUrl || undefined,
      });

      setSuccess('Lost item updated successfully!');
      setTimeout(() => {
        navigate(`/lost-items/${id}`);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update lost item');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-blue-600 hover:text-blue-700 flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Lost Item</h1>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-2">
                Item Name *
              </label>
              <input
                type="text"
                id="itemName"
                value={formData.itemName}
                onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Black Wallet"
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as LostItemCategory })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as LostItemStatus })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Detailed description of the item..."
                required
              />
            </div>

            <div>
              <label htmlFor="lastSeenLocation" className="block text-sm font-medium text-gray-700 mb-2">
                Last Seen Location *
              </label>
              <input
                type="text"
                id="lastSeenLocation"
                value={formData.lastSeenLocation}
                onChange={(e) => setFormData({ ...formData, lastSeenLocation: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Library 3rd Floor"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Image
              </label>

              {(formData.existingImageUrl && !removeExistingImage && !imageFile) && (
                <div className="mb-4">
                  <img
                    src={formData.existingImageUrl}
                    alt="Current"
                    className="h-48 w-auto rounded-lg mx-auto"
                  />
                  <button
                    type="button"
                    onClick={() => setRemoveExistingImage(true)}
                    className="mt-2 text-sm text-red-600 hover:text-red-500 block mx-auto"
                  >
                    Remove current image
                  </button>
                </div>
              )}

              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 transition-colors">
                <div className="space-y-1 text-center">
                  {imagePreview ? (
                    <div className="mb-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mx-auto h-48 w-auto rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview('');
                          setRemoveExistingImage(!!formData.existingImageUrl);
                        }}
                        className="mt-2 text-sm text-red-600 hover:text-red-500"
                      >
                        Remove new image
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                        >
                          <span>Upload a new file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept="image/jpeg,image/png,image/jpg,image/webp"
                            onChange={handleImageChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, WebP up to 5MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'Updating...' : 'Update Lost Item'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
