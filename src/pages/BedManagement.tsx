import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Plus, Filter, Building2, BedDouble, Users } from 'lucide-react';
import WardFloorPlan from '../components/Beds/WardFloorPlan';
import AddBedModal from '../components/Beds/AddBedModal';
import BedLevelModal from '../components/Beds/BedLevelModal';
import BedMaintenanceModal from '../components/Beds/BedMaintenanceModal';
import BedTransferModal from '../components/Beds/BedTransferModal';

type BedStatus = 'available' | 'occupied' | 'reserved' | 'cleaning' | 'maintenance';
type BedType = 'normal' | 'icu' | 'emergency' | 'pediatric';
type BedLevel = 'standard' | 'premium' | 'vip';
type RoomType = 'standard' | 'premium' | 'vip';

interface Room {
  id: string;
  name: string;
  type: RoomType;
  capacity: number;
  beds: Bed[];
  facilities: string[];
}

interface Bed {
  id: string;
  number: string;
  status: BedStatus;
  type: BedType;
  level: BedLevel;
  patient?: {
    id: string;
    name: string;
    gender: string;
    age: number;
  };
  facilities: {
    hasOxygen: boolean;
    hasCall: boolean;
    hasTV: boolean;
    hasAC: boolean;
    hasBathroom: boolean;
  };
  maintenanceHistory: {
    date: string;
    type: string;
    description: string;
    performer: string;
  }[];
}

interface Ward {
  id: string;
  name: string;
  floor: string;
  department: string;
  rooms: Room[];
}

const BedManagement: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWard, setSelectedWard] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<BedStatus | ''>('');
  const [showAddBed, setShowAddBed] = useState(false);
  const [showBedLevel, setShowBedLevel] = useState(false);
  const [showMaintenance, setShowMaintenance] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);

  // 示例数据
  const wards: Ward[] = [
    {
      id: 'W001',
      name: '内科病区A',
      floor: '3楼',
      department: '内科',
      rooms: [
        {
          id: 'R001',
          name: '301房',
          type: 'standard',
          capacity: 4,
          facilities: ['中央空调', '卫生间', '电视'],
          beds: [
            {
              id: 'B001',
              number: '301-A',
              status: 'occupied',
              type: 'normal',
              level: 'standard',
              patient: {
                id: 'P001',
                name: '张三',
                gender: '男',
                age: 45
              },
              facilities: {
                hasOxygen: true,
                hasCall: true,
                hasTV: true,
                hasAC: true,
                hasBathroom: true
              },
              maintenanceHistory: []
            },
            {
              id: 'B002',
              number: '301-B',
              status: 'available',
              type: 'normal',
              level: 'standard',
              facilities: {
                hasOxygen: true,
                hasCall: true,
                hasTV: true,
                hasAC: true,
                hasBathroom: true
              },
              maintenanceHistory: []
            }
          ]
        }
      ]
    }
  ];

  // 为AddBedModal准备wardRooms数据
  const wardRooms = wards.flatMap(ward => 
    ward.rooms.map(room => ({
      id: room.id,
      number: room.name,
      type: room.type,
      capacity: room.capacity,
      currentBeds: room.beds.length,
      wardName: ward.name
    }))
  );

  // 统计数据
  const stats = {
    totalBeds: wards.reduce((sum, ward) => 
      sum + ward.rooms.reduce((roomSum, room) => roomSum + room.beds.length, 0), 0),
    availableBeds: wards.reduce((sum, ward) => 
      sum + ward.rooms.reduce((roomSum, room) => 
        roomSum + room.beds.filter(bed => bed.status === 'available').length, 0), 0),
    occupiedBeds: wards.reduce((sum, ward) => 
      sum + ward.rooms.reduce((roomSum, room) => 
        roomSum + room.beds.filter(bed => bed.status === 'occupied').length, 0), 0),
    maintenanceBeds: wards.reduce((sum, ward) => 
      sum + ward.rooms.reduce((roomSum, room) => 
        roomSum + room.beds.filter(bed => bed.status === 'maintenance').length, 0), 0)
  };

  const handleBedClick = (bed: Bed) => {
    setSelectedBed(bed);
    if (bed.status === 'maintenance') {
      setShowMaintenance(true);
    } else if (bed.status === 'occupied') {
      setShowTransfer(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* 头部信息 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">床位管理</h1>
          <p className="text-gray-600">管理医院床位资源和调配</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-2">
          <button
            onClick={() => setShowBedLevel(true)}
            className="px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100"
          >
            床位等级
          </button>
          <button
            onClick={() => setShowAddBed(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 flex items-center"
          >
            <Plus size={16} className="mr-1" />
            添加床位
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">总床位数</h3>
            <BedDouble className="h-5 w-5 text-primary-600" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">{stats.totalBeds}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">可用床位</h3>
            <BedDouble className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-2xl font-semibold text-green-600">{stats.availableBeds}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">占用床位</h3>
            <BedDouble className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-2xl font-semibold text-blue-600">{stats.occupiedBeds}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">维护中</h3>
            <BedDouble className="h-5 w-5 text-orange-600" />
          </div>
          <p className="text-2xl font-semibold text-orange-600">{stats.maintenanceBeds}</p>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="搜索床位号、患者姓名..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="">所有病区</option>
            {wards.map(ward => (
              <option key={ward.id} value={ward.id}>{ward.name}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as BedStatus)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="">所有状态</option>
            <option value="available">可用</option>
            <option value="occupied">已占用</option>
            <option value="reserved">已预约</option>
            <option value="cleaning">清洁中</option>
            <option value="maintenance">维护中</option>
          </select>
        </div>
      </div>

      {/* 病区平面图 */}
      {wards.map(ward => (
        <div key={ward.id} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">{ward.name}</h2>
              <p className="text-sm text-gray-500">{ward.floor} • {ward.department}</p>
            </div>
          </div>
          
          <WardFloorPlan
            ward={ward.name}
            rooms={ward.rooms}
            onBedClick={handleBedClick}
          />
        </div>
      ))}

      {/* 模态框 */}
      <AddBedModal
        isOpen={showAddBed}
        onClose={() => setShowAddBed(false)}
        onSubmit={(data) => {
          console.log('添加床位:', data);
          setShowAddBed(false);
        }}
        wardRooms={wardRooms}
      />

      <BedLevelModal
        isOpen={showBedLevel}
        onClose={() => setShowBedLevel(false)}
        onSubmit={(data) => {
          console.log('设置床位等级:', data);
          setShowBedLevel(false);
        }}
      />

      {selectedBed && (
        <>
          <BedMaintenanceModal
            isOpen={showMaintenance}
            onClose={() => {
              setShowMaintenance(false);
              setSelectedBed(null);
            }}
            onSubmit={(data) => {
              console.log('床位维护:', data);
              setShowMaintenance(false);
              setSelectedBed(null);
            }}
            bedInfo={{
              id: selectedBed.id,
              number: selectedBed.number,
              ward: wards.find(w => 
                w.rooms.some(r => 
                  r.beds.some(b => b.id === selectedBed.id)
                )
              )?.name || ''
            }}
          />

          <BedTransferModal
            isOpen={showTransfer}
            onClose={() => {
              setShowTransfer(false);
              setSelectedBed(null);
            }}
            onSubmit={(data) => {
              console.log('床位调整:', data);
              setShowTransfer(false);
              setSelectedBed(null);
            }}
            currentBed={{
              id: selectedBed.id,
              number: selectedBed.number,
              ward: wards.find(w => 
                w.rooms.some(r => 
                  r.beds.some(b => b.id === selectedBed.id)
                )
              )?.name || '',
              patient: selectedBed.patient
            }}
            availableBeds={[
              { id: 'B003', number: '302-A', ward: '内科病区A', type: '普通床位' },
              { id: 'B004', number: '302-B', ward: '内科病区A', type: '普通床位' }
            ]}
          />
        </>
      )}
    </div>
  );
};

export default BedManagement;
