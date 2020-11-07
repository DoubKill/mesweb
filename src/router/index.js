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
    path: 'collect/rub/daily',
    component: () => import('@/views/collect_rubber_daily_manage/index'),
    name: 'CollectRubDailyManage',
    meta: {
      title: '日别胶料收皮管理',
      permissionName: 'pallet_feedback'
    }
  }
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
      path: 'material',
      component: () => import('@/views/material_repertory_manage/index'),
      name: 'MaterialRepertoryManage',
      meta: {
        title: '原料库存',
        permissionName: 'material_inventory'
      }
    },
    {
      path: 'rubber-inventory-info',
      component: () => import('@/views/inventory/rubber_inventory_info.vue'),
      name: 'RubberInventoryInfo',
      meta: {
        title: '胶料库存信息汇总',
        permissionName: 'product_inventory'
      }
    },
    {
      path: 'rubber',
      component: () => import('@/views/rubber_repertory_manage/index'),
      name: 'RubberRepertoryManage',
      meta: {
        title: '胶料库存管理',
        permissionName: 'product_inventory'
      }
    },
    {
      path: 'material-inout-record',
      component: () => import('@/views/inventory/material_inout_record.vue'),
      name: 'MaterialInOutRecord',
      meta: {
        title: '物料出入库履历',
        permissionName: 'product_inventory'
      }
    },
    {
      path: 'material-inventory-manage',
      component: () => import('@/views/inventory/material-inventory-manage.vue'),
      name: 'MaterialInventoryManage',
      meta: {
        title: '物料库存管理',
        permissionName: 'product_inventory'
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
      path: 'final-rubber-manage',
      component: () => import('@/views/inventory/final_rubber_manage.vue'),
      name: 'OutboundManage',
      meta: {
        title: '终炼胶库计划管理'
        // permissionName: 'product_inventory'
      }
    },
    {
      path: 'expire-rubber-manage',
      component: () => import('@/views/inventory/expire_rubber_manage.vue'),
      name: 'ExpireRubberManage',
      meta: {
        title: '过期胶料管理'
        // permissionName: 'product_inventory'
      }
    },
    {
      path: 'material-attribute-manage',
      component: () => import('@/views/inventory/material-attribute-manage.vue'),
      name: 'MaterialAttributeManage',
      meta: {
        title: '物料属性管理'
        // permissionName: 'product_inventory'
      }
    }
  ]
},
{
  path: '/quality',
  component: Layout,
  redirect: '/quality/benchmark',
  name: 'quality',
  meta: {
    title: '质量管理',
    icon: 'quality'
  },
  children: [{
    path: 'test-indicators',
    component: () => import('@/views/quality_management/test_indicators'),
    name: 'testIndicators',
    meta: {
      title: '试验指标管理'
      // permissionName: 'product_inventory'
    }
  },
  {
    path: 'test-types',
    component: () => import('@/views/quality_management/test_types'),
    name: 'testTypes',
    meta: {
      title: '试验类型管理'
      // permissionName: 'product_inventory'
    }
  },
  {
    path: 'test-methods-manage',
    component: () => import('@/views/quality_management/test_methods_manage'),
    namel: 'testMethodsManage',
    meta: {
      title: '试验方法管理'
    }
  },
  {
    path: 'quick-plan-manage',
    component: () => import('@/views/quality_management/quick_plan_manage'),
    namel: 'quickPlanManage',
    meta: {
      title: '快检计划管理'
    }
  },
  {
    path: 'grade-manage',
    component: () => import('@/views/quality_management/grade_manage'),
    namel: 'gradeManage',
    meta: {
      title: '等级管理'
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
      title: '胶料快检判定基准录入'
      // permissionName:'material_inventory'
    }
  },
  {
    path: 'manual-entry',
    component: () => import('@/views/quality_management/manual_entry'),
    name: 'ManualEntry',
    meta: {
      title: '手工检测数据录入'
      // permissionName: 'product_inventory'
    }
  },
  /* {
    path: 'month-pass-detail',
    component: () => import('@/views/quality_management/month_pass_detail'),
    name: 'monthPassDetail',
    meta: {
      title: '月快检合格率统计'
      // permissionName: 'product_inventory'
    }
  },
  {
    path: 'material-month-pass',
    component: () => import('@/views/quality_management/material_month_pass'),
    name: 'materialMonthPass',
    meta: {
      title: '胶料月合格率统计'
      // permissionName: 'product_inventory'
    }
  },
  {
    path: 'material-day-pass',
    component: () => import('@/views/quality_management/material_day_pass'),
    name: 'materialDayPass',
    meta: {
      title: '胶料日合格率统计'
      // permissionName: 'product_inventory'
    }
  },*/
  {
    path: 'inferior-quality-product-manage',
    component: () => import('@/views/quality_management/inferior_quality_product_manage'),
    name: 'InferiorQualityProductManage',
    meta: {
      title: '不合格品查询'
    }
  }, {
    path: 'unqualified-treatment-opinions-manage',
    component: () => import('@/views/quality_management/unqualified_treatment_opinions_manage'),
    name: 'UnqualifiedTreatmentOpinionsManage',
    meta: {
      title: '不合格处理意见管理'
    }
  }, {
    path: 'details',
    component: () => import('@/views/quality_management/details'),
    name: 'Details',
    meta: {
      title: '胶料快检详细信息'
      // permissionName: 'product_inventory'
    }
  },
  {
    path: 'check-synthesize-manage',
    component: () => import('@/views/quality_management/check_synthesize_manage'),
    name: 'CheckSynthesizeManage',
    meta: {
      title: '快检信息综合管理'
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
  }, children: [{
    path: 'classes-banburying-summary',
    component: () => import('@/views/equipment-management/classes-banburying-summary'),
    name: 'classes-banburying-summary',
    meta: {
      title: '班次密炼时间汇总'
      // permissionName: 'product_inventory'
    }
  },
  {
    path: 'banburying-ratio-summary',
    component: () => import('@/views/equipment-management/banburying-ratio-summary'),
    name: 'banburying-ratio-summary',
    meta: {
      title: '密炼时间占比汇总'
      // permissionName: 'product_inventory'
    }
  },
  {
    path: 'rubber-acar-summary',
    component: () => import('@/views/equipment-management/rubber-acar-summary'),
    name: 'rubber-acar-summary',
    meta: {
      title: '胶料单车次时间汇总'
      // permissionName: 'product_inventory'
    }
  },
  {
    path: 'specs-switch-summary',
    component: () => import('@/views/equipment-management/specs-switch-summary'),
    name: 'specs-switch-summary',
    meta: {
      title: '规格切换时间汇总'
      // permissionName: 'product_inventory'
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
