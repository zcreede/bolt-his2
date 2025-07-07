import React from 'react';
import VitalSignsEditor from './VitalSignsEditor';
import RichTextEditor from './RichTextEditor';
import { Activity, Eye, Stethoscope, Hand } from 'lucide-react';

interface ExaminationTabProps {
  data: {
    vitalSigns: {
      temperature: number;
      bloodPressure: string;
      heartRate: number;
      respiratoryRate: number;
      weight?: number;
      height?: number;
      bmi?: number;
    };
    generalExamination: string;
    systemicExamination: string;
    neurologicalExamination: string;
  };
  onChange: (field: string, value: any) => void;
  onAttachmentUpload?: (file: File) => Promise<string>;
}

const ExaminationTab: React.FC<ExaminationTabProps> = ({ data, onChange, onAttachmentUpload }) => {
  const handleVitalSignsUpdate = (vitalSigns: any) => {
    // 计算BMI
    if (vitalSigns.weight && vitalSigns.height) {
      const heightInMeters = vitalSigns.height / 100;
      const bmi = (vitalSigns.weight / (heightInMeters * heightInMeters)).toFixed(1);
      vitalSigns.bmi = parseFloat(bmi);
    }
    onChange('vitalSigns', vitalSigns);
  };

  return (
    <div className="space-y-6 p-4">
      {/* 生命体征 */}
      <div>
        <div className="flex items-center mb-3">
          <Activity size={18} className="text-red-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-800">生命体征</h3>
          <span className="ml-2 text-sm text-red-500">*</span>
        </div>
        <VitalSignsEditor
          vitalSigns={data.vitalSigns}
          onUpdate={handleVitalSignsUpdate}
        />
      </div>

      {/* 一般检查 */}
      <div>
        <div className="flex items-center mb-3">
          <Eye size={18} className="text-blue-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-800">一般检查</h3>
        </div>
        <RichTextEditor
          value={data.generalExamination}
          onChange={(value) => onChange('generalExamination', value)}
          placeholder="请记录患者的一般状况：发育、营养、意识状态、精神状态、体位、步态、面容、皮肤粘膜等..."
          height="150px"
          onAttachmentUpload={onAttachmentUpload}
        />
        <div className="mt-2 text-xs text-gray-500">
          包含：发育营养、意识状态、精神状态、体位步态、面容表情、皮肤粘膜、浅表淋巴结
        </div>
      </div>

      {/* 系统检查 */}
      <div>
        <div className="flex items-center mb-3">
          <Stethoscope size={18} className="text-green-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-800">系统检查</h3>
        </div>
        <RichTextEditor
          value={data.systemicExamination}
          onChange={(value) => onChange('systemicExamination', value)}
          placeholder="请按系统记录检查结果：呼吸系统、循环系统、消化系统、泌尿生殖系统、内分泌系统等..."
          height="200px"
          onAttachmentUpload={onAttachmentUpload}
        />
        <div className="mt-2 text-xs text-gray-500">
          按系统记录：呼吸系统、循环系统、消化系统、泌尿生殖系统、肌肉骨骼系统
        </div>
      </div>

      {/* 神经系统检查 */}
      <div>
        <div className="flex items-center mb-3">
          <Hand size={18} className="text-purple-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-800">神经系统检查</h3>
        </div>
        <RichTextEditor
          value={data.neurologicalExamination}
          onChange={(value) => onChange('neurologicalExamination', value)}
          placeholder="请记录神经系统检查：高级神经功能、颅神经、运动系统、感觉系统、反射等..."
          height="150px"
          onAttachmentUpload={onAttachmentUpload}
        />
        <div className="mt-2 text-xs text-gray-500">
          包含：高级神经功能、颅神经、运动系统、感觉系统、反射、脑膜刺激征
        </div>
      </div>
    </div>
  );
};

export default ExaminationTab;
