import React, { useState, useEffect } from 'react';
import { Sidebar, TabKey } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { ProjectDashboard } from './components/modules/ProjectDashboard';
import { WBSExplorer } from './components/modules/WBSExplorer';
import { SiteDiaryModule } from './components/modules/SiteDiaryModule';
import { BOQEVMModule } from './components/modules/BOQEVMModule';
import { SubcontractorPPCModule } from './components/modules/SubcontractorPPCModule';
import { MaterialWarehouseModule } from './components/modules/MaterialWarehouseModule';
import { EquipmentFleetModule } from './components/modules/EquipmentFleetModule';
import { WinSteelFactoryModule } from './components/modules/WinSteelFactoryModule';
import { QAQCModule } from './components/modules/QAQCModule';
import { HSEModule } from './components/modules/HSEModule';
import { WorkforceWIPModule } from './components/modules/WorkforceWIPModule';
import { FidicClaimsVOModule } from './components/modules/FidicClaimsVOModule';
import { CreateProjectModal } from './components/modals/CreateProjectModal';
import { ActionModal } from './components/modals/ActionModal';

import { 
  Project, 
  WBSItem, 
  DailySiteDiary, 
  Subcontractor, 
  Subcontract, 
  PaymentCertificate,
  EVMAnalysis,
  Material,
  StockBalance,
  Equipment,
  SteelComponent 
} from './types';

import { 
  projectApi, 
  subcontractorApi, 
  boqApi, 
  inventoryApi, 
  equipmentApi, 
  winsteelApi 
} from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('projects');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Project-specific data
  const [wbsItems, setWbsItems] = useState<WBSItem[]>([]);
  const [diaries, setDiaries] = useState<DailySiteDiary[]>([]);
  const [subcontracts, setSubcontracts] = useState<Subcontract[]>([]);
  const [certificates, setCertificates] = useState<PaymentCertificate[]>([]);
  const [evmData, setEvmData] = useState<EVMAnalysis | null>(null);
  const [stockBalances, setStockBalances] = useState<StockBalance[]>([]);
  
  // Enterprise catalogs
  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [components, setComponents] = useState<SteelComponent[]>([]);

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showActionModal, setShowActionModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initial Data Load
  useEffect(() => {
    async function initClusterData() {
      setLoading(true);
      try {
        const [projList, subList, matList, eqList, compList] = await Promise.all([
          projectApi.getProjects(),
          subcontractorApi.getSubcontractors(),
          inventoryApi.getMaterials(),
          equipmentApi.getEquipments(),
          winsteelApi.getComponents(1)
        ]);

        setProjects(projList);
        setSubcontractors(subList);
        setMaterials(matList);
        setEquipments(eqList);
        setComponents(compList);

        if (projList.length > 0) {
          await loadProjectDetails(projList[0]);
        }
      } catch (err) {
        console.error('Failed to initialize ERP cluster data:', err);
      } finally {
        setLoading(false);
      }
    }

    initClusterData();
  }, []);

  const loadProjectDetails = async (project: Project) => {
    setSelectedProject(project);
    try {
      const [wbs, diaryList, contractList, evm, stocks] = await Promise.all([
        projectApi.getProjectWBS(project.id),
        projectApi.getSiteDiaries(project.id),
        subcontractorApi.getSubcontracts(project.id),
        boqApi.getEVMAnalysis(project.id),
        inventoryApi.getStockBalances(project.id)
      ]);

      setWbsItems(wbs);
      setDiaries(diaryList);
      setSubcontracts(contractList);
      setEvmData(evm);
      setStockBalances(stocks);

      if (contractList.length > 0) {
        const certList = await subcontractorApi.getCertificates(contractList[0].id);
        setCertificates(certList);
      } else {
        setCertificates([]);
      }
    } catch (err) {
      console.error(`Failed to load details for project ${project.code}:`, err);
    }
  };

  const handleSelectProject = (project: Project) => {
    loadProjectDetails(project);
  };

  const handleCreateProject = (newProject: Project) => {
    setProjects(prev => [newProject, ...prev]);
    setSelectedProject(newProject);
    setShowCreateModal(false);
    setToastMessage(`Đã khởi tạo thành công dự án mới: ${newProject.code} - ${newProject.name}!`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleActionSuccess = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  return (
    <div className={`flex h-screen font-sans antialiased overflow-hidden transition-colors duration-200 ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      {/* 1. Left Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        onSelectTab={setActiveTab} 
        isDarkMode={isDarkMode} 
      />

      {/* 2. Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header with Theme Switcher */}
        <Header
          projects={projects}
          selectedProject={selectedProject}
          onSelectProject={handleSelectProject}
          onOpenCreateModal={() => setShowCreateModal(true)}
          onOpenActionModal={() => setShowActionModal(true)}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(prev => !prev)}
        />

        {/* Dynamic Workspace Container */}
        <main className={`flex-1 overflow-y-auto p-6 custom-scrollbar transition-colors duration-200 ${
          isDarkMode ? 'bg-slate-950' : 'bg-slate-50'
        }`}>
          {/* Toast Notification */}
          {toastMessage && (
            <div className="mb-4 p-3 bg-emerald-950/90 border border-emerald-800 rounded-xl text-xs font-semibold text-emerald-300 shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2">
              <span>{toastMessage}</span>
              <button onClick={() => setToastMessage(null)} className="text-emerald-400 hover:text-white ml-3">✕</button>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-3">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-semibold text-slate-400">
                Đang nạp dữ liệu Ánh Dương ERP từ PostgreSQL 192.168.1.50...
              </p>
            </div>
          ) : (
            <>
              {activeTab === 'projects' && (
                <ProjectDashboard
                  projects={projects}
                  selectedProject={selectedProject}
                  onSelectProject={handleSelectProject}
                  onOpenCreateModal={() => setShowCreateModal(true)}
                  isDarkMode={isDarkMode}
                />
              )}

              {activeTab === 'wbs' && (
                <WBSExplorer
                  project={selectedProject}
                  items={wbsItems}
                />
              )}

              {activeTab === 'diary' && (
                <SiteDiaryModule
                  project={selectedProject}
                  diaries={diaries}
                  onOpenActionModal={() => setShowActionModal(true)}
                />
              )}

              {activeTab === 'boq' && (
                <BOQEVMModule
                  projectId={selectedProject?.id || 1}
                  evmData={evmData}
                />
              )}

              {activeTab === 'subcontractors' && (
                <SubcontractorPPCModule
                  subcontractors={subcontractors}
                  subcontracts={subcontracts}
                  certificates={certificates}
                />
              )}

              {activeTab === 'inventory' && (
                <MaterialWarehouseModule
                  stockBalances={stockBalances}
                  materials={materials}
                />
              )}

              {activeTab === 'equipment' && (
                <EquipmentFleetModule
                  equipments={equipments}
                />
              )}

              {activeTab === 'winsteel' && (
                <WinSteelFactoryModule
                  components={components}
                />
              )}

              {activeTab === 'qaqc' && (
                <QAQCModule
                  project={selectedProject}
                />
              )}

              {activeTab === 'hse' && (
                <HSEModule
                  project={selectedProject}
                  isDarkMode={isDarkMode}
                />
              )}

              {activeTab === 'workforce' && (
                <WorkforceWIPModule
                  project={selectedProject}
                  isDarkMode={isDarkMode}
                />
              )}

              {activeTab === 'wip' && (
                <WorkforceWIPModule
                  project={selectedProject}
                  isDarkMode={isDarkMode}
                />
              )}

              {activeTab === 'claims' && (
                <FidicClaimsVOModule
                  project={selectedProject}
                  isDarkMode={isDarkMode}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* 3. Global Action Modals */}
      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateProject={handleCreateProject}
      />

      <ActionModal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        onSuccess={handleActionSuccess}
      />
    </div>
  );
}
