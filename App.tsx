import React, { useState } from 'react';
import Layout from './components/Layout';
import FinanceModule from './components/FinanceModule';
import AccountsModule from './components/AccountsModule';
import DistributionModule from './components/DistributionModule';
import WarehouseModule from './components/WarehouseModule';
import SalesModule from './components/SalesModule';
import DeliveryModule from './components/DeliveryModule';
import { UserRole } from './types';
import { MOCK_INVENTORY, InventoryItem } from './constants';

const App: React.FC = () => {
  // State for global user context and navigation
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(UserRole.ADMIN);
  const [activeModule, setActiveModule] = useState<string>('finance');
  // Global inventory state
  const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY);

  // Route renderer
  const renderModule = () => {
    switch (activeModule) {
      case 'finance':
        return <FinanceModule currentRole={currentUserRole} />;
      case 'accounts':
        return <AccountsModule />;
      case 'distribution':
        return <DistributionModule />;
      case 'warehouse':
        return <WarehouseModule inventory={inventory} onInventoryChange={setInventory} />;
      case 'sales':
        return <SalesModule inventory={inventory} />;
      case 'delivery':
        return <DeliveryModule />;
      default:
        return <FinanceModule currentRole={currentUserRole} />;
    }
  };

  return (
    <Layout
      currentRole={currentUserRole}
      onRoleChange={setCurrentUserRole}
      activeModule={activeModule}
      onModuleChange={setActiveModule}
    >
      {renderModule()}
    </Layout>
  );
};

export default App;
