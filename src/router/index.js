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
  children: [{
    path: 'homePage',
    component: () => import('@/views/homePage/index'),
    meta: {
      title: '首页',
      icon: 'el-icon-s-home'
    }
  }]
}
]

// 存在权限的路由
// meta.permissionName  权限
export const asyncRoutes = [{
  path: '',
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
      permissionName: 'globalcodetype'
    }
  },
  {
    path: '/group/manage',
    name: 'group-manage',
    component: () => import('@/views/basic/group-manage/index'),
    meta: {
      title: '角色管理',
      permissionName: 'groupextension'
    }
  },
  {
    path: '/user/manage',
    name: 'user-manage',
    component: () => import('@/views/basic/user-manage/index'),
    meta: {
      title: '用户管理',
      permissionName: 'user'
    }
  },
  {
    path: '/users/by/group/manage',
    name: 'users-by-group-manage',
    component: () => import('@/views/basic/users-by-group-manage/index'),
    meta: {
      title: '角色别用户管理',
      permissionName: 'group_user'
    }
  },
  {
    path: '/equip/base/info/manage',
    name: 'equip-base-info-manage',
    component: () => import('@/views/change_shifts_manage/index'),
    meta: {
      title: '倒班时间管理',
      permissionName: 'workschedule'
    }
  },
  {
    path: '/change/shifts/manage',
    name: 'change-shifts-manage',
    component: () => import('@/views/factory_schedule_manage/index'),
    meta: {
      title: '工厂排班管理',
      permissionName: 'planschedule'
    }
  },
  {
    path: 'factory/schedule/manage',
    name: 'factory-schedule-manage',
    component: () => import('@/views/factory_schedule_result/index'),
    meta: {
      title: '工厂排班结果',
      permissionName: 'planschedule'
    }
  },
  {
    path: 'location-site',
    component: () => import('@/views/basic/location-site'),
    name: 'location-site',
    meta: {
      title: '库存位管理',
      permissionName: 'class_production_summary'
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
      title: '设备管理'
    },
    children: [{
      path: 'category/manage',
      name: 'category-manage',
      component: () => import('@/views/category_manage/index'),
      meta: {
        title: '设备种类',
        permissionName: 'equipcategoryattribute'
      }
    },
    {
      path: 'equip/manage',
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
  redirect: '/recipe/material/base/info/manage',
  name: 'recipe',
  meta: {
    title: '配方管理',
    icon: 'formula'
    // permissionName: 'recipe'
  },
  children: [{
    path: 'material/base/info/manage',
    name: 'material-base-info-manage',
    component: () => import('@/views/material_base_info_manage/index'),
    meta: {
      title: '原材料基础信息',
      permissionName: 'material'
    }
  },
  {
    path: 'rb/recipe/std/manage',
    name: 'rb-recipe-std-manage',
    component: () => import('@/views/rubber_recipe_standard_manage/index'),
    meta: {
      title: '胶料代码管理',
      permissionName: 'productinfo'
    }
  },
  {
    path: 'rb/material/std/manage',
    name: 'rb-material-std-manage',
    component: () => import('@/views/rb_material_std_manage/index'),
    meta: {
      title: '胶料配方标准管理',
      permissionName: 'productbatching'
    }
  },
  {
    path: 'search/rubber/info',
    name: 'search-rubber-info',
    component: () => import('@/views/recipe/small-material-recipe/index'),
    meta: {
      title: '小料配料标准管理',
      permissionName: 'productbatching'
    }
  }
  ]
},
{
  path: '/plan',
  component: Layout,
  redirect: '/plan/rubber/schedule/daily/plan',
  name: 'plan',
  meta: {
    title: '生产计划管理',
    icon: 'productionPlanManagement'
    // permissionName: 'plan'
  },
  children: [{
    path: 'rubber/schedule/daily/plan',
    name: 'rubber-schedule-daily-plan',
    component: () => import('@/views/rubber_schedule_daily_plan/index'),
    meta: {
      title: '排产胶料日计划',
      permissionName: 'productdayplan'
    }
  },
  {
    path: 'rubber/schedule/daily/plan/release',
    name: 'rubber-schedule-daily-plan-release',
    component: () => import('@/views/rubber_schedule_daily_plan/release'),
    meta: {
      title: '排产胶料日计划下达',
      permissionName: 'productdayplan'
    }
  },
  {
    path: 'material/requisitions/plan',
    name: 'material-requisitions-plan',
    component: () => import('@/views/plan/material-requisitions-plan/index'),
    meta: {
      title: '排产领料计划',
      permissionName: 'productdayplan'
    }
  },
  {
    path: 'material/quantity/demanded',
    name: 'material-quantity-demanded',
    component: () => import('@/views/material_quantity_demanded/index'),
    meta: {
      title: '原材料需求量',
      permissionName: 'materialdemanded'
    }
  }
  ]
},
{
  path: '/produce',
  component: Layout,
  redirect: 'produce/performance/manage',
  name: 'ProduceManage',
  meta: {
    title: '生产管理',
    icon: 'production'
    // permissionName: 'production'
  },
  children: [{
    path: 'performance/manage',
    component: () => import('@/views/production/banburying-performance-manage/index'),
    name: 'BanburyingPerformanceManage',
    meta: {
      title: '密炼实绩',
      permissionName: 'product_actual'
    }
  },
  {
    path: 'plan/manage',
    component: () => import('@/views/banburying_plan/index'),
    name: 'BanburyingPlanManage',
    meta: {
      title: '密炼机台别计划对比',
      permissionName: 'plan_reality'
    }
  },
  {
    path: 'internal/mixer',
    component: () => import('@/views/internal_mixer_production/index'),
    name: 'InternalMixerProduction',
    meta: {
      title: '密炼生产履历',
      permissionName: 'product_record'
    }
  },
  {
    path: 'train-number-report',
    component: () => import('@/views/production/train-number-report.vue'),
    name: 'train-number-report',
    meta: {
      title: '车次报表',
      permissionName: 'product_actual'
    }
  },
  {
    path: 'product-plan-reality-analyse',
    component: () => import('@/views/production/product-plan-reality-analyse.vue'),
    name: 'ProductPlanRealityAnalyse',
    meta: {
      title: '产量计划实际分析（车数）',
      permissionName: 'product_actual'
    }
  },
  {
    path: 'interval-production-statistics',
    component: () => import('@/views/production/interval-production-statistics.vue'),
    name: 'IntervalProductionStatistics',
    meta: {
      title: '区间产量统计（车数）',
      permissionName: 'product_actual'
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
  redirect: '/repertory/material',
  name: 'RepertoryManage',
  meta: {
    title: '库存管理',
    icon: 'stock'
  },
  children: [
    {
      path: 'warehouse-info',
      component: () => import('@/views/inventory/warehouse_info.vue'),
      name: 'WarehouseInfo',
      meta: {
        title: '仓库信息管理',
        permissionName: 'warehouse'
      }
    },
    {
      path: 'material',
      component: () => import('@/views/material_repertory_manage/index'),
      name: 'MaterialRepertoryManage',
      meta: {
        title: '原料库存',
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
      path: 'rubber',
      component: () => import('@/views/rubber_repertory_manage/index'),
      name: 'RubberRepertoryManage',
      meta: {
        title: '混炼胶库存',
        permissionName: 'product_inventory'
      }
    },
    {
      path: 'material-inout-record',
      component: () => import('@/views/inventory/material_inout_record.vue'),
      name: 'MaterialInOutRecord',
      meta: {
        title: '物料出入库履历',
        permissionName: 'in_out_history'
      }
    },
    {
      path: 'material-inventory-manage',
      component: () => import('@/views/inventory/material-inventory-manage.vue'),
      name: 'MaterialInventoryManage',
      meta: {
        title: '物料库位信息',
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
      path: 'final-mixing-rubber-manage',
      component: () => import('@/views/inventory/final-mixing-rubber-manage.vue'),
      name: 'final-mixing-rubber',
      meta: {
        title: '终炼胶出库计划',
        permissionName: 'inventory_plan'
      }
    },
    {
      path: 'compound-rubber-manage',
      component: () => import('@/views/inventory/compound-rubber-manage.vue'),
      name: 'CompoundManage',
      meta: {
        title: '混炼胶出库计划',
        permissionName: 'inventory_plan'
      }
    },
    {
      path: 'final-rubber-manage',
      component: () => import('@/views/inventory/final_rubber_manage.vue'),
      name: 'OutboundManage',
      meta: {
        title: '胶片库出库计划',
        permissionName: 'inventory_plan'
      }
    },
    {
      path: 'curtain-storehouse',
      component: () => import('@/views/inventory/curtain-storehouse.vue'),
      name: 'curtainStorehouse',
      meta: {
        title: '帘布库出库计划',
        permissionName: 'LB_inventory_plan'
      }
    },
    {
      path: 'warehouse-out-kanban',
      component: () => import('@/views/inventory/warehouse-out-kanban.vue'),
      name: 'warehouseOutKanban',
      meta: {
        title: '出库看板',
        permissionName: 'LB_inventory_plan'
      }
    },
    // {
    //   path: 'expire-rubber-manage',
    //   component: () => import('@/views/inventory/expire_rubber_manage.vue'),
    //   name: 'ExpireRubberManage',
    //   meta: {
    //     title: '过期胶料管理',
    //     permissionName: 'expire_product'
    //   }
    // },
    {
      path: 'material-attribute-manage',
      component: () => import('@/views/inventory/material-attribute-manage.vue'),
      name: 'MaterialAttributeManage',
      meta: {
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
        title: '收发货管理'
      },
      children: [
        {
          path: '/index',
          component: () => import('@/views/inventory/receive-good-manage/receive-list.vue'),
          name: 'ReceiveGoodManageIndex',
          meta: {
            title: '发货计划管理',
            permissionName: 'delivery_plan'
          }
        },
        {
          path: '/view',
          component: () => import('@/views/inventory/receive-good-manage/receive-view.vue'),
          name: 'ReceiveGoodManageView',
          meta: {
            title: '发货履历管理',
            permissionName: 'delivery_history'
          }
        },
        {
          path: '/address',
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
        title: '快检标准管理'
      },
      children: [
        {
          path: 'test-indicators',
          component: () => import('@/views/quality_management/test_indicators'),
          name: 'testIndicators',
          meta: {
            title: '试验指标管理',
            permissionName: 'test_indicator'
          }
        },
        {
          path: 'test-types',
          component: () => import('@/views/quality_management/test_types'),
          name: 'testTypes',
          meta: {
            title: '试验类型管理',
            permissionName: 'test_type'
          }
        },
        {
          path: 'test-methods-manage',
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
          path: 'grade-manage',
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
          path: 'benchmark_edit',
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
        title: '快检信息统计分析'
      },
      children: [
        {
          path: 'month-pass-detail',
          component: () => import('@/views/quality_management/month_pass_detail'),
          name: 'monthPassDetail',
          meta: {
            title: '月快检合格率统计',
            permissionName: 'month_passing_rate'
          }
        },
        {
          path: 'material-month-pass',
          component: () => import('@/views/quality_management/material_month_pass'),
          name: 'materialMonthPass',
          meta: {
            title: '胶料月合格率统计',
            permissionName: 'product_month_passing_rate'
          }
        },
        {
          path: 'material-day-pass',
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
        title: '不合格品处理'
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
          path: '/disposal-list-generate',
          component: () => import('@/views/quality_management/disposal-list-generates.vue'),
          name: 'DisposalListGenerate',
          meta: {
            title: '不合格处置单生成',
            permissionName: 'unqualified_trains'
          }
        },
        {
          path: '/disposal-list',
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
        title: '快检结果管理'
      },
      children: [
        {
          path: 'manual-entry',
          component: () => import('@/views/quality_management/manual_entry'),
          name: 'ManualEntry',
          meta: {
            title: '手工检测数据录入',
            permissionName: 'test_result'
          }
        },
        {
          path: 'details',
          component: () => import('@/views/quality_management/details'),
          name: 'Details',
          meta: {
            title: '胶料快检详细信息',
            permissionName: 'result_info'
          }
        },
        {
          path: 'check-synthesize-manage',
          component: () => import('@/views/quality_management/check_synthesize_manage'),
          name: 'CheckSynthesizeManage',
          meta: {
            title: '快检信息综合管理',
            permissionName: 'deal_result'
          }
        }
      ]
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
    path: 'classes-banburying-summary',
    component: () => import('@/views/equipment-management/classes-banburying-summary'),
    name: 'classes-banburying-summary',
    meta: {
      title: '班次密炼时间汇总',
      permissionName: 'class_production_summary'
    }
  },
  {
    path: 'banburying-ratio-summary',
    component: () => import('@/views/equipment-management/banburying-ratio-summary'),
    name: 'banburying-ratio-summary',
    meta: {
      title: '密炼时间占比汇总',
      permissionName: 'production_time_summary'
    }
  },
  {
    path: 'rubber-acar-summary',
    component: () => import('@/views/equipment-management/rubber-acar-summary'),
    name: 'rubber-acar-summary',
    meta: {
      title: '胶料单车次时间汇总',
      permissionName: 'single_trains_time_consume'
    }
  },
  {
    path: 'specs-switch-summary',
    component: () => import('@/views/equipment-management/specs-switch-summary'),
    name: 'specs-switch-summary',
    meta: {
      title: '规格切换时间汇总',
      permissionName: 'product_exchange_consume'
    }
  },
  {
    path: '/spare-part',
    redirect: '/spare-part/base/spare-location',
    component: {
      render: c => c('router-view')
    },
    name: 'spare-part',
    meta: {
      title: '备品备件管理'
    },
    children: [
      {
        path: 'base',
        redirect: '/spare-location',
        component: {
          render: c => c('router-view')
        },
        name: 'spare-part-base',
        meta: {
          title: '基础管理'
        },
        breadcrumb: false,
        children: [
          {
            path: 'spare-location',
            component: () => import('@/views/equipment-management/spare-part/spare-location'),
            name: 'spare-location',
            meta: {
              title: '库存位管理'
            }
          },
          {
            path: 'spare-type',
            component: () => import('@/views/equipment-management/spare-part/spare-type'),
            name: 'spare-type',
            meta: {
              title: '类型管理',
              permissionName: 'class_production_summary'
            }
          },
          {
            path: 'spareparts-spare',
            component: () => import('@/views/equipment-management/spare-part/spareparts-spare'),
            name: 'spareparts-spare',
            meta: {
              title: '基本信息管理',
              permissionName: 'class_production_summary'
            }
          },
          {
            path: 'shelf-material-binding',
            component: () => import('@/views/equipment-management/spare-part/shelf-material-binding'),
            name: 'shelf-material-binding',
            meta: {
              title: '货架物料绑定管理',
              permissionName: 'class_production_summary'
            }
          },
          {
            path: 'location-manage',
            component: () => import('@/views/equipment-management/spare-part/location-manage'),
            name: 'spare-part-location-manage',
            meta: {
              title: '备品备件库位管理',
              permissionName: 'class_production_summary'
            }
          },
          {
            path: 'inventory-manage',
            component: () => import('@/views/equipment-management/spare-part/inventory-manage'),
            name: 'spare-part-inventory-manage',
            meta: {
              title: '备品备件库存管理',
              permissionName: 'class_production_summary'
            }
          }
        ]
      },
      {
        path: 'warehous',
        redirect: '/warehousing',
        component: {
          render: c => c('router-view')
        },
        name: 'spare-part-warehousing-managr',
        meta: {
          title: '出入库管理'
        },
        breadcrumb: false,
        children: [
          {
            path: 'warehousing',
            component: () => import('@/views/equipment-management/spare-part/warehousing'),
            name: 'spare-part-warehousing',
            meta: {
              title: '备品备件入库管理',
              permissionName: 'class_production_summary'
            }
          },
          {
            path: 'warehouse-out',
            component: () => import('@/views/equipment-management/spare-part/warehouse-out'),
            name: 'spare-part-warehouse-out',
            meta: {
              title: '备品备件出库管理',
              permissionName: 'class_production_summary'
            }
          },
          {
            path: 'inventory',
            component: () => import('@/views/equipment-management/spare-part/inventory'),
            name: 'spare-part-inventory',
            meta: {
              title: '备品备件盘点管理',
              permissionName: 'class_production_summary'
            }
          }
        ]
      }, {
        path: 'record',
        redirect: '/warehousing-record',
        component: {
          render: c => c('router-view')
        },
        name: 'spare-part-record-managr',
        meta: {
          title: '履历管理'
        },
        breadcrumb: false,
        children: [
          {
            path: 'warehousing-record',
            component: () => import('@/views/equipment-management/spare-part/all-record'),
            name: 'spare-part-warehousing-record',
            meta: {
              title: '备品备件入库履历',
              permissionName: 'class_production_summary'
            }
          },
          {
            path: 'warehousing-out-record',
            component: () => import('@/views/equipment-management/spare-part/all-record'),
            name: 'spare-part-warehousing-out-record',
            meta: {
              title: '备品备件出库履历',
              permissionName: 'class_production_summary'
            }
          },
          {
            path: 'inventory-record',
            component: () => import('@/views/equipment-management/spare-part/all-record'),
            name: 'spare-part-inventory-record',
            meta: {
              title: '备品备件盘点履历',
              permissionName: 'class_production_summary'
            }
          }
        ]
      }
    ]
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
