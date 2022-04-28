const BasicsUrl = '/api/v1/basics/'
const SystemUrl = '/api/v1/system/'

export default {
  LoginUrl: '/api/v1/system/login/',
  HomePageUrl: '/api/v1/index/',
  GlobalTypesUrl: BasicsUrl + 'global-types/',
  GlobalCodesUrl: BasicsUrl + 'global-codes/',

  EquipCategoryUrl: BasicsUrl + 'equips-category/',
  // const EquipCategoryUrl : BasicsUrl + "equips-category-list/",
  EquipTypeGlobalUrl: BasicsUrl + 'global-codes/',
  EquipProcessGlobalUrl: BasicsUrl + 'global-codes/',
  EquipLevelGlobalUrl: BasicsUrl + 'global-codes/',
  // StateGlobalUrl: BasicsUrl + 'global-codes/?all=1&class_name=胶料状态',
  SiteGlobalUrl: BasicsUrl + 'global-codes/',
  SITEGlobalUrl: BasicsUrl + 'global-codes/',
  StageGlobalUrl: BasicsUrl + 'global-codes/',
  // DevTypeGlobalUrl: BasicsUrl + 'global-codes/?all=1&class_name=炼胶机类型',
  MaterialTypelUrl: BasicsUrl + 'global-codes/',
  ClassArrangelUrl: BasicsUrl + 'global-codes/',

  EquipUrl: BasicsUrl + 'equips/',

  PersonnelsUrl: SystemUrl + 'personnels/',
  DelUser: SystemUrl + 'del-user/',
  PermissionUrl: SystemUrl + 'group-permissions/',
  GroupUrl: SystemUrl + 'group_extension/',
  UsersByGroupUrl: SystemUrl + 'personnels_groups/',
  WorkSchedulesUrl: BasicsUrl + 'work_schedules/',
  GroupAddUserUrl: SystemUrl + 'group_add_user/',
  ResetPassword: '/api/v1/system/reset-password/',
  MaterialsUrl: '/api/v1/recipe/materials/',
  XlRecipeNotice: '/api/v1/terminal/xl-recipe-notice/',
  MaterialInfoIssue: '/api/v1/terminal/material-info-issue/', // 原材料下发至称量系统接口
  ProductInfosUrl: '/api/v1/recipe/product-infos/',
  ValidateVersionsUrl: '/api/v1/recipe/validate-versions/',
  CopyProductInfosUrl: '/api/v1/recipe/copy-product-infos/',
  // 胶料配料标准管理接口 所有配方接口
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
  InLibraryInventory: '/api/v1/inventory/In-library_inventory/',
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
  // 数据点误差(不合格pass指标管理)
  DataPointStandardErrors: '/api/v1/quality/data-point-standard-errors/',
  // 标记历史记录
  DataPointLabelHistory: '/api/v1/quality/data-point-label-history/',
  IgnoredProductInfo: '/api/v1/quality/ignored-product-info/',
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
  MatDataPointIndicatorsHistory: '/api/v1/quality/mat-data-point-indicators-history/',

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
  ShiftTimeSummary: '/api/v1/production/shift-time-summary/', // 交接班时间汇总
  ShiftTimeSummaryDetail: '/api/v1/production/shift-time-summary/detail/',
  // 设备管理计算总和
  SumSollectTrains: '/api/v1/production/sum-collect-trains/',
  // 物料库存管理
  MaterialInventoryManage: '/api/v1/inventory/material-inventory-manage/',

  // 北自混炼胶库存列表
  BzMixinInventory: '/api/v1/inventory/bz-mixin-inventory/',
  // 终练出库弹框列表(帘布库存明细)
  BzFinalInventory: 'api/v1/inventory/bz-final-inventory/',
  // 原材料库存明细
  WmsStorage: '/api/v1/inventory/wms-storage/',
  // 炭黑库存明细
  ThStorage: '/api/v1/inventory/th-storage/',
  WmsExpireDetails: '/api/v1/inventory/wms-expire-details/',
  ThExpireDetails: '/api/v1/inventory/th-expire-details/',
  // 混炼胶库计划管理
  PutPlanManagement: '/api/v1/inventory/put-plan-management/',
  MixinRubberyOutboundOrder: 'api/v1/inventory/mixin-rubbery-outbound-order/',
  OutboundDeliveryOrders: '/api/v1/inventory/outbound-delivery-orders/',
  OutboundDeliveryOrderDetails: '/api/v1/inventory/outbound-delivery-order-details/',
  OutboundDeliveryOrdersExport: '/api/v1/inventory/outbound-delivery-orders/export/',

  //  终炼胶库计划管理
  FinalPlanManagement: '/api/v1/inventory/final-plan-management/',
  FinalRubberyOutboundOrder: '/api/v1/inventory/final-rubbery-outbound-order/',
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

  StationTypesUrl: BasicsUrl + 'global-codes/',

  WarehouseMaterialTypeUrl: '/api/v1/inventory/warehouse-material-type/',

  MaterialTypesUrl: BasicsUrl + 'global-codes/',

  // 批量打印
  LabelPrint: '/api/v1/quality/label-print/',
  ShowQualifiedRange: '/api/v1/quality/show-qualified-range/',
  // 出库口补打印卡片- 详情
  AdditionalPrintDetail: '/api/v1/inventory/additional-print-detail/',
  // 出库口补打印卡片- 打印
  AdditionalPrint: '/api/v1/inventory/additional-print/',
  // 修改车次
  TrainsFix: '/api/v1/production/trains-fix/',
  PalletTrainBatchFix: '/api/v1/production/pallet-train-batch-fix/',
  LabelPrintLogs: '/api/v1/quality/label-print-logs/',
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
  TrainsFeedbacksApiviewDown: '/api/v1/production/trains-feedbacks-apiview/',
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
  // DepartmentManage: '/api/v1/system/section/',

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
  GetRecipeManual: '/api/v1/terminal/weighting-package-single/get_recipe_manual/',

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
  ZcMaterialsThoughMes: '/api/v1/recipe/zc-materials-though-mes/',
  WeightingPackageLog: '/api/v1/terminal/weighting-package-log/',
  ManualPost: '/api/v1/terminal/weighting-package-log/manual_post/', // 扫码合包接口
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
  ProductDetails: '/api/v1/inventory/product-details/',
  ExamineMaterial: '/api/v1/quality/examine-material/',
  // 检测类型
  MaterialExamineType: '/api/v1/quality/material-examine-type/',
  ExportTemplate: '/api/v1/quality/material-examine-type/export-template/',
  ImportData: '/api/v1/quality/material-examine-type/import-data/',
  // 单位管理
  MaterialUnit: '/api/v1/quality/material-unit/',
  MaterialEquipmentType: '/api/v1/quality/material-equip-types/',
  MaterialEquipment: '/api/v1/quality/material-equips/',
  WmsMaterialSearch: '/api/v1/quality/wms-material-search/',
  MaterialExamineResult: '/api/v1/quality/material-examine-result/',
  MaterialUnqualifiedTypes: '/api/v1/quality/material-unqualified-types/',
  MaterialUnqualifiedProcess: '/api/v1/quality/material-unqualified-process/',
  MaterialExamineResultCurve: '/api/v1/quality/material-examine-result-curve/',
  Disqualification: '/api/v1/quality/examine-material/disqualification/',
  // 小料原材料列表
  XlMaterial: '/api/v1/terminal/xl-material/',
  XlBin: '/api/v1/terminal/xl-bin/',
  SaveBin: '/api/v1/terminal/xl-bin/save_bin/',
  XlRecipe: '/api/v1/terminal/xl-recipe/',
  UpdateFlagCount: '/api/v1/terminal/update-flag-count/',
  XlRecipeMaterial: '/api/v1/terminal/xl-recipe-material/',
  XlReportBasic: '/api/v1/terminal/xl-report-basic/',
  XlReportWeight: '/api/v1/terminal/xl-report-weight/',
  XlPlan: '/api/v1/terminal/xl-plan/',
  RotateClasses: '/api/v1/terminal/xl-plan/rotate_classes/',
  UpDownMove: '/api/v1/terminal/xl-plan/up_down_move/',
  CurrentFactoryDate: '/api/v1/basics/current-factory-date/',
  AutoMan: '/api/v1/terminal/xl-plan/auto_man/',
  WmsStock: '/api/v1/inventory/wms-stock/',
  WmsWeightStock: '/api/v1/inventory/wms-weight-stock/',
  WmsEntrance: '/api/v1/inventory/wms-entrance/',
  // 炭黑库货位列表
  ThStock: '/api/v1/inventory/th-stock/',
  // 炭黑库货物重量列表
  ThWeightStock: '/api/v1/inventory/th-weight-stock/',
  // 炭黑库出库口列表
  ThEntrance: '/api/v1/inventory/th-entrance/',
  // 炭黑库 获取内伸位货物信息
  ThInstock: '/api/v1/inventory/th-instock/',
  // 原材料上报设备
  MaterialReportEquip: '/api/v1/quality/material-report-equip/',
  MaterialReportValue: '/api/v1/quality/material-report-value/',
  // 胶料上报设备
  ProductReportEquip: '/api/v1/quality/product-report-equip/',
  // 快检设备监控
  EquipTestData: '/api/v1/quality/equip-test-data/',
  CheckEquip: '/api/v1/quality/check-equip/',
  ProductReportValue: '/api/v1/quality/product-report-value/',
  // 原材料库存
  WmsInventory: '/api/v1/inventory/wms-inventory/',
  WmsMaterialGroups: '/api/v1/inventory/wms-material-groups/',
  WmsTunnels: '/api/v1/inventory/wms-tunnels/',
  WmsStockSummsry: '/api/v1/inventory/wms-stock-summsry/',
  ThStockSummsry: '/api/v1/inventory/th-stock-summsry/',
  // 原材料 获取内伸位货物信息
  WmsInstock: '/api/v1/inventory/wms-instock/',
  // 炭黑库库存
  ThInventory: '/api/v1/inventory/th-inventory/',
  ThMaterialGroups: '/api/v1/inventory/th-material-groups/',
  ThTunnels: '/api/v1/inventory/th-tunnels/',
  // 线边库 库区
  Depot: '/api/v1/inventory/depot/',
  // 库位
  DepotSite: '/api/v1/inventory/depot-site/',
  PalletData: '/api/v1/inventory/pallet-data/',
  DepotPallet: '/api/v1/inventory/depot-pallet/',
  DepotPalletInfo: '/api/v1/inventory/depot-pallet-info/',
  PalletTestResult: '/api/v1/inventory/pallet-test-result/',
  DepotResume: '/api/v1/inventory/depot-resume/',
  // erp原材料信息管理
  ErpMaterials: '/api/v1/recipe/erp-materials/',
  // 硫磺库库区
  SulfurDepot: '/api/v1/inventory/sulfur-depot/',
  // 硫磺库库位
  SulfurDepotSite: '/api/v1/inventory/sulfur-depot-site/',
  // 硫磺库库存查询
  DepotSulfur: '/api/v1/inventory/depot-sulfur/',
  DepotSulfurInfo: '/api/v1/inventory/depot-sulfur-info/',
  // 硫磺库出入库管理
  SulfurData: '/api/v1/inventory/sulfur-data/',
  SulfurResume: '/api/v1/inventory/sulfur-resume/',

  BzMixinInventorySummary: '/api/v1/inventory/bz-mixin-inventory-summary/',
  BzFinalInventorySummary: '/api/v1/inventory/bz-final-inventory-summary/',
  BzFinalInventorySearch: '/api/v1/inventory/bz-final-inventory-search/',
  BzMixinInventorySearch: '/api/v1/inventory/bz-mixin-inventory-search/',

  WeightingPackageExpire: '/api/v1/terminal/weighting-package-expire/',
  // 快检设备履历
  ProductTestResume: '/api/v1/quality/product-test-resume/',
  ProductTestPlan: '/api/v1/quality/product-test-plan/',
  UnderwayPlan: '/api/v1/quality/product-test-plan/underway-plan/',
  RubberMaxStretchTestResult: '/api/v1/quality/rubber-max-stretch-test-result/',
  ProductTestPlanDetail: '/api/v1/quality/product-test-plan-detail/',
  BulkCreate: '/api/v1/quality/product-test-plan-detail/bulk_create/',
  // 看板
  OutBoundTasks: '/api/v1/inventory/out-bound-tasks/',
  InoutBoundSummary: '/api/v1/inventory/inout-bound-summary/',
  // 投料重量设定
  RawWeight: '/api/v1/terminal/carbon-tank-set/',
  // 投料履历查询
  RawQuery: '/api/v1/terminal/feed-check-operation/',
  // 油料罐物料设定
  OliSet: '/api/v1/terminal/oli-tank-setting/',
  // 粉料罐物料设定
  PinkSet: '/api/v1/terminal/powder-tank-setting/',
  // 不合格车次列表查询
  DisposalList: '/api/v1/quality/unqialified-pallet-list/',
  // 不合格项
  DataPoint: '/api/v1/quality/data-point-list/',
  // 炭黑投料提示-计划显示
  FeedCapacityPlan: '/api/v1/terminal/feed-capacity-plan/',
  CarbonFeedingPrompt: '/api/v1/terminal/carbon-feeding-prompt/',
  CarOutCheck: '/api/v1/terminal/carbon-out-check/',
  // 炭黑投料-下出库任务
  CarbonOutTask: '/api/v1/terminal/carbon-out-task/',
  // 胶片库出库单列表
  CompoundManage: '/api/v1/inventory/outbound-delivery-orders/',
  // 出库
  Outbound: '/api/v1/inventory/outbound-delivery-order-details/',
  // 机台别不合格率
  MachinePass: '/api/v1/quality/unqialified-equip/',
  // 胶料别不合格率
  RubberPass: '/api/v1/quality/product-test-statics/',
  // 班次别不合格率
  ClassesPass: '/api/v1/quality/class-test-statics/',
  // 用户出库口库区
  UserStation: '/api/v1/inventory/outbound-history/',
  // 生产运行记录修改
  RuntimeDetail: '/api/v1/production/runtime-record-detail/',
  EquipTargetMtbmttrSettings: '/api/v1/equipment/equip-target-mtbmttr-settings/', // MTBF/MTTR设定
  EquipOrderAssignRule: '/api/v1/equipment/equip-order-assign-rule/',
  EquipOrderAssignRuleImportXlsx: '/api/v1/equipment/equip-order-assign-rule/import_xlsx/',
  EquipOrderAssignRuleGetName: '/api/v1/equipment/equip-order-assign-rule/get_name/',
  EquipMachineHaltType: '/api/v1/equipment/equip-machine-halt-type/',
  EquipMachineHaltReason: '/api/v1/equipment/equip-machine-halt-reason/',
  SectionUserTree: '/api/v1/system/section/tree/', // 部门用户树结构
  EquipMaintenanceAreaSettings: '/api/v1/equipment/equip-maintenance-area-settings/', // 维护包干设置
  SectionTree: '/api/v1/system/section/',
  EquipFaultTypes: '/api/v1/equipment/equip-fault-types/', // 设备故障分类 大分类
  EquipFaultCodes: '/api/v1/equipment/equip-fault-codes/', // 设备故障分类 中分类
  EquipBom: '/api/v1/equipment/equip-bom/',
  ExchangeLocation: '/api/v1/equipment/equip-bom/exchange_location/', // bom同级上下移动
  EquipJobItemStandard: '/api/v1/equipment/equip-job-item-standard/', // 设备作业项目标准定义
  EquipJobItemStandardImport: '/api/v1/equipment/equip-job-item-standard/import_xlsx/', // 设备作业项目标准定义 导入
  // 供应商管理台账
  EquipSupplier: '/api/v1/equipment/equip-supplier/',
  EquipSupplierImport: '/api/v1/equipment/equip-supplier/import_xlsx/',
  EquipSupplierGetName: '/api/v1/equipment/equip-supplier/get_name/',
  // 设备类型
  EquipsCategory: '/api/v1/basics/equips-category/',
  // 设备固定资产台账
  EquipProperty: '/api/v1/equipment/equip-property/',
  EquipPropertyImport: '/api/v1/equipment/equip-property/import_xlsx/',
  // 设备位置区域定义
  EquipAreaDefine: '/api/v1/equipment/equip-area-define/',
  EquipAreaDefineImport: '/api/v1/equipment/equip-area-define/import_xlsx/',
  EquipAreaDefineGetName: '/api/v1/equipment/equip-area-define/get_name/',
  // 设备部位定义
  EquipPartNew: '/api/v1/equipment/equip-part-new/',
  EquipPartNewImport: '/api/v1/equipment/equip-part-new/import_xlsx/',
  // 设备部件分类
  EquipComponentType: '/api/v1/equipment/equip-component-type/',
  EquipComponentTypeImport: '/api/v1/equipment/equip-component-type/import_xlsx/',
  // 设备部件定义
  EquipComponent: '/api/v1/equipment/equip-component/',
  EquipComponentImport: '/api/v1/equipment/equip-component/import_xlsx/',
  // 部件与erp绑定关系
  ErpSpareComponentRelation: '/api/v1/equipment/erp-spare-component-relation/',
  // erp备件物料信息
  EquipSpareErp: '/api/v1/equipment/equip-spare-erp/',
  EquipSpareErpImport: '/api/v1/equipment/equip-spare-erp/import_xlsx/',
  // 设备故障信号定义
  EquipFaultSignal: '/api/v1/equipment/equip-fault-signal/',
  EquipFaultSignalImport: '/api/v1/equipment/equip-fault-signal/import_xlsx/',
  EquipFaultSignalGetName: '/api/v1/equipment/equip-fault-signal/get_name/',
  // 设备维护作业标准定义
  EquipMaintenanceStandard: '/api/v1/equipment/equip_maintenance_standard/',
  EquipMaintenanceStandardImport: '/api/v1/equipment/equip_maintenance_standard/import_xlsx/',
  EquipMaintenanceStandardGetName: '/api/v1/equipment/equip_maintenance_standard/get_name/',
  // 设备维修作业标准定义
  EquipRepairStandard: '/api/v1/equipment/equip-repair-standard/',
  EquipRepairStandardImport: '/api/v1/equipment/equip-repair-standard/import_xlsx/',
  EquipRepairStandardGetName: '/api/v1/equipment/equip-repair-standard/get_name/',
  GetDefaultCode: '/api/v1/equipment/get-default-code/',
  // 报修申请
  EquipApplyRepair: '/api/v1/equipment/equip-apply-repair/',
  UploadImages: '/api/v1/equipment/upload-images/',
  GetStaff: '/api/v1/equipment/get-staff/',
  // 维修工单
  EquipApplyOrder: '/api/v1/equipment/equip-apply-order/',
  MultiUpdate: '/api/v1/equipment/equip-apply-order/multi_update/',
  MaterialReq: '/api/v1/equipment/equip-repair-material-req/',
  EquipWarehouseInventory: '/api/v1/equipment/equip-warehouse-inventory/', // 备件库存查询
  // 新建库区库位
  EquipWarehouseArea: '/api/v1/equipment/equip-warehouse-area/',
  EquipWarehouseLocation: '/api/v1/equipment/equip-warehouse-location/',
  // 获取出库单据条码
  GetOrderId: '/api/v1/equipment/equip-warehouse-order/get_order_id/',
  // 新建出库单据
  EquipWarehouseOrder: '/api/v1/equipment/equip-warehouse-order/',
  EquipWarehouseRecord: '/api/v1/equipment/equip-warehouse-record/', // 备件出入库履历
  EquipWarehouseStatistical: '/api/v1/equipment/equip-warehouse-statistical/', // 备件入出库统计分析
  EquipWarehouseOrderDetail: '/api/v1/equipment/equip-warehouse-order-detail/',
  GetCode: '/api/v1/equipment/equip-warehouse-order/get_code/',
  EquipCodePrint: '/api/v1/equipment/equip-code-print/',
  EquipPlan: '/api/v1/equipment/equip-plan/', // 维护计划
  EquipPlanGetName: '/api/v1/equipment/equip-plan/get-plan-name/', // 维护计划
  EquipGenerateOrder: '/api/v1/equipment/equip-plan/generate-order/',
  EquipClosePlan: '/api/v1/equipment/equip-plan/close-plan/',
  EquipInspectionOrder: '/api/v1/equipment/equip-inspection-order/', // 巡检工单
  MultiUpdateInspection: '/api/v1/equipment/equip-inspection-order/multi_update/',
  WmsStorageSummary: '/api/v1/inventory/wms-storage-summary/',
  WmsRelease: '/api/v1/inventory/wms-release/',
  ThStorageSummary: '/api/v1/inventory/th-storage-summary/',
  ThRelease: '/api/v1/inventory/th-release/',
  ReturnRubber: '/api/v1/terminal/return-rubber/', // 补打印列表
  Personnels: '/api/v1/system/personnels/', // 获取工艺员
  ReplaceMaterial: '/api/v1/terminal/replace-material/',
  MaterialMultiUpdate: '/api/v1/terminal/replace-material/multi_update/',
  WmsExpireList: '/api/v1/inventory/wms-expire-list/', // 原材料即将超期物料查询
  ThExpireList: '/api/v1/inventory/th-expire-list/', // 炭黑即将超期物料查询
  WeightingPackageSingle: 'api/v1/terminal/weighting-package-single/',
  GetManualInfo: '/api/v1/terminal/get-manual-info/', // 获取物料
  WeightingPackageManua: '/api/v1/terminal/weighting-package-manual/', // 合包
  GetMaterialTolerance: '/api/v1/terminal/get-material-tolerance/', // 物料查公差
  XlRecipesInfo: '/api/v1/terminal/xl-recipes-info/',

  ToleranceKeyword: '/api/v1/terminal/tolerance-keyword/',
  ToleranceRule: '/api/v1/terminal/tolerance-rule/',
  EquipMtbfmttpStatement: '/api/v1/equipment/equip-mtbfmttp-statement/', // MTBF/MTTF
  EquipWorkorderStatement: '/api/v1/equipment/equip-workorder-statement/', // 工单别处理时间
  EquipStatement: '/api/v1/equipment/equip-statement/', // 机台别处理时间
  EquipUserStatement: '/api/v1/equipment/equip-user-statement/', // 人员别处理时间

  ProductClassesPlanReal: '/api/v1/production/product-classes-plan-real/', // 生产记录表
  WmsSafetySettings: '/api/v1/inventory/wms-safety-settings/',
  ThSafetySettings: '/api/v1/inventory/th-safety-settings/',
  MaterialDetailsAux: '/api/v1/terminal/material-details-aux/',
  EquipPeriodStatement: '/api/v1/equipment/equip-period-statement/', // 期间别处理时间
  EquipFinishingRate: '/api/v1/equipment/equip-finishing-rate/', // 工单按时完成率报表
  EquipOldRate: '/api/v1/equipment/equip-old-rate/', // 交旧率报表
  GetSpare: '/api/v1/equipment/get-spare/', // 同步ERP
  GetSpareOrder: '/api/v1/equipment/get-spare-order/', // 同步领料单入库单据
  SchedulingParamsSetting: '/api/v1/plan/scheduling-params-setting/', // 排程参数设定
  SchedulingRecipeMachineSetting: '/api/v1/plan/scheduling-recipe-machine-setting/', // 定机表
  SchedulingRecipeMachineImport: '/api/v1/plan/scheduling-recipe-machine-setting/import_xlsx/',
  RecipeMachineWeight: '/api/v1/plan/recipe-machine-weight/',
  MatTankStatus: '/api/v1/plan/mat-tank-status/',
  SchedulingWashRules: '/api/v1/plan/scheduling-wash-rules/',
  SchedulingPlaceKeyword: '/api/v1/plan/scheduling-place-keyword/',

  OperaKeyword: '/api/v1/plan/scheduling-place-opera-keyword/',
  SchedulingEquipCapacity: '/api/v1/plan/scheduling-equip-capacity/',
  DuratePutinReson: '/api/v1/production/durate-putin-reson/', // 期间别不入库原因统计
  SchedulingProductDemandedDeclare: '/api/v1/plan/scheduling-product-demanded-declare/', // 各分厂胶料计划申报
  SchedulingProductSafetyParams: '/api/v1/plan/scheduling-product-safety-params/',
  SchedulingResult: '/api/v1/plan/scheduling-result/', // 机台生产计划-整体列表
  ImportXlx: '/api/v1/plan/scheduling-result/import_xlx/',
  ScheduleNos: '/api/v1/plan/scheduling-result/schedule_nos/',
  SchedulingProductDeclareSummary: '/api/v1/plan/scheduling-product-declare-summary/', // 胶料计划库存汇总
  SchedulingProductImport: '/api/v1/plan/scheduling-product-declare-summary/import_xlsx/',
  SchedulingProcedures: '/api/v1/plan/scheduling-procedures/', // 自动排程
  UpSequence: '/api/v1/plan/scheduling-product-declare-summary/up-sequence/', // 上调计划
  DownSequence: '/api/v1/plan/scheduling-product-declare-summary/down-sequence/', // 下调计划
  SchedulingEquipShutdownPlan: '/api/v1/plan/scheduling-equip-shutdown-plan/', // 机台设备停机计划设置
  MachineTargetValue: '/api/v1/production/machine-target-value/', // 机台目标值设定
  MonthlyOutputStatistics: '/api/v1/production/monthly-output-statistics-and-performance/', // 月产量统计明细及绩效
  DailyProductionCompletionReport: '/api/v1/production/daily-production-completion-report/', // 月产量完成
  AttendanceResultAudit: '/api/v1/production/attendance-result-audit/',
  Equip190e: '/api/v1/production/equip-190e/',
  Equip190eImport: '/api/v1/production/equip-190e/import_xlsx/',
  MonthlyOutputStatisticsReport: '/api/v1/production/monthly-output-statistics-report/',
  SchedulingStockSummary: '/api/v1/plan/scheduling-stock-summary/',
  SchedulingStockConfirm: '/api/v1/plan/scheduling-stock-summary/confirm/',
  SchedulingMaterialDemanded: '/api/v1/plan/scheduling-material-demanded/', // 原材料需求量
  MaterialExpendSummary: '/api/v1/production/material-expend-summary/', // 原材料消耗量
  SchedulingRecipeStages: '/api/v1/plan/scheduling-recipe-stages/',
  WmsNucleinManagement: '/api/v1/inventory/wms-nuclein-management/',
  MaterialTestPlan: '/api/v1/quality/material-test-plan/',
  MaterialTestPlanDetail: '/api/v1/quality/material-test-plan-detail/',
  CutTimeCollectSummary: '/api/v1/production/cut-time-collect-summary/', // 规格切换时间汇总
  PerformanceJobLadder: '/api/v1/production/performance-job-ladder/', // 绩效计算 岗位阶梯表
  ProductInfoDj: '/api/v1/production/product-info-dj/', // 丁基胶规格设定
  PerformanceUnitPrice: '/api/v1/production/performance-unit-price/', // 绩效计算 单价表
  Employeeattendancerecords: '/api/v1/production/employee-attendance-records/', // 员工出勤记录表
  Employeeattendancerecordsexport: '/api/v1/production/employee-attendance-records-export/', // 员工出勤记录表导出模板
  SummaryOfMillOutput: '/api/v1/production/summary-of-mill-output/', // 密炼机台产量汇总表
  SetThePrice: '/api/v1/production/set-the-price/', // 称量机台产量汇总表单价设定
  SummaryOfWeighingOutput: '/api/v1/production/summary-of-weighing-output/', // 称量机台产量汇总表
  UserImport: '/api/v1/system/personnels/import_xlsx/',
  Sb: '/api/v1/production/nishisb/',
  WmsExceptHandle: '/api/v1/inventory/wms-except-handle/',
  HfStock: '/api/v1/inventory/hf-stock/', // 烘房胶料信息统计列表
  HfStockDetail: '/api/v1/inventory/hf-stock-detail/',
  AttendanceClockDetail: '/api/v1/production/attendance-clock-detail/',
  AttendanceTimeStatistics: '/api/v1/production/attendance-time-statistics/',
  AttendanceGroupSetup: '/api/v1/production/attendance-group-setup/',

  PerformanceSummary: '/api/v1/production/performance-summary/', // 薪资汇总表
  PerformanceSubsidy: '/api/v1/production/performance-subsidy/',

  IndependentPostTemplate: '/api/v1/production/independent-post-template/',
  WmsOutTaskDetails: '/api/v1/inventory/wms-out-task-details/',
  WmsOutTasks: '/api/v1/inventory/wms-out-tasks/',
  WmsCancelTask: '/api/v1/inventory/wms-cancel-task/',
  WmsOutboundOrder: '/api/v1/inventory/wms-outbound-order/',
  ThOutTaskDetails: '/api/v1/inventory/th-out-task-details/',
  ThOutTasks: '/api/v1/inventory/th-out-tasks/',
  ThCancelTask: '/api/v1/inventory/th-cancel-task/',
  ThOutboundOrder: '/api/v1/inventory/th-outbound-order/',
  HfRealStatus: '/api/v1/inventory/hf-real-status/',
  FormulaPreparation: '/api/v1/terminal/formula-preparation/',
  WmsMaterials: '/api/v1/inventory/wms-materials/',
  ThMaterials: '/api/v1/inventory/th-materials/',
  HfInventoryLog: '/api/v1/inventory/hf-inventory-log/',
  MaterialInspectionRegistration: '/api/v1/quality/material-inspection-registration/'
}
