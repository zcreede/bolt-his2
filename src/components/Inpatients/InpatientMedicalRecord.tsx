"use client"

import type React from "react"
import { useState } from "react"
import {
  X,
  FileText,
  Stethoscope,
  Heart,
  Pill,
  Activity,
  Calendar,
  User,
  Edit,
  Plus,
  AlertTriangle,
  CheckCircle,
  Eye,
  Download,
  Printer,
} from "lucide-react"

interface VitalSigns {
  date: string
  time: string
  temperature: number
  bloodPressure: string
  heartRate: number
  respiratoryRate: number
  oxygenSaturation: number
  recordedBy: string
}

interface WardRound {
  id: string
  date: string
  time: string
  doctor: string
  type: "daily" | "emergency" | "consultation"
  chiefComplaint: string
  physicalExam: string
  assessment: string
  plan: string
  nextRoundDate?: string
  urgencyLevel: "normal" | "attention" | "urgent"
}

interface NursingRecord {
  id: string
  date: string
  time: string
  nurse: string
  type: "routine" | "medication" | "procedure" | "observation"
  content: string
  vitalSigns?: VitalSigns
  medicationGiven?: {
    name: string
    dosage: string
    route: string
    time: string
  }[]
  observations: string
  patientResponse: string
}

interface MedicalOrder {
  id: string
  date: string
  time: string
  doctor: string
  type: "medication" | "lab" | "imaging" | "procedure" | "nursing" | "diet" | "activity"
  content: string
  frequency?: string
  duration?: string
  status: "active" | "completed" | "cancelled" | "discontinued"
  executionRecords?: {
    date: string
    time: string
    executedBy: string
    notes?: string
  }[]
}

interface InpatientMedicalRecordData {
  patientInfo: {
    id: string
    name: string
    age: number
    gender: string
    admissionNumber: string
    admissionDate: string
    admissionTime: string
    ward: string
    room: string
    bedNumber: string
    department: string
    attendingDoctor: string
    residentDoctor?: string
    primaryNurse: string
  }
  admissionRecord: {
    chiefComplaint: string
    historyOfPresentIllness: string
    pastMedicalHistory: string
    familyHistory: string
    socialHistory: string
    allergies: string[]
    medications: string[]
    physicalExamination: string
    admissionDiagnosis: string[]
    treatmentPlan: string
    prognosis: string
  }
  dailyRecords: {
    wardRounds: WardRound[]
    nursingRecords: NursingRecord[]
    vitalSigns: VitalSigns[]
  }
  medicalOrders: MedicalOrder[]
  labResults: Array<{
    id: string
    date: string
    type: string
    results: Array<{
      test: string
      value: string
      unit: string
      referenceRange: string
      status: "normal" | "abnormal" | "critical"
    }>
    interpretation: string
  }>
  imagingResults: Array<{
    id: string
    date: string
    type: string
    findings: string
    impression: string
    radiologist: string
  }>
  consultations: Array<{
    id: string
    date: string
    department: string
    consultant: string
    reason: string
    findings: string
    recommendations: string
  }>
  dischargeInfo?: {
    dischargeDate: string
    dischargeTime: string
    dischargeDiagnosis: string[]
    condition: string
    instructions: string
    followUpPlan: string
    medications: Array<{
      name: string
      dosage: string
      frequency: string
      duration: string
    }>
  }
}

interface InpatientMedicalRecordProps {
  isOpen: boolean
  onClose: () => void
  patientId: string
  recordData: InpatientMedicalRecordData
  onUpdateRecord: (data: Partial<InpatientMedicalRecordData>) => void
}

const InpatientMedicalRecord: React.FC<InpatientMedicalRecordProps> = ({
  isOpen,
  onClose,
  patientId,
  recordData,
  onUpdateRecord,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "admission" | "daily" | "orders" | "results" | "discharge">(
    "overview",
  )
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState<{ type: "round" | "nursing" | "order" | null }>({ type: null })

  if (!isOpen) return null

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* 患者基本信息 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-800">患者信息</h3>
          <button className="text-primary-600 hover:text-primary-700 text-sm">
            <Edit size={14} className="inline mr-1" />
            编辑
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">住院号</p>
            <p className="font-medium">{recordData.patientInfo.admissionNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">姓名</p>
            <p className="font-medium">{recordData.patientInfo.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">年龄/性别</p>
            <p className="font-medium">
              {recordData.patientInfo.age}岁 / {recordData.patientInfo.gender}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">入院日期</p>
            <p className="font-medium">
              {recordData.patientInfo.admissionDate} {recordData.patientInfo.admissionTime}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">病区/床位</p>
            <p className="font-medium">
              {recordData.patientInfo.ward} {recordData.patientInfo.bedNumber}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">主治医师</p>
            <p className="font-medium">{recordData.patientInfo.attendingDoctor}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">住院医师</p>
            <p className="font-medium">{recordData.patientInfo.residentDoctor || "未分配"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">责任护士</p>
            <p className="font-medium">{recordData.patientInfo.primaryNurse}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">科室</p>
            <p className="font-medium">{recordData.patientInfo.department}</p>
          </div>
        </div>
      </div>

      {/* 当前诊断 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">当前诊断</h3>
        <div className="space-y-2">
          {recordData.admissionRecord.admissionDiagnosis.map((diagnosis, index) => (
            <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <span className="text-blue-800 font-medium">
                {index + 1}. {diagnosis}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 最新生命体征 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">最新生命体征</h3>
        {recordData.dailyRecords.vitalSigns.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {(() => {
              const latest = recordData.dailyRecords.vitalSigns[recordData.dailyRecords.vitalSigns.length - 1]
              return (
                <>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-500 mb-1">体温</p>
                    <p
                      className={`text-xl font-semibold ${
                        latest.temperature > 37.5 ? "text-red-600" : "text-gray-800"
                      }`}
                    >
                      {latest.temperature}°C
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-500 mb-1">血压</p>
                    <p className="text-xl font-semibold text-gray-800">{latest.bloodPressure}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-500 mb-1">心率</p>
                    <p className={`text-xl font-semibold ${latest.heartRate > 100 ? "text-red-600" : "text-gray-800"}`}>
                      {latest.heartRate}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-500 mb-1">呼吸</p>
                    <p
                      className={`text-xl font-semibold ${
                        latest.respiratoryRate > 24 ? "text-red-600" : "text-gray-800"
                      }`}
                    >
                      {latest.respiratoryRate}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-500 mb-1">血氧</p>
                    <p
                      className={`text-xl font-semibold ${
                        latest.oxygenSaturation < 95 ? "text-red-600" : "text-gray-800"
                      }`}
                    >
                      {latest.oxygenSaturation}%
                    </p>
                  </div>
                </>
              )
            })()}
          </div>
        )}
        <div className="mt-3 text-xs text-gray-500">
          记录时间: {recordData.dailyRecords.vitalSigns[recordData.dailyRecords.vitalSigns.length - 1]?.date}{" "}
          {recordData.dailyRecords.vitalSigns[recordData.dailyRecords.vitalSigns.length - 1]?.time}
        </div>
      </div>

      {/* 活动医嘱概览 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-800">活动医嘱</h3>
          <span className="text-sm text-gray-500">
            {recordData.medicalOrders.filter((order) => order.status === "active").length} 条活动医嘱
          </span>
        </div>
        <div className="space-y-2">
          {recordData.medicalOrders
            .filter((order) => order.status === "active")
            .slice(0, 5)
            .map((order) => (
              <div key={order.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <div>
                  <span className="text-sm font-medium text-gray-800">{order.content}</span>
                  {order.frequency && <span className="text-xs text-gray-500 ml-2">• {order.frequency}</span>}
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    order.type === "medication"
                      ? "bg-green-100 text-green-800"
                      : order.type === "lab"
                        ? "bg-purple-100 text-purple-800"
                        : order.type === "imaging"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {order.type === "medication"
                    ? "用药"
                    : order.type === "lab"
                      ? "检验"
                      : order.type === "imaging"
                        ? "影像"
                        : order.type === "procedure"
                          ? "操作"
                          : order.type === "nursing"
                            ? "护理"
                            : order.type === "diet"
                              ? "饮食"
                              : order.type === "activity"
                                ? "活动"
                                : "其他"}
                </span>
              </div>
            ))}
          {recordData.medicalOrders.filter((order) => order.status === "active").length > 5 && (
            <div className="text-center">
              <button
                onClick={() => setActiveTab("orders")}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                查看全部 {recordData.medicalOrders.filter((order) => order.status === "active").length} 条医嘱
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 最近查房记录 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-800">最近查房记录</h3>
          <button onClick={() => setActiveTab("daily")} className="text-sm text-primary-600 hover:text-primary-700">
            查看全部
          </button>
        </div>
        {recordData.dailyRecords.wardRounds.length > 0 && (
          <div className="space-y-3">
            {recordData.dailyRecords.wardRounds
              .sort((a, b) => new Date(b.date + " " + b.time).getTime() - new Date(a.date + " " + a.time).getTime())
              .slice(0, 2)
              .map((round) => (
                <div key={round.id} className="border-l-4 border-primary-500 pl-4 py-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-800">{round.doctor}</span>
                      <span className="ml-2 text-xs text-gray-500">
                        {round.type === "daily" ? "日常查房" : round.type === "emergency" ? "急诊查房" : "会诊"}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {round.date} {round.time}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>
                      <strong>主诉：</strong>
                      {round.chiefComplaint}
                    </p>
                    <p>
                      <strong>评估：</strong>
                      {round.assessment}
                    </p>
                    <p>
                      <strong>计划：</strong>
                      {round.plan}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )

  const renderAdmissionTab = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-800">入院记录</h3>
          <button
            onClick={() => setEditingSection("admission")}
            className="text-primary-600 hover:text-primary-700 text-sm"
          >
            <Edit size={14} className="inline mr-1" />
            编辑
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">主诉</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-800">{recordData.admissionRecord.chiefComplaint}</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-2">现病史</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-800 whitespace-pre-wrap">{recordData.admissionRecord.historyOfPresentIllness}</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-2">既往史</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-800">{recordData.admissionRecord.pastMedicalHistory}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">家族史</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-800">{recordData.admissionRecord.familyHistory}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-2">社会史</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-800">{recordData.admissionRecord.socialHistory}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-2">过敏史</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              {recordData.admissionRecord.allergies.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {recordData.admissionRecord.allergies.map((allergy, index) => (
                    <span key={index} className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                      {allergy}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-800">无已知过敏史</p>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-2">体格检查</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-800 whitespace-pre-wrap">{recordData.admissionRecord.physicalExamination}</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-2">入院诊断</h4>
            <div className="space-y-2">
              {recordData.admissionRecord.admissionDiagnosis.map((diagnosis, index) => (
                <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <span className="text-blue-800 font-medium">
                    {index + 1}. {diagnosis}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-2">治疗计划</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-800 whitespace-pre-wrap">{recordData.admissionRecord.treatmentPlan}</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-2">预后</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-800">{recordData.admissionRecord.prognosis}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderDailyTab = () => (
    <div className="space-y-6">
      {/* 查房记录 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-800">查房记录</h3>
          <button
            onClick={() => setShowAddModal({ type: "round" })}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
          >
            <Plus size={16} className="mr-1" />
            添加查房记录
          </button>
        </div>

        <div className="space-y-4">
          {recordData.dailyRecords.wardRounds
            .sort((a, b) => new Date(b.date + " " + b.time).getTime() - new Date(a.date + " " + a.time).getTime())
            .map((round) => (
              <div key={round.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Stethoscope size={16} className="text-primary-600 mr-2" />
                    <span className="font-medium text-gray-800">{round.doctor}</span>
                    <span
                      className={`ml-3 px-2 py-1 text-xs rounded-full ${
                        round.urgencyLevel === "urgent"
                          ? "bg-red-100 text-red-800"
                          : round.urgencyLevel === "attention"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {round.urgencyLevel === "urgent"
                        ? "紧急"
                        : round.urgencyLevel === "attention"
                          ? "需关注"
                          : "正常"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {round.date} {round.time}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700">主诉</h5>
                    <p className="text-sm text-gray-600 mt-1">{round.chiefComplaint}</p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-700">体格检查</h5>
                    <p className="text-sm text-gray-600 mt-1">{round.physicalExam}</p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-700">评估</h5>
                    <p className="text-sm text-gray-600 mt-1">{round.assessment}</p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-700">计划</h5>
                    <p className="text-sm text-gray-600 mt-1">{round.plan}</p>
                  </div>
                  {round.nextRoundDate && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar size={14} className="mr-1" />
                      下次查房: {round.nextRoundDate}
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* 护理记录 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-800">护理记录</h3>
          <button
            onClick={() => setShowAddModal({ type: "nursing" })}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <Plus size={16} className="mr-1" />
            添加护理记录
          </button>
        </div>

        <div className="space-y-4">
          {recordData.dailyRecords.nursingRecords
            .sort((a, b) => new Date(b.date + " " + b.time).getTime() - new Date(a.date + " " + a.time).getTime())
            .map((record) => (
              <div key={record.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Heart size={16} className="text-pink-600 mr-2" />
                    <span className="font-medium text-gray-800">{record.nurse}</span>
                    <span
                      className={`ml-3 px-2 py-1 text-xs rounded-full ${
                        record.type === "routine"
                          ? "bg-blue-100 text-blue-800"
                          : record.type === "medication"
                            ? "bg-green-100 text-green-800"
                            : record.type === "procedure"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {record.type === "routine"
                        ? "常规护理"
                        : record.type === "medication"
                          ? "给药护理"
                          : record.type === "procedure"
                            ? "操作护理"
                            : "观察护理"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {record.date} {record.time}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700">护理内容</h5>
                    <p className="text-sm text-gray-600 mt-1">{record.content}</p>
                  </div>

                  {record.medicationGiven && record.medicationGiven.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700">给药记录</h5>
                      <div className="mt-1 space-y-1">
                        {record.medicationGiven.map((med, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            {med.name} {med.dosage} {med.route} - {med.time}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h5 className="text-sm font-medium text-gray-700">观察记录</h5>
                    <p className="text-sm text-gray-600 mt-1">{record.observations}</p>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-gray-700">患者反应</h5>
                    <p className="text-sm text-gray-600 mt-1">{record.patientResponse}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* 生命体征趋势 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">生命体征记录</h3>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">日期时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">体温(°C)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">血压(mmHg)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">心率(bpm)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">呼吸(/min)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">血氧(%)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">记录者</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recordData.dailyRecords.vitalSigns
                .sort((a, b) => new Date(b.date + " " + b.time).getTime() - new Date(a.date + " " + a.time).getTime())
                .map((vital, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vital.date} {vital.time}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        vital.temperature > 37.5 ? "text-red-600" : "text-gray-900"
                      }`}
                    >
                      {vital.temperature}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vital.bloodPressure}</td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        vital.heartRate > 100 || vital.heartRate < 60 ? "text-red-600" : "text-gray-900"
                      }`}
                    >
                      {vital.heartRate}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        vital.respiratoryRate > 24 || vital.respiratoryRate < 12 ? "text-red-600" : "text-gray-900"
                      }`}
                    >
                      {vital.respiratoryRate}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        vital.oxygenSaturation < 95 ? "text-red-600" : "text-gray-900"
                      }`}
                    >
                      {vital.oxygenSaturation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vital.recordedBy}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderOrdersTab = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-800">医嘱管理</h3>
          <button
            onClick={() => setShowAddModal({ type: "order" })}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
          >
            <Plus size={16} className="mr-1" />
            开具医嘱
          </button>
        </div>

        {/* 活动医嘱 */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-3">活动医嘱</h4>
          <div className="space-y-3">
            {recordData.medicalOrders
              .filter((order) => order.status === "active")
              .map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span
                        className={`px-2 py-1 text-xs rounded-full mr-3 ${
                          order.type === "medication"
                            ? "bg-green-100 text-green-800"
                            : order.type === "lab"
                              ? "bg-purple-100 text-purple-800"
                              : order.type === "imaging"
                                ? "bg-blue-100 text-blue-800"
                                : order.type === "procedure"
                                  ? "bg-red-100 text-red-800"
                                  : order.type === "nursing"
                                    ? "bg-pink-100 text-pink-800"
                                    : order.type === "diet"
                                      ? "bg-orange-100 text-orange-800"
                                      : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.type === "medication"
                          ? "用药"
                          : order.type === "lab"
                            ? "检验"
                            : order.type === "imaging"
                              ? "影像"
                              : order.type === "procedure"
                                ? "操作"
                                : order.type === "nursing"
                                  ? "护理"
                                  : order.type === "diet"
                                    ? "饮食"
                                    : order.type === "activity"
                                      ? "活动"
                                      : "其他"}
                      </span>
                      <span className="font-medium text-gray-800">{order.content}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-xs text-blue-600 hover:text-blue-700">修改</button>
                      <button className="text-xs text-red-600 hover:text-red-700">停止</button>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 mb-2">
                    {order.frequency && <span>频次: {order.frequency}</span>}
                    {order.duration && <span className="ml-4">疗程: {order.duration}</span>}
                  </div>

                  <div className="text-xs text-gray-500">
                    开具时间: {order.date} {order.time} • 开具医生: {order.doctor}
                  </div>

                  {/* 执行记录 */}
                  {order.executionRecords && order.executionRecords.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <h6 className="text-xs font-medium text-gray-700 mb-2">执行记录</h6>
                      <div className="space-y-1">
                        {order.executionRecords.slice(-3).map((execution, index) => (
                          <div key={index} className="text-xs text-gray-600">
                            {execution.date} {execution.time} - {execution.executedBy}
                            {execution.notes && <span className="ml-2 text-gray-500">({execution.notes})</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* 已完成医嘱 */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3">已完成医嘱</h4>
          <div className="space-y-3">
            {recordData.medicalOrders
              .filter((order) => order.status === "completed")
              .slice(0, 5)
              .map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="px-2 py-1 text-xs rounded-full mr-3 bg-gray-100 text-gray-600">
                        {order.type === "medication"
                          ? "用药"
                          : order.type === "lab"
                            ? "检验"
                            : order.type === "imaging"
                              ? "影像"
                              : order.type === "procedure"
                                ? "操作"
                                : order.type === "nursing"
                                  ? "护理"
                                  : order.type === "diet"
                                    ? "饮食"
                                    : order.type === "activity"
                                      ? "活动"
                                      : "其他"}
                      </span>
                      <span className="font-medium text-gray-700">{order.content}</span>
                    </div>
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">已完成</span>
                  </div>

                  <div className="text-xs text-gray-500">
                    开具时间: {order.date} {order.time} • 开具医生: {order.doctor}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderResultsTab = () => (
    <div className="space-y-6">
      {/* 检验结果 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">检验结果</h3>

        <div className="space-y-4">
          {recordData.labResults.map((result) => (
            <div key={result.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-800">{result.type}</h4>
                <div className="text-sm text-gray-500">{result.date}</div>
              </div>

              <div className="overflow-x-auto mb-3">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left text-xs font-medium text-gray-500 py-2">检验项目</th>
                      <th className="text-left text-xs font-medium text-gray-500 py-2">结果</th>
                      <th className="text-left text-xs font-medium text-gray-500 py-2">单位</th>
                      <th className="text-left text-xs font-medium text-gray-500 py-2">参考范围</th>
                      <th className="text-left text-xs font-medium text-gray-500 py-2">状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.results.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-2 text-sm text-gray-800">{item.test}</td>
                        <td
                          className={`py-2 text-sm font-medium ${
                            item.status === "normal"
                              ? "text-green-600"
                              : item.status === "abnormal"
                                ? "text-yellow-600"
                                : "text-red-600"
                          }`}
                        >
                          {item.value}
                        </td>
                        <td className="py-2 text-sm text-gray-600">{item.unit}</td>
                        <td className="py-2 text-sm text-gray-600">{item.referenceRange}</td>
                        <td className="py-2">
                          {item.status === "normal" && <CheckCircle size={16} className="text-green-600" />}
                          {item.status === "abnormal" && <AlertTriangle size={16} className="text-yellow-600" />}
                          {item.status === "critical" && <AlertTriangle size={16} className="text-red-600" />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {result.interpretation && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h5 className="text-sm font-medium text-blue-800 mb-1">解读</h5>
                  <p className="text-sm text-blue-700">{result.interpretation}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 影像结果 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">影像结果</h3>

        <div className="space-y-4">
          {recordData.imagingResults.map((result) => (
            <div key={result.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-800">{result.type}</h4>
                <div className="text-sm text-gray-500">{result.date}</div>
              </div>

              <div className="space-y-3">
                <div>
                  <h5 className="text-sm font-medium text-gray-700">影像所见</h5>
                  <p className="text-sm text-gray-600 mt-1">{result.findings}</p>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-gray-700">影像诊断</h5>
                  <p className="text-sm text-gray-600 mt-1">{result.impression}</p>
                </div>

                <div className="text-xs text-gray-500">报告医生: {result.radiologist}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 会诊记录 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">会诊记录</h3>

        <div className="space-y-4">
          {recordData.consultations.map((consultation) => (
            <div key={consultation.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-800">{consultation.department}会诊</h4>
                  <p className="text-sm text-gray-600">会诊医生: {consultation.consultant}</p>
                </div>
                <div className="text-sm text-gray-500">{consultation.date}</div>
              </div>

              <div className="space-y-3">
                <div>
                  <h5 className="text-sm font-medium text-gray-700">会诊原因</h5>
                  <p className="text-sm text-gray-600 mt-1">{consultation.reason}</p>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-gray-700">会诊意见</h5>
                  <p className="text-sm text-gray-600 mt-1">{consultation.findings}</p>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-gray-700">建议</h5>
                  <p className="text-sm text-gray-600 mt-1">{consultation.recommendations}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderDischargeTab = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-800">出院记录</h3>
          {!recordData.dischargeInfo && (
            <button className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700">
              <Plus size={16} className="mr-1" />
              创建出院记录
            </button>
          )}
        </div>

        {recordData.dischargeInfo ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">出院日期</p>
                <p className="font-medium">{recordData.dischargeInfo.dischargeDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">出院时间</p>
                <p className="font-medium">{recordData.dischargeInfo.dischargeTime}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-2">出院诊断</h4>
              <div className="space-y-2">
                {recordData.dischargeInfo.dischargeDiagnosis.map((diagnosis, index) => (
                  <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <span className="text-blue-800 font-medium">
                      {index + 1}. {diagnosis}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-2">出院时情况</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-800">{recordData.dischargeInfo.condition}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-2">出院医嘱</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-800 whitespace-pre-wrap">{recordData.dischargeInfo.instructions}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-2">出院带药</h4>
              <div className="space-y-2">
                {recordData.dischargeInfo.medications.map((med, index) => (
                  <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="font-medium text-gray-800">{med.name}</div>
                    <div className="text-sm text-gray-600">
                      {med.dosage} • {med.frequency} • {med.duration}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-2">随访计划</h4>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-gray-800 whitespace-pre-wrap">{recordData.dischargeInfo.followUpPlan}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <FileText size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">暂无出院记录</h3>
            <p className="text-gray-500">患者尚未出院，出院时将创建出院记录</p>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">住院病历</h2>
            <p className="text-sm text-gray-500 mt-1">
              {recordData.patientInfo.name} • {recordData.patientInfo.admissionNumber} • {recordData.patientInfo.ward}{" "}
              {recordData.patientInfo.bedNumber}床
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:text-primary-600 rounded-lg hover:bg-gray-100">
              <Printer size={20} />
            </button>
            <button className="p-2 text-gray-600 hover:text-primary-600 rounded-lg hover:bg-gray-100">
              <Download size={20} />
            </button>
            <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === "overview"
                ? "border-b-2 border-primary-500 text-primary-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Eye size={16} className="inline mr-2" />
            概览
          </button>
          <button
            onClick={() => setActiveTab("admission")}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === "admission"
                ? "border-b-2 border-primary-500 text-primary-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <FileText size={16} className="inline mr-2" />
            入院记录
          </button>
          <button
            onClick={() => setActiveTab("daily")}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === "daily"
                ? "border-b-2 border-primary-500 text-primary-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Calendar size={16} className="inline mr-2" />
            日常记录
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === "orders"
                ? "border-b-2 border-primary-500 text-primary-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Pill size={16} className="inline mr-2" />
            医嘱管理
          </button>
          <button
            onClick={() => setActiveTab("results")}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === "results"
                ? "border-b-2 border-primary-500 text-primary-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Activity size={16} className="inline mr-2" />
            检查结果
          </button>
          <button
            onClick={() => setActiveTab("discharge")}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === "discharge"
                ? "border-b-2 border-primary-500 text-primary-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <User size={16} className="inline mr-2" />
            出院记录
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(95vh-180px)]">
          {activeTab === "overview" && renderOverviewTab()}
          {activeTab === "admission" && renderAdmissionTab()}
          {activeTab === "daily" && renderDailyTab()}
          {activeTab === "orders" && renderOrdersTab()}
          {activeTab === "results" && renderResultsTab()}
          {activeTab === "discharge" && renderDischargeTab()}
        </div>
      </div>
    </div>
  )
}

export default InpatientMedicalRecord
