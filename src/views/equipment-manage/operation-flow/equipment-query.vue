<template>
  <div class="equipmentQuery">
    <!-- 维修工单查询 -->
    <el-form :inline="true">
      <el-form-item label="计划维修时间">
        <el-date-picker
          v-model="dateValue"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item label="计划名称">
        <el-input
          v-model="search.plan_name"
          style="width:200px"
          @input="debounceList"
        />
      </el-form-item>
      <el-form-item label="机台">
        <equip-select
          @equipSelected="equipSelected"
        />
      </el-form-item>
      <el-form-item label="工单编号">
        <el-input
          v-model="search.work_order_no"
          style="width:200px"
          @input="debounceList"
        />
      </el-form-item>
      <el-form-item label="设备条件">
        <el-select
          v-model="search.equip_condition"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in ['停机', '不停机']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="重要程度">
        <el-select
          v-model="search.importance_level"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in ['高', '中', '低']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="维修标准">
        <el-input
          v-model="search.equip_repair_standard"
          style="width:200px"
          @input="debounceList"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="search.status"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in ['已生成', '已指派', '已接单', '已开始', '已完成','已验收', '已关闭']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="维修人">
        <el-input
          v-model="search.repair_user"
          style="width:200px"
          @input="debounceList"
        />
      </el-form-item>
      <el-form-item label="验收人">
        <el-input
          v-model="search.accept_user"
          style="width:200px"
          @input="debounceList"
        />
      </el-form-item>
      <el-form-item label="验收结果">
        <el-select
          v-model="search.result_accept_result"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in ['合格','不合格']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否需要外协">
        <el-select
          v-model="search.result_need_outsourcing"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in [{label:'Y',value:true},{label:'N',value:false}]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否需要物料">
        <el-select
          v-model="search.result_material_requisition"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in [{label:'Y',value:true},{label:'N',value:false}]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="btnExportLoad" @click="templateDownload">导出Excel</el-button>
        <el-button type="primary" @click="changeSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      size="mini"
      :row-class-name="tableRowClassName"
      :data="tableData"
      border
    >
      <el-table-column
        prop="plan_id"
        label="计划/报修编号"
        min-width="20"
      />
      <el-table-column
        prop="plan_name"
        label="计划/报修名称"
        min-width="20"
      />
      <el-table-column
        prop="work_order_no"
        label="工单编号"
        min-width="20"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="dialog(scope.row)"
          >{{ scope.row.work_order_no }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="equip_no"
        label="机台"
        min-width="20"
      />
      <el-table-column
        prop="part_name"
        label="部位名称"
        min-width="20"
      />
      <el-table-column
        label="维修标准/故障原因"
        min-width="20"
      >
        <template slot-scope="scope">
          <el-link
            v-if="scope.row.equip_maintenance_standard_name"
            type="primary"
            @click="repairDialog(scope.row)"
          >{{ scope.row.equip_maintenance_standard_name }}</el-link>
          <el-link
            v-if="scope.row.equip_repair_standard_name"
            type="primary"
            @click="repairDialog(scope.row)"
          >{{ scope.row.equip_repair_standard_name }}</el-link>
          <el-link
            v-else
            type="primary"
            @click="repairDialog(scope.row)"
          >{{ scope.row.result_fault_cause_name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="result_fault_desc"
        label="故障详情描述"
        min-width="20"
      />
      <el-table-column
        prop="result_repair_desc"
        label="维修记录"
        min-width="20"
      />
      <el-table-column
        prop="planned_repair_date"
        label="计划维修日期"
        min-width="20"
      />
      <el-table-column
        prop="equip_condition"
        label="设备条件"
        min-width="20"
      />
      <el-table-column
        prop="importance_level"
        label="重要程度"
        min-width="20"
      />
      <el-table-column
        prop="status"
        label="状态"
        min-width="20"
      />
      <el-table-column
        prop="repair_user"
        label="维修人"
        min-width="20"
      />
      <el-table-column
        prop="repair_start_datetime"
        label="维修开始时间"
        min-width="20"
      />
      <el-table-column
        prop="repair_end_datetime"
        label="维修结束时间"
        min-width="20"
      />
      <el-table-column
        prop="result_material_requisition"
        label="是否需要物料"
        min-width="20"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.result_material_requisition===true">Y</span>
          <span v-if="scope.row.result_material_requisition===false">N</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="result_need_outsourcing"
        label="是否需要外协"
        min-width="20"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.result_need_outsourcing===true">Y</span>
          <span v-if="scope.row.result_need_outsourcing===false">N</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="wait_material"
        label="是否等待物料"
        min-width="20"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.wait_material===true">Y</span>
          <span v-if="scope.row.wait_material===false">N</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="wait_outsourcing"
        label="是否等待外协维修"
        min-width="20"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.wait_outsourcing===true">Y</span>
          <span v-if="scope.row.wait_outsourcing===false">N</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="assign_user"
        label="指派人"
        min-width="20"
      />
      <el-table-column
        prop="assign_datetime"
        label="指派时间"
        min-width="20"
      />
      <el-table-column
        prop="assign_to_user"
        label="被指派人"
        min-width="20"
      />
      <el-table-column
        prop="receiving_user"
        label="接单人"
        min-width="20"
      />
      <el-table-column
        prop="receiving_datetime"
        label="接单时间"
        min-width="20"
      />
      <el-table-column
        prop="created_username"
        label="报修人"
        min-width="20"
      />
      <el-table-column
        prop="created_date"
        label="报修时间"
        min-width="20"
      />
      <el-table-column
        prop="accept_user"
        label="验收人"
        min-width="20"
      />
      <el-table-column
        prop="accept_datetime"
        label="验收时间"
        min-width="20"
      />
      <el-table-column
        prop="result_accept_result"
        label="验收结果"
        min-width="20"
      />
      <el-table-column
        prop="result_accept_desc"
        label="验收记录"
        min-width="20"
      />
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />
    <el-dialog
      title="工单详情"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form :inline="true" label-width="120px">
        <el-form-item style="" />
      </el-form>
    </el-dialog>
    <el-dialog
      title="报修详情"
      :visible.sync="dialogVisibleRepair"
      width="30%"
    >
      <repair
        :rule-form="ruleForm"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseRepair">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="维修作业标准详情"
      :visible.sync="dialogVisibleDefinition"
      width="70%"
    >
      <definition
        :type-form="typeForm"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseDefinition">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="维护作业标准详情"
      :visible.sync="dialogVisibleMaintain"
      width="70%"
    >
      <maintain
        :type-form="typeForm1"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseMaintain">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import page from '@/components/page'
import { equipApplyOrder, equipApplyOrderdDown, equipApplyRepair, equipRepairStandard, equipMaintenanceStandard } from '@/api/jqy'
import EquipSelect from '@/components/EquipSelect/index'
import definition from '../components/definition-dialog'
import maintain from '../components/definition-dialog1'
import repair from '../components/repair-dialog'
import { debounce } from '@/utils'
export default {
  name: 'EquipmentQuery',
  components: { EquipSelect, page, repair, definition, maintain },
  data() {
    return {
      loading: false,
      btnExportLoad: false,
      dialogVisibleRepair: false,
      dialogVisibleDefinition: false,
      dialogVisibleMaintain: false,
      search: {},
      dateValue: [],
      tableData: [],
      ruleForm: {},
      typeForm: {},
      typeForm1: {},
      total: 0,
      dialogVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    debounceList() {
      debounce(this, 'changeSearch')
    },
    changeDate(date) {
      this.search.planned_repair_date_after = date ? date[0] : ''
      this.search.planned_repair_date_before = date ? date[1] : ''
      this.changeSearch()
    },
    async repairDialog(row) {
      if (row.equip_repair_standard_name) {
        this.dialogVisibleDefinition = true
        try {
          const data = await equipRepairStandard('get', null, { params: { id: row.equip_repair_standard }})
          this.typeForm = data.results[0]
        } catch (e) {
          // this.dialogVisible = true
        }
      } else if (row.equip_maintenance_standard_name) {
        this.dialogVisibleMaintain = true
        try {
          const data = await equipMaintenanceStandard('get', null, { params: { id: row.equip_maintenance_standard }})
          this.typeForm1 = data.results[0]
        } catch (e) {
          // this.dialogVisible = true
        }
      } else if (row.result_fault_cause_name) {
        this.dialogVisibleRepair = true
        try {
          const data = await equipApplyRepair('get', null, { params: { plan_id: row.plan_id }})
          this.ruleForm = data.results[0]
        } catch (e) {
        // this.dialogVisible = true
        }
      }
    },
    handleCloseRepair() {
      this.dialogVisibleRepair = false
    },
    handleCloseDefinition() {
      this.dialogVisibleDefinition = false
    },
    handleCloseMaintain() {
      this.dialogVisibleMaintain = false
    },
    tableRowClassName({ row, rowIndex }) {
      // const time = new Date(row.in_storage_time)
      // var nowTime = new Date()
      // var timeDifference = nowTime.getTime() - time.getTime()
      // var days = timeDifference / (24 * 3600 * 1000)
      // if (this.period_of_validity >= 0 && this.period_of_validity !== null) {
      //   if (days >= (0.5 * this.period_of_validity) && days < this.period_of_validity) {
      //     return 'warning-row'
      //   } else if (days >= this.period_of_validity) {
      //     return 'maxwarning-row'
      //   } else { return 'summary-cell-style' }
      // } else {
      //   if (days) {
      //     return 'warn-row'
      //   } else {
      //     return 'summary-cell-style'
      //   }
      // }
    },
    async getList() {
      try {
        this.loading = true
        const data = await equipApplyOrder('get', null, { params: this.search })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changeSearch() {
      this.search.page = 1
      this.getList()
    },
    templateDownload() {
      this.btnExportLoad = true
      const obj = Object.assign({ export: 1 }, this.search)
      const _api = equipApplyOrderdDown
      _api(obj)
        .then(res => {
          const link = document.createElement('a')
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = '维修工单.xlsx' // 下载的文件名
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          this.btnExportLoad = false
        }).catch(e => {
          this.btnExportLoad = false
        })
    },
    equipSelected(obj) {
      this.$set(this.search, 'equip_no', obj ? obj.equip_no : '')
      this.changeSearch()
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    }
  }
}
</script>

<style  lang="scss">
.assOutbound{
  .el-table .warn-row {
    background: #F5F7FA;
  }
  .el-table .warning-row {
    background: #e6a23c;
  }
  .el-table .maxwarning-row {
    background: red;
    color:white;
  }
  .el-table__row:hover > td {
    background-color: transparent !important;
  }
  .el-table__row--striped:hover > td {
    background-color: transparent !important;
  }}
</style>
