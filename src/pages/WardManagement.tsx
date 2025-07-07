import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, Plus, Building2, BedDouble, Users, DoorOpen, ChevronRight, ChevronDown } from 'lucide-react';
import AddWardModal from '../components/Wards/AddWardModal';
import DeleteWardModal from '../components/Wards/DeleteWardModal';
import AddRoomModal from '../components/Wards/AddRoomModal';
import DeleteRoomModal from '../components/Wards/DeleteRoomModal';
import type { RoomFormData } from '../components/Wards/AddRoomModal';

type WardStatus = 'active' | 'maintenance' | 'closed';
type WardType = 'general' | 'icu' | 'emergency' | 'pediatric';
type RoomType = 'standard' | 'premium' | 'vip';

interface Room {
  id: string;
  number: string;
  type: RoomType;
  capacity: number;
  occupancy: number;
  facilities: {
    hasWindow: boolean;
    hasPrivateBathroom: boolean;
    hasTV: boolean;
    hasRefrigerator: boolean;
    hasAC: boolean;
    hasWifi: boolean;
    hasPhone: boolean;
    hasNurseCall: boolean;
    hasOxygen: boolean;
  };
  beds: {
    id: string;
    number: string;
    status: 'available' | 'occupied' | 'maintenance';
    patient?: {
      name: string;
      age: number;
      gender: string;
    };
  }[];
}

interface Ward {
  id: string;
  name: string;
  floor: string;
  type: WardType;
  department: string;
  totalBeds: number;
  headNurse: string;
  contact: string;
  status: WardStatus;
  rooms: Room[];
}

const WardManagement: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<WardStatus | ''>('');
  const [showAddWard, setShowAddWard] = useState(false);
  const [showDeleteWard, setShowDeleteWard] = useState(false);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [showDeleteRoom, setShowDeleteRoom] = useState(false);
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [expandedWards, setExpandedWards] = useState<string[]>([]);

  // 示例数据
  const wards: Ward[] = [
    {
      id: 'W001',
      name: '内科病区A',
      floor: '3楼',
      type: 'general',
      department: '内科',
      totalBeds: 30,
      headNurse: '张护士长',
      contact: '0123-4567',
      status: 'active',
      rooms: [
        {
          id: 'R001',
          number: '301',
          type: 'standard',
          capacity: 4,
          occupancy: 3,
          facilities: {
            hasWindow: true,
            hasPrivateBathroom: false,
            hasTV: true,
            hasRefrigerator: false,
            hasAC: true,
            hasWifi: true,
            hasPhone: true,
            hasNurseCall: true,
            hasOxygen: true
          },
          beds: [
            {
              id: 'B001',
              number: '301-A',
              status: 'occupied',
              patient: {
                name: '张三',
                age: 45,
                gender: '男'
              }
            },
            {
              id: 'B002',
              number: '301-B',
              status: 'occupied',
              patient: {
                name: '李四',
                age: 32,
                gender: '女'
              }
            }
          ]
        }
      ]
    }
  ];

  // 统计数据
  const stats = {
    totalWards: wards.length,
    totalRooms: wards.reduce((sum, ward) => sum + ward.rooms.length, 0),
    totalBeds: wards.reduce((sum, ward) => 
      sum + ward.rooms.reduce((roomSum, room) => roomSum + room.beds.length, 0), 0),
    occupiedBeds: wards.reduce((sum, ward) => 
      sum + ward.rooms.reduce((roomSum, room) => 
        roomSum + room.beds.filter(bed => bed.status === 'occupied').length, 0), 0)
  };

  const getStatusColor = (status: WardStatus) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoomTypeColor = (type: RoomType) => {
    switch (type) {
      case 'standard':
        return 'bg-gray-100 text-gray-800';
      case 'premium':
        return 'bg-blue-100 text-blue-800';
      case 'vip':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleWardExpand = (wardId: string) => {
    setExpandedWards(prev => 
      prev.includes(wardId) 
        ? prev.filter(id => id !== wardId)
        : [...prev, wardId]
    );
  };

  const handleAddRoom = (wardId: string) => {
    setSelectedWard(wards.find(ward => ward.id === wardId) || null);
    setShowAddRoom(true);
  };

  const handleRoomSubmit = (roomData: RoomFormData) => {
    console.log('添加/编辑房间:', roomData);
    setShowAddRoom(false);
    setSelectedWard(null);
  };

  const handleDeleteRoom = (ward: Ward, room: Room) => {
    setSelectedWard(ward);
    setSelectedRoom(room);
    setShowDeleteRoom(true);
  };

  const filteredWards = wards.filter(ward => {
    const matchesSearch = ward.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ward.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = !selectedDepartment || ward.department === selectedDepartment;
    const matchesStatus = !selectedStatus || ward.status === selectedStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">病区管理</h1>
          <p className="text-gray-600">管理医院病区、病房和床位资源</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <button 
            onClick={() => setShowAddWard(true)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            <Plus size={16} className="mr-1" />
            添加病区
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">病区数量</h3>
            <Building2 className="h-5 w-5 text-primary-600" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">{stats.totalWards}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">病房数量</h3>
            <DoorOpen className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-2xl font-semibold text-blue-600">{stats.totalRooms}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">总床位数</h3>
            <BedDouble className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-2xl font-semibold text-green-600">{stats.totalBeds}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">入住床位</h3>
            <Users className="h-5 w-5 text-orange-600" />
          </div>
          <p className="text-2xl font-semibold text-orange-600">{stats.occupiedBeds}</p>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="搜索病区..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="">所有科室</option>
            <option value="内科">内科</option>
            <option value="外科">外科</option>
            <option value="儿科">儿科</option>
            <option value="重症医学科">重症医学科</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as WardStatus)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="">所有状态</option>
            <option value="active">运行中</option>
            <option value="maintenance">维护中</option>
            <option value="closed">已关闭</option>
          </select>
        </div>
      </div>

      {/* 病区列表 */}
      <div className="space-y-4">
        {filteredWards.map((ward) => (
          <div key={ward.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* 病区信息 - 可点击展开/收起 */}
            <div 
              className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleWardExpand(ward.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {expandedWards.includes(ward.id) ? (
                    <ChevronDown size={20} className="text-gray-400 mr-2" />
                  ) : (
                    <ChevronRight size={20} className="text-gray-400 mr-2" />
                  )}
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                      <Building2 size={20} className="text-primary-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold text-gray-800">{ward.name}</h3>
                      <p className="text-sm text-gray-500">{ward.floor} • {ward.department}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(ward.status)}`}>
                    {ward.status === 'active' ? '运行中' : 
                     ward.status === 'maintenance' ? '维护中' : '已关闭'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddRoom(ward.id);
                    }}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    添加病房
                  </button>
                </div>
              </div>

              {/* 基本信息概览 */}
              <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">护士长：</span>
                  <span className="font-medium">{ward.headNurse}</span>
                </div>
                <div>
                  <span className="text-gray-500">联系电话：</span>
                  <span className="font-medium">{ward.contact}</span>
                </div>
                <div>
                  <span className="text-gray-500">病房数：</span>
                  <span className="font-medium">{ward.rooms.length}</span>
                </div>
                <div>
                  <span className="text-gray-500">床位数：</span>
                  <span className="font-medium">{ward.totalBeds}</span>
                </div>
              </div>
            </div>

            {/* 病房列表 - 展开时显示 */}
            {expandedWards.includes(ward.id) && (
              <div className="border-t border-gray-100">
                <div className="p-4">
                  <div className="grid gap-4">
                    {ward.rooms.map((room) => (
                      <div 
                        key={room.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <DoorOpen size={20} className="text-gray-400 mr-2" />
                            <div>
                              <h4 className="font-medium text-gray-800">{room.number}房</h4>
                              <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${getRoomTypeColor(room.type)}`}>
                                {room.type === 'standard' ? '标准间' :
                                 room.type === 'premium' ? '高级间' : 'VIP'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">
                              {room.occupancy}/{room.capacity}床
                            </span>
                            <button
                              onClick={() => handleDeleteRoom(ward, room)}
                              className="text-sm text-red-600 hover:text-red-700 font-medium ml-4"
                            >
                              删除
                            </button>
                          </div>
                        </div>

                        {/* 设施信息 */}
                        <div className="flex flex-wrap gap-2">
                          {room.facilities.hasWindow && 
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">窗户</span>}
                          {room.facilities.hasPrivateBathroom && 
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">独立卫生间</span>}
                          {room.facilities.hasTV && 
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">电视</span>}
                          {room.facilities.hasRefrigerator && 
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">冰箱</span>}
                          {room.facilities.hasAC && 
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">空调</span>}
                          {room.facilities.hasWifi && 
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">WiFi</span>}
                          {room.facilities.hasPhone && 
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">电话</span>}
                          {room.facilities.hasNurseCall && 
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">呼叫器</span>}
                          {room.facilities.hasOxygen && 
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">供氧</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 模态框 */}
      <AddWardModal
        isOpen={showAddWard}
        onClose={() => setShowAddWard(false)}
        onSubmit={(data) => {
          console.log('添加病区:', data);
          setShowAddWard(false);
        }}
      />

      <DeleteWardModal
        isOpen={showDeleteWard}
        onClose={() => {
          setShowDeleteWard(false);
          setSelectedWard(null);
        }}
        onConfirm={() => {
          console.log('关闭病区:', selectedWard?.id);
          setShowDeleteWard(false);
          setSelectedWard(null);
        }}
        wardName={selectedWard?.name || ''}
      />

      <AddRoomModal
        isOpen={showAddRoom}
        onClose={() => {
          setShowAddRoom(false);
          setSelectedWard(null);
        }}
        onSubmit={handleRoomSubmit}
      />

      <DeleteRoomModal
        isOpen={showDeleteRoom}
        onClose={() => {
          setShowDeleteRoom(false);
          setSelectedWard(null);
          setSelectedRoom(null);
        }}
        onConfirm={() => {
          console.log('删除病房:', selectedRoom?.id);
          setShowDeleteRoom(false);
          setSelectedWard(null);
          setSelectedRoom(null);
        }}
        roomNumber={selectedRoom?.number || ''}
      />
    </div>
  );
};

export default WardManagement;
