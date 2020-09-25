const BasicsUrl = '/api/v1/basics/'
const SystemUrl = '/api/v1/system/'

export default {
  LoginUrl: '/api/v1/system/login/',
  HomePageUrl: '/api/v1/index/',
  GlobalTypesUrl: BasicsUrl + 'global-types/',
  GlobalCodesUrl: BasicsUrl + 'global-codes/',

  EquipCategoryUrl: BasicsUrl + 'equips-category/',
  // const EquipCategoryUrl : BasicsUrl + "equips-category-list/",
  EquipTypeGlobalUrl: BasicsUrl + 'global-codes/?all:1&class_name=设备类型',
  EquipProcessGlobalUrl: BasicsUrl + 'global-codes/?all:1&class_name=工序',
  EquipLevelGlobalUrl: BasicsUrl + 'global-codes/?all:1&class_name=产地',
  StateGlobalUrl: BasicsUrl + 'global-codes/?all:1&class_name=胶料状态',
  SiteGlobalUrl: BasicsUrl + 'global-codes/?all:1&class_name=产地',
  SITEGlobalUrl: BasicsUrl + 'global-codes/?all:1&class_name=SITE',
  StageGlobalUrl: BasicsUrl + 'global-codes/?all:1&class_name=胶料段次',
  DevTypeGlobalUrl: BasicsUrl + 'global-codes/?all:1&class_name=炼胶机类型',
  MaterialTypelUrl: BasicsUrl + 'global-codes/?all:1&class_name=原材料类别',
  ClassArrangelUrl: BasicsUrl + 'global-codes/?all:1&class_name=班次',

  EquipUrl: BasicsUrl + 'equips/',

  PersonnelsUrl: SystemUrl + 'personnels/',
  PermissionUrl: SystemUrl + 'group-permissions/',
  GroupUrl: SystemUrl + 'group_extension/',
  UsersByGroupUrl: SystemUrl + 'personnels_groups/',
  WorkSchedulesUrl: BasicsUrl + 'work_schedules/',
  GroupAddUserUrl: SystemUrl + 'group_add_user/',
  MaterialsUrl: '/api/v1/recipe/materials/',
  ProductInfosUrl: '/api/v1/recipe/product-infos/',
  ValidateVersionsUrl: '/api/v1/recipe/validate-versions/',
  CopyProductInfosUrl: '/api/v1/recipe/copy-product-infos/',
  // 胶料配料标准管理接口
  RubberMaterialUrl: '/api/v1/recipe/product-batching/',
  // 配方数据发送至上辅机接口
  SendAuxiliaryUrl: '/api/v1/recipe/recipe-notice/',
  // 胶料配料标准管理——选择胶料编码与段次接口
  RubberStageUrl: '/api/v1/recipe/product-stages/',
  PreBatchInfoUrl: '/api/v1/recipe/pre-batch-info/',
  ProductRecipeUrl: '/api/v1/recipe/product-recipe/',

  ProductBatching: '/api/v1/plan/product-batching-day-plans/',
  MaterialRequisitionsCopy: '/api/v1/plan/product-batching-day-plans-copy/',
  // 领料计划接口
  MaterialDemanded: '/api/v1/plan/material-demanded-apiview/',
  MaterialRequisitions: '/api/v1/plan/material-requisition-classes/',
  // 胶料日计划
  ProductDayPlans: '/api/v1/plan/product-day-plans/',

  PalletFeedBacksUrl: '/api/v1/production/pallet-feedbacks/',
  // 胶料日计划
  ProductDayPlansUrl: '/api/v1/plan/product-day-plans/',
  ProductDayPlanManyCreateUrl: '/api/v1/plan/product-day-plan-manycreate/',
  // 排产配料小料日计划---选择胶料
  RubberSelectUrl: '/api/v1/plan/product-batching-day-plan-manycreate/',
  PlanScheduleUrl: '/api/v1/basics/plan-schedule/',

  ProductActualUrl: '/api/v1/production/product-actual/',
  // 密炼实绩
  ProductDayPlansCopyUrl: '/api/v1/plan/product-day-plans-copy/',
  PalletFeedbacksUrl: '/api/v1/production/pallet-feedbacks/',
  TrainsFeedbacksUrl: '/api/v1/production/trains-feedbacks/',

  // 生产管理---密炼机台别计划对比
  BanburyPlanUrl: '/api/v1/production/plan-reality/',
  InternalMixerUrl: '/api/v1/production/production-record/',
  ClassesListUrl: '/api/v1/basics/global-codes/',
  EchartsListUrl: '/api/v1/production/equip-status/',

  PlanSchedulesUrl: '/api/v1/basics/plan-schedules/',

  // 库存管理---原料库存
  MaterialRepertoryUrl: '/api/v1/inventory/material-inventory-view/',
  // 库存管理---胶料库存
  RubberRepertoryUrl: '/api/v1/inventory/product-inventory/',
  // 生成计划管理---原材料需求量
  MaterialQuantityDemandedUrl: '/api/v1/plan/materia-quantity-demande/',

  ProductDayPlanNoticeUrl: '/api/v1/plan/product-day-plan-notice/?product_day_id:',

  // 新增计划的展示
  ProductClassesPlanUrl: '/api/v1/plan/product-classes-plan-list/',
  // 新增计划保存
  ProductClassesPlanPanycreateUrl: '/api/v1/plan/product-classes-plan-manycreate/',
  // 计划下达到上辅机
  ProductDayPlanNotice: '/api/v1/plan/product-day-plan-notice/'
}
