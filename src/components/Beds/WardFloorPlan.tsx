import React, { useState } from 'react';
import { BedDouble, Users, AlertTriangle } from 'lucide-react';

type BedStatus = 'available' | 'occupied' | 'reserved' | 'cleaning' | 'maintenance';
type BedType = 'normal' | 'icu' | 'emergency' | 'pediatric';

interface Bed {
  id: string;
  number: string;
  status: BedStatus;
  type: BedType;
  patient?: {
    name: string;
    id: string;
  };
}

interface Room {
  id: string;
  name: string;
  beds: Bed[];
}

interface WardFloorPlanProps {
  ward: string;
  rooms: Room[];
  onBedClick: (bed: Bed) => void;
}

const WardFloorPlan: React.FC<WardFloorPlanProps> = ({ ward, rooms, onBedClick }) => {
  const [hoveredBed, setHoveredBed] = useState<Bed | null>(null);

  const getBedColor = (status: BedStatus) => {
    switch (status) {
      case 'available':
        return 'text-green-600 hover:text-green-700';
      case 'occupied':
        return 'text-red-600 hover:text-red-700';
      case 'reserved':
        return 'text-yellow-600 hover:text-yellow-700';
      case 'cleaning':
        return 'text-blue-600 hover:text-blue-700';
      case 'maintenance':
        return 'text-gray-600 hover:text-gray-700';
      default:
        return 'text-gray-600 hover:text-gray-700';
    }
  };

  const getBedTypeIcon = (type: BedType) => {
    switch (type) {
      case 'icu':
        return <AlertTriangle size={12} className="absolute -top-1 -right-1 text-purple-600" />;
      case 'emergency':
        return <AlertTriangle size={12} className="absolute -top-1 -right-1 text-red-600" />;
      case 'pediatric':
        return <Users size={12} className="absolute -top-1 -right-1 text-blue-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">{ward} 平面图</h2>
      
      <div className="grid grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div key={room.id} className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">{room.name}</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {room.beds.map((bed) => (
                <div
                  key={bed.id}
                  className="relative"
                  onMouseEnter={() => setHoveredBed(bed)}
                  onMouseLeave={() => setHoveredBed(null)}
                >
                  <button
                    onClick={() => onBedClick(bed)}
                    className={`relative w-12 h-12 flex items-center justify-center border-2 rounded-lg transition-colors ${
                      bed.status === 'occupied' ? 'border-red-200' : 'border-gray-200'
                    }`}
                  >
                    <BedDouble className={`w-6 h-6 ${getBedColor(bed.status)}`} />
                    {getBedTypeIcon(bed.type)}
                  </button>
                  
                  {/* 床位信息提示 */}
                  {hoveredBed?.id === bed.id && (
                    <div className="absolute z-10 w-48 bg-white border border-gray-200 rounded-lg shadow-lg p-3 -translate-x-1/2 left-1/2 mt-2">
                      <div className="text-sm font-medium text-gray-800 mb-1">
                        {bed.number}
                      </div>
                      {bed.patient ? (
                        <div className="text-xs text-gray-600">
                          <p>{bed.patient.name}</p>
                          <p className="text-gray-400">{bed.patient.id}</p>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500">空床</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 图例 */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-2">图例说明</h4>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <BedDouble className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-xs text-gray-600">可用</span>
          </div>
          <div className="flex items-center">
            <BedDouble className="w-4 h-4 text-red-600 mr-1" />
            <span className="text-xs text-gray-600">已占用</span>
          </div>
          <div className="flex items-center">
            <BedDouble className="w-4 h-4 text-yellow-600 mr-1" />
            <span className="text-xs text-gray-600">已预约</span>
          </div>
          <div className="flex items-center">
            <BedDouble className="w-4 h-4 text-blue-600 mr-1" />
            <span className="text-xs text-gray-600">清洁中</span>
          </div>
          <div className="flex items-center">
            <BedDouble className="w-4 h-4 text-gray-600 mr-1" />
            <span className="text-xs text-gray-600">维护中</span>
          </div>
          <div className="flex items-center">
            <AlertTriangle className="w-4 h-4 text-purple-600 mr-1" />
            <span className="text-xs text-gray-600">重症监护</span>
          </div>
          <div className="flex items-center">
            <AlertTriangle className="w-4 h-4 text-red-600 mr-1" />
            <span className="text-xs text-gray-600">急诊观察</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 text-blue-600 mr-1" />
            <span className="text-xs text-gray-600">儿科病床</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WardFloorPlan;
