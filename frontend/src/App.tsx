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
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Sub-data for selected project
  const [wbsItems, setWbsItems] = useState<WBSItem[]>([]);
  const [diaries, setDiaries] = useState<DailySiteDiary[]>([]);
  const [subcontracts, setSubcontracts] = useState<Subcontract[]>([]);
  const [certificates, setCertificates] = useState<PaymentCertificate[]>([]);
  const [evmData, setEvmData] = useState<EVMAnalysis | null>(null);
  const [stockBalances, setStockBalances] = useState<StockBalance[]>([]);
  
  // Global registries
  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [components, setComponents] = useState<SteelComponent[]>([]);

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showActionModal, setShowActionModal] = useState<boolean>(false);
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

  // Load project-specific sub-data
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

  const handleCreateProject = (newProjectData: Partial<Project>) => {
    const created: Project = {
      id: projects.length + 1,
      code: newProjectData.code || `DA-ADB-2026-${String(projects.length + 1).padStart(3, '0')}`,
      name: newProjectData.name || 'Dự án Mới',
      clientName: newProjectData.clientName || 'Chủ Đầu Tư Mới',
      location: newProjectData.location || 'Bình Dương, Việt Nam',
      projectType: newProjectData.projectType || 'INDUSTRIAL_FACTORY',
      contractValue: Number(newProjectData.contractValue) || 100000000000,
      startDate: newProjectData.startDate || new Date().toISOString().split('T')[0],
      plannedEndDate: newProjectData.plannedEndDate || '2026-12-31',
      progressPercentage: 0,
      status: 'PLANNING'
    };

    setProjects(prev => [created, ...prev]);
    setSelectedProject(created);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans antialiased overflow-hidden">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* 2. Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header
          projects={projects}
          selectedProject={selectedProject}
          onSelectProject={handleSelectProject}
          onOpenCreateModal={() => setShowCreateModal(true)}
          onOpenActionModal={() => setShowActionModal(true)}
        />

        {/* Dynamic Workspace Container */}
        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-950">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-3">
              <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-semibold text-slate-400">
                Đang nạp dữ liệu Ánh Dương ERP từ PostgreSQL 192.168.1.50...
              </p>
            </div>
          ) : (
            <>
              {activeTab === 'projects' && (
                <ProjectDashboard
                  projects={projects}
                  onSelectProject={handleSelectProject}
                  onOpenCreateModal={() => setShowCreateModal(true)}
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
                  project={selectedProject}
                  evmData={evmData}
                />
              )}

              {activeTab === 'subcontractors' && (
                <SubcontractorPPCModule
                  project={selectedProject}
                  subcontracts={subcontracts}
                  certificates={certificates}
                />
              )}

              {activeTab === 'inventory' && (
                <MaterialWarehouseModule
                  project={selectedProject}
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
        onCreate={handleCreateProject}
      />

      <ActionModal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        project={selectedProject}
        materials={materials}
        equipments={equipments}
      />
    </div>
  );
}
