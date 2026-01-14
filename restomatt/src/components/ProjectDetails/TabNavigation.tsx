import React from 'react';
import { Calculator, DollarSign, Clock, Image } from 'lucide-react';

type TabType = 'items' | 'costs' | 'timeline' | 'photos';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  itemsCount: number;
  costsCount: number;
  milestonesCount: number;
  photosCount: number;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  itemsCount,
  costsCount,
  milestonesCount,
  photosCount,
}) => {
  const tabs = [
    { id: 'items' as TabType, label: 'Items', icon: Calculator, count: itemsCount },
    { id: 'costs' as TabType, label: 'Additional Costs', icon: DollarSign, count: costsCount },
    { id: 'timeline' as TabType, label: 'Timeline', icon: Clock, count: milestonesCount },
    { id: 'photos' as TabType, label: 'Photos', icon: Image, count: photosCount },
  ];

  return (
    <div className="border-b border-gray-200 bg-white">
      <nav className="flex -mb-px overflow-x-auto scrollbar-hide" aria-label="Tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-all
                ${isActive
                  ? 'border-amber-600 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-center space-x-2">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                {tab.count > 0 && (
                  <span className={`
                    py-0.5 px-2 rounded-full text-xs font-medium
                    ${isActive
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-gray-100 text-gray-600'
                    }
                  `}>
                    {tab.count}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default TabNavigation;
