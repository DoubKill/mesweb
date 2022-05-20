import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import { equipRoutes } from './index_equip'

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
    path: '/excel',
    hidden: true,
    component: () => import('@/views/inventory/excel.vue')
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
      isPhone: true // 走不走登录和全限
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
  },
  // http://localhost:9000/#/alone/banburying/
  // substitutes/?name=replace_material&arr=view,opera&equip=S01&key=
  {
    path: '/alone/banburying/substitutes/',
    component: () => import('@/views/quality_management/banburying/substitutes'),
    hidden: true,
    meta: {
      isPhone: true,
      title: '细料胶块放行处理',
      permissionName: 'replace_material'
    }
  },
  // http://localhost:9000/#/alone/performance/productionRecord/
  // ?name=plan_reality&arr=view&equip=S01&day_time=2022-03-23&key=
  {
    path: '/alone/performance/productionRecord/',
    component: () => import('@/views/production/production_result/productionRecord'),
    hidden: true,
    meta: {
      isPhone: true,
      title: '生产记录表',
      permissionName: 'plan_reality'
    }
  },
  // http://localhost:9000/#/alone/material_base_info_manage/
  // ?name=formula_preparation&arr=view&equip=Z05&product_no=&key=
  {
    path: '/alone/material_base_info_manage/',
    component: () => import('@/views/material_base_info_manage/productionFeeding'),
    hidden: true,
    meta: {
      isPhone: true,
      title: '生产投料配方查询',
      permissionName: 'formula_preparation'
    }
  },
  {
    path: '/homePage/index',
    component: () => import('@/views/homePage/index'),
    hidden: true,
    meta: {
      title: '首页',
      permissionName: ''
    }
  },
  {
    path: '/operation-status',
    component: () => import('@/views/equipment-manage/operation-status'),
    hidden: true,
    meta: {
      title: '设备运行现况',
      permissionName: ''
    }
  }
]
// 存在权限的路由
// meta.permissionName  权限
export let asyncRoutes = [
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
      path: '/equipment/personnel-framework',
      component: () => import('@/views/equipment-manage/master-data/personnel-framework'),
      name: 'EquipmentMasterData-personnel-framework',
      meta: {
        title: '人员组织架构',
        icon: 'dashboard',
        permissionName: 'department'
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
    // {
    //   path: '/group/department',
    //   name: 'DepartmenManage',
    //   component: () => import('@/views/basic/department-manage/index'),
    //   meta: {
    //     title: '部门管理',
    //     icon: 'dashboard',
    //     permissionName: 'department'
    //   }
    // },
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
    /*,
    {
      path: '/pinkSet',
      component: () => import('@/views/basic/pinkSet/index'),
      name: 'PinkSet',
      meta: {
        title: '粉料罐-油料罐物料设定',
        icon: 'dashboard',
        permissionName: ''
      }
    }*/
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
    //   path: '/rb/formula-resume',
    //   name: 'FormulaResume',
    //   component: () => import('@/views/recipe/formula-resume'),
    //   meta: {
    //     title: 'MES配方变更履历',
    //     icon: 'formula',
    //     permissionName: ''
    //   }
    // }
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
    // {
    //   path: '/material/quantity/demanded',
    //   name: 'MaterialQuantityDemanded',
    //   component: () => import('@/views/material_quantity_demanded/index'),
    //   meta: {
    //     title: '物料需求量',
    //     icon: 'productionPlanManagement',
    //     permissionName: 'materialdemanded'
    //   }
    // },
    /* {
      path: '/rubber-plan-release',
      name: 'RubberPlanRelease',
      component: () => import('@/views/recipe/rubber-plan-release'),
      meta: {
        title: '小料计划下达',
        icon: 'formula',
        permissionName: 'batching_plan'
      }
    },*/
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
            title: '细料硫磺机配流转卡',
            permissionName: 'xl_weight_card'
          }
        },
        {
          path: '/small-material-weight/singleCard',
          component: () => import('@/views/recipe/small-material-weight/singleCard'),
          name: 'SmallMaterialWeightSingleCard',
          meta: {
            faName: 'SmallMaterialWeight',
            title: '人工单配卡片打印',
            permissionName: 'weighting_package_manual'
          }
        },
        // {
        //   path: '/small-material-weight/artificialCard',
        //   component: () => import('@/views/recipe/small-material-weight/artificialCard'),
        //   name: 'SmallMaterialWeightArtificialCard',
        //   meta: {
        //     faName: 'SmallMaterialWeight',
        //     title: '机配料包卡片补打',
        //     permissionName: ''
        //   }
        // },
        /** {
          path: '/small-material-weight/hebao',
          component: () => import('@/views/recipe/small-material-weight/hebao'),
          name: 'SmallMaterialWeightHebao',
          meta: {
            faName: 'SmallMaterialWeight',
            title: '细料硫磺单配流转卡',
            permissionName: 'weighting_package_manual'
          }
        },
        {
          path: '/small-material-weight/currency/formula/',
          component: () => import('@/views/recipe/small-material-weight/currency'),
          name: 'SmallMaterialWeightCurrencyFormula',
          meta: {
            faName: 'SmallMaterialWeight',
            title: '配方用原材料流转卡',
            permissionName: 'weighting_package_manual'
          }
        },
        {
          path: '/small-material-weight/currency/',
          component: () => import('@/views/recipe/small-material-weight/currency'),
          name: 'SmallMaterialWeightCurrency',
          meta: {
            faName: 'SmallMaterialWeight',
            title: '通用化工流转卡',
            permissionName: 'weighting_package_manual'
          }
        },**/
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
    },
    {
      path: '/auto-schedule',
      redirect: '/schedule/factory-declare',
      name: 'AutoSchedule',
      component: () => import('@/views/plan/schedule/a-index'),
      meta: {
        title: '自动排程',
        icon: 'formula'
      },
      children: [
        {
          path: '/schedule/factory-declare',
          component: () => import('@/views/plan/schedule/factory-declare/a-index'),
          name: 'ScheduleFactoryDeclare',
          redirect: '/schedule/plan-declare',
          meta: {
            faName: 'AutoSchedule',
            title: '分厂申报'
          },
          children: [
            {
              path: '/schedule/plan-declare',
              component: () => import('@/views/plan/schedule/factory-declare/plan-declare'),
              name: 'SchedulePlanDeclare',
              meta: {
                faName: 'ScheduleFactoryDeclare',
                title: '各分厂胶料计划申报',
                permissionName: 'aps_demanded_declare'
              }
            },
            {
              path: '/schedule/safety-declare',
              component: () => import('@/views/plan/schedule/factory-declare/safety-declare'),
              name: 'ScheduleSafetyDeclare',
              meta: {
                faName: 'ScheduleFactoryDeclare',
                title: '安全库存及安全系数申报',
                permissionName: 'aps_safety_params_declare'
              }
            }
          ]
        },
        {
          path: '/schedule/dispose',
          component: () => import('@/views/plan/schedule/dispose/a-index'),
          name: 'ScheduleDispose',
          redirect: '/schedule/plan-declare',
          meta: {
            faName: 'AutoSchedule',
            title: '排程处理'
          },
          children: [
            {
              path: '/schedule/dispose-inventory-summary',
              component: () => import('@/views/plan/schedule/dispose/inventory-summary'),
              name: 'ScheduleInventorySummary',
              meta: {
                faName: 'ScheduleDispose',
                title: '胶料计划库存汇总',
                permissionName: 'aps_plan_summary'
              }
            },
            {
              path: '/schedule/machine-production-all',
              component: () => import('@/views/plan/schedule/dispose/machine-production-all'),
              name: 'ScheduleMachineProduction',
              meta: {
                faName: 'ScheduleDispose',
                title: '机台生产计划-整体列表',
                permissionName: 'aps_result'
              }
            },
            // {
            //   path: '/schedule/machine',
            //   component: () => import('@/views/plan/schedule/dispose/machine'),
            //   name: 'ScheduleMachine',
            //   meta: {
            //     faName: 'ScheduleDispose',
            //     title: '机台生产计划-机台列表',
            //     permissionName: ''
            //   }
            // },
            {
              path: '/schedule/daily-plan',
              component: () => import('@/views/plan/schedule/dispose/daily-plan'),
              name: 'ScheduleDailyPlan',
              meta: {
                faName: 'ScheduleDispose',
                title: '排产胶料日计划下达',
                permissionName: 'productdayplan'
              }
            },
            {
              path: '/schedule/material-requirement',
              component: () => import('@/views/plan/schedule/dispose/material-requirement'),
              name: 'ScheduleMaterialRequirement',
              meta: {
                faName: 'ScheduleDispose',
                title: '物料需求量统计',
                permissionName: 'materialdemanded'
              }
            },
            {
              path: '/schedule/material-demand',
              component: () => import('@/views/plan/schedule/dispose/material-demand'),
              name: 'MaterialDemand',
              meta: {
                faName: 'ScheduleDispose',
                title: '原材料需求量 汇总表',
                permissionName: 'materialdemanded'
              }
            },
            // {
            //   path: '/schedule/weighing-system-plan',
            //   component: () => import('@/views/plan/schedule/dispose/weighing-system-plan'),
            //   name: 'ScheduleWeighingSystemPlan',
            //   meta: {
            //     faName: 'ScheduleDispose',
            //     title: '称量系统计划',
            //     permissionName: ''
            //   }
            // },
            {
              path: '/schedule/equipment-shutdown-plan',
              component: () => import('@/views/plan/schedule/dispose/equipment-shutdown-plan'),
              name: 'ScheduleEquipmentShutdownPlan',
              meta: {
                faName: 'ScheduleDispose',
                title: '机台设备停机计划设置',
                permissionName: 'aps_halt_plan'
              }
            },
            {
              path: '/schedule/scheduled-inventory',
              component: () => import('@/views/plan/schedule/dispose/scheduled-inventory'),
              name: 'ScheduledInventory',
              meta: {
                faName: 'ScheduleDispose',
                title: '排程无硫库存单',
                permissionName: 'aps_stock_summary'
              }
            }
          ]
        },
        /** {
          path: '/schedule/statistical-report',
          component: () => import('@/views/plan/schedule/statistical-report/a-index'),
          name: 'ScheduleStatisticalReport',
          redirect: '/schedule/effective-time',
          meta: {
            faName: 'AutoSchedule',
            title: '统计报表'
          },
          children: [
            {
              path: '/schedule/machine-type',
              component: () => import('@/views/plan/schedule/statistical-report/machine-type'),
              name: 'ScheduleMachineType',
              meta: {
                faName: 'ScheduleStatisticalReport',
                title: '机台别-生产量汇总',
                permissionName: ''
              }
            },
            {
              path: '/schedule/shift-type',
              component: () => import('@/views/plan/schedule/statistical-report/shift-type'),
              name: 'ScheduleShiftType',
              meta: {
                faName: 'ScheduleStatisticalReport',
                title: '班次别-生产量汇总',
                permissionName: ''
              }
            },
            {
              path: '/schedule/period-type',
              component: () => import('@/views/plan/schedule/statistical-report/period-type'),
              name: 'SchedulePeriodType',
              meta: {
                faName: 'ScheduleStatisticalReport',
                title: '期间别-生产量汇总',
                permissionName: ''
              }
            },
            {
              path: '/schedule/site-inventory',
              component: () => import('@/views/plan/schedule/statistical-report/site-inventory'),
              name: 'ScheduleSiteInventory',
              meta: {
                faName: 'ScheduleStatisticalReport',
                title: '炼胶8点现场库存',
                permissionName: ''
              }
            },
            {
              path: '/schedule/real-inventory',
              component: () => import('@/views/plan/schedule/statistical-report/real-inventory'),
              name: 'ScheduleRealInventory',
              meta: {
                faName: 'ScheduleStatisticalReport',
                title: '炼胶实时库存及预警',
                permissionName: ''
              }
            },
            {
              path: '/schedule/production-scheduling',
              component: () => import('@/views/plan/schedule/statistical-report/production-scheduling'),
              name: 'ScheduleProductionScheduling',
              meta: {
                faName: 'ScheduleStatisticalReport',
                title: '胶料排产报表',
                permissionName: ''
              }
            },
            {
              path: '/schedule/machine-release',
              component: () => import('@/views/plan/schedule/statistical-report/machine-release'),
              name: 'ScheduleMachineRelease',
              meta: {
                faName: ' ScheduleStatisticalReport',
                title: '机台下达计划报表',
                permissionName: ''
              }
            },
            {
              path: '/schedule/delivery-comparison',
              component: () => import('@/views/plan/schedule/statistical-report/delivery-comparison'),
              name: 'ScheduleDeliveryComparison',
              meta: {
                faName: 'ScheduleStatisticalReport',
                title: '胶料计划及发货对比',
                permissionName: ''
              }
            }
          ]
        },**/
        {
          path: '/schedule/basic-data',
          component: () => import('@/views/plan/schedule/basic-data/a-index'),
          name: 'ScheduleBasicData',
          redirect: '/schedule/parameter-setting',
          meta: {
            faName: 'AutoSchedule',
            title: '基础数据'
          },
          children: [
            {
              path: '/schedule/parameter-setting',
              component: () => import('@/views/plan/schedule/basic-data/parameter-setting'),
              name: 'ScheduleParameterSetting',
              meta: {
                faName: 'ScheduleBasicData',
                title: '排程参数设定',
                permissionName: 'aps_params_setting'
              }
            },
            {
              path: '/schedule/machine-table',
              component: () => import('@/views/plan/schedule/basic-data/machine-table'),
              name: 'ScheduleMachineTable',
              meta: {
                faName: 'ScheduleBasicData',
                title: '定机表(段次及主副机台)',
                permissionName: 'aps_machine_setting'
              }
            },
            {
              path: '/schedule/weight-statistics',
              component: () => import('@/views/plan/schedule/basic-data/weight-statistics'),
              name: 'ScheduleWeightStatistics',
              meta: {
                faName: 'ScheduleBasicData',
                title: '胶料机台配方物料统计',
                permissionName: 'aps_machine_recipe'
              }
            },
            {
              path: '/schedule/material-specification',
              component: () => import('@/views/plan/schedule/basic-data/material-specification'),
              name: 'ScheduleMaterialSpecification',
              meta: {
                faName: 'ScheduleBasicData',
                title: '炭黑粉料罐物料规格汇总',
                permissionName: 'aps_tank_status'
              }
            },
            {
              path: '/schedule/production-capacity',
              component: () => import('@/views/plan/schedule/basic-data/production-capacity'),
              name: 'ScheduleProductionCapacity',
              meta: {
                faName: 'ScheduleBasicData',
                title: '机台设备生产能力',
                permissionName: 'aps_equip_capacity'
              }
            },
            {
              path: '/schedule/washing-rules',
              component: () => import('@/views/plan/schedule/basic-data/washing-rules'),
              name: 'ScheduleWashingRules',
              meta: {
                faName: 'ScheduleBasicData',
                title: '洗车规则及放置规则',
                permissionName: 'aps_wash_rules'
              }
            },
            {
              path: '/schedule/compound-unit',
              component: () => import('@/views/plan/schedule/basic-data/compound-unit'),
              name: 'ScheduleCompoundUnit',
              meta: {
                faName: 'ScheduleBasicData',
                title: '胶料/单位关键字定义',
                permissionName: 'aps_product_keyword'
              }
            },
            {
              path: '/schedule/processing-keywords',
              component: () => import('@/views/plan/schedule/basic-data/processing-keywords'),
              name: 'ScheduleProcessingKeywords',
              meta: {
                faName: 'ScheduleBasicData',
                title: '处理关键字定义',
                permissionName: 'aps_opera_keyword'
              }
            },
            {
              path: '/equipment-management/report/specification_setting',
              name: 'SpecificationSetting',
              component: () => import('@/views/equipment-management/report/specification_setting'),
              meta: {
                faName: 'ScheduleBasicData',
                title: '丁基胶规格设定',
                permissionName: 'product_info_dj'
              }
            }
          ]
        }
      ]
    },
    {
      path: '/material_base_info_manage/',
      component: () => import('@/views/material_base_info_manage/productionFeeding'),
      name: 'ProductionFeeding',
      meta: {
        title: '生产投料配方查询',
        icon: 'formula',
        permissionName: 'formula_preparation'
      }
    }
    ]
  },
  {
    path: '/produce',
    component: Layout,
    redirect: '/production_result',
    name: 'ProduceManage',
    meta: {
      title: '生产管理',
      icon: 'production'
    },
    children: [
      {
        path: '/production_result',
        redirect: '/performance/productionRecord/',
        component: () => import('@/views/production/production_result/a-index.vue'),
        name: 'ProductionResult',
        meta: {
          title: '生产结果数据查询',
          icon: 'production'
        },
        children: [
          {
            path: '/performance/productionRecord/',
            component: () => import('@/views/production/production_result/productionRecord'),
            name: 'BanburyingProductionRecord',
            meta: {
              faName: 'ProductionResult',
              title: '生产记录表',
              permissionName: 'plan_reality'
            }
          },
          {
            path: '/performance/manage',
            component: () => import('@/views/production/production_result/banburying-performance-manage/index'),
            name: 'BanburyingPerformanceManage',
            meta: {
              faName: 'ProductionResult',
              title: '密炼实绩',
              permissionName: 'product_actual'
            }
          },
          {
            path: '/internal/mixer',
            component: () => import('@/views/production/production_result/internal_mixer_production/index'),
            name: 'InternalMixerProduction',
            meta: {
              faName: 'ProductionResult',
              title: '密炼生产履历',
              permissionName: 'product_record'
            }
          },
          {
            path: '/train-number-report',
            component: () => import('@/views/production/train-number-report.vue'),
            name: 'TrainNumberReport',
            meta: {
              faName: 'ProductionResult',
              title: '车次报表',
              permissionName: 'trains_report'
            }
          },
          {
            path: '/report/produce-work',
            component: () => import('@/views/equipment-management/report/produce-work'),
            name: 'ProduceWork',
            meta: {
              faName: 'ProductionResult',
              title: '生产运行记录',
              permissionName: 'production_record'
            }
          }
        ]
      },
      {
        path: '/result_analysis',
        redirect: '/performance/productionRecord',
        component: () => import('@/views/production/result_analysis/a-index.vue'),
        name: 'ResultAnalysis',
        meta: {
          title: '生产结果分析统计',
          icon: 'production'
        },
        children: [
          {
            path: '/report/output-statistics-summary',
            component: () => import('@/views/equipment-management/report/output-statistics-summary'),
            name: 'OutputStatisticsSummary',
            meta: {
              faName: 'ResultAnalysis',
              title: '月产量统计汇总',
              permissionName: 'monthly_output_statistics_report'
            }
          },
          {
            path: '/report/daily-output-completed',
            component: () => import('@/views/equipment-management/report/daily-output-completed'),
            name: 'DailyOutputCompleted',
            meta: {
              faName: 'ResultAnalysis',
              title: '月产量完成',
              permissionName: 'daily_production_completion_report'
            }
          },
          {
            path: '/report/warehousing-reasons',
            component: () => import('@/views/equipment-management/report/warehousing-reasons'),
            name: 'WarehousingReasons',
            meta: {
              faName: 'ResultAnalysis',
              title: '不入库原因统计',
              permissionName: 'durate_putin_reason'
            }
          },
          {
            path: '/product-plan-reality-analyse',
            component: () => import('@/views/production/product-plan-reality-analyse.vue'),
            name: 'ProductPlanRealityAnalyse',
            meta: {
              faName: 'ResultAnalysis',
              title: '产量计划实际分析（车数）',
              permissionName: 'production_analyze'
            }
          },
          {
            path: '/interval-production-statistics',
            component: () => import('@/views/production/interval-production-statistics.vue'),
            name: 'IntervalProductionStatistics',
            meta: {
              faName: 'ResultAnalysis',
              title: '区间产量统计（车数）',
              permissionName: 'section_production'
            }
          },
          {
            path: '/equipment/classes-banburying-summary',
            component: () => import('@/views/equipment-management/classes-banburying-summary'),
            name: 'ClassesBanburyingSummary',
            meta: {
              faName: 'ResultAnalysis',
              title: '班次密炼时间汇总',
              permissionName: 'class_production_summary'
            }
          },
          {
            path: '/equipment/banburying-ratio-summary',
            component: () => import('@/views/equipment-management/banburying-ratio-summary'),
            name: 'BanburyingRatioSummary',
            meta: {
              faName: 'ResultAnalysis',
              title: '密炼时间占比汇总',
              permissionName: 'production_time_summary'
            }
          },
          {
            path: '/equipment/rubber-acar-summary',
            component: () => import('@/views/equipment-management/rubber-acar-summary'),
            name: 'RubberAcarSummary',
            meta: {
              faName: 'ResultAnalysis',
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
              title: '规格切换时间明细',
              permissionName: 'product_exchange_consume'
            }
          },
          {
            path: '/equipment/shift-handover-time',
            component: () => import('@/views/equipment-management/shift-handover-time'),
            name: 'ShiftHandoverTime',
            meta: {
              faName: 'SummaryStatistics',
              title: '交接班时间汇总',
              permissionName: 'shift_time_summary'
            }
          }
        ]
      },
      {
        path: '/make_up',
        redirect: '/material-print-card',
        component: () => import('@/views/production/resume-fa'),
        name: 'Resume1',
        meta: {
          title: '质量追踪卡补打',
          icon: 'production'
        },
        children: [
          {
            path: '/material-print-card1',
            component: () => import('@/views/inventory/rubber-warehouse/material-print-card.vue'),
            name: 'MaterialPrintCard1',
            meta: {
              faName: 'Resume1',
              title: '胶片流转卡补打', // 出库口补打印卡片
              permissionName: 'addrubber_print'
            }
          },
          {
            path: '/small-material-weight/currency1',
            component: () => import('@/views/recipe/small-material-weight/currency'),
            name: 'SmallMaterialWeightCurrency1',
            meta: {
              faName: 'Resume1',
              title: '通用化工流转卡',
              permissionName: 'material_add_print'
            }
          }
        ]
      },
      {
        path: '/resume',
        redirect: '/internal/investment',
        component: () => import('@/views/production/resume-fa'),
        name: 'Resume',
        meta: {
          title: '投料履历查询',
          icon: 'production'
        },
        children: [
          {
            path: '/internal/investment',
            component: () => import('@/views/production/investment'),
            name: 'InternalInvestment',
            meta: {
              faName: 'Resume',
              title: '密炼投入履历',
              permissionName: 'batch_log'
            }
          },
          {
            path: '/drug-investment',
            component: () => import('@/views/production/drug-investment'),
            name: 'DrugInvestment',
            meta: {
              faName: 'Resume',
              title: '称量投入履历',
              permissionName: 'drug_analyze'
            }
          }
        ]
      },
      {
        path: '/track',
        redirect: '/track-raw-material',
        component: () => import('@/views/production/track/track-fa'),
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
              title: '原材料到胶片 条码追朔',
              permissionName: 'material_retrospect'
            }
          },
          {
            path: '/track-raw-rubber',
            name: 'TrackRawRubber',
            component: () => import('@/views/production/track/track-raw-rubber'),
            meta: {
              faName: 'Track',
              title: '胶片到原材料 条码追朔',
              permissionName: 'product_retrospect'
            }
          }
        ]
      },
      {
        path: '/achievements',
        redirect: '/report/achievement',
        component: () => import('@/views/equipment-management/report/achievements-fa'),
        name: 'Achievements',
        meta: {
          title: '绩效计算',
          icon: 'production'
        },
        children: [
          {
            path: '/report/achievement',
            component: () => import('@/views/equipment-management/report/achievement'),
            name: 'StatisticalReportAchievement',
            meta: {
              faName: 'Achievements',
              title: '密炼员工绩效汇总表',
              permissionName: 'performance_summary'
            }
          },
          {
            path: '/report/weighing',
            component: () => import('@/views/equipment-management/report/weighing'),
            name: 'StatisticalReportWeighing',
            meta: {
              faName: 'Achievements',
              title: '称量员工绩效汇总表',
              permissionName: 'summary_of_weighing_output'
            }
          },
          {
            path: '/report/attendance',
            component: () => import('@/views/equipment-management/report/attendance'),
            name: 'StatisticalReportAttendance',
            meta: {
              faName: 'Achievements',
              title: '员工出勤记录表',
              permissionName: 'employee_attendance_records'
            }
          },
          {
            path: '/report/postTable',
            component: () => import('@/views/equipment-management/report/postTable'),
            name: 'StatisticalReportPost',
            meta: {
              faName: 'Achievements',
              title: '岗位阶梯表',
              permissionName: 'performance_job_ladder'
            }
          },
          {
            path: '/report/machine-value-setting',
            component: () => import('@/views/equipment-management/report/machine-value-setting'),
            name: 'machineValueSetting',
            meta: {
              faName: 'Achievements',
              title: '机台目标值设定',
              permissionName: 'machine_target_value'
            }
          },
          {
            path: '/report/unit-price-list',
            component: () => import('@/views/equipment-management/report/unit-price-list'),
            name: 'StatisticalReportPrice',
            meta: {
              faName: 'Achievements',
              title: '绩效计算 单价表',
              permissionName: 'performance_unit_price'
            }
          },
          {
            path: '/report/mixing',
            component: () => import('@/views/equipment-management/report/mixing'),
            name: 'StatisticalReportMixing',
            meta: {
              faName: 'Achievements',
              title: '密炼机台产量汇总表',
              permissionName: 'summary_of_mill_output'
            }
          },
          {
            path: '/report/190e-setting',
            component: () => import('@/views/equipment-management/report/190e_setting'),
            name: 'SettingE190',
            meta: {
              faName: 'Achievements',
              title: '190E机台规格信息维护',
              permissionName: 'equip_190e'
            }
          },
          {
            path: '/report/set-attendance',
            component: () => import('@/views/equipment-management/report/set-attendance'),
            name: 'SetAttendance',
            meta: {
              faName: 'Achievements',
              title: '考勤组设置',
              permissionName: 'attendance_group_setup'
            }
          }
        ]
      },
      /* {
      path: '/plan/manage',
      component: () => import('@/views/banburying_plan/index'),
      name: 'BanburyingPlanManage',
      meta: {
        title: '密炼机台别计划对比',
        icon: 'production',
        permissionName: 'plan_reality'
      }
    },*/
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
        path: '/material/base/material-consumption',
        name: 'MaterialConsumption',
        component: () => import('@/views/production/material-consumption'),
        meta: {
          title: '原材料消耗量 汇总表',
          icon: 'production',
          permissionName: 'material_expend_summary'
        }
      },
      {
        path: '/material/base/inventory-warning',
        name: 'MaterialBaseInventoryWarning',
        component: () => import('@/views/material_base_info_manage/inventory-warning'),
        meta: {
          title: '原材料-预警参数设定',
          icon: 'production',
          permissionName: 'material_warning_setting'
        }
      },
      {
        path: '/base/carbon-warning',
        name: 'CarbonBaseInventoryWarning',
        component: () => import('@/views/material_base_info_manage/carbon-warning'),
        meta: {
          title: '炭黑库-预警参数设定',
          icon: 'production',
          permissionName: 'th_warning_setting'
        }
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
    redirect: '/compound-manage',
    name: 'RepertoryManage',
    meta: {
      title: '库存管理',
      icon: 'stock'
    },
    children: [
      {
        path: '/rubber-warehouse',
        redirect: '/compound-manage',
        component: () => import('@/views/inventory/rubber-warehouse/a-index.vue'),
        name: 'RubberWarehouse',
        meta: {
          title: '胶料库',
          icon: 'stock'
        },
        children: [
          /** {
            path: '/compound-rubber-manage',
            component: () => import('@/views/inventory/rubber-warehouse/compound-rubber-manage.vue'),
            name: 'CompoundManage',
            meta: {
              faName: 'RubberWarehouse',
              title: '混炼胶出库',
              permissionName: 'compoundRubber_plan'
            }
          },
          {
            path: '/final-mixing-rubber-manage',
            component: () => import('@/views/inventory/rubber-warehouse/final-mixing-rubber-manage.vue'),
            name: 'FinalMixingRubber',
            meta: {
              faName: 'RubberWarehouse',
              title: '终炼胶出库',
              permissionName: 'finalRubber_plan'
            }
          },**/
          {
            path: '/compound-manage',
            component: () => import('@/views/inventory/rubber-warehouse/compoundManage.vue'),
            name: 'compoundManage',
            meta: {
              faName: 'RubberWarehouse',
              title: '胶片库出库计划',
              permissionName: 'product_outbound_plan'
            }
          },
          // {
          //   path: '/delivery-document',
          //   component: () => import('@/views/inventory/rubber-warehouse/delivery-document.vue'),
          //   name: 'DeliveryDocument',
          //   meta: {
          //     faName: 'RubberWarehouse',
          //     title: '出库单据查询',
          //     permissionName: 'product_outbound_plan'
          //   }
          // },
          {
            path: '/rubber',
            component: () => import('@/views/inventory/rubber-warehouse/rubber_repertory_manage/index'),
            name: 'RubberRepertoryManage',
            meta: {
              title: '库内库存统计',
              faName: 'RubberWarehouse',
              permissionName: 'product_inventory'
            }
          },
          {
            path: '/report/workshop-stock',
            component: () => import('@/views/inventory/rubber-warehouse/workshop-stock'),
            name: 'WorkshopStock',
            meta: {
              faName: 'RubberWarehouse',
              title: '车间库存统计',
              permissionName: 'workshop_stock_detail'
            }
          },
          {
            path: '/report/rubber-stock',
            component: () => import('@/views/inventory/rubber-warehouse/rubber-stock'),
            name: 'RubberStock',
            meta: {
              faName: 'RubberWarehouse',
              title: '胶料段次别数量统计',
              permissionName: 'product_stock_detail'
            }
          },
          // {
          //   path: '/material-inventory-manage',
          //   component: () => import('@/views/inventory/rubber-warehouse/material-inventory-manage.vue'),
          //   name: 'MaterialInventoryManage',
          //   meta: {
          //     faName: 'RubberWarehouse',
          //     title: '立库库存明细',
          //     permissionName: 'goods'
          //   }
          // },
          {
            path: '/material-inout-record',
            component: () => import('@/views/inventory/rubber-warehouse/material_inout_record_rubber.vue'),
            name: 'MaterialInoutRecordRubber',
            meta: {
              faName: 'RubberWarehouse',
              title: '出入库履历查询',
              permissionName: 'in_out_history'
            }
          },
          {
            path: '/material-print-card',
            component: () => import('@/views/inventory/rubber-warehouse/material-print-card.vue'),
            name: 'MaterialPrintCard',
            meta: {
              faName: 'RubberWarehouse',
              title: '出库口补打印卡片',
              permissionName: 'additional_print'
            }
          },
          {
            path: '/rubber-overdue-alarm',
            component: () => import('@/views/inventory/rubber-warehouse/rubber-overdue-alarm.vue'),
            name: 'MaterialPrintCard',
            meta: {
              faName: 'RubberWarehouse',
              title: '胶料超期报警',
              permissionName: 'product_expire_query'
            }
          }
        ]
      },
      {
        path: '/material-delivery-manage',
        redirect: '/material-delivery-manage/task',
        component: () => import('@/views/inventory/material-delivery-manage/a-index.vue'),
        name: 'MaterialDelivery',
        meta: {
          title: '原材料库',
          icon: 'stock'
        },
        children: [
          {
            path: '/material-delivery-manage/task',
            component: () => import('@/views/inventory/material-delivery-manage/task.vue'),
            name: 'DeliveryTask',
            meta: {
              faName: 'MaterialDelivery',
              faShowName: '原材料库',
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
              faShowName: '原材料库',
              title: '出库单据',
              permissionName: 'material_outbound_record'
            }
          },
          {
            path: '/receive-good-manage/stock',
            component: () => import('@/views/inventory/material-delivery-manage/stock.vue'),
            name: 'DeliveryStock',
            meta: {
              faName: 'MaterialDelivery',
              faShowName: '原材料库',
              title: '巷道别批次库存统计',
              permissionName: 'material_inventory_summary'
            }
          },
          {
            path: '/delivery-inventory-details',
            component: () => import('@/views/inventory/material-delivery-manage/inventory-details.vue'),
            name: 'DeliveryInventoryDetails',
            meta: {
              faName: 'MaterialDelivery',
              faShowName: '原材料库',
              title: '库存明细',
              permissionName: 'material_stock_detail'
            }
          },
          {
            path: '/delivery-lowWarning',
            component: () => import('@/views/inventory/material-delivery-manage/lowWarning.vue'),
            name: 'DeliveryLowWarning',
            meta: {
              faName: 'MaterialDelivery',
              faShowName: '原材料库',
              title: '库存统计及低库存报警',
              permissionName: 'material_inventory_summary'
            }
          },
          {
            path: '/internal/drying-room-statistics',
            component: () => import('@/views/inspection_release/drying_room_statistics'),
            name: 'DryingRoomStatistics',
            meta: {
              faName: 'MaterialDelivery',
              faShowName: '原材料库',
              title: '烘房信息统计查询',
              permissionName: 'material_hf_summary'
            }
          },
          {
            path: '/internal/drying-room-resume',
            component: () => import('@/views/inspection_release/drying_room_resume'),
            name: 'DryingRoomResume',
            meta: {
              faName: 'MaterialDelivery',
              faShowName: '原材料库',
              title: '入出烘房履历',
              permissionName: 'material_hf_summary'
            }
          },
          {
            path: '/internal/drying-room-status',
            component: () => import('@/views/inspection_release/drying_room_status'),
            name: 'DryingRoomStatus',
            meta: {
              faName: 'MaterialDelivery',
              faShowName: '原材料库',
              title: '烘房状态实时显示',
              permissionName: 'material_hf_real_data'
            }
          },
          {
            path: '/delivery-overdueQuery',
            component: () => import('@/views/inventory/material-delivery-manage/overdueQuery.vue'),
            name: 'DeliveryOverdueQuery',
            meta: {
              faName: 'MaterialDelivery',
              faShowName: '原材料库',
              title: '即将超期预警',
              permissionName: 'material_expire_query'
            }
          },
          {
            path: '/material-delivery-manage/daily',
            component: () => import('@/views/inventory/material-delivery-manage/daily.vue'),
            name: 'DeliveryDaily',
            meta: {
              faName: 'MaterialDelivery',
              faShowName: '原材料库',
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
              faShowName: '原材料库',
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
              faShowName: '原材料库',
              title: '出库年报',
              permissionName: 'material_yearly_summary'
            }
          },
          /* {
            path: '/material',
            component: () => import('@/views/inventory/material-delivery-manage/material_repertory_manage/index'),
            name: 'MaterialRepertoryManage',
            meta: {
              faName: 'MaterialDelivery',
              title: '原材料库存',
              permissionName: 'material_inventory'
            }
          },*/
          {
            path: '/delivery-inout-record',
            component: () => import('@/views/inventory/material-delivery-manage/material_inout_record.vue'),
            name: 'DeliveryInOutRecord',
            meta: {
              faName: 'MaterialDelivery',
              title: '出入库履历查询',
              permissionName: 'material_inout_history'
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
          title: '炭黑库',
          icon: 'stock'
        },
        children: [
          {
            path: '/carbon-delivery-manage/task',
            component: () => import('@/views/inventory/carbon-delivery-manage/task.vue'),
            name: 'CarbonDeliveryTask',
            meta: {
              faName: 'CarbonDelivery',
              faShowName: '炭黑库',
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
              faShowName: '炭黑库',
              title: '出库单据',
              permissionName: 'th_outbound_record'
            }
          },
          {
            path: '/carbon-delivery-manage/stock',
            component: () => import('@/views/inventory/carbon-delivery-manage/stock.vue'),
            name: 'CarbonDeliveryStock',
            meta: {
              faName: 'CarbonDelivery',
              faShowName: '炭黑库',
              title: '巷道别批次库存统计',
              permissionName: 'th_inventory_summary'
            }
          },
          {
            path: '/carbon-inventory-details',
            component: () => import('@/views/inventory/carbon-delivery-manage/inventory-details.vue'),
            name: 'CarbonInventoryDetails',
            meta: {
              faName: 'CarbonDelivery',
              faShowName: '炭黑库',
              title: '库存明细',
              permissionName: 'th_stock_detail'
            }
          },
          {
            path: '/carbon-lowWarning',
            component: () => import('@/views/inventory/carbon-delivery-manage/lowWarning.vue'),
            name: 'CarbonLowWarning',
            meta: {
              faName: 'CarbonDelivery',
              faShowName: '炭黑库',
              title: '库存统计及低库存报警',
              permissionName: 'th_inventory_summary'
            }
          },
          {
            path: '/carbon-overdueQuery',
            component: () => import('@/views/inventory/carbon-delivery-manage/overdueQuery.vue'),
            name: 'CarbonDeliveryOverdueQuery',
            meta: {
              faName: 'CarbonDelivery',
              faShowName: '炭黑库',
              title: '即将超期预警',
              permissionName: 'th_expire_query'
            }
          },
          {
            path: '/carbon-delivery-manage/daily',
            component: () => import('@/views/inventory/carbon-delivery-manage/daily.vue'),
            name: 'CarbonDeliveryDaily',
            meta: {
              faName: 'CarbonDelivery',
              faShowName: '炭黑库',
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
              faShowName: '炭黑库',
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
              faShowName: '炭黑库',
              title: '出库年报',
              permissionName: 'th_yearly_summary'
            }
          },
          {
            path: '/carbon-inout-record',
            component: () => import('@/views/inventory/carbon-delivery-manage/material_inout_record.vue'),
            name: 'CarbonInOutRecord',
            meta: {
              faName: 'CarbonDelivery',
              title: '出入库履历查询',
              permissionName: 'th_inout_history'
            }
          }

        ]
      },
      {
        path: '/material-outgoing',
        redirect: '/receive-good-manage/index',
        component: () => import('@/views/inventory/material-outgoing/a-index.vue'),
        name: 'MaterialOutgoing',
        meta: {
          title: '胶料外发',
          icon: 'stock'
        },
        children: [
          {
            path: '/receive-good-manage/index',
            component: () => import('@/views/inventory/material-outgoing/receive-list.vue'),
            name: 'ReceiveGoodManageIndex',
            meta: {
              faName: 'MaterialOutgoing',
              title: '发货计划管理',
              permissionName: 'delivery_plan'
            }
          },
          {
            path: '/receive-good-manage/view',
            component: () => import('@/views/inventory/material-outgoing/receive-view.vue'),
            name: 'ReceiveGoodManageView',
            meta: {
              faName: 'MaterialOutgoing',
              title: '发货履历管理',
              permissionName: 'delivery_history'
            }
          },
          {
            path: '/receive-good-manage/address',
            component: () => import('@/views/inventory/material-outgoing/receive-address.vue'),
            name: 'ReceiveGoodManageAddress',
            meta: {
              faName: 'MaterialOutgoing',
              title: '发货地管理',
              permissionName: 'delivery_address'
            }
          }
        ]
      },
      {
        path: '/sulphurLibrary',
        redirect: '/sulphurLibrary/inOutWarehouse',
        component: () => import('@/views/inventory/sulphurLibrary/a-index.vue'),
        name: 'SulphurLibrary',
        meta: {
          title: '硫磺库',
          icon: 'stock'
        },
        children: [
          {
            path: '/sulphurLibrary/inOutWarehouse',
            component: () => import('@/views/inventory/sulphurLibrary/inOutWarehouse.vue'),
            name: 'SulphurInOutWarehouse',
            meta: {
              faName: 'SulphurLibrary',
              faShowName: '硫磺库',
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
              faShowName: '硫磺库',
              title: '库存统计',
              permissionName: 'depot_sulfur'
            }
          },
          // {
          //   path: '/sulphur-inventory-details',
          //   component: () => import('@/views/inventory/sulphurLibrary/inventory-details.vue'),
          //   name: 'SulphurInventoryDetails',
          //   meta: {
          //     faName: 'SulphurLibrary',
          //     faShowName: '硫磺库',
          //     title: '库存明细',
          //     permissionName: 'goods'
          //   }
          // },
          {
            path: '/sulphurLibrary/inOutWarehouseResume',
            component: () => import('@/views/inventory/sulphurLibrary/inOutWarehouseResume.vue'),
            name: 'SulphurInOutWarehouseResume',
            meta: {
              faName: 'SulphurLibrary',
              faShowName: '硫磺库',
              title: '出入库履历',
              permissionName: 'sulfur_resume'
            }
          },
          {
            path: '/sulphurLibrary/location',
            component: () => import('@/views/inventory/sulphurLibrary/location.vue'),
            name: 'SulphurLocation',
            meta: {
              faName: 'SulphurLibrary',
              faShowName: '硫磺库',
              title: '库区库位管理',
              permissionName: 'sulfur_depot'
            }
          }

        ]
      },
      {
        path: '/lineSideLibrary',
        redirect: '/lineSideLibrary/inOutWarehouse',
        component: () => import('@/views/inventory/lineSideLibrary/a-index.vue'),
        name: 'LineSideLibrary',
        meta: {
          title: '线边库',
          icon: 'stock'
        },
        children: [
          {
            path: '/lineSideLibrary/inOutWarehouse',
            component: () => import('@/views/inventory/lineSideLibrary/inOutWarehouse.vue'),
            name: 'LineSideInOutWarehouse',
            meta: {
              faName: 'LineSideLibrary',
              faShowName: '线边库',
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
              faShowName: '线边库',
              title: '库存统计',
              permissionName: 'depot_pallet'
            }
          },
          // {
          //   path: '/lineSide-inventory-details',
          //   component: () => import('@/views/inventory/lineSideLibrary/inventory-details.vue'),
          //   name: 'LineSideInventoryDetails',
          //   meta: {
          //     faName: 'LineSideLibrary',
          //     faShowName: '线边库',
          //     title: '库存明细',
          //     permissionName: ''
          //   }
          // },
          {
            path: '/lineSideLibrary/inOutWarehouseResume',
            component: () => import('@/views/inventory/lineSideLibrary/inOutWarehouseResume.vue'),
            name: 'LineSideInOutWarehouseResume',
            meta: {
              faName: 'LineSideLibrary',
              faShowName: '线边库',
              title: '出入库履历',
              permissionName: 'depot_resume'
            }
          },
          {
            path: '/lineSideLibrary/location',
            component: () => import('@/views/inventory/lineSideLibrary/location.vue'),
            name: 'LineSideLocation',
            meta: {
              faName: 'LineSideLibrary',
              faShowName: '线边库',
              title: '库区库位管理',
              permissionName: 'depot'
            }
          }
        ]
      },
      {
        path: '/curtain-warehouse',
        redirect: '/curtain-warehouse/plan',
        component: () => import('@/views/inventory/curtainWarehouse/a-index.vue'),
        name: 'CurtainStorehouse',
        meta: {
          title: '帘布库',
          icon: 'stock'
        },
        children: [
          {
            path: '/curtain-warehouse/plan',
            component: () => import('@/views/inventory/curtainWarehouse/plan.vue'),
            name: 'CurtainStorehousePlan',
            meta: {
              faName: 'CurtainStorehouse',
              title: '出库计划',
              permissionName: 'LB_inventory_plan'
            }
          },
          {
            path: '/curtain-inventory-details',
            component: () => import('@/views/inventory/curtainWarehouse/inventory-details.vue'),
            name: 'CurtainInventoryDetails',
            meta: {
              faName: 'CurtainStorehouse',
              faShowName: '帘布库',
              title: '库存明细',
              permissionName: 'LB_stock_detail'
            }
          },
          {
            path: '/Curtain-inout-record',
            component: () => import('@/views/inventory/curtainWarehouse/material_inout_record.vue'),
            name: 'CurtainInOutRecord',
            meta: {
              faName: 'CurtainStorehouse',
              title: '出入库履历查询',
              permissionName: 'LB_inout_history'
            }
          }
        ]
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
        path: '/material-manage-base',
        redirect: '/warehouse-info',
        component: () => import('@/views/inventory/material-manage-base/a-index.vue'),
        name: 'MaterialManageBase',
        meta: {
          title: '库存管理基础数据',
          icon: 'stock'
        },
        children: [
          {
            path: '/warehouse-info',
            component: () => import('@/views/inventory/material-manage-base/warehouse_info.vue'),
            name: 'WarehouseInfo',
            meta: {
              faName: 'MaterialManageBase',
              title: '仓库基础信息管理',
              permissionName: 'warehouse'
            }
          },
          {
            path: '/material-attribute-manage',
            component: () => import('@/views/inventory/material-manage-base/material-attribute-manage.vue'),
            name: 'MaterialAttributeManage',
            meta: {
              faName: 'MaterialManageBase',
              title: '物料属性管理',
              permissionName: 'material_attr'
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
            path: '/statistics/rubber-pass',
            component: () => import('@/views/quality_management/pass/rubberCompound.vue'),
            name: 'RubberCompound',
            meta: {
              faName: 'QualityStatistics',
              title: '胶料规格别合格率统计',
              permissionName: 'product_quality_analyze'
            }
          },
          { path: '/statistics/machine-pass',
            component: () => import('@/views/quality_management/pass/machine.vue'),
            name: 'Machine',
            meta: {
              faName: 'QualityStatistics',
              title: '机台别合格率统计',
              permissionName: 'equip_quality_analyze'
            }
          },
          { path: '/statistics/classes-pass',
            component: () => import('@/views/quality_management/pass/classes.vue'),
            name: 'Classes',
            meta: {
              faName: 'QualityStatistics',
              title: '班次别合格率统计',
              permissionName: 'classes_quality_analyze'
            }
          }
          /** {
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
          }**/
        ]
      },
      {
        path: '/unqualified-handle',
        redirect: '/unqualified-handle/disposalLaunch',
        component: () => import('@/views/quality_management/DisposalListGenerate-fa'),
        name: 'UnqualifiedHandle',
        meta: {
          title: '胶料不合格品处理',
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
          /** {
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
          },**/
          {
            path: '/unqualified-handle/disposalLaunch',
            component: () => import('@/views/quality_management/disposal/disposalLaunch.vue'),
            name: 'DisposalLaunch',
            meta: {
              faName: 'UnqualifiedHandle',
              title: '不合格处置发生部门发起',
              permissionName: 'product_unqualified_order'
            }
          },
          {
            path: '/unqualified-handle/disposalTechnology',
            component: () => import('@/views/quality_management/disposal/disposalTechnology.vue'),
            name: 'DisposalTechnology',
            meta: {
              faName: 'UnqualifiedHandle',
              title: '不合格处置工艺技术科处理',
              permissionName: 'tech_unqualified_order'
            }
          },
          {
            path: '/unqualified-handle/disposalInspection',
            component: () => import('@/views/quality_management/disposal/disposalInspection.vue'),
            name: 'DisposalInspection',
            meta: {
              faName: 'UnqualifiedHandle',
              title: '不合格处置工艺检查科处理',
              permissionName: 'check_unqualified_order'
            }
          },
          {
            path: '/unqualified-handle/disposalSee',
            component: () => import('@/views/quality_management/disposal/disposalSee.vue'),
            name: 'DisposalSee',
            meta: {
              faName: 'UnqualifiedHandle',
              title: '不合格处置单查看',
              permissionName: 'product_unqualified_order'
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
        redirect: '/material-quickcheck/quickcheck-equipment',
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
          }, {
            path: '/material-quickcheck/quality-inspection-plan',
            component: () => import('@/views/material_quickcheck_manage/quality-inspection-plan'),
            name: 'QualityInspectionPlan',
            meta: {
              faName: 'MaterialQuickcheck',
              title: '原材料 质量检测计划',
              permissionName: 'material_test_plan'
            }
          }
        ]
      },
      {
        path: '/internal/quality-nucleic',
        component: () => import('@/views/inspection_release/quality_nucleic'),
        name: 'QualityNucleic',
        meta: {
          title: '原材料库 核酸检测管控',
          icon: 'quality',
          permissionName: 'wms_hs_management'
        }
      },
      {
        path: '/internal/quality-inspection-release',
        component: () => import('@/views/inspection_release/quality_inspection_release'),
        name: 'QualityInspectionRelease',
        meta: {
          title: '原材料库 质检信息设定',
          icon: 'quality',
          permissionName: 'material_quality_setting'
        }
      },
      {
        path: '/bar-code-registration',
        component: () => import('@/views/inventory/material-delivery-manage/bar-code-registration.vue'),
        name: 'BarCodeRegistration',
        meta: {
          title: '原材料 总部送检条码登记',
          icon: 'quality',
          permissionName: 'material_sjdj'
        }
      },
      {
        path: '/internal/carbon-inspection-release',
        component: () => import('@/views/inspection_release/carbon_inspection_release'),
        name: 'CarbonInspectionRelease',
        meta: {
          title: '炭黑库 质检信息设定',
          icon: 'quality',
          permissionName: 'th_quality_setting'
        }
      },
      {
        path: '/quickCheck',
        redirect: '/inspection-result-management/menni-equip',
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
              faName: 'QuickCheckGather',
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
          title: '炭黑罐投料防错',
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
              permissionName: 'carbon_feeding_prompt'
            }
          },
          {
            path: '/feed/raw-weightSet',
            component: () => import('@/views/quality_management/feed/raw-weightSet'),
            name: 'RawWeightSet',
            meta: {
              faName: 'Feed',
              title: '投料重量设定',
              permissionName: 'carbon_tank_set'
            }
          },
          {
            path: '/feed/raw-query',
            component: () => import('@/views/quality_management/feed/raw-query'),
            name: 'RawQuery',
            meta: {
              faName: 'Feed',
              title: '投料操作履历查询',
              permissionName: 'feed_check_operation'
            }
          }
        ]
      },
      {
        path: '/banburying',
        redirect: '/banburying/substitutes',
        component: () => import('@/views/quality_management/banburying/a-index'),
        name: 'Banburying',
        meta: {
          title: '密炼投料防错',
          icon: 'quality'
        },
        children: [
          {
            path: '/banburying/substitutes',
            component: () => import('@/views/quality_management/banburying/substitutes'),
            name: 'BanburyingSubstitutes',
            meta: {
              faName: 'Banburying',
              title: '细料胶块放行处理',
              permissionName: 'replace_material'
            }
          },
          {
            path: '/banburying/makeUp',
            component: () => import('@/views/quality_management/banburying/makeUp'),
            name: 'BanburyingMakeUp',
            meta: {
              faName: 'Banburying',
              title: '胶皮补打卡片',
              permissionName: 'return_rubber'
            }
          },
          {
            path: '/banburying/toleranceEntry',
            component: () => import('@/views/quality_management/banburying/toleranceEntry'),
            name: 'BanburyingToleranceEntry',
            meta: {
              faName: 'Banburying',
              title: '配方公差标准录入',
              permissionName: 'tolerance_rule'
            }
          },
          {
            path: '/banburying/standardDistinction',
            component: () => import('@/views/quality_management/banburying/standardDistinction'),
            name: 'BanburyingStandardDistinction',
            meta: {
              faName: 'Banburying',
              title: '公差标准区分关键字',
              permissionName: 'tolerance_keyword'
            }
          },
          {
            path: '/banburying/standardProject',
            component: () => import('@/views/quality_management/banburying/standardProject'),
            name: 'BanburyingStandardProject',
            meta: {
              faName: 'Banburying',
              title: '公差标准项目关键字',
              permissionName: 'tolerance_keyword'
            }
          },
          {
            path: '/banburying/standardTreatment',
            component: () => import('@/views/quality_management/banburying/standardTreatment'),
            name: 'BanburyingStandardTreatment',
            meta: {
              faName: 'Banburying',
              title: '公差标准处理关键字',
              permissionName: 'tolerance_keyword'
            }
          }
        ]
      },
      {
        path: '/internal/material-statistics',
        component: () => import('@/views/quality_management/material-statistics'),
        name: 'MaterialStatistics',
        meta: {
          title: '称量机台物料统计',
          icon: 'quality',
          permissionName: 'xl_report_weight_statics'
        }
      }
      // {
      //   path: '/internal/material-statistics',
      //   component: () => import('@/views/quality_management/material-statistics'),
      //   name: 'MaterialStatistics',
      //   meta: {
      //     title: '称量机台物料统计',
      //     icon: 'quality',
      //     permissionName: ''
      //   }
      // }
    ]
  },
  // {
  //   path: '/equipment',
  //   component: Layout,
  //   redirect: '/equipment/classes-banburying-summary',
  //   name: 'equipment',
  //   meta: {
  //     title: '设备管理',
  //     icon: 'quality'
  //   },
  //   children: [
  //     {
  //       path: '/equipment/spare-part',
  //       redirect: '/spare-part/base/spare-location',
  //       component: () => import('@/views/equipment-management/a-spare-part-fa'),
  //       name: 'SparePart',
  //       meta: {
  //         title: '备品备件管理',
  //         icon: 'quality'
  //       },
  //       children: [
  //         {
  //           path: '/base',
  //           redirect: '/spare-location',
  //           component: () => import('@/views/equipment-management/spare-part/a-spare-part-fa'),
  //           name: 'SparePartBase',
  //           meta: {
  //             title: '基础管理'
  //           },
  //           children: [
  //             {
  //               path: '/spare-location',
  //               component: () => import('@/views/equipment-management/spare-part/spare-location'),
  //               name: 'SpareLocation',
  //               meta: {
  //                 faName: 'SparePartBase',
  //                 fourFaName: 'SparePart',
  //                 title: '库存位管理',
  //                 permissionName: 'spare_location'
  //               }
  //             },
  //             {
  //               path: '/spare-type',
  //               component: () => import('@/views/equipment-management/spare-part/spare-type'),
  //               name: 'SpareType',
  //               meta: {
  //                 faName: 'SparePartBase',
  //                 fourFaName: 'SparePart',
  //                 title: '类型管理',
  //                 permissionName: 'spare_type'
  //               }
  //             },
  //             {
  //               path: '/spareparts-spare',
  //               component: () => import('@/views/equipment-management/spare-part/spareparts-spare'),
  //               name: 'SparepartsSpare',
  //               meta: {
  //                 faName: 'SparePartBase',
  //                 fourFaName: 'SparePart',
  //                 title: '基本信息管理',
  //                 permissionName: 'spare_info'
  //               }
  //             },
  //             {
  //               path: '/shelf-material-binding',
  //               component: () => import('@/views/equipment-management/spare-part/shelf-material-binding'),
  //               name: 'ShelfMaterialBinding',
  //               meta: {
  //                 faName: 'SparePartBase',
  //                 fourFaName: 'SparePart',
  //                 title: '货架物料绑定管理',
  //                 permissionName: 'location_binding'
  //               }
  //             },
  //             {
  //               path: '/location-manage',
  //               component: () => import('@/views/equipment-management/spare-part/location-manage'),
  //               name: 'SparePartLocationManage',
  //               meta: {
  //                 faName: 'SparePartBase',
  //                 fourFaName: 'SparePart',
  //                 title: '备品备件库位管理',
  //                 permissionName: 'spare_inventory'
  //               }
  //             },
  //             {
  //               path: '/inventory-manage',
  //               component: () => import('@/views/equipment-management/spare-part/inventory-manage'),
  //               name: 'SparePartInventoryManage',
  //               meta: {
  //                 faName: 'SparePartBase',
  //                 fourFaName: 'SparePart',
  //                 title: '备品备件库存管理',
  //                 permissionName: 'spare_stock'
  //               }
  //             },
  //             {
  //               path: '/inventory-upload',
  //               component: () => import('@/views/equipment-management/spare-part/inventory-upload'),
  //               name: 'InventoryUpload',
  //               meta: {
  //                 faName: 'SparePartBase',
  //                 fourFaName: 'SparePart',
  //                 title: '备品备件库存导入',
  //                 permissionName: 'spare_import'
  //               }
  //             }
  //           ]
  //         },
  //         {
  //           path: '/warehous',
  //           redirect: '/warehousing',
  //           component: () => import('@/views/equipment-management/spare-part/a-spare-part-warehousing-fa'),
  //           name: 'SparePartWarehousingManage',
  //           meta: {
  //             title: '出入库管理'
  //           },
  //           children: [
  //             {
  //               path: '/warehousing',
  //               component: () => import('@/views/equipment-management/spare-part/warehousing'),
  //               name: 'SparePartWarehousing',
  //               meta: {
  //                 faName: 'SparePartWarehousing',
  //                 fourFaName: 'SparePart',
  //                 title: '备品备件入库管理',
  //                 permissionName: 'spare_inbound'
  //               }
  //             },
  //             {
  //               path: '/warehouse-out',
  //               component: () => import('@/views/equipment-management/spare-part/warehouse-out'),
  //               name: 'SparePartWarehouseOut',
  //               meta: {
  //                 faName: 'SparePartWarehousing',
  //                 fourFaName: 'SparePart',
  //                 title: '备品备件出库管理',
  //                 permissionName: 'spare_outbound'
  //               }
  //             },
  //             {
  //               path: '/inventory',
  //               component: () => import('@/views/equipment-management/spare-part/inventory'),
  //               name: 'SparePartInventory',
  //               meta: {
  //                 faName: 'SparePartWarehousing',
  //                 fourFaName: 'SparePart',
  //                 title: '备品备件盘点管理',
  //                 permissionName: 'stock_count'
  //               }
  //             }
  //           ]
  //         },
  //         {
  //           path: '/record',
  //           redirect: '/warehousing-record',
  //           component: () => import('@/views/equipment-management/spare-part/a-spare-part-record-manage'),
  //           name: 'SparePartRecordManage',
  //           meta: {
  //             title: '履历管理'
  //           },
  //           children: [
  //             {
  //               path: '/warehousing-record',
  //               component: () => import('@/views/equipment-management/spare-part/all-record'),
  //               name: 'SparePartWarehousingRecord',
  //               meta: {
  //                 faName: 'SparePartWarehousingRecord',
  //                 fourFaName: 'SparePart',
  //                 title: '备品备件入库履历',
  //                 permissionName: 'inbound_history'
  //               }
  //             },
  //             {
  //               path: '/warehousing-out-record',
  //               component: () => import('@/views/equipment-management/spare-part/out-record'),
  //               name: 'SparePartWarehousingOutRecord',
  //               meta: {
  //                 faName: 'SparePartWarehousingRecord',
  //                 fourFaName: 'SparePart',
  //                 title: '备品备件出库履历',
  //                 permissionName: 'outbound_history'
  //               }
  //             },
  //             {
  //               path: '/inventory-record',
  //               component: () => import('@/views/equipment-management/spare-part/all-record'),
  //               name: 'SparePartInventoryRecord',
  //               meta: {
  //                 faName: 'SparePartWarehousingRecord',
  //                 fourFaName: 'SparePart',
  //                 title: '备品备件盘点履历',
  //                 permissionName: 'stock_history'
  //               }
  //             }
  //           ]
  //         }
  //       ]
  //     },
  //     {
  //       path: '/equipment-maintenance',
  //       redirect: '/location-definition',
  //       component: () => import('@/views/equipment-management/repair/a-equipment-maintenance-fa'),
  //       name: 'EquipmentMaintenance',
  //       meta: {
  //         title: '设备维修管理',
  //         icon: 'quality'
  //       },
  //       children: [
  //         {
  //           path: '/location-definition',
  //           component: () => import('@/views/equipment-management/repair/location-definition'),
  //           name: 'LocationDefinition',
  //           meta: {
  //             faName: 'EquipmentMaintenance',
  //             title: '设备部位定义',
  //             permissionName: 'equip_part'
  //           }
  //         },
  //         {
  //           path: '/cause-of-shutdown',
  //           redirect: '/cause-of-shutdown/mold',
  //           component: () => import('@/views/equipment-management/repair/a-repair-fa'),
  //           name: 'CauseOfShutdown',
  //           meta: {
  //             title: '停机原因管理'
  //           },
  //           children: [
  //             {
  //               path: '/cause-of-shutdown/mold',
  //               component: () => import('@/views/equipment-management/repair/shutdown-mold'),
  //               name: 'CauseOfShutdownMold',
  //               meta: {
  //                 faName: 'CauseOfShutdown',
  //                 fourFaName: 'EquipmentMaintenance',
  //                 title: '停机类型定义',
  //                 permissionName: 'equip_down_type'
  //               }
  //             },
  //             {
  //               path: '/cause-of-shutdown/reason',
  //               component: () => import('@/views/equipment-management/repair/shutdown-reason'),
  //               name: 'CauseOfShutdownReason',
  //               meta: {
  //                 faName: 'CauseOfShutdown',
  //                 fourFaName: 'EquipmentMaintenance',
  //                 title: '停机原因定义',
  //                 permissionName: 'equip_down_reason'
  //               }
  //             }
  //           ]
  //         },
  //         {
  //           path: '/repair-apply',
  //           component: () => import('@/views/equipment-management/repair/repair-apply'),
  //           name: 'RepairApply',
  //           meta: {
  //             faName: 'EquipmentMaintenance',
  //             title: '设备维修申请页面',
  //             permissionName: 'equip_current_status'
  //           }
  //         },
  //         {
  //           path: '/repair-manage',
  //           component: () => import('@/views/equipment-management/repair/repair-manage'),
  //           name: 'RepairManage',
  //           meta: {
  //             faName: 'EquipmentMaintenance',
  //             title: '设备维修单管理',
  //             permissionName: 'equip_maintenance_order'
  //           }
  //         },
  //         {
  //           path: '/work-state',
  //           component: () => import('@/views/equipment-management/repair/work-state'),
  //           name: 'WorkState',
  //           meta: {
  //             faName: 'EquipmentMaintenance',
  //             title: '设备运行现况',
  //             permissionName: 'equip_status'
  //           }
  //         },
  //         {
  //           path: '/repair-resume',
  //           component: () => import('@/views/equipment-management/repair/repair-resume'),
  //           name: 'RepairResume',
  //           meta: {
  //             faName: 'EquipmentMaintenance',
  //             title: '设备维修履历',
  //             permissionName: 'equip_maintenance_order_log'
  //           }
  //         },
  //         {
  //           path: '/equipment-assets',
  //           component: () => import('@/views/equipment-management/repair/equipment-assets'),
  //           name: 'EquipmentAssets',
  //           meta: {
  //             faName: 'EquipmentMaintenance',
  //             title: '设备资产',
  //             permissionName: 'property'
  //           }
  //         }
  //       ]
  //     },
  //  /** {
  //   path: '/equipment-maintain',
  //   redirect: '/location-definition',
  //   component: {
  //     render: c => c('router-view')
  //   },
  //   name: 'equipment-maintain',
  //   meta: {
  //     title: '设备维护管理',
  //     icon: 'quality'
  //   },
  //   children: [
  //     {
  //       path: '/maintain-standard',
  //       component: () => import('@/views/equipment-management/maintain/standard'),
  //       name: 'maintain-standard',
  //       meta: {
  //         title: '维护标准定义',
  //         permissionName: ''
  //       }
  //     },
  //     {
  //       path: '/maintain-plan',
  //       component: () => import('@/views/equipment-management/maintain/plan'),
  //       name: 'maintain-plan',
  //       meta: {
  //         title: '设备维护计划',
  //         permissionName: ''
  //       }
  //     },
  //     {
  //       path: '/maintain-resume',
  //       component: () => import('@/views/equipment-management/maintain/resume'),
  //       name: 'maintain-resume',
  //       meta: {
  //         title: '设备维护履历',
  //         permissionName: ''
  //       }
  //     }
  //   ]
  // },**/
  //     {
  //       path: '/platform-manage',
  //       component: () => import('@/views/equipment-management/repair/platform-manage'),
  //       name: 'PlatformManage',
  //       meta: {
  //         icon: 'quality',
  //         title: '平台信息管理',
  //         permissionName: 'platform_config'
  //       }
  //     },
  //     {
  //       path: '/fault-day-statistics',
  //       component: () => import('@/views/quality_management/fault/fault-day-statistics'),
  //       name: 'FaultDayStatistics',
  //       meta: {
  //         title: '设备别故障日统计',
  //         icon: 'quality',
  //         permissionName: 'equip_daily_summary'
  //       }
  //     },
  //     {
  //       path: '/fault-week-statistics',
  //       component: () => import('@/views/quality_management/fault/fault-week-statistics'),
  //       name: 'FaultWeekStatistics',
  //       meta: {
  //         title: '设备别故障周统计',
  //         icon: 'quality',
  //         permissionName: 'equip_daily_summary'
  //       }
  //     },
  //     {
  //       path: '/fault-month-statistics',
  //       component: () => import('@/views/quality_management/fault/fault-month-statistics'),
  //       name: 'FaultMonthStatistics',
  //       meta: {
  //         title: '设备别故障月统计',
  //         icon: 'quality',
  //         permissionName: 'equip_monthly_summary'
  //       }
  //     }
  //   ]
  // },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]
asyncRoutes = asyncRoutes.concat(equipRoutes)

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
