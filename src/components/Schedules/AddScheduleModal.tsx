import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

type AddScheduleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (scheduleData: ScheduleFormData) => void;
  initialData?: ScheduleFormData;
  mode?: 'add' | 'edit';
};

export type ScheduleFormData = {
  doctorId: string;
  department: string;
  date: string;
  startTime: string;
  endTime: string;
  breakTime?: string;
  maxPatients: number;
  status: 'available' | 'booked' | 'onLeave' | 'holiday';
  repeat: 'none' | 'daily' | 'weekly' | 'monthly';
};

const AddScheduleModal: React.FC<AddScheduleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode = 'add'
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<ScheduleFormData>(initialData || {
    doctorId: '',
    department: '',
    date: '',
    startTime: '',
    endTime: '',
    breakTime: '',
    maxPatients: 20,
    status: 'available',
    repeat: 'none'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {mode === 'add' ? t('schedules.new') : t('schedules.edit')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('schedules.form.doctor')}*
              </label>
              <select
                required
                value={formData.doctorId}
                onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">{t('schedules.form.selectDoctor')}</option>
                <option value="D-001">Dr. Sarah Wilson (Cardiology)</option>
                <option value="D-002">Dr. James Anderson (Neurology)</option>
                <option value="D-003">Dr. Emma Davis (Orthopedics)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('schedules.form.department')}*
              </label>
              <select
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">{t('schedules.form.selectDepartment')}</option>
                <option value="Cardiology">Cardiology Department</option>
                <option value="Neurology">Neurology Department</option>
                <option value="Orthopedics">Orthopedics Department</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('schedules.form.date')}*
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('schedules.form.repeat')}
              </label>
              <select
                value={formData.repeat}
                onChange={(e) => setFormData({ ...formData, repeat: e.target.value as ScheduleFormData['repeat'] })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="none">{t('schedules.form.repeatOptions.none')}</option>
                <option value="daily">{t('schedules.form.repeatOptions.daily')}</option>
                <option value="weekly">{t('schedules.form.repeatOptions.weekly')}</option>
                <option value="monthly">{t('schedules.form.repeatOptions.monthly')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('schedules.form.startTime')}*
              </label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('schedules.form.endTime')}*
              </label>
              <input
                type="time"
                required
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('schedules.form.breakTime')}
              </label>
              <input
                type="text"
                placeholder="e.g., 13:00-14:00"
                value={formData.breakTime}
                onChange={(e) => setFormData({ ...formData, breakTime: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('schedules.form.maxPatients')}*
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.maxPatients}
                onChange={(e) => setFormData({ ...formData, maxPatients: parseInt(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('common.status')}*
              </label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ScheduleFormData['status'] })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="available">{t('schedules.status.available')}</option>
                <option value="booked">{t('schedules.status.booked')}</option>
                <option value="onLeave">{t('schedules.status.onLeave')}</option>
                <option value="holiday">{t('schedules.status.holiday')}</option>
              </select>
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

export default AddScheduleModal;
