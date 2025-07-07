"use client"

import type React from "react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  Search,
  Building2,
  BedDouble,
  Users,
  Clock,
  AlertTriangle,
  Plus,
  FileText,
  Clipboard,
  Heart,
  Stethoscope,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  BookOpen,
} from "lucide-react"
import AdmissionRequestModal from "../components/Inpatients/AdmissionRequestModal"
import DeleteInpatientModal from "../components/Inpatients/DeleteInpatientModal"
import WardRoundModal from "../components/Inpatients/WardRoundModal"
import InpatientDetailsModal from "../components/Inpatients/InpatientDetailsModal"
import AddInpatientModal from "../components/Inpatients/AddInpatientModal"
import InpatientCareModal from "../components/Inpatients/InpatientCareModal"
import DischargeModal from "../components/Inpatients/DischargeModal"
import InpatientMedicalRecord from "../components/Inpatients/InpatientMedicalRecord"

type AdmissionRequest = {
  id: string
  patientName: string
  patientId: string
  age: number
  gender: string
  department: string
  doctor: string
  diagnosis: string
  reason: string
  requestDate: string
  urgency: "normal" | "urgent"
  status: "pending" | "approved" | "rejected"
  requestTime: string
  expectedStayDuration: number
  insuranceType: string
  contactPerson: {
    name: string
    relationship: string
    phone: string
  }
}

type AdmissionStatus = "pending" | "approved" | "rejected"
type InpatientStatus = "admitted" | "critical" | "stable" | "improving" | "discharged" | "transferred"
type InpatientView = "list" | "requests" | "rounds" | "care"

interface Inpatient {
  id: string
  patientId: string
  patientName: string
  age: number
  gender: string
  admissionDate: string
  admissionTime: string
  ward: string
  room: string
  bedNumber: string
  diagnosis: string[]
  doctor: string
  department: string
  status: InpatientStatus
  expectedDischargeDate?: string
  lengthOfStay: number
  vitalSigns: {
    temperature: number
    bloodPressure: string
    heartRate: number
    respiratoryRate: number
    oxygenSaturation: number
  }
  nursingLevel: "standard" | "intermediate" | "intensive"
  dietType: string
  activityLevel: string
  medications: Array<{
    name: string
    dosage: string
    frequency: string
    route: string
    startDate: string
    endDate?: string
    status: "active" | "discontinued" | "completed"
  }>
  allergies?: string[]
  notes?: string
  lastRound?: {
    date: string
    time: string
    doctor: string
    notes: string
  }
  careTeam: Array<{
    id: string
    name: string
    role: string
    department: string
  }>
  orders: Array<{
    id: string
    type: "medication" | "lab" | "imaging" | "procedure" | "nursing" | "diet" | "activity"
    name: string
    status: "active" | "completed" | "cancelled"
    orderedDate: string
    orderedBy: string
    details: string
  }>
  progressNotes: Array<{
    id: string
    date: string
    time: string
    author: string
    content: string
    type: "doctor" | "nurse" | "other"
  }>
  treatmentResponse: "good" | "fair" | "poor" | "unknown"
  complications: string[]
  dischargeStatus?: "pending" | "planned" | "completed"
  dischargeDate?: string
  dischargeSummary?: string
  followUpPlan?: string
}

const Inpatients: React.FC = () => {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<AdmissionStatus | InpatientStatus | "">("")
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [selectedWard, setSelectedWard] = useState("")
  const [selectedRequest, setSelectedRequest] = useState<AdmissionRequest | null>(null)
  const [selectedInpatient, setSelectedInpatient] = useState<Inpatient | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showWardRoundModal, setShowWardRoundModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showCareModal, setShowCareModal] = useState(false)
  const [showDischargeModal, setShowDischargeModal] = useState(false)
  const [showMedicalRecord, setShowMedicalRecord] = useState(false)
  const [currentView, setCurrentView] = useState<InpatientView>("list")
  const [expandedPatient, setExpandedPatient] = useState<string | null>(null)

  // 示例数据 - 住院申请列表
  const admissionRequests: AdmissionRequest[] = [
    {
      id: "REQ-001",
      patientName: "张三",
      patientId: "P-12348",
      age: 45,
      gender: "男",
      department: "心内科",
      doctor: "李医生",
      diagnosis: "冠心病",
      reason: "需要进一步治疗和观察",
      requestDate: "2024-01-24",
      requestTime: "09:30",
      urgency: "normal",
      status: "pending",
      expectedStayDuration: 7,
      insuranceType: "城镇职工医保",
      contactPerson: {
        name: "张小明",
        relationship: "子女",
        phone: "13812345678",
      },
    },
    {
      id: "REQ-002",
      patientName: "李四",
      patientId: "P-12349",
      age: 32,
      gender: "女",
      department: "神经内科",
      doctor: "王医生",
      diagnosis: "脑梗塞",
      reason: "需要立即住院治疗",
      requestDate: "2024-01-24",
      requestTime: "10:15",
      urgency: "urgent",
      status: "pending",
      expectedStayDuration: 14,
      insuranceType: "城镇居民医保",
      contactPerson: {
        name: "李大明",
        relationship: "父亲",
        phone: "13987654321",
      },
    },
  ]

  // 示例数据 - 住院病人
  const inpatients: Inpatient[] = [
    {
      id: "INP-001",
      patientId: "P-12350",
      patientName: "王五",
      age: 65,
      gender: "男",
      admissionDate: "2024-01-20",
      admissionTime: "14:30",
      ward: "心内科病区",
      room: "301",
      bedNumber: "301-A",
      diagnosis: ["冠心病", "高血压", "2型糖尿病"],
      doctor: "张医生",
      department: "心内科",
      status: "stable",
      expectedDischargeDate: "2024-01-27",
      lengthOfStay: 4,
      vitalSigns: {
        temperature: 36.5,
        bloodPressure: "130/80",
        heartRate: 72,
        respiratoryRate: 18,
        oxygenSaturation: 98,
      },
      nursingLevel: "standard",
      dietType: "低盐饮食",
      activityLevel: "适度活动",
      medications: [
        {
          name: "阿司匹林",
          dosage: "100mg",
          frequency: "每日一次",
          route: "口服",
          startDate: "2024-01-20",
          status: "active",
        },
        {
          name: "硝酸甘油",
          dosage: "0.5mg",
          frequency: "需要时",
          route: "舌下含服",
          startDate: "2024-01-20",
          status: "active",
        },
      ],
      allergies: ["青霉素"],
      lastRound: {
        date: "2024-01-24",
        time: "09:00",
        doctor: "张医生",
        notes: "患者状态稳定，无胸痛症状，继续当前治疗方案",
      },
      careTeam: [
        {
          id: "D-001",
          name: "张医生",
          role: "主治医师",
          department: "心内科",
        },
        {
          id: "N-001",
          name: "李护士",
          role: "责任护士",
          department: "心内科",
        },
      ],
      orders: [
        {
          id: "ORD-001",
          type: "medication",
          name: "阿司匹林 100mg 口服 每日一次",
          status: "active",
          orderedDate: "2024-01-20",
          orderedBy: "张医生",
          details: "餐后服用",
        },
        {
          id: "ORD-002",
          type: "lab",
          name: "血常规",
          status: "completed",
          orderedDate: "2024-01-21",
          orderedBy: "张医生",
          details: "监测白细胞计数",
        },
      ],
      progressNotes: [
        {
          id: "NOTE-001",
          date: "2024-01-21",
          time: "10:30",
          author: "张医生",
          content: "患者无胸痛不适，生命体征平稳，继续观察",
          type: "doctor",
        },
        {
          id: "NOTE-002",
          date: "2024-01-22",
          time: "08:30",
          author: "李护士",
          content: "患者睡眠良好，饮食正常，无特殊不适",
          type: "nurse",
        },
      ],
      treatmentResponse: "good",
      complications: [],
    },
    {
      id: "INP-002",
      patientId: "P-12351",
      patientName: "赵六",
      age: 78,
      gender: "女",
      admissionDate: "2024-01-18",
      admissionTime: "09:45",
      ward: "神经内科病区",
      room: "205",
      bedNumber: "205-B",
      diagnosis: ["脑梗塞", "高血压", "心房颤动"],
      doctor: "王医生",
      department: "神经内科",
      status: "improving",
      expectedDischargeDate: "2024-02-01",
      lengthOfStay: 6,
      vitalSigns: {
        temperature: 36.8,
        bloodPressure: "145/85",
        heartRate: 85,
        respiratoryRate: 20,
        oxygenSaturation: 96,
      },
      nursingLevel: "intermediate",
      dietType: "软食",
      activityLevel: "卧床休息，定时翻身",
      medications: [
        {
          name: "阿托伐他汀",
          dosage: "20mg",
          frequency: "每晚一次",
          route: "口服",
          startDate: "2024-01-18",
          status: "active",
        },
        {
          name: "依诺肝素",
          dosage: "40mg",
          frequency: "每日一次",
          route: "皮下注射",
          startDate: "2024-01-18",
          status: "active",
        },
      ],
      allergies: [],
      lastRound: {
        date: "2024-01-24",
        time: "08:30",
        doctor: "王医生",
        notes: "患者肢体活动较前改善，言语功能恢复中，继续康复训练",
      },
      careTeam: [
        {
          id: "D-002",
          name: "王医生",
          role: "主治医师",
          department: "神经内科",
        },
        {
          id: "N-002",
          name: "张护士",
          role: "责任护士",
          department: "神经内科",
        },
        {
          id: "T-001",
          name: "刘治疗师",
          role: "康复治疗师",
          department: "康复科",
        },
      ],
      orders: [
        {
          id: "ORD-003",
          type: "medication",
          name: "阿托伐他汀 20mg 口服 每晚一次",
          status: "active",
          orderedDate: "2024-01-18",
          orderedBy: "王医生",
          details: "睡前服用",
        },
        {
          id: "ORD-004",
          type: "procedure",
          name: "康复训练",
          status: "active",
          orderedDate: "2024-01-19",
          orderedBy: "王医生",
          details: "每日两次，每次30分钟",
        },
      ],
      progressNotes: [
        {
          id: "NOTE-003",
          date: "2024-01-20",
          time: "11:00",
          author: "王医生",
          content: "患者意识清醒，右侧肢体活动受限，言语含糊，CT显示左侧大脑中动脉区域梗塞",
          type: "doctor",
        },
        {
          id: "NOTE-004",
          date: "2024-01-22",
          time: "09:30",
          author: "刘治疗师",
          content: "患者配合康复训练，右侧肢体肌力3级，言语功能有所改善",
          type: "other",
        },
      ],
      treatmentResponse: "fair",
      complications: ["轻度吞咽困难"],
    },
    {
      id: "INP-003",
      patientId: "P-12352",
      patientName: "钱七",
      age: 42,
      gender: "男",
      admissionDate: "2024-01-23",
      admissionTime: "16:20",
      ward: "呼吸科病区",
      room: "402",
      bedNumber: "402-C",
      diagnosis: ["重症肺炎", "慢性支气管炎"],
      doctor: "刘医生",
      department: "呼吸科",
      status: "critical",
      lengthOfStay: 1,
      vitalSigns: {
        temperature: 38.9,
        bloodPressure: "110/70",
        heartRate: 110,
        respiratoryRate: 26,
        oxygenSaturation: 92,
      },
      nursingLevel: "intensive",
      dietType: "流质饮食",
      activityLevel: "卧床休息",
      medications: [
        {
          name: "头孢曲松",
          dosage: "2g",
          frequency: "每12小时一次",
          route: "静脉滴注",
          startDate: "2024-01-23",
          status: "active",
        },
        {
          name: "沙丁胺醇",
          dosage: "5mg",
          frequency: "每6小时一次",
          route: "雾化吸入",
          startDate: "2024-01-23",
          status: "active",
        },
      ],
      allergies: [],
      lastRound: {
        date: "2024-01-24",
        time: "07:30",
        doctor: "刘医生",
        notes: "患者发热持续，呼吸困难，氧饱和度下降，考虑加用无创通气",
      },
      careTeam: [
        {
          id: "D-003",
          name: "刘医生",
          role: "主治医师",
          department: "呼吸科",
        },
        {
          id: "N-003",
          name: "赵护士",
          role: "责任护士",
          department: "呼吸科",
        },
      ],
      orders: [
        {
          id: "ORD-005",
          type: "medication",
          name: "头孢曲松 2g 静脉滴注 每12小时一次",
          status: "active",
          orderedDate: "2024-01-23",
          orderedBy: "刘医生",
          details: "输注时间不少于30分钟",
        },
        {
          id: "ORD-006",
          type: "lab",
          name: "动脉血气分析",
          status: "active",
          orderedDate: "2024-01-24",
          orderedBy: "刘医生",
          details: "紧急",
        },
      ],
      progressNotes: [
        {
          id: "NOTE-005",
          date: "2024-01-23",
          time: "18:00",
          author: "刘医生",
          content: "患者高热，呼吸急促，肺部啰音明显，胸片显示双肺浸润，开始抗生素治疗",
          type: "doctor",
        },
        {
          id: "NOTE-006",
          date: "2024-01-24",
          time: "06:00",
          author: "赵护士",
          content: "患者夜间发热39.2°C，给予物理降温及退热药物，氧饱和度一度下降至90%，已增加氧流量",
          type: "nurse",
        },
      ],
      treatmentResponse: "poor",
      complications: ["呼吸衰竭"],
    },
  ]

  // 示例数据 - 可用床位
  const availableBeds = [
    {
      id: "BED-001",
      number: "301-A",
      ward: "心内科病区",
      type: "普通床位",
    },
    {
      id: "BED-002",
      number: "302-B",
      ward: "神经内科病区",
      type: "普通床位",
    },
  ]

  // 示例住院病历数据
  const getMedicalRecordData = (inpatient: Inpatient) => ({
    patientInfo: {
      id: inpatient.patientId,
      name: inpatient.patientName,
      age: inpatient.age,
      gender: inpatient.gender,
      admissionNumber: `ADM-${inpatient.id}`,
      admissionDate: inpatient.admissionDate,
      admissionTime: inpatient.admissionTime,
      ward: inpatient.ward,
      room: inpatient.room,
      bedNumber: inpatient.bedNumber,
      department: inpatient.department,
      attendingDoctor: inpatient.doctor,
      residentDoctor: "住院医师",
      primaryNurse: inpatient.careTeam.find((member) => member.role === "责任护士")?.name || "护士",
    },
    admissionRecord: {
      chiefComplaint: "胸痛3天",
      historyOfPresentIllness:
        "患者3天前无明显诱因出现胸痛，为胸骨后压榨性疼痛，持续时间约10-15分钟，休息后可缓解。疼痛不向他处放射，无恶心呕吐，无大汗淋漓。今日症状加重，持续时间延长，遂来院就诊。",
      pastMedicalHistory: "高血压病史10年，糖尿病病史5年，规律服药控制。",
      familyHistory: "父亲有冠心病史，母亲有糖尿病史。",
      socialHistory: "吸烟史20年，每日1包，已戒烟2年。偶尔饮酒。",
      allergies: inpatient.allergies || [],
      medications: inpatient.medications.map((med) => `${med.name} ${med.dosage} ${med.frequency}`),
      physicalExamination:
        "T 36.5°C，P 72次/分，R 18次/分，BP 130/80mmHg。神志清楚，精神可，心界不大，心率72次/分，律齐，各瓣膜听诊区未闻及病理性杂音。双肺呼吸音清，未闻及干湿性啰音。腹部平软，无压痛反跳痛，肝脾未触及。双下肢无水肿。",
      admissionDiagnosis: inpatient.diagnosis,
      treatmentPlan: "1. 心电监护，吸氧\n2. 抗血小板聚集治疗\n3. 调脂稳定斑块\n4. 控制血压血糖\n5. 完善相关检查",
      prognosis: "经积极治疗，预后良好",
    },
    dailyRecords: {
      wardRounds: [
        {
          id: "WR-001",
          date: "2024-01-24",
          time: "09:00",
          doctor: inpatient.doctor,
          type: "daily" as const,
          chiefComplaint: "胸痛症状较前缓解",
          physicalExam: "生命体征平稳，心肺查体无异常",
          assessment: "冠心病，病情稳定",
          plan: "继续抗血小板、调脂治疗，监测心电图变化",
          urgencyLevel: "normal" as const,
        },
      ],
      nursingRecords: [
        {
          id: "NR-001",
          date: "2024-01-24",
          time: "08:00",
          nurse: "李护士",
          type: "routine" as const,
          content: "晨间护理，协助患者洗漱，更换床单位",
          observations: "患者精神状态良好，无胸痛症状",
          patientResponse: "患者配合护理，无不适主诉",
        },
      ],
      vitalSigns: [
        {
          date: "2024-01-24",
          time: "08:00",
          temperature: inpatient.vitalSigns.temperature,
          bloodPressure: inpatient.vitalSigns.bloodPressure,
          heartRate: inpatient.vitalSigns.heartRate,
          respiratoryRate: inpatient.vitalSigns.respiratoryRate,
          oxygenSaturation: inpatient.vitalSigns.oxygenSaturation,
          recordedBy: "李护士",
        },
      ],
    },
    medicalOrders: [
      {
        id: "MO-001",
        date: "2024-01-20",
        time: "15:00",
        doctor: inpatient.doctor,
        type: "medication" as const,
        content: "阿司匹林 100mg 口服 每日一次",
        frequency: "每日一次",
        duration: "长期",
        status: "active" as const,
        executionRecords: [
          {
            date: "2024-01-21",
            time: "08:00",
            executedBy: "李护士",
            notes: "患者已服药",
          },
        ],
      },
    ],
    labResults: [
      {
        id: "LAB-001",
        date: "2024-01-21",
        type: "血常规",
        results: [
          {
            test: "白细胞计数",
            value: "6.5",
            unit: "×10⁹/L",
            referenceRange: "3.5-9.5",
            status: "normal" as const,
          },
          {
            test: "血红蛋白",
            value: "135",
            unit: "g/L",
            referenceRange: "130-175",
            status: "normal" as const,
          },
        ],
        interpretation: "血常规检查结果正常",
      },
    ],
    imagingResults: [
      {
        id: "IMG-001",
        date: "2024-01-20",
        type: "胸部CT",
        findings: "双肺纹理清晰，未见明显实质性病变，心影大小正常",
        impression: "胸部CT未见异常",
        radiologist: "影像科医生",
      },
    ],
    consultations: [],
  })

  const getStatusColor = (status: AdmissionStatus | InpatientStatus, urgency?: "normal" | "urgent") => {
    if (status === "pending") {
      return urgency === "urgent" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
    }
    if (status === "approved") {
      return "bg-green-100 text-green-800"
    }
    if (status === "rejected") {
      return "bg-gray-100 text-gray-800"
    }
    if (status === "admitted") {
      return "bg-blue-100 text-blue-800"
    }
    if (status === "critical") {
      return "bg-red-100 text-red-800"
    }
    if (status === "stable") {
      return "bg-green-100 text-green-800"
    }
    if (status === "improving") {
      return "bg-teal-100 text-teal-800"
    }
    if (status === "discharged") {
      return "bg-gray-100 text-gray-800"
    }
    if (status === "transferred") {
      return "bg-purple-100 text-purple-800"
    }
    return "bg-gray-100 text-gray-800"
  }

  const getStatusLabel = (status: AdmissionStatus | InpatientStatus) => {
    const labels = {
      pending: "待审核",
      approved: "已批准",
      rejected: "已拒绝",
      admitted: "已入院",
      critical: "危重",
      stable: "稳定",
      improving: "好转中",
      discharged: "已出院",
      transferred: "已转科",
    }
    return labels[status] || "未知"
  }

  const handleApproveRequest = (bedNumber: string) => {
    if (selectedRequest) {
      console.log("批准住院申请:", selectedRequest.id, "分配床位:", bedNumber)
      setSelectedRequest(null)
    }
  }

  const handleRejectRequest = (reason: string) => {
    if (selectedRequest) {
      console.log("拒绝住院申请:", selectedRequest.id, "原因:", reason)
      setSelectedRequest(null)
    }
  }

  const handleAddInpatient = (data: any) => {
    console.log("添加住院患者:", data)
    setShowAddModal(false)
  }

  const handleDischargeInpatient = (data: any) => {
    console.log("办理出院:", data)
    setShowDischargeModal(false)
  }

  const handleWardRound = (data: any) => {
    console.log("查房记录:", data)
    setShowWardRoundModal(false)
  }

  const handleCareUpdate = (data: any) => {
    console.log("更新护理计划:", data)
    setShowCareModal(false)
  }

  const handleUpdateMedicalRecord = (data: any) => {
    console.log("更新住院病历:", data)
  }

  const toggleExpandPatient = (id: string) => {
    if (expandedPatient === id) {
      setExpandedPatient(null)
    } else {
      setExpandedPatient(id)
    }
  }

  const filteredRequests = admissionRequests.filter((request) => {
    const matchesSearch =
      request.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.doctor.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !selectedStatus || request.status === selectedStatus
    const matchesDepartment = !selectedDepartment || request.department === selectedDepartment
    return matchesSearch && matchesStatus && matchesDepartment
  })

  const filteredInpatients = inpatients.filter((inpatient) => {
    const matchesSearch =
      inpatient.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inpatient.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inpatient.doctor.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !selectedStatus || inpatient.status === selectedStatus
    const matchesDepartment = !selectedDepartment || inpatient.department === selectedDepartment
    const matchesWard = !selectedWard || inpatient.ward === selectedWard
    return matchesSearch && matchesStatus && matchesDepartment && matchesWard
  })

  const renderRequestsView = () => (
    <div className="space-y-4">
      {filteredRequests.map((request) => (
        <div key={request.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center">
                  <h3 className="font-semibold text-gray-800">{request.patientName}</h3>
                  <span className="ml-2 text-sm text-gray-500">({request.patientId})</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {request.age}岁 • {request.gender}
                </p>
              </div>
              <div className="flex space-x-2">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    request.urgency === "urgent" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {request.urgency === "urgent" ? "紧急" : "普通"}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(request.status, request.urgency)}`}>
                  {getStatusLabel(request.status)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">申请科室</p>
                <p className="font-medium">{request.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">申请医生</p>
                <p className="font-medium">{request.doctor}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">申请时间</p>
                <p className="font-medium">
                  {request.requestDate} {request.requestTime}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">预计住院时间</p>
                <p className="font-medium">{request.expectedStayDuration}天</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-700 mb-2">诊断信息</h4>
              <p className="text-sm text-gray-600">{request.diagnosis}</p>
              <p className="text-sm text-gray-600 mt-2">住院原因：{request.reason}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">医保类型</p>
                <p className="font-medium">{request.insuranceType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">联系人信息</p>
                <p className="font-medium">
                  {request.contactPerson.name} ({request.contactPerson.relationship})
                  <span className="text-sm text-gray-500 ml-2">{request.contactPerson.phone}</span>
                </p>
              </div>
            </div>

            {request.status === "pending" && (
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedRequest(request)}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
                >
                  审核
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )

  const renderInpatientsView = () => (
    <div className="space-y-4">
      {filteredInpatients.map((inpatient) => (
        <div key={inpatient.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div
            className="p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
            onClick={() => toggleExpandPatient(inpatient.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                  <Users size={20} className="text-primary-600" />
                </div>
                <div>
                  <div className="flex items-center">
                    <h3 className="font-semibold text-gray-800">{inpatient.patientName}</h3>
                    <span className="ml-2 text-sm text-gray-500">({inpatient.patientId})</span>
                    <span className={`ml-3 px-2 py-1 text-xs rounded-full ${getStatusColor(inpatient.status)}`}>
                      {getStatusLabel(inpatient.status)}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <span>
                      {inpatient.age}岁 • {inpatient.gender}
                    </span>
                    <span className="mx-2">|</span>
                    <span>
                      {inpatient.ward} {inpatient.bedNumber}床
                    </span>
                    <span className="mx-2">|</span>
                    <span>住院{inpatient.lengthOfStay}天</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="mr-4">
                  {inpatient.lastRound && (
                    <div className="text-xs text-gray-500">最近查房: {inpatient.lastRound.date}</div>
                  )}
                </div>
                {expandedPatient === inpatient.id ? (
                  <ChevronDown size={20} className="text-gray-400" />
                ) : (
                  <ChevronRight size={20} className="text-gray-400" />
                )}
              </div>
            </div>
          </div>

          {expandedPatient === inpatient.id && (
            <div className="p-4 bg-gray-50">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 左侧：基本信息和生命体征 */}
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="font-medium text-gray-700 mb-3">基本信息</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">入院日期</span>
                        <span className="text-sm font-medium">{inpatient.admissionDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">主治医生</span>
                        <span className="text-sm font-medium">{inpatient.doctor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">科室</span>
                        <span className="text-sm font-medium">{inpatient.department}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">护理级别</span>
                        <span className="text-sm font-medium">
                          {inpatient.nursingLevel === "standard"
                            ? "普通护理"
                            : inpatient.nursingLevel === "intermediate"
                              ? "中级护理"
                              : "重症护理"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">饮食</span>
                        <span className="text-sm font-medium">{inpatient.dietType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">活动</span>
                        <span className="text-sm font-medium">{inpatient.activityLevel}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="font-medium text-gray-700 mb-3">生命体征</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">体温</span>
                        <span
                          className={`text-sm font-medium ${
                            inpatient.vitalSigns.temperature > 37.5 ? "text-red-600" : "text-gray-800"
                          }`}
                        >
                          {inpatient.vitalSigns.temperature}°C
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">血压</span>
                        <span className="text-sm font-medium">{inpatient.vitalSigns.bloodPressure} mmHg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">心率</span>
                        <span
                          className={`text-sm font-medium ${
                            inpatient.vitalSigns.heartRate > 100 ? "text-red-600" : "text-gray-800"
                          }`}
                        >
                          {inpatient.vitalSigns.heartRate} bpm
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">呼吸</span>
                        <span
                          className={`text-sm font-medium ${
                            inpatient.vitalSigns.respiratoryRate > 24 ? "text-red-600" : "text-gray-800"
                          }`}
                        >
                          {inpatient.vitalSigns.respiratoryRate} /min
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">血氧</span>
                        <span
                          className={`text-sm font-medium ${
                            inpatient.vitalSigns.oxygenSaturation < 95 ? "text-red-600" : "text-gray-800"
                          }`}
                        >
                          {inpatient.vitalSigns.oxygenSaturation}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 中间：诊断和医嘱 */}
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="font-medium text-gray-700 mb-3">诊断</h4>
                    <div className="space-y-2">
                      {inpatient.diagnosis.map((diag, index) => (
                        <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                          <span className="text-sm text-blue-800">{diag}</span>
                        </div>
                      ))}
                      {inpatient.complications.length > 0 && (
                        <div className="mt-3">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">并发症</h5>
                          {inpatient.complications.map((comp, index) => (
                            <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-2 mb-2">
                              <span className="text-sm text-red-800">{comp}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-700">医嘱</h4>
                      <span className="text-xs text-gray-500">
                        {inpatient.orders.filter((o) => o.status === "active").length} 条活动医嘱
                      </span>
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {inpatient.orders
                        .filter((order) => order.status === "active")
                        .map((order) => (
                          <div key={order.id} className="border-l-2 border-primary-500 pl-2 py-1">
                            <div className="text-sm font-medium text-gray-800">{order.name}</div>
                            <div className="text-xs text-gray-500">
                              {order.orderedDate} • {order.orderedBy}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* 右侧：进展记录和操作 */}
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="font-medium text-gray-700 mb-3">进展记录</h4>
                    <div className="space-y-3 max-h-40 overflow-y-auto">
                      {inpatient.progressNotes
                        .sort(
                          (a, b) =>
                            new Date(b.date + " " + b.time).getTime() - new Date(a.date + " " + a.time).getTime(),
                        )
                        .slice(0, 3)
                        .map((note) => (
                          <div key={note.id} className="border-l-2 border-gray-300 pl-2 py-1">
                            <div className="text-xs text-gray-500">
                              {note.date} {note.time} • {note.author}
                            </div>
                            <div className="text-sm text-gray-800 mt-1">{note.content}</div>
                          </div>
                        ))}
                    </div>
                    {inpatient.progressNotes.length > 3 && (
                      <div className="mt-2 text-center">
                        <button className="text-xs text-primary-600 hover:text-primary-700">
                          查看全部 {inpatient.progressNotes.length} 条记录
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="font-medium text-gray-700 mb-3">操作</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setSelectedInpatient(inpatient)
                          setShowMedicalRecord(true)
                        }}
                        className="flex items-center justify-center px-3 py-2 text-sm text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100"
                      >
                        <BookOpen size={16} className="mr-1" />
                        住院病历
                      </button>
                      <button
                        onClick={() => {
                          setSelectedInpatient(inpatient)
                          setShowWardRoundModal(true)
                        }}
                        className="flex items-center justify-center px-3 py-2 text-sm text-green-600 bg-green-50 rounded-lg hover:bg-green-100"
                      >
                        <Stethoscope size={16} className="mr-1" />
                        查房记录
                      </button>
                      <button
                        onClick={() => {
                          setSelectedInpatient(inpatient)
                          setShowCareModal(true)
                        }}
                        className="flex items-center justify-center px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                      >
                        <Heart size={16} className="mr-1" />
                        护理计划
                      </button>
                      <button
                        onClick={() => {
                          setSelectedInpatient(inpatient)
                          setShowDetailsModal(true)
                        }}
                        className="flex items-center justify-center px-3 py-2 text-sm text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100"
                      >
                        <FileText size={16} className="mr-1" />
                        详细信息
                      </button>
                      <button
                        onClick={() => {
                          setSelectedInpatient(inpatient)
                          setShowDischargeModal(true)
                        }}
                        className="flex items-center justify-center px-3 py-2 text-sm text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 col-span-2"
                      >
                        <ArrowRight size={16} className="mr-1" />
                        办理出院
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )

  const renderWardRoundsView = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">今日查房计划</h3>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">病区</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">医生</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  查房时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  患者数
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">心内科病区</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">张医生</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">09:00 - 10:30</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">12</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    已完成
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-primary-600 hover:text-primary-900">查看记录</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">神经内科病区</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">王医生</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">10:00 - 11:30</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">8</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    进行中
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-primary-600 hover:text-primary-900">查看记录</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">呼吸科病区</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">刘医生</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">14:00 - 15:30</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">10</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                    未开始
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-primary-600 hover:text-primary-900">安排查房</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">需要关注的患者</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {inpatients
            .filter((patient) => patient.status === "critical" || patient.complications.length > 0)
            .map((patient) => (
              <div key={patient.id} className="border border-red-200 bg-red-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-gray-800">{patient.patientName}</div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(patient.status)}`}>
                    {getStatusLabel(patient.status)}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {patient.ward} {patient.bedNumber}床 • {patient.doctor}
                </div>
                <div className="text-sm text-red-600">
                  {patient.complications.length > 0 ? (
                    <>
                      <span className="font-medium">并发症：</span>
                      {patient.complications.join("、")}
                    </>
                  ) : (
                    <span className="font-medium">需要密切监测</span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setSelectedInpatient(patient)
                    setShowWardRoundModal(true)
                  }}
                  className="mt-2 w-full px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700"
                >
                  立即查房
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  )

  const renderCareView = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">护理任务</h3>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">患者</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">床位</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">任务</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  计划时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">王五</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">心内科病区 301-A</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">测量生命体征</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">08:00</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    已完成
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-primary-600 hover:text-primary-900">查看详情</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">赵六</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">神经内科病区 205-B</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">静脉给药</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">10:00</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    待执行
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-primary-600 hover:text-primary-900">执行</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">钱七</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">呼吸科病区 402-C</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">吸氧治疗</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">持续</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    进行中
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-primary-600 hover:text-primary-900">调整</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">护理评估</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {inpatients.map((patient) => (
            <div key={patient.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-gray-800">{patient.patientName}</div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    patient.nursingLevel === "intensive"
                      ? "bg-red-100 text-red-800"
                      : patient.nursingLevel === "intermediate"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                  }`}
                >
                  {patient.nursingLevel === "intensive"
                    ? "重症护理"
                    : patient.nursingLevel === "intermediate"
                      ? "中级护理"
                      : "普通护理"}
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-2">
                {patient.ward} {patient.bedNumber}床 • 住院{patient.lengthOfStay}天
              </div>
              <div className="text-sm text-gray-600 mb-3">
                <div>
                  <span className="font-medium">饮食：</span>
                  {patient.dietType}
                </div>
                <div>
                  <span className="font-medium">活动：</span>
                  {patient.activityLevel}
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedInpatient(patient)
                  setShowCareModal(true)
                }}
                className="w-full px-3 py-1 text-sm text-primary-600 border border-primary-600 rounded hover:bg-primary-50"
              >
                更新护理计划
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">住院管理</h1>
          <p className="text-gray-600">管理住院患者和病房分配</p>
        </div>

        <div className="mt-4 md:mt-0 flex space-x-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 flex items-center"
          >
            <Plus size={16} className="mr-1" />
            新增住院
          </button>
        </div>
      </div>

      {/* 视图切换 */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setCurrentView("list")}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              currentView === "list" ? "bg-primary-100 text-primary-700" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Users size={16} className="inline mr-2" />
            住院患者
          </button>
          <button
            onClick={() => setCurrentView("requests")}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              currentView === "requests" ? "bg-primary-100 text-primary-700" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Clipboard size={16} className="inline mr-2" />
            住院申请
            {filteredRequests.filter((r) => r.status === "pending").length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded-full">
                {filteredRequests.filter((r) => r.status === "pending").length}
              </span>
            )}
          </button>
          <button
            onClick={() => setCurrentView("rounds")}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              currentView === "rounds" ? "bg-primary-100 text-primary-700" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Stethoscope size={16} className="inline mr-2" />
            查房管理
          </button>
          <button
            onClick={() => setCurrentView("care")}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              currentView === "care" ? "bg-primary-100 text-primary-700" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Heart size={16} className="inline mr-2" />
            护理管理
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BedDouble size={24} className="text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">在院患者</p>
              <p className="text-2xl font-semibold text-gray-800">
                {inpatients.filter((p) => p.status !== "discharged").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">危重患者</p>
              <p className="text-2xl font-semibold text-gray-800">
                {inpatients.filter((p) => p.status === "critical").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock size={24} className="text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">待审核申请</p>
              <p className="text-2xl font-semibold text-gray-800">
                {admissionRequests.filter((r) => r.status === "pending").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Building2 size={24} className="text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">可用床位</p>
              <p className="text-2xl font-semibold text-gray-800">{availableBeds.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="搜索患者姓名、ID或医生..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">全部状态</option>
              {currentView === "requests" ? (
                <>
                  <option value="pending">待审核</option>
                  <option value="approved">已批准</option>
                  <option value="rejected">已拒绝</option>
                </>
              ) : (
                <>
                  <option value="admitted">已入院</option>
                  <option value="critical">危重</option>
                  <option value="stable">稳定</option>
                  <option value="improving">好转中</option>
                  <option value="discharged">已出院</option>
                </>
              )}
            </select>

            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">全部科室</option>
              <option value="心内科">心内科</option>
              <option value="神经内科">神经内科</option>
              <option value="呼吸科">呼吸科</option>
              <option value="消化科">消化科</option>
            </select>

            {currentView === "list" && (
              <select
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">全部病区</option>
                <option value="心内科病区">心内科病区</option>
                <option value="神经内科病区">神经内科病区</option>
                <option value="呼吸科病区">呼吸科病区</option>
              </select>
            )}
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      {currentView === "requests" && renderRequestsView()}
      {currentView === "list" && renderInpatientsView()}
      {currentView === "rounds" && renderWardRoundsView()}
      {currentView === "care" && renderCareView()}

      {/* 模态框 */}
      {selectedRequest && (
        <AdmissionRequestModal
          isOpen={true}
          onClose={() => setSelectedRequest(null)}
          request={selectedRequest}
          availableBeds={availableBeds}
          onApprove={handleApproveRequest}
          onReject={handleRejectRequest}
        />
      )}

      {showAddModal && (
        <AddInpatientModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSubmit={handleAddInpatient} />
      )}

      {showDeleteModal && selectedInpatient && (
        <DeleteInpatientModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          inpatient={selectedInpatient}
          onConfirm={() => {
            console.log("删除住院患者:", selectedInpatient.id)
            setShowDeleteModal(false)
            setSelectedInpatient(null)
          }}
        />
      )}

      {showWardRoundModal && selectedInpatient && (
        <WardRoundModal
          isOpen={showWardRoundModal}
          onClose={() => setShowWardRoundModal(false)}
          inpatient={selectedInpatient}
          onSubmit={handleWardRound}
        />
      )}

      {showDetailsModal && selectedInpatient && (
        <InpatientDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          inpatient={selectedInpatient}
        />
      )}

      {showCareModal && selectedInpatient && (
        <InpatientCareModal
          isOpen={showCareModal}
          onClose={() => setShowCareModal(false)}
          inpatient={selectedInpatient}
          onSubmit={handleCareUpdate}
        />
      )}

      {showDischargeModal && selectedInpatient && (
        <DischargeModal
          isOpen={showDischargeModal}
          onClose={() => setShowDischargeModal(false)}
          inpatient={selectedInpatient}
          onSubmit={handleDischargeInpatient}
        />
      )}

      {showMedicalRecord && selectedInpatient && (
        <InpatientMedicalRecord
          isOpen={showMedicalRecord}
          onClose={() => setShowMedicalRecord(false)}
          patientId={selectedInpatient.patientId}
          recordData={getMedicalRecordData(selectedInpatient)}
          onUpdateRecord={handleUpdateMedicalRecord}
        />
      )}
    </div>
  )
}

export default Inpatients
