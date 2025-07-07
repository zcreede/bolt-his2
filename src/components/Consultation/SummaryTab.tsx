import React from 'react';
import { 
  FileText, 
  Stethoscope, 
  Activity, 
  Pill, 
  FlaskConical, 
  Calendar,
  Heart,
  User,
  Users,
  AlertTriangle,
  Printer,
  Download,
  Share2,
  Clock
} from 'lucide-react';

interface SummaryTabProps {
  data: {
    // 病史采集
    presentIllness: string;
    pastHistory: string;
    familyHistory: string;
    socialHistory: any;
    
    // 体格检查
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
    
    // 诊断
    diagnoses: Array<{
      code: string;
      name: string;
      type: 'primary' | 'secondary';
      certainty: 'confirmed' | 'suspected' | 'rule-out';
      notes?: string;
    }>;
    clinicalReasoning: string;
    differentialDiagnosis: string;
    
    // 医嘱
    medications: Array<{
      id: string;
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
      route: string;
      instructions: string;
    }>;
    investigations: Array<{
      id: string;
      type: 'lab' | 'imaging' | 'procedure';
      name: string;
      urgency: 'routine' | 'urgent' | 'stat';
      instructions: string;
    }>;
    generalInstructions: string;
    
    // 随访计划
    followupPlan: string;
    nextAppointment: string;
    healthEducation: string;
    followupType: 'clinic' | 'phone' | 'video' | 'message';
    followupInterval: string;
    followupInstructions: string;
    medicationReview: boolean;
    labReview: boolean;
    imagingReview: boolean;
    warningSignsEducation: string[];
    lifestyleRecommendations: string[];
  };
  patientInfo: {
    id: string;
    name: string;
    age: number;
    gender: string;
    phone?: string;
    address?: string;
    visitType?: 'normal' | 'return';
    chiefComplaint?: string;
    allergies?: string[];
    chronicConditions?: string[];
    lastVisit?: string;
  };
}

const SummaryTab: React.FC<SummaryTabProps> = ({ data, patientInfo }) => {
  return (
    <div className="p-4 space-y-6">
      {/* 顶部操作栏 */}
      <div className="flex justify-end space-x-2 mb-4">
        <button className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
          <Printer size={16} className="mr-1" />
          打印
        </button>
        <button className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
          <Download size={16} className="mr-1" />
          导出
        </button>
        <button className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
          <Share2 size={16} className="mr-1" />
          分享
        </button>
      </div>

      {/* 病历标题 */}
      <div className="text-center border-b border-gray-200 pb-4">
        <h1 className="text-xl font-bold text-gray-800">门诊病历</h1>
        <p className="text-sm text-gray-500 mt-1">
          就诊日期: {new Date().toLocaleDateString()} | 
          医生: 张医生 | 
          科室: 内科
        </p>
      </div>

      {/* 患者基本信息 */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h2 className="text-md font-semibold text-gray-800 mb-2 flex items-center">
          <User size={16} className="mr-2 text-primary-600" />
          患者基本信息
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span className="text-gray-500 text-sm">姓名:</span>
            <span className="ml-2 font-medium">{patientInfo.name}</span>
          </div>
          <div>
            <span className="text-gray-500 text-sm">性别:</span>
            <span className="ml-2">{patientInfo.gender === 'male' ? '男' : '女'}</span>
          </div>
          <div>
            <span className="text-gray-500 text-sm">年龄:</span>
            <span className="ml-2">{patientInfo.age}岁</span>
          </div>
          <div>
            <span className="text-gray-500 text-sm">ID:</span>
            <span className="ml-2">{patientInfo.id}</span>
          </div>
          <div>
            <span className="text-gray-500 text-sm">电话:</span>
            <span className="ml-2">{patientInfo.phone || '未记录'}</span>
          </div>
          <div>
            <span className="text-gray-500 text-sm">就诊类型:</span>
            <span className="ml-2">{patientInfo.visitType === 'return' ? '复诊' : '初诊'}</span>
          </div>
        </div>
        
        {/* 过敏史和慢性病 */}
        {(patientInfo.allergies?.length || patientInfo.chronicConditions?.length) && (
          <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
            {patientInfo.allergies?.length ? (
              <div>
                <div className="flex items-center text-red-600 text-sm font-medium mb-1">
                  <AlertTriangle size={14} className="mr-1" />
                  过敏史
                </div>
                <div className="flex flex-wrap gap-1">
                  {patientInfo.allergies.map((allergy, index) => (
                    <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                      {allergy}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
            
            {patientInfo.chronicConditions?.length ? (
              <div>
                <div className="flex items-center text-orange-600 text-sm font-medium mb-1">
                  <Heart size={14} className="mr-1" />
                  慢性病史
                </div>
                <div className="flex flex-wrap gap-1">
                  {patientInfo.chronicConditions.map((condition, index) => (
                    <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                      {condition}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* 主诉 */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h2 className="text-md font-semibold text-gray-800 mb-2">主诉</h2>
        <p className="text-gray-700">{patientInfo.chiefComplaint || '未记录'}</p>
      </div>

      {/* 现病史 */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h2 className="text-md font-semibold text-gray-800 mb-2 flex items-center">
          <Clock size={16} className="mr-2 text-primary-600" />
          现病史
        </h2>
        <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: data.presentIllness || '未记录' }} />
      </div>

      {/* 既往史 */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h2 className="text-md font-semibold text-gray-800 mb-2 flex items-center">
          <User size={16} className="mr-2 text-blue-600" />
          既往史
        </h2>
        <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: data.pastHistory || '未记录' }} />
      </div>

      {/* 家族史 */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h2 className="text-md font-semibold text-gray-800 mb-2 flex items-center">
          <Users size={16} className="mr-2 text-green-600" />
          家族史
        </h2>
        <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: data.familyHistory || '未记录' }} />
      </div>

      {/* 社会史 */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h2 className="text-md font-semibold text-gray-800 mb-2 flex items-center">
          <Heart size={16} className="mr-2 text-purple-600" />
          社会史
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 职业史 */}
          {data.socialHistory.occupation.current && (
            <div>
              <h3 className="text-sm font-medium text-gray-700">职业史</h3>
              <div className="mt-1 text-sm">
                <p><span className="text-gray-500">当前职业:</span> {data.socialHistory.occupation.current}</p>
                {data.socialHistory.occupation.duration && (
                  <p><span className="text-gray-500">从事时间:</span> {data.socialHistory.occupation.duration}</p>
                )}
                {data.socialHistory.occupation.exposures.length > 0 && (
                  <p>
                    <span className="text-gray-500">职业暴露:</span> 
                    {data.socialHistory.occupation.exposures.join(', ')}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* 吸烟史 */}
          {data.socialHistory.smoking.status !== 'never' && (
            <div>
              <h3 className="text-sm font-medium text-gray-700">吸烟史</h3>
              <div className="mt-1 text-sm">
                <p>
                  <span className="text-gray-500">状态:</span> 
                  {data.socialHistory.smoking.status === 'current' ? '现在吸烟' : '曾经吸烟'}
                </p>
                {data.socialHistory.smoking.amountPerDay > 0 && (
                  <p><span className="text-gray-500">数量:</span> {data.socialHistory.smoking.amountPerDay}支/天</p>
                )}
                {data.socialHistory.smoking.duration > 0 && (
                  <p><span className="text-gray-500">持续时间:</span> {data.socialHistory.smoking.duration}年</p>
                )}
                {data.socialHistory.smoking.packYears && (
                  <p><span className="text-gray-500">包年:</span> {data.socialHistory.smoking.packYears}</p>
                )}
              </div>
            </div>
          )}

          {/* 饮酒史 */}
          {data.socialHistory.alcohol.status !== 'never' && (
            <div>
              <h3 className="text-sm font-medium text-gray-700">饮酒史</h3>
              <div className="mt-1 text-sm">
                <p>
                  <span className="text-gray-500">状态:</span> 
                  {data.socialHistory.alcohol.status === 'current' ? '现在饮酒' : '曾经饮酒'}
                </p>
                <p>
                  <span className="text-gray-500">频率:</span> 
                  {data.socialHistory.alcohol.frequency === 'daily' ? '每天' : 
                   data.socialHistory.alcohol.frequency === 'weekly' ? '每周' : 
                   data.socialHistory.alcohol.frequency === 'occasional' ? '偶尔' : '从不'}
                </p>
                {data.socialHistory.alcohol.amountPerWeek > 0 && (
                  <p><span className="text-gray-500">数量:</span> {data.socialHistory.alcohol.amountPerWeek}次/周</p>
                )}
              </div>
            </div>
          )}

          {/* 婚育史 */}
          <div>
            <h3 className="text-sm font-medium text-gray-700">婚育史</h3>
            <div className="mt-1 text-sm">
              <p>
                <span className="text-gray-500">婚姻状况:</span> 
                {data.socialHistory.maritalStatus === 'single' ? '未婚' : 
                 data.socialHistory.maritalStatus === 'married' ? '已婚' : 
                 data.socialHistory.maritalStatus === 'divorced' ? '离婚' : 
                 data.socialHistory.maritalStatus === 'widowed' ? '丧偶' : 
                 data.socialHistory.maritalStatus === 'separated' ? '分居' : '其他'}
              </p>
              <p><span className="text-gray-500">子女数:</span> {data.socialHistory.children}</p>
            </div>
          </div>

          {/* 月经史（女性） */}
          {patientInfo.gender === 'female' && data.socialHistory.menstrualHistory && (
            <div>
              <h3 className="text-sm font-medium text-gray-700">月经史</h3>
              <div className="mt-1 text-sm">
                {data.socialHistory.menstrualHistory.age > 0 && (
                  <p><span className="text-gray-500">初潮年龄:</span> {data.socialHistory.menstrualHistory.age}岁</p>
                )}
                <p>
                  <span className="text-gray-500">规律性:</span> 
                  {data.socialHistory.menstrualHistory.regularity === 'regular' ? '规律' : '不规律'}
                </p>
                {data.socialHistory.menstrualHistory.lastPeriod && (
                  <p><span className="text-gray-500">末次月经:</span> {data.socialHistory.menstrualHistory.lastPeriod}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 体格检查 */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h2 className="text-md font-semibold text-gray-800 mb-2 flex items-center">
          <Stethoscope size={16} className="mr-2 text-green-600" />
          体格检查
        </h2>
        
        {/* 生命体征 */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">生命体征</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">体温</p>
              <p className={`text-lg font-semibold ${
                data.vitalSigns.temperature > 37.5 ? 'text-red-600' : 'text-gray-800'
              }`}>
                {data.vitalSigns.temperature}°C
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">血压</p>
              <p className="text-lg font-semibold text-gray-800">
                {data.vitalSigns.bloodPressure}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">心率</p>
              <p className={`text-lg font-semibold ${
                data.vitalSigns.heartRate > 100 ? 'text-red-600' : 'text-gray-800'
              }`}>
                {data.vitalSigns.heartRate}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">呼吸</p>
              <p className={`text-lg font-semibold ${
                data.vitalSigns.respiratoryRate > 24 ? 'text-red-600' : 'text-gray-800'
              }`}>
                {data.vitalSigns.respiratoryRate}
              </p>
            </div>
          </div>
        </div>
        
        {/* 一般检查 */}
        {data.generalExamination && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-1">一般检查</h3>
            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: data.generalExamination }} />
          </div>
        )}
        
        {/* 系统检查 */}
        {data.systemicExamination && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-1">系统检查</h3>
            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: data.systemicExamination }} />
          </div>
        )}
        
        {/* 神经系统检查 */}
        {data.neurologicalExamination && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">神经系统检查</h3>
            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: data.neurologicalExamination }} />
          </div>
        )}
      </div>

      {/* 诊断 */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h2 className="text-md font-semibold text-gray-800 mb-2 flex items-center">
          <AlertTriangle size={16} className="mr-2 text-red-600" />
          诊断
        </h2>
        
        {data.diagnoses && data.diagnoses.length > 0 ? (
          <div className="space-y-3">
            {data.diagnoses.map((diagnosis, index) => (
              <div key={index} className={`p-3 rounded-lg ${
                diagnosis.type === 'primary' ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      diagnosis.type === 'primary' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {diagnosis.type === 'primary' ? '主要诊断' : '次要诊断'}
                    </span>
                    <span className={`ml-2 inline-block px-2 py-1 text-xs rounded-full ${
                      diagnosis.certainty === 'confirmed' ? 'bg-green-100 text-green-800' : 
                      diagnosis.certainty === 'suspected' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {diagnosis.certainty === 'confirmed' ? '确诊' : 
                       diagnosis.certainty === 'suspected' ? '疑似' : '待排除'}
                    </span>
                  </div>
                  {diagnosis.code && (
                    <span className="text-xs text-gray-500">{diagnosis.code}</span>
                  )}
                </div>
                <div className="mt-1 font-medium">
                  {diagnosis.name}
                </div>
                {diagnosis.notes && (
                  <div className="mt-1 text-sm text-gray-600">
                    {diagnosis.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">未记录诊断</p>
        )}
        
        {/* 临床推理 */}
        {data.clinicalReasoning && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-1">临床推理</h3>
            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: data.clinicalReasoning }} />
          </div>
        )}
        
        {/* 鉴别诊断 */}
        {data.differentialDiagnosis && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-1">鉴别诊断</h3>
            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: data.differentialDiagnosis }} />
          </div>
        )}
      </div>

      {/* 医嘱 */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h2 className="text-md font-semibold text-gray-800 mb-2 flex items-center">
          <Pill size={16} className="mr-2 text-green-600" />
          医嘱
        </h2>
        
        {/* 药物医嘱 */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">药物医嘱</h3>
          {data.medications && data.medications.length > 0 ? (
            <div className="space-y-2">
              {data.medications.map((medication, index) => (
                <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex justify-between">
                    <div className="font-medium text-gray-800">{medication.name}</div>
                    <div className="text-sm text-gray-500">{medication.route}</div>
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    {medication.dosage} • {medication.frequency} • {medication.duration}
                  </div>
                  {medication.instructions && (
                    <div className="mt-1 text-sm text-gray-600">
                      说明: {medication.instructions}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">未开具药物医嘱</p>
          )}
        </div>
        
        {/* 检查检验医嘱 */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">检查检验医嘱</h3>
          {data.investigations && data.investigations.length > 0 ? (
            <div className="space-y-2">
              {data.investigations.map((investigation, index) => (
                <div key={index} className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {investigation.type === 'lab' ? (
                        <FlaskConical size={16} className="text-purple-600 mr-2" />
                      ) : investigation.type === 'imaging' ? (
                        <Activity size={16} className="text-blue-600 mr-2" />
                      ) : (
                        <Activity size={16} className="text-orange-600 mr-2" />
                      )}
                      <span className="font-medium text-gray-800">{investigation.name}</span>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      investigation.urgency === 'stat' ? 'bg-red-100 text-red-800' : 
                      investigation.urgency === 'urgent' ? 'bg-orange-100 text-orange-800' : 
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {investigation.urgency === 'stat' ? '急查' : 
                       investigation.urgency === 'urgent' ? '加急' : '常规'}
                    </span>
                  </div>
                  {investigation.instructions && (
                    <div className="mt-1 text-sm text-gray-600">
                      说明: {investigation.instructions}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">未开具检查检验医嘱</p>
          )}
        </div>
        
        {/* 一般医嘱 */}
        {data.generalInstructions && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">一般医嘱</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-sm text-gray-700">{data.generalInstructions}</p>
            </div>
          </div>
        )}
      </div>

      {/* 随访计划 */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h2 className="text-md font-semibold text-gray-800 mb-2 flex items-center">
          <Calendar size={16} className="mr-2 text-blue-600" />
          随访计划
        </h2>
        
        {/* 随访安排 */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">随访安排</h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">随访方式:</span> 
                  {data.followupType === 'clinic' ? '门诊复诊' : 
                   data.followupType === 'phone' ? '电话随访' : 
                   data.followupType === 'video' ? '视频随访' : '消息随访'}
                </p>
                {data.followupInterval && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">随访间隔:</span> {data.followupInterval}
                  </p>
                )}
              </div>
              <div>
                {data.nextAppointment && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">下次随访时间:</span> {data.nextAppointment}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mt-1">
                  {data.medicationReview && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">药物评估</span>
                  )}
                  {data.labReview && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">化验复查</span>
                  )}
                  {data.imagingReview && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">影像复查</span>
                  )}
                </div>
              </div>
            </div>
            {data.followupInstructions && (
              <div className="mt-2 text-sm text-gray-600">
                <span className="font-medium">随访说明:</span> {data.followupInstructions}
              </div>
            )}
          </div>
        </div>
        
        {/* 健康教育 */}
        {data.healthEducation && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">健康教育</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-sm text-gray-700">{data.healthEducation}</p>
            </div>
          </div>
        )}
        
        {/* 生活方式建议 */}
        {data.lifestyleRecommendations && data.lifestyleRecommendations.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">生活方式建议</h3>
            <div className="flex flex-wrap gap-2">
              {data.lifestyleRecommendations.map((recommendation, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {recommendation}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* 警示症状 */}
        {data.warningSignsEducation && data.warningSignsEducation.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">需警惕的症状</h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800 mb-2">如出现以下症状，请立即就医：</p>
              <div className="flex flex-wrap gap-2">
                {data.warningSignsEducation.map((sign, index) => (
                  <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                    {sign}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 医生签名 */}
      <div className="mt-8 border-t border-gray-200 pt-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">医生签名：张医生</p>
          <p className="text-sm text-gray-500">签名日期：{new Date().toLocaleDateString()}</p>
        </div>
        <div className="text-sm text-gray-500">
          病历完成时间：{new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default SummaryTab;
