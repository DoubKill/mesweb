import Layout from '@/layout'
export const equipRoutes = [
  {
    path: '/equipment-manage',
    component: Layout,
    redirect: '/equipment-home',
    name: 'EquipmentManage',
    meta: {
      title: '设备管理',
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
              permissionName: 'equip_plan'
            }
          },
          {
            path: '/equipment/maintenance-query',
            component: () => import('@/views/equipment-manage/maintenance/maintenance-query'),
            name: 'MaintenanceQuery',
            meta: {
              faName: 'MaintenanceFlow',
              title: '设备维护计划查询',
              permissionName: 'equip_plan'
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
              permissionName: 'equip_apply_repair'
            }
          },
          // {
          //   path: '/equipment/repair-application-process',
          //   component: () => import('@/views/equipment-manage/operation-flow/repair-application-process'),
          //   name: 'EquipmentRepairProcess',
          //   meta: {
          //     faName: 'EquipmentOperationFlow',
          //     title: '报修申请处理',
          //     permissionName: ''
          //   }
          // },
          {
            path: '/equipment/assign-equipment',
            component: () => import('@/views/equipment-manage/operation-flow/assign-equipment'),
            name: 'AssignEquipment',
            meta: {
              faName: 'EquipmentOperationFlow',
              title: '指派维修工单',
              permissionName: 'equip_apply_order'
            }
          },
          {
            path: '/equipment/order-equipment',
            component: () => import('@/views/equipment-manage/operation-flow/order-equipment'),
            name: 'OrderEquipment',
            meta: {
              faName: 'EquipmentOperationFlow',
              title: '接单维修工单',
              permissionName: 'equip_apply_order'
            }
          },
          {
            path: '/equipment/execute-equipment',
            component: () => import('@/views/equipment-manage/operation-flow/execute-equipment'),
            name: 'ExecuteEquipment',
            meta: {
              faName: 'EquipmentOperationFlow',
              title: '执行维修工单',
              permissionName: 'equip_apply_order'
            }
          },
          {
            path: '/equipment/acceptance-equipment',
            component: () => import('@/views/equipment-manage/operation-flow/acceptance-equipment'),
            name: 'AcceptanceEquipment',
            meta: {
              faName: 'EquipmentOperationFlow',
              title: '验收维修工单',
              permissionName: 'equip_apply_order'
            }
          },
          {
            path: '/equipment/equipment-query',
            component: () => import('@/views/equipment-manage/operation-flow/equipment-query'),
            name: 'EquipmentQuery',
            meta: {
              faName: 'EquipmentOperationFlow',
              title: '维修工单查询',
              permissionName: 'equip_apply_order'
            }
          }
          // {
          //   path: '/equipment/apare-parts',
          //   component: () => import('@/views/equipment-manage/operation-flow/apare-parts'),
          //   name: 'ApareParts',
          //   meta: {
          //     faName: 'EquipmentOperationFlow',
          //     title: '备件领料申请处理',
          //     permissionName: ''
          //   }
          // }
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
              permissionName: 'equip_inspection_order'
            }
          },
          {
            path: '/equipment/order-patrol',
            component: () => import('@/views/equipment-manage/inspection/order-patrol'),
            name: 'OrderPatrol',
            meta: {
              faName: 'InspectionFlow',
              title: '接单巡检工单',
              permissionName: 'equip_inspection_order'
            }
          },
          {
            path: '/equipment/execute-patrol',
            component: () => import('@/views/equipment-manage/inspection/execute-patrol'),
            name: 'ExecutePatrol',
            meta: {
              faName: 'InspectionFlow',
              title: '执行巡检工单',
              permissionName: 'equip_inspection_order'
            }
          },
          {
            path: '/equipment/patrol-query',
            component: () => import('@/views/equipment-manage/inspection/patrol-query'),
            name: 'PatrolQuery',
            meta: {
              faName: 'InspectionFlow',
              title: '巡检工单查询',
              permissionName: 'equip_inspection_order'
            }
          }
        ]
      },
      {
        path: '/equipment/standard-definition',
        redirect: '/equipment/project-definition',
        component: () => import('@/views/equipment-manage/standard-definition/a-index'),
        name: 'StandardDefinition',
        meta: {
          title: '标准定义',
          icon: 'quality'
        },
        children: [
          {
            path: '/equipment/project-definition',
            component: () => import('@/views/equipment-manage/standard-definition/project-definition'),
            name: 'ProjectDefinition',
            meta: {
              faName: 'StandardDefinition',
              title: '作业项目标准定义',
              permissionName: 'equip_job_standard'
            }
          },
          {
            path: '/equipment/maintain-definition',
            component: () => import('@/views/equipment-manage/standard-definition/maintain-definition'),
            name: 'MaintainDefinition',
            meta: {
              faName: 'StandardDefinition',
              title: '维护作业标准定义',
              permissionName: 'equip_maintenance_standard'
            }
          },
          {
            path: '/equipment/repair-definition',
            component: () => import('@/views/equipment-manage/standard-definition/repair-definition'),
            name: 'RepairDefinition',
            meta: {
              faName: 'StandardDefinition',
              title: '维修作业标准定义',
              permissionName: 'equip_repair_standard'
            }
          }
        ]
      },
      {
        path: '/equipment/spare-parts',
        redirect: '/equipment/location-management',
        component: () => import('@/views/equipment-manage/spare-parts/a-index'),
        name: 'SparePartsWarehouse',
        meta: {
          title: '备品备件库',
          icon: 'quality'
        },
        children: [
          {
            path: '/equipment/location-management',
            component: () => import('@/views/equipment-manage/spare-parts/location-management'),
            name: 'LocationManagement',
            meta: {
              faName: 'SparePartsWarehouse',
              title: '备件库区库位管理',
              permissionName: 'equip_warehouse'
            }
          },
          {
            path: '/equipment/warehousing-management',
            component: () => import('@/views/equipment-manage/spare-parts/warehousing-management'),
            name: 'WarehousingManagement',
            meta: {
              faName: 'SparePartsWarehouse',
              title: '备件入库管理',
              permissionName: 'equip_in_warehouse'
            }
          },
          {
            path: '/equipment/outbounding-management',
            component: () => import('@/views/equipment-manage/spare-parts/outbounding-management'),
            name: 'OutboundingManagement',
            meta: {
              faName: 'SparePartsWarehouse',
              title: '备件出库管理',
              permissionName: 'equip_out_warehouse'
            }
          },
          {
            path: '/equipment/inventory-query',
            component: () => import('@/views/equipment-manage/spare-parts/inventory-query'),
            name: 'InventoryQuery',
            meta: {
              faName: 'SparePartsWarehouse',
              title: '备件库存查询',
              permissionName: 'equip_warehouse_inventory'
            }
          },
          {
            path: '/equipment/history-query',
            component: () => import('@/views/equipment-manage/spare-parts/history-query'),
            name: 'HistoryQuery',
            meta: {
              faName: 'SparePartsWarehouse',
              title: '备件出入库履历查询',
              permissionName: 'equip_warehouse_record'
            }
          },
          {
            path: '/equipment/statistics',
            component: () => import('@/views/equipment-manage/spare-parts/statistics'),
            name: 'Statistics',
            meta: {
              faName: 'SparePartsWarehouse',
              title: '备件出入库统计分析',
              permissionName: 'equip_warehouse_statistical'
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
              permissionName: 'equip_supplier'
            }
          },
          {
            path: '/equipment/fixed-assets',
            component: () => import('@/views/equipment-manage/master-data/fixed-assets'),
            name: 'EquipmentMasterDataFixedAssets',
            meta: {
              faName: 'EquipmentMasterData',
              title: '设备固定资产台账',
              permissionName: 'equip_property'
            }
          },
          {
            path: '/equipment/location-area',
            component: () => import('@/views/equipment-manage/master-data/location-area'),
            name: 'EquipmentMasterDataLocation',
            meta: {
              faName: 'EquipmentMasterData',
              title: '设备位置区域定义',
              permissionName: 'equip_area'
            }
          },
          // {
          //   path: '/equipment/type',
          //   component: () => import('@/views/equipment-manage/master-data/type'),
          //   name: 'EquipmentMasterDataType',
          //   meta: {
          //     faName: 'EquipmentMasterData',
          //     title: '设备种类定义',
          //     permissionName: ''
          //   }
          // },
          {
            path: '/equipment/region',
            component: () => import('@/views/equipment-manage/master-data/region'),
            name: 'EquipmentMasterDataRegion',
            meta: {
              faName: 'EquipmentMasterData',
              title: '设备部位定义',
              permissionName: 'equip_part'
            }
          },
          {
            path: '/equipment/parts-type',
            component: () => import('@/views/equipment-manage/master-data/parts-type'),
            name: 'EquipmentMasterDataPartsType',
            meta: {
              faName: 'EquipmentMasterData',
              title: '设备部件分类',
              permissionName: 'equip_component_type'
            }
          },
          {
            path: '/equipment/parts-define',
            component: () => import('@/views/equipment-manage/master-data/parts-define'),
            name: 'EquipmentMasterDataPartsDefine',
            meta: {
              faName: 'EquipmentMasterData',
              title: '设备部件定义',
              permissionName: 'equip_component'
            }
          },
          {
            path: '/equipment/BOM-manage',
            component: () => import('@/views/equipment-manage/master-data/BOM-manage'),
            name: 'EquipmentMasterDataBOMManage',
            meta: {
              faName: 'EquipmentMasterData',
              title: '设备BOM管理',
              permissionName: 'equip_bom'
            }
          },
          {
            path: '/equipment/ERP-material',
            component: () => import('@/views/equipment-manage/master-data/ERP-material'),
            name: 'EquipmentMasterDataERPMaterial',
            meta: {
              faName: 'EquipmentMasterData',
              title: 'ERP备件物料信息',
              permissionName: 'equip_spare_erp'
            }
          },
          {
            path: '/equipment/spare-parts-code',
            component: () => import('@/views/equipment-manage/master-data/spare-parts-code'),
            name: 'EquipmentMasterDataSparePartsCode',
            meta: {
              faName: 'EquipmentMasterData',
              title: '备件代码定义',
              permissionName: 'equip_spare'
            }
          },
          {
            path: '/equipment/fault-classify',
            component: () => import('@/views/equipment-manage/master-data/fault-classify'),
            name: 'EquipmentMasterDataFaultClassify',
            meta: {
              faName: 'EquipmentMasterData',
              title: '设备故障分类管理',
              permissionName: 'equip_fault_type'
            }
          },
          {
            path: '/equipment/equip-fault-signal',
            component: () => import('@/views/equipment-manage/master-data/equip-fault-signal'),
            name: 'EquipmentMasterDataFaultSignal',
            meta: {
              faName: 'EquipmentMasterData',
              title: '设备故障信号定义',
              permissionName: 'equip_fault_signal'
            }
          },
          {
            path: '/equipment/shutdown-reason',
            component: () => import('@/views/equipment-manage/master-data/shutdown-reason'),
            name: 'EquipmentMasterDataShutdownReason',
            meta: {
              faName: 'EquipmentMasterData',
              title: '设备停机原因定义',
              permissionName: 'equip_halt_reason'
            }
          },
          {
            path: '/equipment/appoint-rule',
            component: () => import('@/views/equipment-manage/master-data/appoint-rule'),
            name: 'EquipmentMasterDataAppointRule',
            meta: {
              faName: 'EquipmentMasterData',
              title: '工单指派规则定义',
              permissionName: 'equip_assign_rule'
            }
          },
          {
            path: '/equipment/MTBF-MTTR',
            component: () => import('@/views/equipment-manage/master-data/MTBF-MTTR'),
            name: 'EquipmentMasterDataMTBFMTTR',
            meta: {
              faName: 'EquipmentMasterData',
              title: '目标MTBF/MTTR设定',
              permissionName: 'equip_mtbf_mttr_setting'
            }
          },
          {
            path: '/equipment/repair-all',
            component: () => import('@/views/equipment-manage/master-data/repair-all'),
            name: 'EquipmentMasterDataRepairAll',
            meta: {
              faName: 'EquipmentMasterData',
              title: '维修包干定义',
              permissionName: 'equip_maintenance_setting'
            }
          }
        ]
      },
      {
        path: '/equipment/report-form',
        redirect: '/equipment/supplier',
        component: () => import('@/views/equipment-manage/report-form/a-index'),
        name: 'EquipmentReportForm',
        meta: {
          title: '统计报表',
          icon: 'quality'
        },
        children: [
          {
            path: '/equipment/OEE',
            component: () => import('@/views/equipment-manage/report-form/OEE'),
            name: 'EquipmentReportFormOEE',
            meta: {
              faName: 'EquipmentReportForm',
              title: '密炼机 设备OEE分析',
              permissionName: ''
            }
          },
          {
            path: '/equipment/reportForm/MTBF-MTTR',
            component: () => import('@/views/equipment-manage/report-form/MTBF-MTTR'),
            name: 'EquipmentReportFormMTBFMTTR',
            meta: {
              faName: 'EquipmentReportForm',
              title: 'MTBF/MTTR分析报表',
              permissionName: 'equip_mtbfmttp_statement'
            }
          },
          {
            path: '/equipment/order-time',
            component: () => import('@/views/equipment-manage/report-form/order-time'),
            name: 'EquipmentReportFormOrder',
            meta: {
              faName: 'EquipmentReportForm',
              title: '工单别处理时间报表',
              permissionName: 'equip_workorder_statement'
            }
          },
          {
            path: '/equipment/equip-time',
            component: () => import('@/views/equipment-manage/report-form/equip-time'),
            name: 'EquipmentReportFormEquip',
            meta: {
              faName: 'EquipmentReportForm',
              title: '机台别处理时间报表',
              permissionName: 'equip_statement'
            }
          },
          {
            path: '/equipment/person-time',
            component: () => import('@/views/equipment-manage/report-form/person-time'),
            name: 'EquipmentReportFormPerson',
            meta: {
              faName: 'EquipmentReportForm',
              title: '人员别处理时间报表',
              permissionName: 'equip_user_statement'
            }
          },
          {
            path: '/equipment/order-processing',
            component: () => import('@/views/equipment-manage/report-form/order-processing'),
            name: 'EquipmentReportFormOrderProcessing',
            meta: {
              faName: 'EquipmentReportForm',
              title: '期间别处理时间报表',
              permissionName: 'equip_period_statement'
            }
          },
          {
            path: '/equipment/order-completed',
            component: () => import('@/views/equipment-manage/report-form/order-completed'),
            name: 'EquipmentReportFormOrderCompleted',
            meta: {
              faName: 'EquipmentReportForm',
              title: '工单按时完成率报表',
              permissionName: 'equip_finishing_rate'
            }
          },
          {
            path: '/equipment/obsolescence-rate',
            component: () => import('@/views/equipment-manage/report-form/obsolescence-rate'),
            name: 'EquipmentReportFormObsolescenceRate',
            meta: {
              faName: 'EquipmentReportForm',
              title: '交旧率报表',
              permissionName: 'equip_old_rate'
            }
          },
          {
            path: '/equipment/order-receiving',
            component: () => import('@/views/equipment-manage/report-form/order-receiving'),
            name: 'EquipmentReportFormOrderReceiving',
            meta: {
              faName: 'EquipmentReportForm',
              title: '设备故障统计列表',
              permissionName: ''
            }
          },
          {
            path: '/equipment/fault-cause',
            component: () => import('@/views/equipment-manage/report-form/fault-cause'),
            name: 'EquipmentReportFormFaultCause',
            meta: {
              faName: 'EquipmentReportForm',
              title: '设备故障分析报表',
              permissionName: ''
            }
          },
          {
            path: '/equipment/energy-consumption',
            component: () => import('@/views/equipment-manage/report-form/energy-consumption'),
            name: 'EquipmentReportFormEnergyConsumption',
            meta: {
              faName: 'EquipmentReportForm',
              title: '能耗（电）统计报表',
              permissionName: ''
            }
          }
        ]
      }
    ]
  }
]
