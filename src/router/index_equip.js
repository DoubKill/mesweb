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
        path: '/equipment/master-data',
        redirect: '/spare-part/base/spare-location',
        component: () => import('@/views/equipment-manage/master-data/a-index'),
        name: 'EquipmentMasterData',
        meta: {
          title: '主数据管理',
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
            path: '/equipment/type',
            component: () => import('@/views/equipment-manage/master-data/type'),
            name: 'EquipmentMasterDataType',
            meta: {
              faName: 'EquipmentMasterData',
              title: '设备种类',
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
          }
        ]
      },
      {
        path: '/equipment/operation-flow',
        redirect: '/spare-part/base/spare-location',
        component: () => import('@/views/equipment-manage/operation-flow/a-index'),
        name: 'EquipmentOperationFlow',
        meta: {
          title: '业务流程管理',
          icon: 'quality'
        },
        children: [
          {
            path: '/equipment/maintenance',
            component: () => import('@/views/equipment-manage/operation-flow/maintenance'),
            name: 'Maintenance',
            meta: {
              faName: 'EquipmentOperationFlow',
              title: '设备维护计划',
              permissionName: ''
            }
          },
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
              title: '指派设备维修工单',
              permissionName: ''
            }
          },
          {
            path: '/equipment/execute-equipment',
            component: () => import('@/views/equipment-manage/operation-flow/execute-equipment'),
            name: 'ExecuteEquipment',
            meta: {
              faName: 'EquipmentOperationFlow',
              title: '执行设备维修工单',
              permissionName: ''
            }
          },
          {
            path: '/equipment/acceptance-equipment',
            component: () => import('@/views/equipment-manage/operation-flow/acceptance-equipment'),
            name: 'AcceptanceEquipment',
            meta: {
              faName: 'EquipmentOperationFlow',
              title: '验收设备维修工单',
              permissionName: ''
            }
          },
          {
            path: '/equipment/equipment-query',
            component: () => import('@/views/equipment-manage/operation-flow/equipment-query'),
            name: 'EquipmentQuery',
            meta: {
              faName: 'EquipmentOperationFlow',
              title: '设备维修工单查询',
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
      }
    ]
  }
]
