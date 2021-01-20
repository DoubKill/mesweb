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
export const constantRoutes = [{
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
  component: Layout,
  redirect: '/homePage',
  meta: {
    title: '首页',
    icon: 'el-icon-s-home'
  },
  children: [{
    path: '/homePage',
    component: () => import('@/views/homePage/index'),
    meta: {
      title: '首页',
      icon: 'el-icon-s-home'
    }
  }
  // {
  //   path: '/Kanban',
  //   component: () => import('@/views/homePage/Kanban'),
  //   meta: {
  //     title: '看板',
  //     icon: 'el-icon-s-home'
  //   }
  // },
  // {
  //   path: '/2code',
  //   component: () => import('@/views/homePage/2code'),
  //   meta: {
  //     title: '二维码',
  //     icon: 'el-icon-s-home'
  //   }
  // }
  ]
}
]

// 存在权限的路由
// meta.permissionName  权限
export const asyncRoutes = [{
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
    name: 'global-codes-manage',
    component: () => import('@/views/basic/global-codes-manage/index'),
    meta: {
      title: '公用代码管理',
      icon: 'dashboard',
      permissionName: 'globalcodetype'
    }
  },
  {
    path: '/group/manage',
    name: 'group-manage',
    component: () => import('@/views/basic/group-manage/index'),
    meta: {
      title: '角色管理',
      icon: 'dashboard',
      permissionName: 'groupextension'
    }
  },
  {
    path: '/user/manage',
    name: 'user-manage',
    component: () => import('@/views/basic/user-manage/index'),
    meta: {
      title: '用户管理',
      icon: 'dashboard',
      permissionName: 'user'
    }
  },
  {
    path: '/users/by/group/manage',
    name: 'users-by-group-manage',
    component: () => import('@/views/basic/users-by-group-manage/index'),
    meta: {
      title: '角色别用户管理',
      icon: 'dashboard',
      permissionName: 'group_user'
    }
  },
  {
    path: '/equip/base/info/manage',
    name: 'equip-base-info-manage',
    component: () => import('@/views/change_shifts_manage/index'),
    meta: {
      title: '倒班时间管理',
      icon: 'dashboard',
      permissionName: 'workschedule'
    }
  },
  {
    path: '/change/shifts/manage',
    name: 'change-shifts-manage',
    component: () => import('@/views/factory_schedule_manage/index'),
    meta: {
      title: '工厂排班管理',
      icon: 'dashboard',
      permissionName: 'planschedule'
    }
  },
  {
    path: '/factory/schedule/manage',
    name: 'factory-schedule-manage',
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
    name: 'location-site',
    meta: {
      title: '位置点管理',
      icon: 'dashboard',
      permissionName: 'location'
    }
  },
  {
    path: '/factory',
    redirect: '/factory/category/manage',
    component: {
      render: c => c('router-view')
    },
    name: 'factory',
    meta: {
      title: '设备管理',
      icon: 'dashboard'
    },
    children: [{
      path: '/factory/category/manage',
      name: 'category-manage',
      component: () => import('@/views/category_manage/index'),
      meta: {
        title: '设备种类',
        permissionName: 'equipcategoryattribute'
      }
    },
    {
      path: '/factory/equip/manage',
      name: 'equip-manage',
      component: () => import('@/views/equip_manage/index'),
      meta: {
        title: '设备基础信息',
        permissionName: 'equip'
      }
    }
    ]
  }
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
    // permissionName: 'recipe'
  },
  children: [{
    path: '/material/base/info/manage',
    name: 'material-base-info-manage',
    component: () => import('@/views/material_base_info_manage/index'),
    meta: {
      title: '原材料基础信息',
      icon: 'formula',
      permissionName: 'material'
    }
  },
  {
    path: '/rb/recipe/std/manage',
    name: 'rb-recipe-std-manage',
    component: () => import('@/views/rubber_recipe_standard_manage/index'),
    meta: {
      title: '胶料代码管理',
      icon: 'formula',
      permissionName: 'productinfo'
    }
  },
  {
    path: '/rb/material/std/manage',
    name: 'rb-material-std-manage',
    component: () => import('@/views/rb_material_std_manage/index'),
    meta: {
      title: '胶料配方标准管理',
      icon: 'formula',
      permissionName: 'productbatching'
    }
  },
  {
    path: '/rb/material-tank/manage',
    name: 'material-tank',
    component: () => import('@/views/recipe/tankInformation/list'),
    meta: {
      title: '称量系统料仓信息管理',
      icon: 'formula',
      permissionName: 'weight_tank'
    }
  },
  {
    path: '/search/rubber/info',
    name: 'search-rubber-info',
    component: () => import('@/views/recipe/small-material-recipe/index'),
    meta: {
      title: '小料配料标准管理',
      icon: 'formula',
      permissionName: 'weight_batching'
    }
  },
  {
    path: '/rubber-plan-release',
    name: 'rubber-plan-release',
    component: () => import('@/views/recipe/rubber-plan-release'),
    meta: {
      title: '小料计划下达',
      icon: 'formula',
      permissionName: 'batching_plan'
    }
  },
  {
    path: '/actual-comparison',
    name: 'actual-comparison',
    component: () => import('@/views/recipe/actual-comparison'),
    meta: {
      title: '小料称量计划与实际对比',
      icon: 'formula',
      permissionName: 'batching_reality'
    }
  }
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
    // permissionName: 'plan'
  },
  children: [{
    path: '/rubber/schedule/daily/plan',
    name: 'rubber-schedule-daily-plan',
    component: () => import('@/views/rubber_schedule_daily_plan/index'),
    meta: {
      title: '排产胶料日计划',
      icon: 'productionPlanManagement',
      permissionName: 'productdayplan'
    }
  },
  {
    path: '/rubber/schedule/daily/plan/release',
    name: 'rubber-schedule-daily-plan-release',
    component: () => import('@/views/rubber_schedule_daily_plan/release'),
    meta: {
      title: '排产胶料日计划下达',
      icon: 'productionPlanManagement',
      permissionName: 'productdayplan'
    }
  },
  {
    path: '/material/requisitions/plan',
    name: 'material-requisitions-plan',
    component: () => import('@/views/plan/material-requisitions-plan/index'),
    meta: {
      title: '排产领料计划',
      icon: 'productionPlanManagement',
      permissionName: 'productdayplan'
    }
  },
  {
    path: '/material/quantity/demanded',
    name: 'material-quantity-demanded',
    component: () => import('@/views/material_quantity_demanded/index'),
    meta: {
      title: '原材料需求量',
      icon: 'productionPlanManagement',
      permissionName: 'materialdemanded'
    }
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
    // permissionName: 'production'
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
    name: 'train-number-report',
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
    name: 'drug-investment',
    meta: {
      title: '药品投入统计',
      icon: 'production',
      permissionName: 'drug_analyze'
    }
  },
  {
    path: '/zl-warehouse-out-kanban',
    component: () => import('@/views/production/warehouse-out-kanban.vue'),
    name: 'zl-warehouseOutKanban',
    meta: {
      title: '终炼胶出库看板', icon: 'production',
      permissionName: 'zl_dashboard'
    }
  },
  {
    path: '/hl-warehouse-out-kanban',
    component: () => import('@/views/production/warehouse-out-kanban.vue'),
    name: 'hl-warehouseOutKanban',
    meta: {
      title: '混炼胶出库看板', icon: 'production',
      permissionName: 'hl_dashboard'
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
        title: '原料库存',
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
      name: 'final-mixing-rubber',
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
      name: 'curtainStorehouse',
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
      component: {
        render: c => c('router-view')
      },
      name: 'ReceiveGoodManage',
      meta: {
        title: '收发货管理',
        icon: 'stock'
      },
      children: [
        {
          path: '/receive-good-manage/index',
          component: () => import('@/views/inventory/receive-good-manage/receive-list.vue'),
          name: 'ReceiveGoodManageIndex',
          meta: {
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
      component: {
        render: c => c('router-view')
      },
      name: 'quick-check',
      meta: {
        title: '快检标准管理',
        icon: 'quality'
      },
      children: [
        {
          path: '/quick-check/test-indicators',
          component: () => import('@/views/quality_management/test_indicators'),
          name: 'testIndicators',
          meta: {
            title: '试验指标管理',
            permissionName: 'test_indicator'
          }
        },
        {
          path: '/quick-check/test-types',
          component: () => import('@/views/quality_management/test_types'),
          name: 'testTypes',
          meta: {
            title: '试验类型管理',
            permissionName: 'test_type'
          }
        },
        {
          path: '/quick-check/test-methods-manage',
          component: () => import('@/views/quality_management/test_methods_manage'),
          namel: 'testMethodsManage',
          meta: {
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
          namel: 'gradeManage',
          meta: {
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
          name: 'benchmark_edit',
          meta: {
            title: '胶料快检判定基准录入',
            permissionName: 'evaluating'
          }
        }
      ]
    },
    {
      path: '/statistics',
      redirect: '/statistics/month-pass-detail',
      component: {
        render: c => c('router-view')
      },
      name: 'quality-statistics',
      meta: {
        title: '快检信息统计分析',
        icon: 'quality'
      },
      children: [
        {
          path: '/statistics/month-pass-detail',
          component: () => import('@/views/quality_management/month_pass_detail'),
          name: 'monthPassDetail',
          meta: {
            title: '月快检合格率统计',
            permissionName: 'month_passing_rate'
          }
        },
        {
          path: '/statistics/material-month-pass',
          component: () => import('@/views/quality_management/material_month_pass'),
          name: 'materialMonthPass',
          meta: {
            title: '胶料月合格率统计',
            permissionName: 'product_month_passing_rate'
          }
        },
        {
          path: '/statistics/material-day-pass',
          component: () => import('@/views/quality_management/material_day_pass'),
          name: 'materialDayPass',
          meta: {
            title: '胶料日合格率统计',
            permissionName: 'product_daily_passing_rate'
          }
        }
      ]
    },
    {
      path: '/unqualified-handle',
      redirect: '/unqualified-handle/inferior-quality-product-manage',
      component: {
        render: c => c('router-view')
      },
      name: 'unqualified-handle',
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
            title: '不合格处置单生成',
            permissionName: 'unqualified_trains'
          }
        },
        {
          path: '/unqualified-handle/disposal-list',
          component: () => import('@/views/quality_management/disposal-list.vue'),
          name: 'DisposalList',
          meta: {
            title: '不合格处置单管理',
            permissionName: 'unqualified_order'
          }
        }
      ]
    },
    {
      path: '/inspection-result-management',
      redirect: '/inspection-result-management/manual-entry',
      component: {
        render: c => c('router-view')
      },
      name: 'inspection-result-management',
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
            title: '手工检测数据录入',
            permissionName: 'test_result'
          }
        },
        {
          path: '/inspection-result-management/details',
          component: () => import('@/views/quality_management/details'),
          name: 'Details',
          meta: {
            title: '胶料快检详细信息',
            permissionName: 'result_info'
          }
        },
        {
          path: '/inspection-result-management/check-synthesize-manage',
          component: () => import('@/views/quality_management/check_synthesize_manage'),
          name: 'CheckSynthesizeManage',
          meta: {
            title: '快检信息综合管理',
            permissionName: 'deal_result'
          }
        }
      ]
    },
    {
      path: '/material-info-mapping',
      component: () => import('@/views/quality_management/material-info-mapping/material-info-mapping'),
      name: 'material-info-mapping',
      meta: {
        title: 'mes与子系统物料信息映射',
        icon: 'quality',
        permissionName: ''
      }
    },
    {
      path: '/barcode-change',
      component: () => import('@/views/quality_management/material-info-mapping/barcode-change'),
      name: 'barcode-change',
      meta: {
        title: '条码变更和打印',
        icon: 'quality',
        permissionName: ''
      }
    }
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
  children: [{
    path: '/equipment/classes-banburying-summary',
    component: () => import('@/views/equipment-management/classes-banburying-summary'),
    name: 'classes-banburying-summary',
    meta: {
      title: '班次密炼时间汇总',
      icon: 'quality',
      permissionName: 'class_production_summary'
    }
  },
  {
    path: '/equipment/banburying-ratio-summary',
    component: () => import('@/views/equipment-management/banburying-ratio-summary'),
    name: 'banburying-ratio-summary',
    meta: {
      title: '密炼时间占比汇总',
      icon: 'quality',
      permissionName: 'production_time_summary'
    }
  },
  {
    path: '/equipment/rubber-acar-summary',
    component: () => import('@/views/equipment-management/rubber-acar-summary'),
    name: 'rubber-acar-summary',
    meta: {
      title: '胶料单车次时间汇总',
      icon: 'quality',
      permissionName: 'single_trains_time_consume'
    }
  },
  {
    path: '/equipment/specs-switch-summary',
    component: () => import('@/views/equipment-management/specs-switch-summary'),
    name: 'specs-switch-summary',
    meta: {
      title: '规格切换时间汇总',
      icon: 'quality',
      permissionName: 'product_exchange_consume'
    }
  },
  {
    path: '/equipment/spare-part',
    redirect: '/spare-part/base/spare-location',
    component: {
      render: c => c('router-view')
    },
    name: 'spare-part',
    meta: {
      title: '备品备件管理',
      icon: 'quality'
    },
    children: [
      {
        path: '/base',
        redirect: '/spare-location',
        component: {
          render: c => c('router-view')
        },
        name: 'spare-part-base',
        meta: {
          title: '基础管理'
        },
        children: [
          {
            path: '/spare-location',
            component: () => import('@/views/equipment-management/spare-part/spare-location'),
            name: 'spare-location',
            meta: {
              title: '库存位管理',
              permissionName: 'spare_location'
            }
          },
          {
            path: '/spare-type',
            component: () => import('@/views/equipment-management/spare-part/spare-type'),
            name: 'spare-type',
            meta: {
              title: '类型管理',
              permissionName: 'spare_type'
            }
          },
          {
            path: '/spareparts-spare',
            component: () => import('@/views/equipment-management/spare-part/spareparts-spare'),
            name: 'spareparts-spare',
            meta: {
              title: '基本信息管理',
              permissionName: 'spare_info'
            }
          },
          {
            path: '/shelf-material-binding',
            component: () => import('@/views/equipment-management/spare-part/shelf-material-binding'),
            name: 'shelf-material-binding',
            meta: {
              title: '货架物料绑定管理',
              permissionName: 'location_binding'
            }
          },
          {
            path: '/location-manage',
            component: () => import('@/views/equipment-management/spare-part/location-manage'),
            name: 'spare-part-location-manage',
            meta: {
              title: '备品备件库位管理',
              permissionName: 'spare_inventory'
            }
          },
          {
            path: '/inventory-manage',
            component: () => import('@/views/equipment-management/spare-part/inventory-manage'),
            name: 'spare-part-inventory-manage',
            meta: {
              title: '备品备件库存管理',
              permissionName: 'spare_stock'
            }
          },
          {
            path: '/inventory-upload',
            component: () => import('@/views/equipment-management/spare-part/inventory-upload'),
            name: 'inventory-upload',
            meta: {
              title: '备品备件库存导入',
              permissionName: 'spare_import'
            }
          }
        ]
      },
      {
        path: '/warehous',
        redirect: '/warehousing',
        component: {
          render: c => c('router-view')
        },
        name: 'spare-part-warehousing-managr',
        meta: {
          title: '出入库管理'
        },
        children: [
          {
            path: '/warehousing',
            component: () => import('@/views/equipment-management/spare-part/warehousing'),
            name: 'spare-part-warehousing',
            meta: {
              title: '备品备件入库管理',
              permissionName: 'spare_inbound'
            }
          },
          {
            path: '/warehouse-out',
            component: () => import('@/views/equipment-management/spare-part/warehouse-out'),
            name: 'spare-part-warehouse-out',
            meta: {
              title: '备品备件出库管理',
              permissionName: 'spare_outbound'
            }
          },
          {
            path: '/inventory',
            component: () => import('@/views/equipment-management/spare-part/inventory'),
            name: 'spare-part-inventory',
            meta: {
              title: '备品备件盘点管理',
              permissionName: 'stock_count'
            }
          }
        ]
      }, {
        path: '/record',
        redirect: '/warehousing-record',
        component: {
          render: c => c('router-view')
        },
        name: 'spare-part-record-managr',
        meta: {
          title: '履历管理'
        },
        children: [
          {
            path: '/warehousing-record',
            component: () => import('@/views/equipment-management/spare-part/all-record'),
            name: 'spare-part-warehousing-record',
            meta: {
              title: '备品备件入库履历',
              permissionName: 'inbound_history'
            }
          },
          {
            path: '/warehousing-out-record',
            component: () => import('@/views/equipment-management/spare-part/all-record'),
            name: 'spare-part-warehousing-out-record',
            meta: {
              title: '备品备件出库履历',
              permissionName: 'outbound_history'
            }
          },
          {
            path: '/inventory-record',
            component: () => import('@/views/equipment-management/spare-part/all-record'),
            name: 'spare-part-inventory-record',
            meta: {
              title: '备品备件盘点履历',
              permissionName: 'stock_history'
            }
          }
        ]
      }
    ]
  },
  {
    path: '/location-definition',
    component: () => import('@/views/equipment-management/repair/location-definition'),
    name: 'location-definition',
    meta: {
      title: '设备部位定义',
      icon: 'quality',
      permissionName: ''
    }
  },
  {
    path: '/cause-of-shutdown',
    redirect: '/cause-of-shutdown/mold',
    component: {
      render: c => c('router-view')
    },
    name: 'cause-of-shutdown',
    meta: {
      title: '停机原因管理',
      icon: 'quality'
    },
    children: [
      {
        path: '/cause-of-shutdown/mold',
        component: () => import('@/views/equipment-management/repair/shutdown-mold'),
        name: 'cause-of-shutdown-mold',
        meta: {
          title: '停机类型定义',
          permissionName: ''
        }
      },
      {
        path: '/cause-of-shutdown/reason',
        component: () => import('@/views/equipment-management/repair/shutdown-reason'),
        name: 'cause-of-shutdown-reason',
        meta: {
          title: '停机原因定义',
          permissionName: ''
        }
      }
    ]
  },
  {
    path: '/repair-apply',
    component: () => import('@/views/equipment-management/repair/repair-apply'),
    name: 'repair-apply',
    meta: {
      icon: 'quality',
      title: '设备维修申请页面',
      permissionName: ''
    }
  },
  {
    path: '/repair-manage',
    component: () => import('@/views/equipment-management/repair/repair-manage'),
    name: 'repair-manage',
    meta: {
      icon: 'quality',
      title: '设备维修单管理',
      permissionName: ''
    }
  },
  {
    path: '/work-state',
    component: () => import('@/views/equipment-management/repair/work-state'),
    name: 'work-state',
    meta: {
      icon: 'quality',
      title: '设备运行现况',
      permissionName: ''
    }
  },
  {
    path: '/repair-resume',
    component: () => import('@/views/equipment-management/repair/repair-resume'),
    name: 'repair-resume',
    meta: {
      icon: 'quality',
      title: '设备维修履历',
      permissionName: ''
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
