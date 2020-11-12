const BasicsUrl = '/api/v1/basics/'
const SystemUrl = '/api/v1/system/'

export default {
  LoginUrl: '/api/v1/system/login/',
  HomePageUrl: '/api/v1/index/',
  GlobalTypesUrl: BasicsUrl + 'global-types/',
  GlobalCodesUrl: BasicsUrl + 'global-codes/',

  EquipCategoryUrl: BasicsUrl + 'equips-category/',
  // const EquipCategoryUrl : BasicsUrl + "equips-category-list/",
  EquipTypeGlobalUrl: BasicsUrl + 'global-codes/?all=1&class_name=设备类型',
  EquipProcessGlobalUrl: BasicsUrl + 'global-codes/?all=1&class_name=工序',
  EquipLevelGlobalUrl: BasicsUrl + 'global-codes/?all=1&class_name=产地',
  StateGlobalUrl: BasicsUrl + 'global-codes/?all=1&class_name=胶料状态',
  SiteGlobalUrl: BasicsUrl + 'global-codes/?all=1&class_name=产地',
  SITEGlobalUrl: BasicsUrl + 'global-codes/?all=1&class_name=SITE',
  StageGlobalUrl: BasicsUrl + 'global-codes/?all=1&class_name=胶料段次',
  DevTypeGlobalUrl: BasicsUrl + 'global-codes/?all=1&class_name=炼胶机类型',
  MaterialTypelUrl: BasicsUrl + 'global-codes/?all=1&class_name=原材料类别',
  ClassArrangelUrl: BasicsUrl + 'global-codes/?all=1&class_name=班次',

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
  ProductDayPlanNotice: '/api/v1/plan/product-day-plan-notice/',

  TestTypeDataUrl: '/api/v1/quality/test-indicator-data-points/',
  MaterialTestOrdersUrl: '/api/v1/quality/material-test-orders/',
  // 胶料快检判定基准管理列表
  MaterialTestTypes: '/api/v1/quality/material-test-indicators-tab/',
  // 试验指标列表
  TestIndicators: '/api/v1/quality/test-indicators/',
  // 试验方法列表
  TestSubTypes: '/api/v1/quality/test-methods/',
  TestTypeData: '/api/v1/quality/test-indicator-data-points/',
  // 物料指标试验方法
  MatTestIndicatorMethods: '/api/v1/quality/mat-test-indicator-methods/',
  // 录入新增提交
  MaterialTestOrders: '/api/v1/quality/material-test-orders/',
  MatIndicatorTab: '/api/v1/quality/mat-indicator-tab/',
  MaterialDataPoints: '/api/v1/quality/material-data-points/',
  // 试验类型数据点
  DataPoints: '/api/v1/quality/data-points/',
  // 试验类型
  TestTypes: '/api/v1/quality/test-types/',
  // 胶料原材料列表
  BatchingMaterials: '/api/v1/quality/batching-materials/',
  // 物料试验方法
  MatTestMethods: '/api/v1/quality/mat-test-methods/',
  // 物料数据点评判指标
  MatDataPointIndicators: '/api/v1/quality/mat-data-point-indicators/',

  MaterialDealResultUrl: '/api/v1/quality/material-deal-result/',
  DisposeTypeUrl: '/api/v1/basics/global-codes/',
  DealSuggestionUrl: '/api/v1/quality/deal-suggestion/',

  ResultStatusUrl: '/api/v1/quality/result-status/',

  PalletFeedTestUrl: '/api/v1/quality/pallet-feed-test/',

  MaterialValidTimeUrl: '/api/v1/quality/material_valid_time/',

  LevelResult: '/api/v1/quality/level-result/',

  // 班次密炼时间汇总
  ClassesBanburySummary: '/api/v1/production/classes-banbury-summary/',
  // 胶料单车次时间汇总
  CollectTrainsFeed: '/api/v1/production/collect-trains-feed/',
  // 密炼时间占比汇总
  EquipBanburySummary: '/api/v1/production/equip-banbury-summary/',
  // 规格切换时间汇总
  CutTimeCollect: '/api/v1/production/cut-time-collect/',
  // 设备管理计算总和
  SumSollectTrains: '/api/v1/production/sum-collect-trains/',
  // 物料库存管理
  MaterialInventoryManage: '/api/v1/inventory/material-inventory-manage/',
  // 出库计划管理
  PutPlanManagement: '/api/v1/inventory/put-plan-management/',
  // 物料属性管理
  materialsAttribute: '/api/v1/recipe/materials-attribute/',
  // 物料条码信息
  materialsSupplier: '/api/v1/recipe/materials-supplier/',

  dealSuggestionView: '/api/v1/quality/deal-suggestion-view/',

  // 查询可用库存数
  MaterialCount: '/api/v1/inventory/material_count/',
  // 物料出入库履历列表
  InventoryLog: '/api/v1/inventory/inventory-log/',

  // 仓库名
  WarehouseNamesUrl: '/api/v1/inventory/warehouse-info/warehouse_names/',

  // 仓库信息
  WarehouseInfoUrl: '/api/v1/inventory/warehouse-info/',

  StationInfoUrl: '/api/v1/inventory/station-info/',

  StationTypesUrl: BasicsUrl + 'global-codes/?all=1&class_name=站点类型',

  WarehouseMaterialTypeUrl: '/api/v1/inventory/warehouse-material-type/',

  MaterialTypesUrl: BasicsUrl + 'global-codes/?all=1&class_name=物料类型'

}
