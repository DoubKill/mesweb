import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    redirect: '/home'
  // children: [
  // {
  //   path: '/2code',
  //   component: () => import('@/views/homePage/2code'),
  //   meta: {
  //     title: '二维码',
  //     icon: 'el-icon-s-home'
  //   }
  // }
  // ]
  },
  {
    path: '/phone/fault-day-statistics',
    component: () => import('@/views/quality_management/phone/fault-day-statistics'),
    hidden: true,
    meta: {
      isPhone: true
    }
  },
  {
    path: '/phone/fault-week-statistics',
    component: () => import('@/views/quality_management/phone/fault-week-statistics'),
    hidden: true,
    meta: {
      isPhone: true
    }
  },
  {
    path: '/phone/fault-month-statistics',
    component: () => import('@/views/quality_management/phone/fault-month-statistics'),
    hidden: true,
    meta: {
      isPhone: true
    }
  },
  {
    path: '/Outbound-Kanban/:id',
    component: () => import('@/views/Z-Outbound-Kanban'),
    hidden: true,
    meta: {
      // 是否是单独页面
      isPhone: true
    }
  }
]

// 存在权限的路由
// meta.permissionName  权限
export const asyncRoutes = [
  {
    path: '/home',
    component: Layout,
    redirect: '/homePage',
    name: 'home',
    meta: {
      title: '首页',
      icon: 'el-icon-s-home'
    },
    children: [{
      path: '/homePage',
      component: () => import('@/views/homePage/index'),
      name: 'HomePageMain',
      meta: {
        title: '首页',
        icon: 'el-icon-s-home'
      }
    }
    ]
  },
  {
    path: '/global',
    component: Layout,
    redirect: '/global/codes/manage',
    name: 'globalManage',
    meta: {
      title: '基础信息管理',
      icon: 'dashboard'
    },
    children: [{
      path: '/global/codes/manage',
      name: 'GlobalCodesManage',
      component: () => import('@/views/basic/global-codes-manage/index'),
      meta: {
        title: '公用代码管理',
        icon: 'dashboard',
        permissionName: 'globalcodetype'
      }
    },
    {
      path: '/group/manage',
      name: 'GroupManage',
      component: () => import('@/views/basic/group-manage/index'),
      meta: {
        title: '角色管理',
        icon: 'dashboard',
        permissionName: 'groupextension'
      }
    },
    {
      path: '/group/department',
      name: 'DepartmenManage',
      component: () => import('@/views/basic/department-manage/index'),
      meta: {
        title: '部门管理',
        icon: 'dashboard',
        permissionName: 'department'
      }
    },
    {
      path: '/user/manage',
      name: 'UserManage',
      component: () => import('@/views/basic/user-manage/index'),
      meta: {
        title: '用户管理',
        icon: 'dashboard',
        permissionName: 'user'
      }
    },
    {
      path: '/users/by/group/manage',
      name: 'UsersByGroupManage',
      component: () => import('@/views/basic/users-by-group-manage/index'),
      meta: {
        title: '角色别用户管理',
        icon: 'dashboard',
        permissionName: 'group_user'
      }
    },
    {
      path: '/equip/base/info/manage',
      name: 'EquipBaseInfoManage',
      component: () => import('@/views/change_shifts_manage/index'),
      meta: {
        title: '倒班时间管理',
        icon: 'dashboard',
        permissionName: 'workschedule'
      }
    },
    {
      path: '/change/shifts/manage',
      name: 'ChangeShiftsManage',
      component: () => import('@/views/factory_schedule_manage/index'),
      meta: {
        title: '工厂排班管理',
        icon: 'dashboard',
        permissionName: 'planschedule'
      }
    },
    {
      path: '/factory/schedule/manage',
      name: 'FactoryScheduleManage',
      component: () => import('@/views/factory_schedule_result/index'),
      meta: {
        title: '工厂排班结果',
        icon: 'dashboard',
        permissionName: 'planschedule'
      }
    },
    {
      path: '/location-site',
      component: () => import('@/views/basic/location-site'),
      name: 'LocationSite',
      meta: {
        title: '位置点管理',
        icon: 'dashboard',
        permissionName: 'location'
      }
    },
    {
      path: '/factory',
      redirect: '/factory/category/manage',
      component: () => import('@/views/category_manage/category-fa'),
      // component: {render: c => c('router-view')},
      name: 'Factory',
      meta: {
        title: '设备管理',
        icon: 'dashboard'
      },
      children: [{
        path: '/factory/category/manage',
        name: 'CategoryManage',
        component: () => import('@/views/category_manage/index'),
        meta: {
          faName: 'Factory',
          title: '设备种类',
          permissionName: 'equipcategoryattribute'
        }
      },
      {
        path: '/factory/equip/manage',
        name: 'EquipManage',
        component: () => import('@/views/equip_manage/index'),
        meta: {
          faName: 'Factory',
          title: '设备基础信息',
          permissionName: 'equip'
        }
      }
      ]
    }
    // {
    //   path: '/powder-tank',
    //   component: () => import('@/views/basic/powder-tank'),
    //   name: 'PowderTank',
    //   meta: {
    //     title: '粉料罐-油料罐 物料设定',
    //     icon: 'dashboard',
    //     permissionName: ''
    //   }
    // }
    ]
  },
  {
    path: '/recipe',
    component: Layout,
    redirect: '/material/base/info/manage',
    name: 'recipe',
    meta: {
      title: '配方管理',
      icon: 'formula'
    },
    children: [{
      path: '/material/base/info/manage',
      name: 'MaterialBaseInfoManage',
      component: () => import('@/views/material_base_info_manage/index'),
      meta: {
        title: '原材料基础信息',
        icon: 'formula',
        permissionName: 'material'
      }
    },
    // {
    //   path: '/material-info-mapping',
    //   component: () => import('@/views/quality_management/material-info-mapping/material-info-mapping'),
    //   name: 'MaterialInfoMapping',
    //   meta: {
    //     title: 'mes与子系统物料信息映射',
    //     icon: 'formula',
    //     permissionName: 'material_map'
    //   }
    // },
    {
      path: '/rb/recipe/ERP-material-info',
      component: () => import('@/views/quality_management/material-info-mapping/ERP-material-info'),
      name: 'ERPMaterialInfo',
      meta: {
        title: 'ERP原材料信息',
        icon: 'formula',
        permissionName: 'material_map'
      }
    },
    {
      path: '/rb/recipe/std/manage',
      name: 'RbRecipeStdManage',
      component: () => import('@/views/rubber_recipe_standard_manage/index'),
      meta: {
        title: '胶料代码管理',
        icon: 'formula',
        permissionName: 'productinfo'
      }
    },
    {
      path: '/rb/material/std/manage',
      name: 'RbMaterialStdManage',
      component: () => import('@/views/rb_material_std_manage/newIndex'),
      meta: {
        title: '胶料配方标准管理',
        icon: 'formula',
        permissionName: 'productbatching'
      }
    },
    // {
    //   path: '/rb/material/std/manage111',
    //   name: 'rb-material-std-manage111',
    //   component: () => import('@/views/rb_material_std_manage/index'),
    //   meta: {
    //     title: '胶料配方标准管理1111',
    //     icon: 'formula',
    //     permissionName: 'productbatching'
    //   }
    // },
    {
      path: '/rb/material-tank/manage',
      name: 'MaterialTank',
      component: () => import('@/views/recipe/tankInformation/list'),
      meta: {
        title: '称量系统料仓信息管理',
        icon: 'formula',
        permissionName: 'weight_tank'
      }
    }
      // {
      //   path: '/search/rubber/info',
      //   name: 'search-rubber-info',
      //   component: () => import('@/views/recipe/small-material-recipe/index'),
      //   meta: {
      //     title: '小料配料标准管理',
      //     icon: 'formula',
      //     permissionName: 'weight_batching'
      //   }
      // }
    ]
  },
  {
    path: '/plan',
    component: Layout,
    redirect: '/rubber/schedule/daily/plan',
    name: 'plan',
    meta: {
      title: '生产计划管理',
      icon: 'productionPlanManagement'
    },
    children: [{
      path: '/rubber/schedule/daily/plan',
      name: 'RubberScheduleDailyPlan',
      component: () => import('@/views/rubber_schedule_daily_plan/index'),
      meta: {
        title: '排产胶料日计划',
        icon: 'productionPlanManagement',
        permissionName: 'productdayplan'
      }
    },
    {
      path: '/rubber/schedule/daily/plan/release',
      name: 'RubberScheduleDailyPlanRelease',
      component: () => import('@/views/rubber_schedule_daily_plan/release'),
      meta: {
        title: '排产胶料日计划下达',
        icon: 'productionPlanManagement',
        permissionName: 'productdayplan'
      }
    },
    {
      path: '/material/requisitions/plan',
      name: 'MaterialRequisitionsPlan',
      component: () => import('@/views/plan/material-requisitions-plan/index'),
      meta: {
        title: '排产领料计划',
        icon: 'productionPlanManagement',
        permissionName: 'productdayplan'
      }
    },
    {
      path: '/material/quantity/demanded',
      name: 'MaterialQuantityDemanded',
      component: () => import('@/views/material_quantity_demanded/index'),
      meta: {
        title: '物料需求量',
        icon: 'productionPlanManagement',
        permissionName: 'materialdemanded'
      }
    },
    {
      path: '/rubber-plan-release',
      name: 'RubberPlanRelease',
      component: () => import('@/views/recipe/rubber-plan-release'),
      meta: {
        title: '小料计划下达',
        icon: 'formula',
        permissionName: 'batching_plan'
      }
    },
    // {
    //   path: '/actual-comparison',
    //   name: 'ActualComparison',
    //   component: () => import('@/views/recipe/actual-comparison'),
    //   meta: {
    //     title: '小料称量计划与实际对比',
    //     icon: 'formula',
    //     permissionName: 'batching_reality'
    //   }
    // },
    {
      path: '/small-material-weight',
      redirect: '/small-material-weight/material',
      component: () => import('@/views/recipe/small-material-weight/index'),
      name: 'SmallMaterialWeight',
      meta: {
        title: '小料称量管理',
        icon: 'formula'
      },
      children: [
        {
          path: '/small-material-weight/material',
          component: () => import('@/views/recipe/small-material-weight/material'),
          name: 'SmallMaterialWeightMaterial',
          meta: {
            faName: 'SmallMaterialWeight',
            title: '物料管理',
            permissionName: 'xl_material'
          }
        },
        {
          path: '/small-material-weight/feed-bin',
          component: () => import('@/views/recipe/small-material-weight/feed-bin'),
          name: 'SmallMaterialWeightFeedBin',
          meta: {
            faName: 'SmallMaterialWeight',
            title: '料仓管理',
            permissionName: 'xl_bin'
          }
        },
        {
          path: '/small-material-weight/formula',
          component: () => import('@/views/recipe/small-material-weight/formula'),
          name: 'SmallMaterialWeightFormula',
          meta: {
            faName: 'SmallMaterialWeight',
            title: '配方管理',
            permissionName: 'xl_recipe'
          }
        },
        {
          path: '/small-material-weight/plan',
          component: () => import('@/views/recipe/small-material-weight/plan'),
          name: 'SmallMaterialWeightPlan',
          meta: {
            faName: 'SmallMaterialWeight',
            title: '计划管理',
            permissionName: 'xl_plan'
          }
        },
        {
          path: '/small-material-weight/train-number',
          component: () => import('@/views/recipe/small-material-weight/train-number'),
          name: 'SmallMaterialWeightTrainNumber',
          meta: {
            faName: 'SmallMaterialWeight',
            title: '车次报表',
            permissionName: 'xl_report_basic'
          }
        },
        {
          path: '/small-material-weight/consumption',
          component: () => import('@/views/recipe/small-material-weight/consumption'),
          name: 'SmallMaterialWeightConsumption',
          meta: {
            faName: 'SmallMaterialWeight',
            title: '物料消耗报表',
            permissionName: 'xl_report_weight'
          }
        },
        {
          path: '/small-material-weight/trackingCard',
          component: () => import('@/views/recipe/small-material-weight/trackingCard'),
          name: 'SmallMaterialWeightTrackingCard',
          meta: {
            faName: 'SmallMaterialWeight',
            title: '料包产出-质量追踪卡管理',
            permissionName: 'xl_weight_card'
          }
        },
        {
          path: '/small-material-weight/valid',
          component: () => import('@/views/recipe/small-material-weight/valid'),
          name: 'SmallMaterialWeightValid',
          meta: {
            faName: 'SmallMaterialWeight',
            title: '料包有效期管理',
            permissionName: 'xl_expire_data'
          }
        }
      ]
    }
    ]
  },
  {
    path: '/produce',
    component: Layout,
    redirect: '/performance/manage',
    name: 'ProduceManage',
    meta: {
      title: '生产管理',
      icon: 'production'
    },
    children: [{
      path: '/performance/manage',
      component: () => import('@/views/production/banburying-performance-manage/index'),
      name: 'BanburyingPerformanceManage',
      meta: {
        title: '密炼实绩',
        icon: 'production',
        permissionName: 'product_actual'
      }
    },
    {
      path: '/plan/manage',
      component: () => import('@/views/banburying_plan/index'),
      name: 'BanburyingPlanManage',
      meta: {
        title: '密炼机台别计划对比',
        icon: 'production',
        permissionName: 'plan_reality'
      }
    },
    {
      path: '/internal/mixer',
      component: () => import('@/views/internal_mixer_production/index'),
      name: 'InternalMixerProduction',
      meta: {
        title: '密炼生产履历',
        icon: 'production',
        permissionName: 'product_record'
      }
    },
    {
      path: '/train-number-report',
      component: () => import('@/views/production/train-number-report.vue'),
      name: 'TrainNumberReport',
      meta: {
        title: '车次报表',
        icon: 'production',
        permissionName: 'trains_report'
      }
    },
    {
      path: '/product-plan-reality-analyse',
      component: () => import('@/views/production/product-plan-reality-analyse.vue'),
      name: 'ProductPlanRealityAnalyse',
      meta: {
        title: '产量计划实际分析（车数）',
        icon: 'production',
        permissionName: 'production_analyze'
      }
    },
    {
      path: '/interval-production-statistics',
      component: () => import('@/views/production/interval-production-statistics.vue'),
      name: 'IntervalProductionStatistics',
      meta: {
        title: '区间产量统计（车数）',
        icon: 'production',
        permissionName: 'section_production'
      }
    },
    {
      path: '/internal/investment',
      component: () => import('@/views/production/investment'),
      name: 'InternalInvestment',
      meta: {
        title: '密炼投入履历',
        icon: 'production',
        permissionName: 'batch_log'
      }
    },
    {
      path: '/drug-investment',
      component: () => import('@/views/production/drug-investment'),
      name: 'DrugInvestment',
      meta: {
        title: '药品投入统计',
        icon: 'production',
        permissionName: 'drug_analyze'
      }
    },
    // {
    //   path: '/zl-warehouse-out-kanban',
    //   component: () => import('@/views/production/warehouse-out-kanban.vue'),
    //   name: 'ZlWarehouseOutKanban',
    //   meta: {
    //     title: '终炼胶出库看板', icon: 'production',
    //     permissionName: 'zl_dashboard'
    //   }
    // },
    // {
    //   path: '/hl-warehouse-out-kanban',
    //   component: () => import('@/views/production/hl-warehouseOutKanban.vue'),
    //   name: 'HlWarehouseOutKanban',
    //   meta: {
    //     title: '混炼胶出库看板', icon: 'production',
    //     permissionName: 'hl_dashboard'
    //   }
    // },
    {
      path: '/summary-statistics',
      redirect: '/equipment/classes-banburying-summary',
      component: () => import('@/views/equipment-management/summary-statistics-fa'),
      name: 'SummaryStatistics',
      meta: {
        title: '生产信息汇总',
        icon: 'production'
      },
      children: [
        {
          path: '/equipment/classes-banburying-summary',
          component: () => import('@/views/equipment-management/classes-banburying-summary'),
          name: 'ClassesBanburyingSummary',
          meta: {
            faName: 'SummaryStatistics',
            title: '班次密炼时间汇总',
            permissionName: 'class_production_summary'
          }
        },
        {
          path: '/equipment/banburying-ratio-summary',
          component: () => import('@/views/equipment-management/banburying-ratio-summary'),
          name: 'BanburyingRatioSummary',
          meta: {
            faName: 'SummaryStatistics',
            title: '密炼时间占比汇总',
            permissionName: 'production_time_summary'
          }
        },
        {
          path: '/equipment/rubber-acar-summary',
          component: () => import('@/views/equipment-management/rubber-acar-summary'),
          name: 'RubberAcarSummary',
          meta: {
            faName: 'SummaryStatistics',
            title: '胶料单车次时间汇总',
            permissionName: 'single_trains_time_consume'
          }
        },
        {
          path: '/equipment/specs-switch-summary',
          component: () => import('@/views/equipment-management/specs-switch-summary'),
          name: 'SpecsSwitchSummary',
          meta: {
            faName: 'SummaryStatistics',
            title: '规格切换时间汇总',
            permissionName: 'product_exchange_consume'
          }
        }
      ]
    },
    {
      path: '/track',
      redirect: '/track-raw-material',
      component: () => import('@/views/production/track/track-raw-material'),
      name: 'Track',
      meta: {
        title: '条码追朔',
        icon: 'production'
      },
      children: [
        {
          path: '/track-raw-material',
          name: 'TrackRawMaterial',
          component: () => import('@/views/production/track/track-raw-material'),
          meta: {
            faName: 'Track',
            title: '原材料条码追朔',
            permissionName: 'material_retrospect'
          }
        },
        {
          path: '/track-raw-rubber',
          name: 'TrackRawRubber',
          component: () => import('@/views/production/track/track-raw-rubber'),
          meta: {
            faName: 'Track',
            title: '胶片条码追朔',
            permissionName: 'product_retrospect'
          }
        }
      ]
    },
    {
      path: '/statistical-report',
      redirect: '/report/produce-work',
      component: () => import('@/views/equipment-management/report/report-fa'),
      name: 'StatisticalReport',
      meta: {
        title: '统计报表',
        icon: 'production'
      },
      children: [
        {
          path: '/report/produce-work',
          component: () => import('@/views/equipment-management/report/produce-work'),
          name: 'ProduceWork',
          meta: {
            faName: 'StatisticalReport',
            title: '生产运行记录',
            permissionName: 'production_record'
          }
        },
        // {
        //   path: '/report/material-requirement',
        //   component: () => import('@/views/equipment-management/report/material-requirement'),
        //   name: 'material-requirement',
        //   meta: {
        //     title: '物料需求汇总',
        //     permissionName: ''
        //   }
        // },
        {
          path: '/report/rubber-stock',
          component: () => import('@/views/equipment-management/report/rubber-stock'),
          name: 'RubberStock',
          meta: {
            faName: 'StatisticalReport',
            title: '胶料库存明细',
            permissionName: 'product_stock_detail'
          }
        },
        {
          path: '/report/workshop-stock',
          component: () => import('@/views/equipment-management/report/workshop-stock'),
          name: 'WorkshopStock',
          meta: {
            faName: 'StatisticalReport',
            title: '车间库存明细',
            permissionName: 'workshop_stock_detail'
          }
        }
      ]
    }

      // {
      //   path: 'collect/rub/daily',
      //   component: () => import('@/views/collect_rubber_daily_manage/index'),
      //   name: 'CollectRubDailyManage',
      //   meta: {
      //     title: '日别胶料收皮管理',
      //     permissionName: 'pallet_feedback'
      //   }
      // }
    ]
  },
  {
    path: '/repertory',
    component: Layout,
    redirect: '/warehouse-info',
    name: 'RepertoryManage',
    meta: {
      title: '库存管理',
      icon: 'stock'
    },
    children: [
      {
        path: '/warehouse-info',
        component: () => import('@/views/inventory/warehouse_info.vue'),
        name: 'WarehouseInfo',
        meta: {
          title: '仓库信息管理',
          icon: 'stock',
          permissionName: 'warehouse'
        }
      },
      {
        path: '/material',
        component: () => import('@/views/material_repertory_manage/index'),
        name: 'MaterialRepertoryManage',
        meta: {
          title: '原材料库存',
          icon: 'stock',
          permissionName: 'material_inventory'
        }
      },
      // {
      //   path: 'rubber-inventory-info',
      //   component: () => import('@/views/inventory/rubber_inventory_info.vue'),
      //   name: 'RubberInventoryInfo',
      //   meta: {
      //     title: '胶料库存信息汇总',
      //     permissionName: 'warehouse_summary'
      //   }
      // },
      {
        path: '/rubber',
        component: () => import('@/views/rubber_repertory_manage/index'),
        name: 'RubberRepertoryManage',
        meta: {
          title: '混炼胶库存',
          icon: 'stock',
          permissionName: 'product_inventory'
        }
      },
      {
        path: '/lineSideLibrary',
        redirect: '/lineSideLibrary/Location',
        component: () => import('@/views/inventory/lineSideLibrary/a-index.vue'),
        name: 'LineSideLibrary',
        meta: {
          title: '线边库存',
          icon: 'stock'
        },
        children: [
          {
            path: '/lineSideLibrary/location',
            component: () => import('@/views/inventory/lineSideLibrary/location.vue'),
            name: 'LineSideLocation',
            meta: {
              faName: 'LineSideLibrary',
              title: '库区库位管理',
              permissionName: 'depot'
            }
          },
          {
            path: '/lineSideLibrary/inOutWarehouse',
            component: () => import('@/views/inventory/lineSideLibrary/inOutWarehouse.vue'),
            name: 'LineSideInOutWarehouse',
            meta: {
              faName: 'LineSideLibrary',
              title: '出入库管理',
              permissionName: 'pallet_data'
            }
          },
          {
            path: '/lineSideLibrary/stockRecord',
            component: () => import('@/views/inventory/lineSideLibrary/stockRecord.vue'),
            name: 'LineSideStockRecord',
            meta: {
              faName: 'LineSideLibrary',
              title: '库存查询',
              permissionName: 'depot_pallet'
            }
          },
          {
            path: '/lineSideLibrary/inOutWarehouseResume',
            component: () => import('@/views/inventory/lineSideLibrary/inOutWarehouseResume.vue'),
            name: 'LineSideInOutWarehouseResume',
            meta: {
              faName: 'LineSideLibrary',
              title: '出入库履历',
              permissionName: 'depot_resume'
            }
          }
        ]
      },
      {
        path: '/sulphurLibrary',
        redirect: '/sulphurLibrary/Location',
        component: () => import('@/views/inventory/sulphurLibrary/a-index.vue'),
        name: 'SulphurLibrary',
        meta: {
          title: '硫磺库存',
          icon: 'stock'
        },
        children: [
          {
            path: '/sulphurLibrary/location',
            component: () => import('@/views/inventory/sulphurLibrary/location.vue'),
            name: 'SulphurLocation',
            meta: {
              faName: 'SulphurLibrary',
              title: '库区库位管理',
              permissionName: 'sulfur_depot'
            }
          },
          {
            path: '/sulphurLibrary/inOutWarehouse',
            component: () => import('@/views/inventory/sulphurLibrary/inOutWarehouse.vue'),
            name: 'SulphurInOutWarehouse',
            meta: {
              faName: 'SulphurLibrary',
              title: '出入库管理',
              permissionName: 'sulfur_data'
            }
          },
          {
            path: '/sulphurLibrary/stockRecord',
            component: () => import('@/views/inventory/sulphurLibrary/stockRecord.vue'),
            name: 'SulphurStockRecord',
            meta: {
              faName: 'SulphurLibrary',
              title: '库存查询',
              permissionName: 'depot_sulfur'
            }
          },
          {
            path: '/sulphurLibrary/inOutWarehouseResume',
            component: () => import('@/views/inventory/sulphurLibrary/inOutWarehouseResume.vue'),
            name: 'SulphurInOutWarehouseResume',
            meta: {
              faName: 'SulphurLibrary',
              title: '出入库履历',
              permissionName: 'sulfur_resume'
            }
          }
        ]
      },
      {
        path: '/material-inout-record',
        component: () => import('@/views/inventory/material_inout_record.vue'),
        name: 'MaterialInOutRecord',
        meta: {
          title: '物料出入库履历',
          icon: 'stock',
          permissionName: 'in_out_history'
        }
      },
      // {
      //   path: '/film-inout-record',
      //   component: () => import('@/views/inventory/film-inout-record.vue'),
      //   name: 'film-inout-record',
      //   meta: {
      //     title: '胶片出入库履历',
      //     icon: 'stock',
      //     permissionName: ''
      //   }
      // },
      {
        path: '/material-inventory-manage',
        component: () => import('@/views/inventory/material-inventory-manage.vue'),
        name: 'MaterialInventoryManage',
        meta: {
          title: '物料库位信息',
          icon: 'stock',
          permissionName: 'goods'
        }
      },
      // {
      //   path: 'outbound-manage',
      //   component: () => import('@/views/inventory/outbound_manage.vue'),
      //   name: 'OutboundManage',
      //   meta: {
      //     title: '出库计划管理',
      //     permissionName: 'product_inventory'
      //   }
      // },
      {
        path: '/final-mixing-rubber-manage',
        component: () => import('@/views/inventory/final-mixing-rubber-manage.vue'),
        name: 'FinalMixingRubber',
        meta: {
          title: '终炼胶出库计划',
          icon: 'stock',
          permissionName: 'finalRubber_plan'
        }
      },
      {
        path: '/compound-rubber-manage',
        component: () => import('@/views/inventory/compound-rubber-manage.vue'),
        name: 'CompoundManage',
        meta: {
          title: '混炼胶出库计划',
          icon: 'stock',
          permissionName: 'compoundRubber_plan'
        }
      },
      {
        path: '/material-delivery-manage',
        redirect: '/material-delivery-manage/task',
        component: () => import('@/views/inventory/material-delivery-manage/a-index.vue'),
        name: 'MaterialDelivery',
        meta: {
          title: '原材料出库管理',
          icon: 'stock'
        },
        children: [
          {
            path: '/material-delivery-manage/task',
            component: () => import('@/views/inventory/material-delivery-manage/task.vue'),
            name: 'DeliveryTask',
            meta: {
              faName: 'MaterialDelivery',
              title: '出库任务',
              permissionName: 'material_outbound_task'
            }
          },
          {
            path: '/receive-good-manage/bill',
            component: () => import('@/views/inventory/material-delivery-manage/bill.vue'),
            name: 'DeliveryBill',
            meta: {
              faName: 'MaterialDelivery',
              title: '出库单据',
              permissionName: 'material_outbound_record'
            }
          },
          {
            path: '/material-delivery-manage/daily',
            component: () => import('@/views/inventory/material-delivery-manage/daily.vue'),
            name: 'DeliveryDaily',
            meta: {
              faName: 'MaterialDelivery',
              title: '出库日报',
              permissionName: 'material_daily_summary'
            }
          },
          {
            path: '/receive-good-manage/monthly',
            component: () => import('@/views/inventory/material-delivery-manage/monthly.vue'),
            name: 'DeliveryMonthly',
            meta: {
              faName: 'MaterialDelivery',
              title: '出库月报',
              permissionName: 'material_monthly_summary'
            }
          },
          {
            path: '/receive-good-manage/yearly',
            component: () => import('@/views/inventory/material-delivery-manage/yearly.vue'),
            name: 'DeliveryYearly',
            meta: {
              faName: 'MaterialDelivery',
              title: '出库年报',
              permissionName: 'material_yearly_summary'
            }
          },
          {
            path: '/receive-good-manage/stock',
            component: () => import('@/views/inventory/material-delivery-manage/stock.vue'),
            name: 'DeliveryStock',
            meta: {
              faName: 'MaterialDelivery',
              title: '库存管理',
              permissionName: 'material_inventory_summary'
            }
          }
        ]
      },
      {
        path: '/carbon-delivery-manage',
        redirect: '/carbon-delivery-manage/task',
        component: () => import('@/views/inventory/carbon-delivery-manage/a-index.vue'),
        name: 'CarbonDelivery',
        meta: {
          title: '炭黑出库管理',
          icon: 'stock'
        },
        children: [
          {
            path: '/carbon-delivery-manage/task',
            component: () => import('@/views/inventory/carbon-delivery-manage/task.vue'),
            name: 'CarbonDeliveryTask',
            meta: {
              faName: 'CarbonDelivery',
              title: '出库任务',
              permissionName: 'th_outbound_task'
            }
          },
          {
            path: '/carbon-good-manage/bill',
            component: () => import('@/views/inventory/carbon-delivery-manage/bill.vue'),
            name: 'CarbonDeliveryBill',
            meta: {
              faName: 'CarbonDelivery',
              title: '出库单据',
              permissionName: 'th_outbound_record'
            }
          },
          {
            path: '/carbon-delivery-manage/daily',
            component: () => import('@/views/inventory/carbon-delivery-manage/daily.vue'),
            name: 'CarbonDeliveryDaily',
            meta: {
              faName: 'CarbonDelivery',
              title: '出库日报',
              permissionName: 'th_daily_summary'
            }
          },
          {
            path: '/carbon-delivery-manage/monthly',
            component: () => import('@/views/inventory/carbon-delivery-manage/monthly.vue'),
            name: 'CarbonDeliveryMonthly',
            meta: {
              faName: 'CarbonDelivery',
              title: '出库月报',
              permissionName: 'material_th_summary'
            }
          },
          {
            path: '/carbon-delivery-manage/yearly',
            component: () => import('@/views/inventory/carbon-delivery-manage/yearly.vue'),
            name: 'CarbonDeliveryYearly',
            meta: {
              faName: 'CarbonDelivery',
              title: '出库年报',
              permissionName: 'th_yearly_summary'
            }
          },
          {
            path: '/carbon-delivery-manage/stock',
            component: () => import('@/views/inventory/carbon-delivery-manage/stock.vue'),
            name: 'CarbonDeliveryStock',
            meta: {
              faName: 'CarbonDelivery',
              title: '库存管理',
              permissionName: 'th_inventory_summary'
            }
          }
        ]
      },
      // {
      //   path: '/raw-material-manage',
      //   component: () => import('@/views/inventory/raw-material-manage.vue'),
      //   name: 'RawMaterial',
      //   meta: {
      //     title: '原材料出库计划',
      //     icon: 'stock',
      //     permissionName: 'material_outbound_plan'
      //   }
      // },
      // {
      //   path: '/druss-delivery',
      //   component: () => import('@/views/inventory/druss-delivery.vue'),
      //   name: 'DrussDelivery',
      //   meta: {
      //     title: '炭黑出库计划',
      //     icon: 'stock',
      //     permissionName: 'carbon_outbound_plan'
      //   }
      // },
      // {
      //   path: '/final-rubber-manage',
      //   component: () => import('@/views/inventory/final_rubber_manage.vue'),
      //   name: 'OutboundManage',
      //   meta: {
      //     title: '胶片库出库计划',
      //     icon: 'stock',
      //     permissionName: 'inventory_plan'
      //   }
      // },
      {
        path: '/curtain-storehouse',
        component: () => import('@/views/inventory/curtain-storehouse.vue'),
        name: 'CurtainStorehouse',
        meta: {
          title: '帘布库出库计划',
          icon: 'stock',
          permissionName: 'LB_inventory_plan'
        }
      },
      // {
      //   path: '/expire-rubber-manage',
      //   component: () => import('@/views/inventory/expire_rubber_manage.vue'),
      //   name: 'ExpireRubberManage',
      //   meta: {
      //     title: '过期胶料管理',
      //     permissionName: 'expire_product'
      //   }
      // },
      {
        path: '/material-attribute-manage',
        component: () => import('@/views/inventory/material-attribute-manage.vue'),
        name: 'MaterialAttributeManage',
        meta: {
          icon: 'stock',
          title: '物料属性管理',
          permissionName: 'material_attr'
        }
      },
      {
        path: '/receive-good-manage',
        redirect: '/receive-good-manage/index',
        component: () => import('@/views/inventory/receive-good-manage/index.vue'),
        name: 'ReceiveGoodManage',
        meta: {
          title: '发货管理',
          icon: 'stock'
        },
        children: [
          {
            path: '/receive-good-manage/index',
            component: () => import('@/views/inventory/receive-good-manage/receive-list.vue'),
            name: 'ReceiveGoodManageIndex',
            meta: {
              faName: 'ReceiveGoodManage',
              title: '发货计划管理',
              permissionName: 'delivery_plan'
            }
          },
          {
            path: '/receive-good-manage/view',
            component: () => import('@/views/inventory/receive-good-manage/receive-view.vue'),
            name: 'ReceiveGoodManageView',
            meta: {
              title: '发货履历管理',
              permissionName: 'delivery_history'
            }
          },
          {
            path: '/receive-good-manage/address',
            component: () => import('@/views/inventory/receive-good-manage/receive-address.vue'),
            name: 'ReceiveGoodManageAddress',
            meta: {
              title: '发货地管理',
              permissionName: 'delivery_address'
            }
          }
        ]
      }
    ]
  },
  {
    path: '/quality',
    component: Layout,
    redirect: '/quick-check/test-indicators',
    name: 'quality',
    meta: {
      title: '质量管理',
      icon: 'quality'
    },
    children: [
      {
        path: '/quick-check',
        redirect: '/quick-check/test-indicators',
        component: () => import('@/views/quality_management/QuickCheck-fa'),
        name: 'QuickCheck',
        meta: {
          title: '快检标准管理',
          icon: 'quality'
        },
        children: [
          {
            path: '/quick-check/test-indicators',
            component: () => import('@/views/quality_management/test_indicators'),
            name: 'TestIndicators',
            meta: {
              faName: 'QuickCheck',
              title: '试验指标管理',
              permissionName: 'test_indicator'
            }
          },
          {
            path: '/quick-check/test-types',
            component: () => import('@/views/quality_management/test_types'),
            name: 'TestTypes',
            meta: {
              faName: 'QuickCheck',
              title: '试验类型管理',
              permissionName: 'test_type'
            }
          },
          {
            path: '/quick-check/test-methods-manage',
            component: () => import('@/views/quality_management/test_methods_manage'),
            name: 'TestMethodsManage',
            meta: {
              faName: 'QuickCheck',
              title: '试验方法管理',
              permissionName: 'test_method'
            }
          },
          // {
          //   path: 'quick-plan-manage',
          //   component: () => import('@/views/quality_management/quick_plan_manage'),
          //   namel: 'quickPlanManage',
          //   meta: {
          //     title: '快检计划管理'
          //   }
          // },
          {
            path: '/quick-check/grade-manage',
            component: () => import('@/views/quality_management/grade_manage'),
            name: 'GradeManage',
            meta: {
              faName: 'QuickCheck',
              title: '等级管理',
              permissionName: 'level'
            }
          },
          // {
          //   path: 'benchmark',
          //   component: () => import('@/views/quality_management/benchmark'),
          //   name: 'Benchmark',
          //   meta: {
          //     title: '胶料快检判定基准管理'
          //     // permissionName: 'material_inventory'
          //   }
          // },
          {
            path: '/quick-check/benchmark_edit',
            component: () => import('@/views/quality_management/benchmark_edit'),
            name: 'BenchmarkEdit',
            meta: {
              faName: 'QuickCheck',
              title: '胶料快检判定基准录入',
              permissionName: 'evaluating'
            }
          }
        ]
      },
      {
        path: '/statistics',
        redirect: '/statistics/month-pass-detail',
        component: () => import('@/views/quality_management/quality-statistics-fa'),
        name: 'QualityStatistics',
        meta: {
          title: '快检信息统计分析',
          icon: 'quality'
        },
        children: [
          {
            path: '/statistics/month-pass-detail',
            component: () => import('@/views/quality_management/month_pass_detail'),
            name: 'MonthPassDetail',
            meta: {
              faName: 'QualityStatistics',
              title: '月快检合格率统计',
              permissionName: 'month_passing_rate'
            }
          },
          {
            path: '/statistics/material-month-pass',
            component: () => import('@/views/quality_management/material_month_pass'),
            name: 'MaterialMonthPass',
            meta: {
              faName: 'QualityStatistics',
              title: '胶料月合格率统计',
              permissionName: 'product_month_passing_rate'
            }
          },
          {
            path: '/statistics/material-day-pass',
            component: () => import('@/views/quality_management/material_day_pass'),
            name: 'MaterialDayPass',
            meta: {
              faName: 'QualityStatistics',
              title: '胶料日合格率统计',
              permissionName: 'product_daily_passing_rate'
            }
          }
        ]
      },
      {
        path: '/unqualified-handle',
        redirect: '/unqualified-handle/inferior-quality-product-manage',
        component: () => import('@/views/quality_management/DisposalListGenerate-fa'),
        name: 'UnqualifiedHandle',
        meta: {
          title: '不合格品处理',
          icon: 'quality'
        },
        children: [
        // {
        //   path: 'inferior-quality-product-manage',
        //   component: () => import('@/views/quality_management/inferior_quality_product_manage'),
        //   name: 'InferiorQualityProductManage',
        //   meta: {
        //     title: '不合格品处理',
        //     permissionName: 'non-conformity_product'
        //   }
        // }, {
        //   path: 'unqualified-treatment-opinions-manage',
        //   component: () => import('@/views/quality_management/unqualified_treatment_opinions_manage'),
        //   name: 'UnqualifiedTreatmentOpinionsManage',
        //   meta: {
        //     title: '不合格处理意见管理',
        //     permissionName: 'deal_suggestion'
        //   }
        // }
          {
            path: '/unqualified-handle/disposal-list-generate',
            component: () => import('@/views/quality_management/disposal-list-generates.vue'),
            name: 'DisposalListGenerate',
            meta: {
              faName: 'UnqualifiedHandle',
              title: '不合格处置单生成',
              permissionName: 'unqualified_trains'
            }
          },
          {
            path: '/unqualified-handle/disposal-list',
            component: () => import('@/views/quality_management/disposal-list.vue'),
            name: 'DisposalList',
            meta: {
              faName: 'UnqualifiedHandle',
              title: '不合格处置单管理',
              permissionName: 'unqualified_order'
            }
          }
        ]
      },
      {
        path: '/inspection-result-management',
        redirect: '/inspection-result-management/manual-entry',
        component: () => import('@/views/quality_management/a-inspection-result-management-fa'),
        name: 'InspectionResultManagement',
        meta: {
          title: '快检结果管理',
          icon: 'quality'
        },
        children: [
          {
            path: '/inspection-result-management/manual-entry',
            component: () => import('@/views/quality_management/manual_entry'),
            name: 'ManualEntry',
            meta: {
              faName: 'InspectionResultManagement',
              title: '手工检测数据录入',
              permissionName: 'test_result'
            }
          },
          {
            path: '/inspection-result-management/details',
            component: () => import('@/views/quality_management/details'),
            name: 'Details',
            meta: {
              faName: 'InspectionResultManagement',
              title: '胶料快检详细信息',
              permissionName: 'result_info'
            }
          },
          {
            path: '/inspection-result-management/check-synthesize-manage',
            component: () => import('@/views/quality_management/check_synthesize_manage'),
            name: 'CheckSynthesizeManage',
            meta: {
              faName: 'InspectionResultManagement',
              title: '快检信息综合管理',
              permissionName: 'deal_result'
            }
          }
          // {
          //   path: '/inspection-result-management/menni-report',
          //   component: () => import('@/views/quality_management/menni-report'),
          //   name: 'RubberMenniReport',
          //   meta: {
          //     faName: 'InspectionResultManagement',
          //     title: '胶料门尼数据上报',
          //     permissionName: 'product_report_value'
          //   }
          // }
        ]
      },
      // {
      //   path: '/barcode-change',
      //   component: () => import('@/views/quality_management/material-info-mapping/barcode-change'),
      //   name: 'BarcodeChange',
      //   meta: {
      //     title: '条码变更',
      //     icon: 'quality',
      //     permissionName: 'bar_code'
      //   }
      // },
      // {
      //   path: '/result-entry',
      //   component: () => import('@/views/quality_management/result-entry'),
      //   name: 'ResultEntry',
      //   meta: {
      //     title: '原材料临时快检结果录入',
      //     icon: 'quality',
      //     permissionName: 'material_temp_input'
      //   }
      // },
      /** {
        path: '/material-quality',
        redirect: '/material-quality',
        component: {
          render: c => c('router-view')
        },
        name: 'material-quality',
        meta: {
          title: '原材料质检管理',
          icon: 'quality'
        },
        children: [
          {
            path: '/material-quality/test-indicators',
            component: () => import('@/views/quality_management/material/test_indicators'),
            name: 'material-testIndicators',
            meta: {
              title: '试验指标管理',
              permissionName: 'raw_test_indicator'
            }
          },
          {
            path: '/material-quality/test-types',
            component: () => import('@/views/quality_management/material/test_types'),
            name: 'material-testTypes',
            meta: {
              title: '试验类型管理',
              permissionName: 'raw_test_type'
            }
          },
          {
            path: '/material-quality/test-methods-manage',
            component: () => import('@/views/quality_management/material/test_methods_manage'),
            namel: 'material-testMethodsManage',
            meta: {
              title: '试验方法管理',
              permissionName: 'raw_test_method'
            }
          },
          {
            path: '/material-quality/grade-manage',
            component: () => import('@/views/quality_management/material/grade_manage'),
            namel: 'material-gradeManage',
            meta: {
              title: '等级管理',
              permissionName: 'raw_level'
            }
          },
          {
            path: '/material-quality/benchmark_edit',
            component: () => import('@/views/quality_management/material/benchmark_edit'),
            name: 'material-benchmark_edit',
            meta: {
              title: '物料快检判定基准录入',
              permissionName: 'raw_evaluating'
            }
          },
          {
            path: '/material-quality/info_entry',
            component: () => import('@/views/quality_management/material/info_entry'),
            name: 'material-info_entry',
            meta: {
              title: '原材料快检信息录入',
              permissionName: 'raw_test_result'
            }
          },
          {
            path: '/material-quality/results-view',
            component: () => import('@/views/quality_management/material/results-view'),
            name: 'material-results-view',
            meta: {
              title: '原材料快检结果查看',
              permissionName: 'raw_result_info'
            }
          },
          {
            path: '/material-quality/material-unqualified',
            component: () => import('@/views/quality_management/material/material-unqualified'),
            name: 'material-unqualified',
            meta: {
              title: '原材料不合格处理',
              permissionName: 'raw_unqualified_material'
            }
          }
        ]
      },**/
      {
        path: '/material-quickcheck',
        redirect: '/material-quickcheck',
        component: () => import('@/views/material_quickcheck_manage/quickcheck-fa'),
        name: 'MaterialQuickcheck',
        meta: {
          title: '原材料快检管理',
          icon: 'quality'
        },
        children: [
          {
            path: '/material-quickcheck/quickcheck-equipment',
            component: () => import('@/views/material_quickcheck_manage/material_quickcheck_equipment'),
            name: 'MaterialQuickcheckEquipment',
            meta: {
              faName: 'MaterialQuickcheck',
              title: '快检设备管理',
              permissionName: 'material_equipment'
            }
          },
          {
            path: '/material-quickcheck/quickcheck-type',
            component: () => import('@/views/material_quickcheck_manage/material_quickcheck_type'),
            name: 'MaterialQuickcheckType',
            meta: {
              faName: 'MaterialQuickcheck',
              title: '快检类型管理',
              permissionName: 'material_examine_type'
            }
          },
          {
            path: '/material-quickcheck/quickcheck-value',
            component: () => import('@/views/material_quickcheck_manage/material_quickcheck_value'),
            name: 'MaterialQuickcheckValue',
            meta: {
              faName: 'MaterialQuickcheck',
              title: '检测值管理',
              permissionName: 'material_examine_value'
            }
          },
          // {
          //   path: '/material-quickcheck/meniequipmentdata',
          //   component: () => import('@/views/material_quickcheck_manage/meniequipmentdata'),
          //   name: 'meniequipmentdata',
          //   meta: {
          // faName: 'MaterialQuickcheck',
          //     title: '门尼设备数据绑定管理',
          //     permissionName: ''
          //   }
          // },
          {
            path: '/material-quickcheck/raw-material',
            component: () => import('@/views/material_quickcheck_manage/raw_material'),
            name: 'QuickcheckRawMaterial',
            meta: {
              faName: 'MaterialQuickcheck',
              title: '原材料管理',
              permissionName: 'examine_material'
            }
          },
          {
            path: '/material-quickcheck/menni-equip',
            component: () => import('@/views/material_quickcheck_manage/menni-equip'),
            name: 'MenniEquip',
            meta: {
              faName: 'MaterialQuickcheck',
              title: '原材料门尼设备管理',
              permissionName: 'material_report_equip'
            }
          },
          {
            path: '/material-quickcheck/menni-report',
            component: () => import('@/views/material_quickcheck_manage/menni-report'),
            name: 'MenniReport',
            meta: {
              faName: 'MaterialQuickcheck',
              title: '原材料门尼数据上报',
              permissionName: 'material_report_value'
            }
          }
        ]
      }
      /** {
        path: '/quickCheck',
        redirect: '/quickCheck/deviceMonitor',
        component: () => import('@/views/quality_management/quickCheck/a-index'),
        name: 'QuickCheckGather',
        meta: {
          title: '快检数据采集',
          icon: 'quality'
        },
        children: [
          {
            path: '/inspection-result-management/menni-equip',
            component: () => import('@/views/quality_management/menni-equip'),
            name: 'RubberMenniEquip',
            meta: {
              faName: 'InspectionResultManagement',
              title: '胶料门尼设备管理',
              permissionName: 'product_report_equip'
            }
          },
          {
            path: '/quickCheck/deviceMonitor',
            component: () => import('@/views/quality_management/quickCheck/deviceMonitor'),
            name: 'DeviceMonitor',
            meta: {
              faName: 'QuickCheckGather',
              title: '快检设备监控',
              permissionName: 'examine_equip'
            }
          },
          {
            path: '/quickCheck/testPlan',
            component: () => import('@/views/quality_management/quickCheck/testPlan'),
            name: 'TestPlan',
            meta: {
              faName: 'QuickCheckGather',
              title: '快检检测计划',
              permissionName: 'examine_test_plan'
            }
          },
          {
            path: '/quickCheck/resume',
            component: () => import('@/views/quality_management/quickCheck/resume'),
            name: 'QuickCheckResume',
            meta: {
              faName: 'QuickCheckGather',
              title: '检测履历查询',
              permissionName: 'examine_sulfur'
            }
          }
        ]
      },
      {
        path: '/feed',
        redirect: '/feed/raw-plan',
        component: () => import('@/views/quality_management/feed/a-index'),
        name: 'Feed',
        meta: {
          title: '炭黑罐投料报错',
          icon: 'quality'
        },
        children: [
          {
            path: '/feed/raw-plan',
            component: () => import('@/views/quality_management/feed/raw-plan'),
            name: 'RawPlan',
            meta: {
              faName: 'Feed',
              title: '投料计划',
              permissionName: ''
            }
          },
          {
            path: '/feed/raw-weightSet',
            component: () => import('@/views/quality_management/feed/raw-weightSet'),
            name: 'RawWeightSet',
            meta: {
              faName: 'Feed',
              title: '投料重量设定',
              permissionName: ''
            }
          },
          {
            path: '/feed/raw-query',
            component: () => import('@/views/quality_management/feed/raw-query'),
            name: 'RawQuery',
            meta: {
              faName: 'Feed',
              title: '投料操作履历查询',
              permissionName: ''
            }
          }
        ]
      }**/
    ]
  },
  {
    path: '/equipment',
    component: Layout,
    redirect: '/equipment/classes-banburying-summary',
    name: 'equipment',
    meta: {
      title: '设备管理',
      icon: 'quality'
    },
    children: [
      {
        path: '/equipment/spare-part',
        redirect: '/spare-part/base/spare-location',
        component: () => import('@/views/equipment-management/a-spare-part-fa'),
        name: 'SparePart',
        meta: {
          title: '备品备件管理',
          icon: 'quality'
        },
        children: [
          {
            path: '/base',
            redirect: '/spare-location',
            component: () => import('@/views/equipment-management/spare-part/a-spare-part-fa'),
            name: 'SparePartBase',
            meta: {
              title: '基础管理'
            },
            children: [
              {
                path: '/spare-location',
                component: () => import('@/views/equipment-management/spare-part/spare-location'),
                name: 'SpareLocation',
                meta: {
                  faName: 'SparePartBase',
                  fourFaName: 'SparePart',
                  title: '库存位管理',
                  permissionName: 'spare_location'
                }
              },
              {
                path: '/spare-type',
                component: () => import('@/views/equipment-management/spare-part/spare-type'),
                name: 'SpareType',
                meta: {
                  faName: 'SparePartBase',
                  fourFaName: 'SparePart',
                  title: '类型管理',
                  permissionName: 'spare_type'
                }
              },
              {
                path: '/spareparts-spare',
                component: () => import('@/views/equipment-management/spare-part/spareparts-spare'),
                name: 'SparepartsSpare',
                meta: {
                  faName: 'SparePartBase',
                  fourFaName: 'SparePart',
                  title: '基本信息管理',
                  permissionName: 'spare_info'
                }
              },
              {
                path: '/shelf-material-binding',
                component: () => import('@/views/equipment-management/spare-part/shelf-material-binding'),
                name: 'ShelfMaterialBinding',
                meta: {
                  faName: 'SparePartBase',
                  fourFaName: 'SparePart',
                  title: '货架物料绑定管理',
                  permissionName: 'location_binding'
                }
              },
              {
                path: '/location-manage',
                component: () => import('@/views/equipment-management/spare-part/location-manage'),
                name: 'SparePartLocationManage',
                meta: {
                  faName: 'SparePartBase',
                  fourFaName: 'SparePart',
                  title: '备品备件库位管理',
                  permissionName: 'spare_inventory'
                }
              },
              {
                path: '/inventory-manage',
                component: () => import('@/views/equipment-management/spare-part/inventory-manage'),
                name: 'SparePartInventoryManage',
                meta: {
                  faName: 'SparePartBase',
                  fourFaName: 'SparePart',
                  title: '备品备件库存管理',
                  permissionName: 'spare_stock'
                }
              },
              {
                path: '/inventory-upload',
                component: () => import('@/views/equipment-management/spare-part/inventory-upload'),
                name: 'InventoryUpload',
                meta: {
                  faName: 'SparePartBase',
                  fourFaName: 'SparePart',
                  title: '备品备件库存导入',
                  permissionName: 'spare_import'
                }
              }
            ]
          },
          {
            path: '/warehous',
            redirect: '/warehousing',
            component: () => import('@/views/equipment-management/spare-part/a-spare-part-warehousing-fa'),
            name: 'SparePartWarehousingManage',
            meta: {
              title: '出入库管理'
            },
            children: [
              {
                path: '/warehousing',
                component: () => import('@/views/equipment-management/spare-part/warehousing'),
                name: 'SparePartWarehousing',
                meta: {
                  faName: 'SparePartWarehousing',
                  fourFaName: 'SparePart',
                  title: '备品备件入库管理',
                  permissionName: 'spare_inbound'
                }
              },
              {
                path: '/warehouse-out',
                component: () => import('@/views/equipment-management/spare-part/warehouse-out'),
                name: 'SparePartWarehouseOut',
                meta: {
                  faName: 'SparePartWarehousing',
                  fourFaName: 'SparePart',
                  title: '备品备件出库管理',
                  permissionName: 'spare_outbound'
                }
              },
              {
                path: '/inventory',
                component: () => import('@/views/equipment-management/spare-part/inventory'),
                name: 'SparePartInventory',
                meta: {
                  faName: 'SparePartWarehousing',
                  fourFaName: 'SparePart',
                  title: '备品备件盘点管理',
                  permissionName: 'stock_count'
                }
              }
            ]
          }, {
            path: '/record',
            redirect: '/warehousing-record',
            component: () => import('@/views/equipment-management/spare-part/a-spare-part-record-manage'),
            name: 'SparePartRecordManage',
            meta: {
              title: '履历管理'
            },
            children: [
              {
                path: '/warehousing-record',
                component: () => import('@/views/equipment-management/spare-part/all-record'),
                name: 'SparePartWarehousingRecord',
                meta: {
                  faName: 'SparePartWarehousingRecord',
                  fourFaName: 'SparePart',
                  title: '备品备件入库履历',
                  permissionName: 'inbound_history'
                }
              },
              {
                path: '/warehousing-out-record',
                component: () => import('@/views/equipment-management/spare-part/out-record'),
                name: 'SparePartWarehousingOutRecord',
                meta: {
                  faName: 'SparePartWarehousingRecord',
                  fourFaName: 'SparePart',
                  title: '备品备件出库履历',
                  permissionName: 'outbound_history'
                }
              },
              {
                path: '/inventory-record',
                component: () => import('@/views/equipment-management/spare-part/all-record'),
                name: 'SparePartInventoryRecord',
                meta: {
                  faName: 'SparePartWarehousingRecord',
                  fourFaName: 'SparePart',
                  title: '备品备件盘点履历',
                  permissionName: 'stock_history'
                }
              }
            ]
          }
        ]
      },
      {
        path: '/equipment-maintenance',
        redirect: '/location-definition',
        component: () => import('@/views/equipment-management/repair/a-equipment-maintenance-fa'),
        name: 'EquipmentMaintenance',
        meta: {
          title: '设备维修管理',
          icon: 'quality'
        },
        children: [
          {
            path: '/location-definition',
            component: () => import('@/views/equipment-management/repair/location-definition'),
            name: 'LocationDefinition',
            meta: {
              faName: 'EquipmentMaintenance',
              title: '设备部位定义',
              permissionName: 'equip_part'
            }
          },
          {
            path: '/cause-of-shutdown',
            redirect: '/cause-of-shutdown/mold',
            component: () => import('@/views/equipment-management/repair/a-repair-fa'),
            name: 'CauseOfShutdown',
            meta: {
              title: '停机原因管理'
            },
            children: [
              {
                path: '/cause-of-shutdown/mold',
                component: () => import('@/views/equipment-management/repair/shutdown-mold'),
                name: 'CauseOfShutdownMold',
                meta: {
                  faName: 'CauseOfShutdown',
                  fourFaName: 'EquipmentMaintenance',
                  title: '停机类型定义',
                  permissionName: 'equip_down_type'
                }
              },
              {
                path: '/cause-of-shutdown/reason',
                component: () => import('@/views/equipment-management/repair/shutdown-reason'),
                name: 'CauseOfShutdownReason',
                meta: {
                  faName: 'CauseOfShutdown',
                  fourFaName: 'EquipmentMaintenance',
                  title: '停机原因定义',
                  permissionName: 'equip_down_reason'
                }
              }
            ]
          },
          {
            path: '/repair-apply',
            component: () => import('@/views/equipment-management/repair/repair-apply'),
            name: 'RepairApply',
            meta: {
              faName: 'EquipmentMaintenance',
              title: '设备维修申请页面',
              permissionName: 'equip_current_status'
            }
          },
          {
            path: '/repair-manage',
            component: () => import('@/views/equipment-management/repair/repair-manage'),
            name: 'RepairManage',
            meta: {
              faName: 'EquipmentMaintenance',
              title: '设备维修单管理',
              permissionName: 'equip_maintenance_order'
            }
          },
          {
            path: '/work-state',
            component: () => import('@/views/equipment-management/repair/work-state'),
            name: 'WorkState',
            meta: {
              faName: 'EquipmentMaintenance',
              title: '设备运行现况',
              permissionName: 'equip_status'
            }
          },
          {
            path: '/repair-resume',
            component: () => import('@/views/equipment-management/repair/repair-resume'),
            name: 'RepairResume',
            meta: {
              faName: 'EquipmentMaintenance',
              title: '设备维修履历',
              permissionName: 'equip_maintenance_order_log'
            }
          },
          {
            path: '/equipment-assets',
            component: () => import('@/views/equipment-management/repair/equipment-assets'),
            name: 'EquipmentAssets',
            meta: {
              faName: 'EquipmentMaintenance',
              title: '设备资产',
              permissionName: 'property'
            }
          }
        ]
      },
      /** {
    path: '/equipment-maintain',
    redirect: '/location-definition',
    component: {
      render: c => c('router-view')
    },
    name: 'equipment-maintain',
    meta: {
      title: '设备维护管理',
      icon: 'quality'
    },
    children: [
      {
        path: '/maintain-standard',
        component: () => import('@/views/equipment-management/maintain/standard'),
        name: 'maintain-standard',
        meta: {
          title: '维护标准定义',
          permissionName: ''
        }
      },
      {
        path: '/maintain-plan',
        component: () => import('@/views/equipment-management/maintain/plan'),
        name: 'maintain-plan',
        meta: {
          title: '设备维护计划',
          permissionName: ''
        }
      },
      {
        path: '/maintain-resume',
        component: () => import('@/views/equipment-management/maintain/resume'),
        name: 'maintain-resume',
        meta: {
          title: '设备维护履历',
          permissionName: ''
        }
      }
    ]
  },
  **/
      {
        path: '/platform-manage',
        component: () => import('@/views/equipment-management/repair/platform-manage'),
        name: 'PlatformManage',
        meta: {
          icon: 'quality',
          title: '平台信息管理',
          permissionName: 'platform_config'
        }
      },
      {
        path: '/fault-day-statistics',
        component: () => import('@/views/quality_management/fault/fault-day-statistics'),
        name: 'FaultDayStatistics',
        meta: {
          title: '设备别故障日统计',
          icon: 'quality',
          permissionName: 'equip_daily_summary'
        }
      },
      {
        path: '/fault-week-statistics',
        component: () => import('@/views/quality_management/fault/fault-week-statistics'),
        name: 'FaultWeekStatistics',
        meta: {
          title: '设备别故障周统计',
          icon: 'quality',
          permissionName: 'equip_daily_summary'
        }
      },
      {
        path: '/fault-month-statistics',
        component: () => import('@/views/quality_management/fault/fault-month-statistics'),
        name: 'FaultMonthStatistics',
        meta: {
          title: '设备别故障月统计',
          icon: 'quality',
          permissionName: 'equip_monthly_summary'
        }
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
