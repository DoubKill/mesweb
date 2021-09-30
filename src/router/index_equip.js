import Layout from '@/layout'
export const equipRoutes = [
  {
    path: '/equipment-manage',
    component: Layout,
    redirect: '/equipment-home',
    name: 'EquipmentManage',
    meta: {
      title: 'new设备管理',
      icon: 'quality'
    },
    children: [
      {
        path: '/equipment-home',
        component: () => import('@/views/equipment-manage/operation-status'),
        name: 'EquipmentHome',
        meta: {
          title: '设备运行现况',
          icon: 'quality',
          permissionName: ''
        }
      },
      {
        path: '/equipment/maintenance',
        redirect: '/equipment/maintenance',
        component: () => import('@/views/equipment-manage/maintenance/a-index'),
        name: 'MaintenanceFlow',
        meta: {
          title: '维护计划',
          icon: 'quality'
        },
        children: [
          {
            path: '/equipment/maintenance',
            component: () => import('@/views/equipment-manage/maintenance/maintenance'),
            name: 'Maintenance',
            meta: {
              faName: 'MaintenanceFlow',
              title: '设备维护计划',
              permissionName: ''
            }
          },
          {
            path: '/equipment/maintenance-query',
            component: () => import('@/views/equipment-manage/maintenance/maintenance-query'),
            name: 'MaintenanceQuery',
            meta: {
              faName: 'MaintenanceFlow',
              title: '设备维护计划查询',
              permissionName: ''
            }
          }
        ]
      },
      {
        path: '/equipment/operation-flow',
        redirect: '/equipment/repair-application',
        component: () => import('@/views/equipment-manage/operation-flow/a-index'),
        name: 'EquipmentOperationFlow',
        meta: {
          title: '设备维修',
          icon: 'quality'
        },
        children: [
          {
            path: '/equipment/repair-application',
            component: () => import('@/views/equipment-manage/operation-flow/repair-application'),
            name: 'EquipmentRepair',
            meta: {
              faName: 'EquipmentOperationFlow',
              title: '报修申请',
              permissionName: ''
            }
          },
          {
            path: '/equipment/repair-application-process',
            component: () => import('@/views/equipment-manage/operation-flow/repair-application-process'),
            name: 'EquipmentRepairProcess',
            meta: {
              faName: 'EquipmentOperationFlow',
              title: '报修申请处理',
              permissionName: ''
            }
          },
          {
            path: '/equipment/assign-equipment',
            component: () => import('@/views/equipment-manage/operation-flow/assign-equipment'),
            name: 'AssignEquipment',
            meta: {
              faName: 'EquipmentOperationFlow',
              title: '指派维修工单',
              permissionName: ''
            }
          },
          {
            path: '/equipment/execute-equipment',
            component: () => import('@/views/equipment-manage/operation-flow/execute-equipment'),
            name: 'ExecuteEquipment',
            meta: {
              faName: 'EquipmentOperationFlow',
              title: '执行维修工单',
              permissionName: ''
            }
          },
          {
            path: '/equipment/acceptance-equipment',
            component: () => import('@/views/equipment-manage/operation-flow/acceptance-equipment'),
            name: 'AcceptanceEquipment',
            meta: {
              faName: 'EquipmentOperationFlow',
              title: '验收维修工单',
              permissionName: ''
            }
          },
          {
            path: '/equipment/equipment-query',
            component: () => import('@/views/equipment-manage/operation-flow/equipment-query'),
            name: 'EquipmentQuery',
            meta: {
              faName: 'EquipmentOperationFlow',
              title: '维修工单查询',
              permissionName: ''
            }
          },
          {
            path: '/equipment/apare-parts',
            component: () => import('@/views/equipment-manage/operation-flow/apare-parts'),
            name: 'ApareParts',
            meta: {
              faName: 'EquipmentOperationFlow',
              title: '备件领料申请处理',
              permissionName: ''
            }
          }
        ]
      },
      {
        path: '/equipment/inspection',
        redirect: '/equipment/assign-patrol',
        component: () => import('@/views/equipment-manage/inspection/a-index'),
        name: 'InspectionFlow',
        meta: {
          title: '设备巡检',
          icon: 'quality'
        },
        children: [
          {
            path: '/equipment/assign-patrol',
            component: () => import('@/views/equipment-manage/inspection/assign-patrol'),
            name: 'AssignPatrol',
            meta: {
              faName: 'InspectionFlow',
              title: '指派巡检工单',
              permissionName: ''
            }
          },
          {
            path: '/equipment/execute-patrol',
            component: () => import('@/views/equipment-manage/inspection/execute-patrol'),
            name: 'ExecutePatrol',
            meta: {
              faName: 'InspectionFlow',
              title: '执行巡检工单',
              permissionName: ''
            }
          },
          {
            path: '/equipment/patrol-query',
            component: () => import('@/views/equipment-manage/inspection/patrol-query'),
            name: 'PatrolQuery',
            meta: {
              faName: 'InspectionFlow',
              title: '巡检工单查询',
              permissionName: ''
            }
          }
        ]
      },
      {
        path: '/equipment/master-data',
        redirect: '/equipment/supplier',
        component: () => import('@/views/equipment-manage/master-data/a-index'),
        name: 'EquipmentMasterData',
        meta: {
          title: '基础数据管理',
          icon: 'quality'
        },
        children: [
          {
            path: '/equipment/supplier',
            component: () => import('@/views/equipment-manage/master-data/supplier'),
            name: 'EquipmentMasterDataSupplier',
            meta: {
              faName: 'EquipmentMasterData',
              title: '供应商管理台账',
              permissionName: ''
            }
          },
          {
            path: '/equipment/location-area',
            component: () => import('@/views/equipment-manage/master-data/location-area'),
            name: 'EquipmentMasterDataLocation',
            meta: {
              faName: 'EquipmentMasterData',
              title: '设备位置区域定义',
              permissionName: ''
            }
          },
          {
            path: '/equipment/appoint-rule',
            component: () => import('@/views/equipment-manage/master-data/appoint-rule'),
            name: 'EquipmentMasterDataAppointRule',
            meta: {
              faName: 'EquipmentMasterData',
              title: '工单指派规则定义',
              permissionName: ''
            }
          },
          {
            path: '/equipment/repair-all',
            component: () => import('@/views/equipment-manage/master-data/repair-all'),
            name: 'EquipmentMasterDataRepairAll',
            meta: {
              faName: 'EquipmentMasterData',
              title: '维修包干定义',
              permissionName: ''
            }
          },
          {
            path: '/equipment/fixed-assets',
            component: () => import('@/views/equipment-manage/master-data/fixed-assets'),
            name: 'EquipmentMasterDataFixedAssets',
            meta: {
              faName: 'EquipmentMasterData',
              title: '设备固定资产台账',
              permissionName: ''
            }
          },
          {
            path: '/equipment/region',
            component: () => import('@/views/equipment-manage/master-data/region'),
            name: 'EquipmentMasterDataRegion',
            meta: {
              faName: 'EquipmentMasterData',
              title: '设备部位定义',
              permissionName: ''
            }
          },
          {
            path: '/equipment/type',
            component: () => import('@/views/equipment-manage/master-data/type'),
            name: 'EquipmentMasterDataType',
            meta: {
              faName: 'EquipmentMasterData',
              title: '设备种类定义',
              permissionName: ''
            }
          },
          {
            path: '/equipment/parts-type',
            component: () => import('@/views/equipment-manage/master-data/parts-type'),
            name: 'EquipmentMasterDataPartsType',
            meta: {
              faName: 'EquipmentMasterData',
              title: '设备部件分类',
              permissionName: ''
            }
          },
          {
            path: '/equipment/ERP-material',
            component: () => import('@/views/equipment-manage/master-data/ERP-material'),
            name: 'EquipmentMasterDataERPMaterial',
            meta: {
              faName: 'EquipmentMasterData',
              title: 'ERP备件物料信息',
              permissionName: ''
            }
          },
          {
            path: '/equipment/fault-classify',
            component: () => import('@/views/equipment-manage/master-data/fault-classify'),
            name: 'EquipmentMasterDataFaultClassify',
            meta: {
              faName: 'EquipmentMasterData',
              title: '设备故障分类管理',
              permissionName: ''
            }
          },
          {
            path: '/equipment/spare-parts-code',
            component: () => import('@/views/equipment-manage/master-data/spare-parts-code'),
            name: 'EquipmentMasterDataSparePartsCode',
            meta: {
              faName: 'EquipmentMasterData',
              title: '备件代码定义',
              permissionName: ''
            }
          }
        ]
      }
    ]
  }
]
