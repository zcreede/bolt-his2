import React from 'react';
import { useTranslation } from 'react-i18next';
import { Monitor, Volume2 } from 'lucide-react';

const QueueDisplay: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Monitor className="h-6 w-6 text-primary-600" />
            <h1 className="text-2xl font-semibold text-gray-900">{t('queue.display.title')}</h1>
          </div>
          <div className="text-xl font-semibold text-gray-800">
            {t('queue.display.department', { name: '内科' })}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Now Serving Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">{t('queue.display.nowServing')}</h2>
              <Volume2 className="h-6 w-6 text-primary-600" />
            </div>
            <div className="space-y-4">
              <div className="bg-primary-50 border border-primary-100 rounded-lg p-6 text-center">
                <div className="text-5xl font-bold text-primary-700 mb-2">A-123</div>
                <div className="text-lg text-gray-600">Dr. Sarah Wilson</div>
                <div className="text-lg text-gray-600">Room 201</div>
              </div>
              <p className="text-center text-sm text-gray-500">
                {t('queue.display.pleaseEnter')}
              </p>
            </div>
          </div>

          {/* Waiting Queue Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{t('queue.display.waiting')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">{t('queue.display.normalQueue')}</h3>
                <div className="space-y-2">
                  {['A-124', 'A-125', 'A-126'].map((number) => (
                    <div key={number} className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                      <div className="text-2xl font-semibold text-gray-700 text-center">{number}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">{t('queue.display.returnQueue')}</h3>
                <div className="space-y-2">
                  {['B-045', 'B-046'].map((number) => (
                    <div key={number} className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                      <div className="text-2xl font-semibold text-blue-700 text-center">{number}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notice */}
        <div className="mt-6 bg-yellow-50 border border-yellow-100 rounded-lg p-4 text-center">
          <p className="text-sm text-yellow-800">
            {t('queue.display.notice')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default QueueDisplay;
