import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Search, 
  UserCheck, 
  Save,
  Send,
  UserPlus,
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  User,
  FileText,
  Stethoscope,
  Pill,
  FlaskConical,
  Calendar
} from 'lucide-react';
import PatientSummary from '../components/Consultation/PatientSummary';
import ClinicalTabs from '../components/Consultation/ClinicalTabs';
import HistoryTab from '../components/Consultation/HistoryTab';
import ExaminationTab from '../components/Consultation/ExaminationTab';
import OrdersTab from '../components/Consultation/OrdersTab';
import InvestigationsTab from '../components/Consultation/InvestigationsTab';
import FollowupTab from '../components/Consultation/FollowupTab';
import SummaryTab from '../components/Consultation/SummaryTab';

type ConsultationStatus = 'waiting' | 'in-progress' | 'completed';
type VisitType = 'normal' | 'return';

type Patient = {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone?: string;
  address?: string;
  visitType?: VisitType;
  queueNumber: string;
  status: ConsultationStatus;
  chiefComplaint?: string;
  allergies?: string[];
  chronicConditions?: string[];
  lastVisit?: string;
  vitalSigns?: {
    temperature: number;
    bloodPressure: string;
    heartRate: number;
    respiratoryRate: number;
    weight?: number;
    height?: number;
    bmi?: number;
  };
};

type ConsultationData = {
  // 病史采集
  presentIllness: string;
  pastHistory: string;
  familyHistory: string;
  socialHistory: {
    occupation: {
      current: string;
      duration: string;
      exposures: string[];
      previousOccupations: string;
    };
    smoking: {
      status: 'never' | 'current' | 'former';
      type: string[];
      amountPerDay: number;
      startAge: number;
      endAge?: number;
      duration: number;
      packYears?: number;
      quitAttempts?: number;
      quitDesire?: 'none' | 'low' | 'medium' | 'high';
    };
    alcohol: {
      status: 'never' | 'current' | 'former';
      frequency: 'never' | 'occasional' | 'weekly' | 'daily';
      type: string[];
      amountPerWeek: number;
      duration: number;
      lastDrink?: string;
    };
    maritalStatus: 'single' | 'married' | 'divorced' | 'widowed' | 'separated' | 'other';
    children: number;
    livingArrangement: string;
    education: string;
    diet: {
      type: string;
      restrictions: string[];
      regularMeals: boolean;
      caffeine: boolean;
      caffeineAmount?: string;
    };
    exercise: {
      frequency: 'never' | 'occasional' | 'regular' | 'daily';
      type: string[];
      duration: number;
      intensity: 'light' | 'moderate' | 'vigorous';
    };
    sleep: {
      hoursPerNight: number;
      quality: 'good' | 'fair' | 'poor';
      issues: string[];
    };
    menstrualHistory?: {
      age: number;
      regularity: 'regular' | 'irregular';
      cycle: number;
      flow: 'light' | 'moderate' | 'heavy';
      pain: 'none' | 'mild' | 'moderate' | 'severe';
      lastPeriod: string;
      menopause: boolean;
      menopauseAge?: number;
    };
  };
  
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
  
  // 检查检验
  investigationsData: {
    investigations: any[];
    templates: any[];
  };
  
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
  emergencyContacts: Array<{
    name: string;
    phone: string;
    relationship: string;
  }>;
  warningSignsEducation: string[];
  lifestyleRecommendations: string[];
};

const Consultation: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('patientId');
  const visitType = searchParams.get('visitType') as VisitType;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState('history');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [consultationData, setConsultationData] = useState<ConsultationData>({
    presentIllness: '',
    pastHistory: '',
    familyHistory: '',
    socialHistory: {
      occupation: {
        current: '',
        duration: '',
        exposures: [],
        previousOccupations: ''
      },
      smoking: {
        status: 'never',
        type: [],
        amountPerDay: 0,
        startAge: 0,
        duration: 0,
        packYears: 0
      },
      alcohol: {
        status: 'never',
        frequency: 'never',
        type: [],
        amountPerWeek: 0,
        duration: 0
      },
      maritalStatus: 'single',
      children: 0,
      livingArrangement: '',
      education: '',
      diet: {
        type: '',
        restrictions: [],
        regularMeals: true,
        caffeine: false
      },
      exercise: {
        frequency: 'never',
        type: [],
        duration: 0,
        intensity: 'light'
      },
      sleep: {
        hoursPerNight: 7,
        quality: 'good',
        issues: []
      }
    },
    vitalSigns: {
      temperature: 36.5,
      bloodPressure: '120/80',
      heartRate: 75,
      respiratoryRate: 16,
      weight: 65,
      height: 170,
      bmi: 22.5
    },
    generalExamination: '',
    systemicExamination: '',
    neurologicalExamination: '',
    diagnoses: [],
    clinicalReasoning: '',
    differentialDiagnosis: '',
    medications: [],
    investigations: [],
    generalInstructions: '',
    investigationsData: {
      investigations: [],
      templates: []
    },
    followupPlan: '',
    nextAppointment: '',
    healthEducation: '',
    followupType: 'clinic',
    followupInterval: '',
    followupInstructions: '',
    medicationReview: false,
    labReview: false,
    imagingReview: false,
    emergencyContacts: [],
    warningSignsEducation: [],
    lifestyleRecommendations: []
  });

  // 模拟数据
  const patients: Patient[] = [
    {
      id: 'P-12345',
      name: '张三',
      age: 45,
      gender: 'male',
      phone: '13812345678',
      address: '北京市朝阳区',
      visitType: 'normal',
      queueNumber: 'A001',
      status: 'waiting',
      chiefComplaint: '头痛，发热三天，伴有乏力和食欲不振',
      allergies: ['青霉素', '磺胺类'],
      chronicConditions: ['高血压'],
      lastVisit: '2024-01-15',
      vitalSigns: {
        temperature: 38.5,
        bloodPressure: '140/90',
        heartRate: 85,
        respiratoryRate: 18,
        weight: 70,
        height: 175,
        bmi: 22.9
      }
    },
    {
      id: 'P-12346',
      name: '李四',
      age: 32,
      gender: 'female',
      phone: '13987654321',
      address: '上海市浦东新区',
      visitType: 'return',
      queueNumber: 'B001',
      status: 'waiting',
      chiefComplaint: '复查高血压，血压控制情况良好，无明显不适',
      allergies: [],
      chronicConditions: ['高血压', '糖尿病'],
      lastVisit: '2024-01-10',
      vitalSigns: {
        temperature: 36.8,
        bloodPressure: '135/85',
        heartRate: 75,
        respiratoryRate: 16,
        weight: 60,
        height: 165,
        bmi: 22.0
      }
    }
  ];

  useEffect(() => {
    if (patientId) {
      const patient = patients.find(p => p.id === patientId);
      if (patient) {
        setSelectedPatient({
          ...patient,
          visitType: visitType || 'normal'
        });
        // 加载患者的生命体征到consultationData
        if (patient.vitalSigns) {
          setConsultationData(prev => ({
            ...prev,
            vitalSigns: patient.vitalSigns
          }));
        }
        // 如果患者有主诉，加载到现病史
        if (patient.chiefComplaint) {
          setConsultationData(prev => ({
            ...prev,
            presentIllness: patient.chiefComplaint || ''
          }));
        }
      }
    }
  }, [patientId, visitType]);

  const handleDataChange = (field: string, value: any) => {
    setConsultationData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleChiefComplaintUpdate = (newComplaint: string) => {
    if (selectedPatient) {
      setSelectedPatient({
        ...selectedPatient,
        chiefComplaint: newComplaint
      });
      // 同时更新现病史
      setConsultationData(prev => ({
        ...prev,
        presentIllness: newComplaint
      }));
      setHasUnsavedChanges(true);
    }
  };

  const handleAttachmentUpload = async (file: File): Promise<string> => {
    console.log('上传文件:', file.name);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`/uploads/${file.name}`);
      }, 1000);
    });
  };

  const handleSaveConsultation = () => {
    console.log('保存就诊记录:', {
      patient: selectedPatient,
      consultationData
    });
    setHasUnsavedChanges(false);
  };

  const handleCompleteConsultation = () => {
    // 验证必填项
    if (!consultationData.presentIllness.trim()) {
      alert('请填写现病史');
      setActiveTab('history');
      return;
    }
    
    if (consultationData.diagnoses.length === 0) {
      alert('请至少添加一个诊断');
      setActiveTab('diagnosis');
      return;
    }

    handleSaveConsultation();
    setSelectedPatient(null);
    navigate('/patients');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'history':
        return (
          <HistoryTab
            data={{
              presentIllness: consultationData.presentIllness,
              pastHistory: consultationData.pastHistory,
              familyHistory: consultationData.familyHistory,
              socialHistory: consultationData.socialHistory
            }}
            onChange={handleDataChange}
            onAttachmentUpload={handleAttachmentUpload}
            patientGender={selectedPatient?.gender}
          />
        );
      case 'examination':
        return (
          <ExaminationTab
            data={{
              vitalSigns: consultationData.vitalSigns,
              generalExamination: consultationData.generalExamination,
              systemicExamination: consultationData.systemicExamination,
              neurologicalExamination: consultationData.neurologicalExamination
            }}
            onChange={handleDataChange}
            onAttachmentUpload={handleAttachmentUpload}
          />
        );
      case 'diagnosis':
        return (
          <div className="p-4">
            <h2 className="text-lg font-medium text-gray-800 mb-4">诊断</h2>
            <p className="text-gray-600">诊断功能正在开发中...</p>
          </div>
        );
      case 'orders':
        return (
          <OrdersTab
            data={{
              medications: consultationData.medications,
              investigations: consultationData.investigations,
              generalInstructions: consultationData.generalInstructions
            }}
            onChange={handleDataChange}
          />
        );
      case 'investigations':
        return (
          <InvestigationsTab
            data={consultationData.investigationsData}
            onChange={handleDataChange}
            patientInfo={selectedPatient ? {
              age: selectedPatient.age,
              gender: selectedPatient.gender,
              allergies: selectedPatient.allergies,
              conditions: selectedPatient.chronicConditions
            } : undefined}
          />
        );
      case 'followup':
        return (
          <FollowupTab
            data={{
              followupPlan: consultationData.followupPlan,
              nextAppointment: consultationData.nextAppointment,
              healthEducation: consultationData.healthEducation,
              followupType: consultationData.followupType,
              followupInterval: consultationData.followupInterval,
              followupInstructions: consultationData.followupInstructions,
              medicationReview: consultationData.medicationReview,
              labReview: consultationData.labReview,
              imagingReview: consultationData.imagingReview,
              emergencyContacts: consultationData.emergencyContacts,
              warningSignsEducation: consultationData.warningSignsEducation,
              lifestyleRecommendations: consultationData.lifestyleRecommendations
            }}
            onChange={handleDataChange}
          />
        );
      case 'summary':
        return (
          <SummaryTab
            data={consultationData}
            patientInfo={selectedPatient || {
              id: '',
              name: '',
              age: 0,
              gender: 'male',
              queueNumber: '',
              status: 'waiting'
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {/* 患者列表 - 可收缩 */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-80'} border-r border-gray-200 bg-white transition-all duration-300 flex flex-col`}>
        {/* 患者列表头部 */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="relative flex-1 mr-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="搜索患者..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title={sidebarCollapsed ? '展开患者列表' : '收起患者列表'}
          >
            {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* 患者列表内容 */}
        <div className="flex-1 overflow-y-auto">
          {patients.map((patient) => (
            <div
              key={patient.id}
              className={`p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedPatient?.id === patient.id ? 'bg-primary-50 border-primary-200' : ''
              }`}
              onClick={() => setSelectedPatient(patient)}
              title={sidebarCollapsed ? `${patient.name} - ${patient.chiefComplaint}` : undefined}
            >
              {sidebarCollapsed ? (
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mb-1">
                    <span className="text-xs font-medium text-primary-600">
                      {patient.name.charAt(0)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">{patient.queueNumber}</div>
                  {patient.visitType === 'normal' ? (
                    <UserPlus size={12} className="text-primary-600 mt-1" />
                  ) : (
                    <UserCheck size={12} className="text-blue-600 mt-1" />
                  )}
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">{patient.name}</h3>
                      <p className="text-xs text-gray-500">
                        {patient.age}岁 • {patient.gender === 'male' ? '男' : '女'} • #{patient.queueNumber}
                      </p>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      {patient.visitType === 'normal' ? (
                        <UserPlus size={14} className="text-primary-600" />
                      ) : (
                        <UserCheck size={14} className="text-blue-600" />
                      )}
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        patient.visitType === 'return' ? 'bg-blue-100 text-blue-800' : 'bg-primary-100 text-primary-800'
                      }`}>
                        {patient.visitType === 'return' ? '复诊' : '初诊'}
                      </span>
                      {patient.allergies && patient.allergies.length > 0 && (
                        <AlertTriangle size={12} className="text-red-500" title="有过敏史" />
                      )}
                    </div>
                  </div>
                  {patient.chiefComplaint && (
                    <div className="text-xs text-gray-600 bg-yellow-50 p-2 rounded border border-yellow-200">
                      <div className="font-medium text-yellow-800 mb-1">主诉：</div>
                      <div className="line-clamp-2">{patient.chiefComplaint}</div>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 就诊区域 */}
      {selectedPatient ? (
        <div className="flex-1 flex flex-col min-w-0">
          {/* 患者信息摘要 - 紧凑布局 */}
          <div className="bg-white border-b border-gray-200 p-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center min-w-0 flex-1">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={20} className="text-primary-600" />
                </div>
                <div className="ml-3 min-w-0 flex-1">
                  <div className="flex items-center space-x-4">
                    <h2 className="text-lg font-semibold text-gray-800">{selectedPatient.name}</h2>
                    <div className="flex items-center text-sm text-gray-500 space-x-3">
                      <span>{selectedPatient.age}岁</span>
                      <span>{selectedPatient.gender === 'male' ? '男' : '女'}</span>
                      <span>ID: {selectedPatient.id}</span>
                      {selectedPatient.phone && <span>{selectedPatient.phone}</span>}
                      {selectedPatient.lastVisit && <span>上次: {selectedPatient.lastVisit}</span>}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        selectedPatient.visitType === 'return' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {selectedPatient.visitType === 'return' ? '复诊' : '初诊'}
                      </span>
                      {/* 过敏和慢性病快速标识 */}
                      {selectedPatient.allergies?.length && (
                        <div className="flex items-center">
                          <AlertTriangle size={14} className="text-red-500 mr-1" />
                          <div className="flex space-x-1">
                            {selectedPatient.allergies.map((allergy, index) => (
                              <span key={index} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                                {allergy}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedPatient.chronicConditions?.length && (
                        <div className="flex space-x-1">
                          {selectedPatient.chronicConditions.map((condition, index) => (
                            <span key={index} className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">
                              {condition}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* 主诉显示 */}
                  {selectedPatient.chiefComplaint && (
                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                      <span className="font-medium text-yellow-800">主诉：</span>
                      <span className="text-yellow-700">{selectedPatient.chiefComplaint}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2 flex-shrink-0">
                <button
                  onClick={handleSaveConsultation}
                  disabled={!hasUnsavedChanges}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg flex items-center ${
                    hasUnsavedChanges 
                      ? 'text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100' 
                      : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                  }`}
                >
                  <Save size={14} className="mr-1" />
                  保存
                  {hasUnsavedChanges && <div className="w-1.5 h-1.5 bg-orange-400 rounded-full ml-2"></div>}
                </button>
                <button
                  onClick={handleCompleteConsultation}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 flex items-center"
                >
                  <Send size={14} className="mr-1" />
                  完成就诊
                </button>
              </div>
            </div>
          </div>

          {/* 临床选项卡 - 紧凑布局 */}
          <div className="flex-shrink-0">
            <div className="bg-white border-b border-gray-200">
              <div className="flex overflow-x-auto">
                <button
                  onClick={() => setActiveTab('history')}
                  className={`flex-shrink-0 px-4 py-3 border-b-2 transition-colors ${
                    activeTab === 'history'
                      ? 'border-primary-500 text-primary-600 bg-primary-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <FileText size={14} />
                    <div className="text-left">
                      <div className="text-sm font-medium">病史采集</div>
                      <div className="text-xs text-gray-400">现病史、既往史</div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('examination')}
                  className={`flex-shrink-0 px-4 py-3 border-b-2 transition-colors ${
                    activeTab === 'examination'
                      ? 'border-primary-500 text-primary-600 bg-primary-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Stethoscope size={14} />
                    <div className="text-left">
                      <div className="text-sm font-medium">体格检查</div>
                      <div className="text-xs text-gray-400">生命体征、体检</div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('diagnosis')}
                  className={`flex-shrink-0 px-4 py-3 border-b-2 transition-colors ${
                    activeTab === 'diagnosis'
                      ? 'border-primary-500 text-primary-600 bg-primary-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <AlertTriangle size={14} />
                    <div className="text-left">
                      <div className="text-sm font-medium">诊断</div>
                      <div className="text-xs text-gray-400">临床诊断、鉴别</div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`flex-shrink-0 px-4 py-3 border-b-2 transition-colors ${
                    activeTab === 'orders'
                      ? 'border-primary-500 text-primary-600 bg-primary-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Pill size={14} />
                    <div className="text-left">
                      <div className="text-sm font-medium">医嘱</div>
                      <div className="text-xs text-gray-400">用药、检查</div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('investigations')}
                  className={`flex-shrink-0 px-4 py-3 border-b-2 transition-colors ${
                    activeTab === 'investigations'
                      ? 'border-primary-500 text-primary-600 bg-primary-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <FlaskConical size={14} />
                    <div className="text-left">
                      <div className="text-sm font-medium">检查检验</div>
                      <div className="text-xs text-gray-400">化验、影像</div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('followup')}
                  className={`flex-shrink-0 px-4 py-3 border-b-2 transition-colors ${
                    activeTab === 'followup'
                      ? 'border-primary-500 text-primary-600 bg-primary-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Calendar size={14} />
                    <div className="text-left">
                      <div className="text-sm font-medium">随访计划</div>
                      <div className="text-xs text-gray-400">复诊、指导</div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('summary')}
                  className={`flex-shrink-0 px-4 py-3 border-b-2 transition-colors ${
                    activeTab === 'summary'
                      ? 'border-primary-500 text-primary-600 bg-primary-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <FileText size={14} />
                    <div className="text-left">
                      <div className="text-sm font-medium">综述详览</div>
                      <div className="text-xs text-gray-400">完整病历</div>
                    </div>
                    {hasUnsavedChanges && <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>}
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* 选项卡内容 - 充分利用剩余空间 */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <div className="h-full overflow-y-auto custom-scrollbar">
              {renderTabContent()}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <UserCheck size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">请从左侧选择患者开始就诊</p>
            <p className="text-sm text-gray-500 mt-2">
              选择患者后可以进行完整的临床诊疗流程
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Consultation;
