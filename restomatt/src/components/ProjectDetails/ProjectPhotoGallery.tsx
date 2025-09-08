import React, { useState, useRef } from 'react';
import { Plus, Camera, Image, X, Edit3, Trash2, Eye, Download } from 'lucide-react';
import { ProjectPhoto } from '../../types';

interface ProjectPhotoGalleryProps {
  photos: ProjectPhoto[];
  onAddPhoto: (photo: Omit<ProjectPhoto, 'id' | 'uploadedAt'>) => void;
  onUpdatePhoto: (photoId: string, updates: Partial<ProjectPhoto>) => void;
  onDeletePhoto: (photoId: string) => void;
}

const ProjectPhotoGallery: React.FC<ProjectPhotoGalleryProps> = ({
  photos,
  onAddPhoto,
  onUpdatePhoto,
  onDeletePhoto,
}) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<ProjectPhoto | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<ProjectPhoto | null>(null);
  const [newPhotoType, setNewPhotoType] = useState<ProjectPhoto['type']>('progress');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const photoCategories = {
    'before': { label: 'Before Photos', color: 'bg-red-100 text-red-800' },
    'progress': { label: 'Progress Photos', color: 'bg-blue-100 text-blue-800' },
    'after': { label: 'After Photos', color: 'bg-green-100 text-green-800' },
    'material': { label: 'Material Samples', color: 'bg-purple-100 text-purple-800' }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = () => {
    if (selectedFile && previewUrl) {
      const photo: Omit<ProjectPhoto, 'id' | 'uploadedAt'> = {
        url: previewUrl, // In a real app, you'd upload to a server and get the URL
        fileName: selectedFile.name,
        caption: newPhotoCaption.trim() || undefined,
        type: newPhotoType,
      };
      onAddPhoto(photo);
      resetUploadForm();
      setIsUploadModalOpen(false);
    }
  };

  const resetUploadForm = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setNewPhotoCaption('');
    setNewPhotoType('progress');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEditPhoto = (photo: ProjectPhoto) => {
    setEditingPhoto(photo);
    setNewPhotoCaption(photo.caption || '');
    setNewPhotoType(photo.type);
  };

  const handleUpdatePhoto = () => {
    if (editingPhoto) {
      const updates: Partial<ProjectPhoto> = {
        caption: newPhotoCaption.trim() || undefined,
        type: newPhotoType,
      };
      onUpdatePhoto(editingPhoto.id, updates);
      setEditingPhoto(null);
      setNewPhotoCaption('');
    }
  };

  const handleDeletePhoto = (photoId: string) => {
    if (window.confirm('Are you sure you want to delete this photo?')) {
      onDeletePhoto(photoId);
    }
  };

  const openFileInput = () => {
    fileInputRef.current?.click();
  };

  const photosByCategory = photos.reduce((acc, photo) => {
    if (!acc[photo.type]) acc[photo.type] = [];
    acc[photo.type].push(photo);
    return acc;
  }, {} as Record<string, ProjectPhoto[]>);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Camera className="h-5 w-5 mr-2 text-amber-600" />
          Project Photos
        </h2>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Photo</span>
        </button>
      </div>

      <div className="p-6">
        {photos.length === 0 ? (
          <div className="text-center py-8">
            <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No photos yet</h3>
            <p className="text-gray-600 mb-4">Add photos to document your project progress</p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add First Photo</span>
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {(Object.keys(photoCategories) as Array<keyof typeof photoCategories>).map((category) => {
              const categoryPhotos = photosByCategory[category] || [];
              if (categoryPhotos.length === 0) return null;

              return (
                <div key={category}>
                  <div className="flex items-center mb-4">
                    <h3 className="text-md font-medium text-gray-900 mr-3">
                      {photoCategories[category].label}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${photoCategories[category].color}`}>
                      {categoryPhotos.length}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryPhotos.map((photo) => (
                      <div key={photo.id} className="relative group bg-gray-100 rounded-lg overflow-hidden">
                        <div className="aspect-w-4 aspect-h-3">
                          <img
                            src={photo.url}
                            alt={photo.caption || photo.fileName}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Hover overlay with actions */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                            <button
                              onClick={() => setSelectedPhoto(photo)}
                              className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-colors"
                              title="View full size"
                            >
                              <Eye className="h-4 w-4 text-gray-900" />
                            </button>
                            <button
                              onClick={() => handleEditPhoto(photo)}
                              className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-colors"
                              title="Edit photo"
                            >
                              <Edit3 className="h-4 w-4 text-gray-900" />
                            </button>
                            <button
                              onClick={() => handleDeletePhoto(photo.id)}
                              className="p-2 bg-red-500 bg-opacity-90 rounded-full hover:bg-opacity-100 transition-colors"
                              title="Delete photo"
                            >
                              <Trash2 className="h-4 w-4 text-white" />
                            </button>
                          </div>
                        </div>

                        {/* Photo info overlay */}
                        {photo.caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2">
                            <p className="text-sm truncate">{photo.caption}</p>
                            <p className="text-xs text-gray-300">
                              {new Date(photo.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Photo</h3>
            <div className="space-y-4">
              {/* File Upload Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Photo</label>
                <div
                  onClick={openFileInput}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-amber-500 transition-colors"
                >
                  {previewUrl ? (
                    <div className="space-y-2">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded mx-auto"
                      />
                      <p className="text-sm text-gray-600">Click to change photo</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Image className="h-8 w-8 text-gray-400 mx-auto" />
                      <p className="text-sm text-gray-600">Click to select a photo</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Photo Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Photo Type</label>
                <select
                  value={newPhotoType}
                  onChange={(e) => setNewPhotoType(e.target.value as ProjectPhoto['type'])}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="before">Before Photo</option>
                  <option value="progress">Progress Photo</option>
                  <option value="after">After Photo</option>
                  <option value="material">Material Sample</option>
                </select>
              </div>

              {/* Caption */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Caption (Optional)</label>
                <textarea
                  value={newPhotoCaption}
                  onChange={(e) => setNewPhotoCaption(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Add a caption for this photo"
                  rows={2}
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleUpload}
                disabled={!selectedFile}
                className="flex-1 bg-amber-600 text-white py-2 px-4 rounded hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Upload Photo
              </button>
              <button
                onClick={() => {
                  setIsUploadModalOpen(false);
                  resetUploadForm();
                }}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Photo</h3>
            <div className="space-y-4">
              {/* Photo Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Photo Type</label>
                <select
                  value={newPhotoType}
                  onChange={(e) => setNewPhotoType(e.target.value as ProjectPhoto['type'])}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="before">Before Photo</option>
                  <option value="progress">Progress Photo</option>
                  <option value="after">After Photo</option>
                  <option value="material">Material Sample</option>
                </select>
              </div>

              {/* Caption */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Caption (Optional)</label>
                <textarea
                  value={newPhotoCaption}
                  onChange={(e) => setNewPhotoCaption(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Add a caption for this photo"
                  rows={2}
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleUpdatePhoto}
                className="flex-1 bg-amber-600 text-white py-2 px-4 rounded hover:bg-amber-700 transition-colors"
              >
                Update Photo
              </button>
              <button
                onClick={() => setEditingPhoto(null)}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Size View Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.caption || selectedPhoto.fileName}
              className="max-w-full max-h-full object-contain"
            />
            {selectedPhoto.caption && (
              <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-70 text-white p-4 rounded">
                <p className="text-lg">{selectedPhoto.caption}</p>
                <p className="text-sm text-gray-300 mt-1">
                  Uploaded: {new Date(selectedPhoto.uploadedAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectPhotoGallery;
