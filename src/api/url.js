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
  PlanImport: '/api/v1/plan/plan-import/',

  TestTypeDataUrl: '/api/v1/quality/test-indicator-data-points/',
  MaterialTestOrdersUrl: '/api/v1/quality/material-test-orders/',
  testResultHistoryUrl: '/api/v1/quality/test-result-history/',
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
  // 不合格品处理导出
  PrintMaterialDealResult: '/api/v1/quality/print-material-deal-result/',
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

  // 混炼胶库计划管理
  PutPlanManagement: '/api/v1/inventory/put-plan-management/',
  //  终炼胶库计划管理
  FinalPlanManagement: '/api/v1/inventory/final-plan-management/',
  // 帘布库计划管理
  LbPlanManagement: '/api/v1/inventory/lb-plan-management/',
  // 原材料出库计划
  MaterialPlanManagement: '/api/v1/inventory/material-plan-management/',
  // 原材料出库口
  MaterialPlanManagementStations: '/api/v1/inventory/material-plan-management/stations/',
  // 炭黑出库计划
  DrussPlanManagement: '/api/v1/inventory/carbon-plan-management/',
  // 炭黑出库口
  DrussPlanManagementStations: '/api/v1/inventory/carbon-plan-management/stations/',

  // 物料属性管理
  materialsAttribute: '/api/v1/recipe/materials-attribute/',
  // 物料条码信息
  materialsSupplier: '/api/v1/recipe/materials-supplier/',

  dealSuggestionView: '/api/v1/quality/deal-suggestion-view/',

  // 查询可用库存数
  MaterialCount: '/api/v1/inventory/material_count/',
  // 物料出入库履历列表
  InventoryLog: '/api/v1/inventory/inventory-log/',
  PalletTrainsFeedbacks: '/api/v1/production/pallet-trains-feedbacks/',
  // 仓库名
  WarehouseNamesUrl: '/api/v1/inventory/warehouse-info/warehouse_names/',
  // 仓库信息
  WarehouseInfoUrl: '/api/v1/inventory/warehouse-info/',

  StationInfoUrl: '/api/v1/inventory/station-info/',

  StationTypesUrl: BasicsUrl + 'global-codes/?all=1&class_name=站点类型',

  WarehouseMaterialTypeUrl: '/api/v1/inventory/warehouse-material-type/',

  MaterialTypesUrl: BasicsUrl + 'global-codes/?all=1&class_name=原材料类别',

  // 批量打印
  LabelPrint: '/api/v1/quality/label-print/',
  // 月快检合格率
  BatchMonthStatistics: '/api/v1/quality/batch-month-statistics/',
  // 日快检合格率
  BatchDayStatistics: '/api/v1/quality/batch-day-statistics/',
  // 合格率页面表头
  StatisticHeaders: 'api/v1/quality/batch-month-statistics/statistic_headers/',
  // 胶料月合格率
  BatchProductNoMonthStatistics: '/api/v1/quality/batch-product-no-month-statistics/',
  // 胶料月合格率
  BatchProductNoDayStatistics: '/api/v1/quality/batch-product-no-day-statistics/',
  // 不合格处置单列表
  UnqualifiedTrains: '/api/v1/quality/unqualified-trains/',
  // 不合格处置单创建
  UnqualifiedDealOrders: '/api/v1/quality/unqualified-deal-orders/',
  // 发货计划
  DispatchPlan: '/api/v1/inventory/dispatch-plan/',
  // 目的地
  DispatchLocation: '/api/v1/inventory/dispatch-location/',
  // 发货履历
  DispatchLog: '/api/v1/inventory/dispatch-log/',

  // 产量计划实际分析
  ProductionPlanRealityAnalysis: '/api/v1/production/production-plan-reality-analysis/',
  UpdateCause: '/api/v1/production/update-cause/',
  // 区间产量统计（车数）
  IntervalOutputStatistics: '/api/v1/production/interval-output-statistics/',
  // 报表-车次列表
  TrainsFeedbacksApiview: '/api/v1/production/trains-feedbacks-apiview/',
  // 报表-车次记录-称量信息{id}
  WeighInformationUrl: '/api/v1/production/weigh-information-list/',
  // 报表-车次记录-密炼信息{id}
  MixerInformationUrl: '/api/v1/production/mixer-information-list/',
  // 报表-车次记录-曲线图{id}
  CurveInformationUrl: '/api/v1/production/curve-information-list/',
  AlarmLogList: '/api/v1/production/alarm_log-list/',

  // 备品备件物料类型
  SparepartsSpareType: '/api/v1/spareparts/spare-type/',
  // 备品备件物料编码
  SparepartsSpare: '/api/v1/spareparts/spare/',
  // 库存位
  LocationNameList: '/api/v1/spareparts/spare-location/name_list/',
  // 入库管理
  SpareInventory: '/api/v1/spareparts/spare-inventory/',

  // 部门管理
  DepartmentManage: '/api/v1/system/section/',

  // 位置点
  Location: '/api/v1/basics/location/',
  BasicsLocationNameList: '/api/v1/basics/location/name_list/',
  SpareLocation: '/api/v1/spareparts/spare-location/',
  // 货架物料绑定
  MaterialLocationBinding: '/api/v1/spareparts/spare-location-binding/',
  SpareInventoryLog: '/api/v1/spareparts/spare-inventory-log/',
  // 备品备件库存
  CountSpareInventory: '/api/v1/spareparts/spare-inventory/count_spare_inventory/',

  // 小料配方
  WeighBatchingUrl: '/api/v1/recipe/weigh-batching/',
  ProductBatchingDetailUrl: '/api/v1/recipe/product-batching-detail/',
  WeighCntTypeUrl: '/api/v1/recipe/weigh-cnt-type/',

  // 备品备件基本信息导入导出
  SpareImportExport: '/api/v1/spareparts/spare-import-export/',
  // 备品备件库存导入
  SpareInventoryImportExport: '/api/v1/spareparts/spare-inventory-import-export/',

  // 配料日班次计划
  BatchingClassesPlanUrl: '/api/v1/plan/batching-classes-plan/',
  BatchingClassesEquipPlan: '/api/v1/plan/batching-classes-equip-plan/',

  // 下发配料计划
  IssueBatchingClassesPlanUrl: '/api/v1/plan/issue-batching-classes-plan/',
  // 看板1
  InventoryNow: '/api/v1/inventory/inventory-log-out/inventory-now/',
  // 看板2
  InventoryToday: '/api/v1/inventory/inventory-log-out/inventory-today/',
  // 看板3
  MixGumOutInventoryLog: '/api/v1/inventory/inventory-log-out/',
  // 物料罐列表
  WeightingTackStatus: '/api/v1/terminal/weighting-tack-status/',
  // 密炼投入履历
  BatchChargeLogList: '/api/v1/terminal/batch-charge-log-list/',
  // 罐号 和 投入设备
  EquipTank: '/api/v1/production/equip-tank/',
  // 药品投入统计
  WeightBatchingLogList: '/api/v1/terminal/weight-batching-log-list/',
  MaterialInventoryList: '/api/v1/inventory/material-inventory-list/',
  QualityPalletFeedTest: '/api/v1/quality/pallet-feed-test/',
  DatapointCurve: '/api/v1/quality/datapoint-curve/',
  // 录入导入
  ImportMaterialMestMrders: '/api/v1/quality/import-material-test-orders/',
  // 不合格历史记录
  DealMathodHistory: '/api/v1/quality/deal-mathod-history/',
  // mes与子系统物料信息映射
  MaterialSupplierCollect: '/api/v1/terminal/material-supplier-collect/',
  ZcMaterials: '/api/v1/recipe/zc-materials/',
  WeightingPackageLog: '/api/v1/terminal/weighting-package-log/',
  EquipEownType: '/api/v1/equipment/equip-down-type/',
  EquipDownReason: '/api/v1/equipment/equip-down-reason/',
  EquipCurrentStatusList: '/api/v1/equipment/equip-current-status-list/',
  EquipCurrentStatus: '/api/v1/equipment/equip-current-status/',
  // 设备部位
  EquipPart: '/api/v1/equipment/equip-part/',
  PropertyTypeNode: '/api/v1/equipment/property-type-node/',
  ExportProperty: '/api/v1/equipment/property/export-property/',
  ImportProperty: '/api/v1/equipment/property/import-property/',
  EquipmentProperty: '/api/v1/equipment/property/',
  // 维修表单
  EquipMaintenanceOrder: '/api/v1/equipment/equip-maintenance-order/',
  // 通知配置
  PlatformConfig: '/api/v1/equipment/platform-config/',
  EquipMaintenanceOrderLog: '/api/v1/equipment/equip-maintenance-order-log/',
  // 原材料临时快检结果录入
  BarcodeQuality: '/api/v1/inventory/barcode-quality/',
  // 原材料临时快检结果录入导出
  BarcodeQualityExport: '/api/v1/inventory/barcode-quality/export/',
  // 原材料条码追溯
  MaterialTrace: '/api/v1/inventory/material-trace/',
  ProductTrace: '/api/v1/inventory/product-trace/',
  // 试验指标列表
  TestIndicatorsRaw: '/api/v1/quality/test-indicators-raw/',
  // 试验类型管理
  TestTypesRaw: '/api/v1/quality/test-types-raw/',
  DataPointsRaw: '/api/v1/quality/data-points-raw/',
  TestMethodsRaw: '/api/v1/quality/test-methods-raw/',
  LevelResultRaw: '/api/v1/quality/level-result-raw/',
  MatTestMethodsRaw: '/api/v1/quality/mat-test-methods-raw/',
  MatDataPointIndicatorsRaw: '/api/v1/quality/mat-data-point-indicators-raw/',
  // 获取原材料指标试验方法
  MatTestIndicatorMethodsRaw: '/api/v1/quality/mat-test-indicator-methods-raw/',
  // 录入
  MaterialInventory: '/api/v1/quality/material-inventory/',
  MaterialTestOrdersRaw: '/api/v1/quality/material-test-orders-raw/',
  UnqualifiedMaterialDealResult: '/api/v1/quality/unqualified-material-deal-result/',
  TestIndicatorDataPointsRaw: '/api/v1/quality/test-indicator-data-points-raw/',
  // 设备故障别日统计
  DayErrorStatistics: '/api/v1/equipment/day-error-statistics/',
  WeekErrorStatistics: '/api/v1/equipment/week-error-statistics/',
  MonthErrorStatistics: '/api/v1/equipment/month-error-statistics/',
  MonthErrorSort: '/api/v1/equipment/month-error-sort/',

  BarcodePreview: '/api/v1/quality/barcode-preview/',
  ProductStationStatics: '/api/v1/inventory/product-station-statics/',

  // 首页
  IndexOverview: '/api/v1/index/overview/',
  IndexProductionAyalyze: '/api/v1/index/production-ayalyze/',
  IndexEquipProductionAyalyze: '/api/v1/index/equip-production-ayalyze/',
  IndexEquipMaintenanceAyalyze: '/api/v1/index/equip-maintenance-ayalyze/',

  RuntimeRecord: '/api/v1/production/runtime-record/',
  ProductDetails: '/api/v1/inventory/product-details/'
}
