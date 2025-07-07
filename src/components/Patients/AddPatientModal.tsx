import React, { useState, useRef, useCallback, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

type AddPatientModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (patient: PatientFormData) => void;
  initialData?: any;
  mode?: 'add' | 'edit';
};

export type PatientFormData = {
  name: string;
  gender: 'male' | 'female';
  dateOfBirth: string;
  phone: string;
  email: string;
  address: string;
  medicalHistory: string;
  allergies: string;
  avatar?: File;
  avatarPreview?: string;
};

const AddPatientModal: React.FC<AddPatientModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  initialData,
  mode = 'add'
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showSuccessPrompt, setShowSuccessPrompt] = useState(false);
  const [newPatientId, setNewPatientId] = useState<string>('');
  const [formData, setFormData] = useState<PatientFormData>({
    name: '',
    gender: 'male',
    dateOfBirth: '',
    phone: '',
    email: '',
    address: '',
    medicalHistory: '',
    allergies: '',
  });

  // Load initial data when editing
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        name: initialData.name || '',
        gender: initialData.gender?.toLowerCase() || 'male',
        dateOfBirth: initialData.dateOfBirth || new Date(new Date().setFullYear(new Date().getFullYear() - initialData.age)).toISOString().split('T')[0],
        phone: initialData.phone || '',
        email: initialData.email || '',
        address: initialData.address || '',
        medicalHistory: initialData.medicalHistory || '',
        allergies: initialData.allergies || '',
        avatarPreview: initialData.avatar
      });
    }
  }, [mode, initialData]);

  const validateImage = (file: File): boolean => {
    if (file.size > 5 * 1024 * 1024) {
      alert(t('common.upload.sizeLimit'));
      return false;
    }

    if (!file.type.startsWith('image/')) {
      alert(t('common.upload.typeError'));
      return false;
    }

    return true;
  };

  const handleImageFile = (file: File) => {
    if (!validateImage(file)) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        avatar: file,
        avatarPreview: reader.result as string
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageFile(file);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageFile(file);
    }
  }, []);

  const removeAvatar = () => {
    setFormData(prev => ({
      ...prev,
      avatar: undefined,
      avatarPreview: undefined
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'edit') {
      onSubmit(formData);
      onClose();
    } else {
      // 模拟API调用，获取新患者ID
      const patientId = `P-${Math.floor(Math.random() * 100000)}`;
      setNewPatientId(patientId);
      onSubmit(formData);
      setShowSuccessPrompt(true);
    }
  };

  const handleStartConsultation = () => {
    navigate(`/consultation?patientId=${newPatientId}`);
    onClose();
  };

  if (!isOpen) return null;

  if (showSuccessPrompt) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            患者信息添加成功
          </h3>
          <p className="text-gray-600 mb-6">
            是否立即开始接诊？
          </p>
          <div className="flex justify-center space-x-3">
            <button
              onClick={() => {
                setShowSuccessPrompt(false);
                onClose();
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              稍后接诊
            </button>
            <button
              onClick={handleStartConsultation}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
            >
              立即接诊
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {mode === 'add' ? t('patients.addNew.title') : t('patients.edit')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Avatar Upload */}
          <div className="mb-6 flex justify-center">
            <div 
              ref={dropZoneRef}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={handleAvatarClick}
              className={`relative cursor-pointer group ${isDragging ? 'scale-105' : ''} transition-transform duration-200`}
            >
              {formData.avatarPreview ? (
                <div className="relative">
                  <img 
                    src={formData.avatarPreview} 
                    alt="Avatar preview" 
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 group-hover:border-primary-100"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeAvatar();
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className={`w-32 h-32 rounded-full bg-gray-100 flex flex-col items-center justify-center border-4 ${isDragging ? 'border-primary-300 bg-primary-50' : 'border-gray-200'} group-hover:border-primary-100`}>
                  <ImageIcon size={40} className="text-gray-400 mb-2" />
                  <span className="text-xs text-gray-500 text-center px-2">
                    {isDragging ? t('patients.addNew.dropImage') : t('patients.addNew.uploadImage')}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload size={24} className="text-white" />
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('patients.addNew.name')}*
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('patients.addNew.gender')}*
              </label>
              <select
                required
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="male">{t('patients.gender.male')}</option>
                <option value="female">{t('patients.gender.female')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('patients.addNew.dateOfBirth')}*
              </label>
              <input
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('patients.addNew.phone')}*
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('patients.addNew.email')}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('patients.addNew.address')}
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('patients.addNew.medicalHistory')}
              </label>
              <textarea
                rows={3}
                value={formData.medicalHistory}
                onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('patients.addNew.allergies')}
              </label>
              <textarea
                rows={2}
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
            >
              {t('common.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPatientModal;
