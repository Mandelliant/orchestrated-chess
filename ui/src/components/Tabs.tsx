import { useState } from 'react';
import { TabWrapper } from './TabWrapper';
import { Proposals } from './Proposals';

// notification related types
const dynamicToastChildStatuses = [
  'info',
  'success',
  'warning',
  'error',
] as const;

type DynamicToastChild = {
  text: string;
  status: (typeof dynamicToastChildStatuses)[number];
};

const Tabs = () => {
  // tab state related functions
  const [activeTab, setActiveTab] = useState('DAO Proposals');

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="my-4 flex w-full flex-row justify-center">
      <div
        role="tablist"
        className="daisyui-tabs daisyui-tabs-lifted daisyui-tabs-lg"
      >
        <TabWrapper
          tab="DAO Proposals"
          activeTab={activeTab}
          handleTabClick={handleTabClick}
        >
          <Proposals />
        </TabWrapper>
      </div>
    </div>
  );
};

export { Tabs };
export type { DynamicToastChild };
