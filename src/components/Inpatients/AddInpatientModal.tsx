import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

type AddInpatientModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (inpatientData: InpatientFormData) => void;
  initialData?: InpatientFormData;
  mode?: 'add' | 'edit';
};

export type InpatientFormData = {
  patientId: string;
  admissionDate: string;
  admissionTime: string;
  ward: string;
  bedNumber: string;
  admissionType: 'emergency' | 'planned' | 'transfer';
  doctorId: string;
  diagnosis: string;
  expectedStayDuration: number;
  notes?: string;
};

const AddInpatientModal: React.FC<AddInpatientModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode = 'add'
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<InpatientFormData>(initialData || {
    patientId: '',
    admissionDate: '',
    admissionTime: '',
    ward: '',
    bedNumber: '',
    admissionType: 'planned',
    doctorId: '',
    diagnosis: '',
    expectedStayDuration: 1,
    notes: ''
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
            {mode === 'add' ? t('inpatients.new') : t('inpatients.edit')}
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
                {t('inpatients.form.patient')}*
              </label>
              <select
                required
                value={formData.patientId}
                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">{t('inpatients.form.selectPatient')}</option>
                <option value="P-12345">Alex Johnson (P-12345)</option>
                <option value="P-12346">Maria Garcia (P-12346)</option>
                <option value="P-12347">David Chen (P-12347)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('inpatients.form.admittingDoctor')}*
              </label>
              <select
                required
                value={formData.doctorId}
                onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">{t('inpatients.form.selectDoctor')}</option>
                <option value="D-001">Dr. Sarah Wilson (Cardiology)</option>
                <option value="D-002">Dr. James Anderson (Neurology)</option>
                <option value="D-003">Dr. Emma Davis (Orthopedics)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('inpatients.form.admissionDate')}*
              </label>
              <input
                type="date"
                required
                value={formData.admissionDate}
                onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('inpatients.form.admissionTime')}*
              </label>
              <input
                type="time"
                required
                value={formData.admissionTime}
                onChange={(e) => setFormData({ ...formData, admissionTime: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('inpatients.form.ward')}*
              </label>
              <select
                required
                value={formData.ward}
                onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">{t('inpatients.form.selectWard')}</option>
                <option value="Cardiology Ward">Cardiology Ward</option>
                <option value="Neurology Ward">Neurology Ward</option>
                <option value="Orthopedics Ward">Orthopedics Ward</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('inpatients.form.bedNumber')}*
              </label>
              <input
                type="text"
                required
                value={formData.bedNumber}
                onChange={(e) => setFormData({ ...formData, bedNumber: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('inpatients.form.admissionType')}*
              </label>
              <select
                required
                value={formData.admissionType}
                onChange={(e) => setFormData({ ...formData, admissionType: e.target.value as InpatientFormData['admissionType'] })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="planned">{t('inpatients.admissionType.planned')}</option>
                <option value="emergency">{t('inpatients.admissionType.emergency')}</option>
                <option value="transfer">{t('inpatients.admissionType.transfer')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('inpatients.form.expectedStayDuration')}*
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.expectedStayDuration}
                onChange={(e) => setFormData({ ...formData, expectedStayDuration: parseInt(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('inpatients.form.diagnosis')}*
              </label>
              <textarea
                required
                rows={3}
                value={formData.diagnosis}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('inpatients.form.notes')}
              </label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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

export default AddInpatientModal;
