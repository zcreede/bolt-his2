import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, FileText, BedDouble, Check, X as XIcon } from 'lucide-react';

type AdmissionRequestModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onApprove: (bedNumber: string) => void;
  onReject: (reason: string) => void;
  request: {
    id: string;
    patientName: string;
    patientId: string;
    age: number;
    gender: string;
    department: string;
    doctor: string;
    diagnosis: string;
    reason: string;
    requestDate: string;
    urgency: 'normal' | 'urgent';
  };
  availableBeds: Array<{
    id: string;
    number: string;
    ward: string;
    type: string;
  }>;
};

const AdmissionRequestModal: React.FC<AdmissionRequestModalProps> = ({
  isOpen,
  onClose,
  onApprove,
  onReject,
  request,
  availableBeds
}) => {
  const { t } = useTranslation();
  const [selectedBed, setSelectedBed] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">住院申请审核</h2>
            <p className="text-sm text-gray-500">申请编号：{request.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* 患者信息 */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">患者信息</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">姓名</span>
                <span className="font-medium">{request.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ID</span>
                <span>{request.patientId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">年龄</span>
                <span>{request.age}岁</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">性别</span>
                <span>{request.gender}</span>
              </div>
            </div>
          </div>

          {/* 申请信息 */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">申请信息</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">申请科室</span>
                <span>{request.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">申请医生</span>
                <span>{request.doctor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">申请日期</span>
                <span>{request.requestDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">紧急程度</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  request.urgency === 'urgent' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {request.urgency === 'urgent' ? '紧急' : '普通'}
                </span>
              </div>
            </div>
          </div>

          {/* 诊断信息 */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">诊断信息</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-800">{request.diagnosis}</p>
              <p className="text-sm text-gray-600 mt-2">住院原因：{request.reason}</p>
            </div>
          </div>

          {!showRejectForm ? (
            <>
              {/* 床位分配 */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">床位分配</h3>
                <select
                  value={selectedBed}
                  onChange={(e) => setSelectedBed(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="">选择床位</option>
                  {availableBeds.map((bed) => (
                    <option key={bed.id} value={bed.number}>
                      {bed.ward} - {bed.number} ({bed.type})
                    </option>
                  ))}
                </select>
              </div>

              {/* 操作按钮 */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowRejectForm(true)}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700"
                >
                  拒绝申请
                </button>
                <button
                  onClick={() => onApprove(selectedBed)}
                  disabled={!selectedBed}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
                    selectedBed
                      ? 'bg-primary-600 hover:bg-primary-700'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  批准入院
                </button>
              </div>
            </>
          ) : (
            <>
              {/* 拒绝原因表单 */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">拒绝原因</h3>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="请输入拒绝原因..."
                />
              </div>

              {/* 操作按钮 */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowRejectForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700"
                >
                  返回
                </button>
                <button
                  onClick={() => onReject(rejectReason)}
                  disabled={!rejectReason}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
                    rejectReason
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  确认拒绝
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdmissionRequestModal;
