<template>
  <div class="maintenanceQuery">
    <!-- 设备维护计划查询 -->
    <el-form :inline="true">
      <el-form-item label="维护类别">
        <el-select
          v-model="search.work_type"
          style="width:150px"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in options"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="计划名称">
        <el-input
          v-model="search.plan_name"
          clearable
          style="width:250px"
          @input="changeDebounce"
        />
      </el-form-item>
      <el-form-item label="计划日期">
        <el-date-picker
          v-model="search.planned_maintenance_date"
          style="width:200px"
          type="date"
          value-format="yyyy-MM-dd"
          @change="changeSearch"
        />
      </el-form-item>
      <el-form-item label="来源">
        <el-select
          v-model="search.plan_source"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in options1"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="search.status"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in options2"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="设备条件">
        <el-select
          v-model="search.equip_condition"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in options3"
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
            v-for="item in options4"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button v-permission="['equip_plan','export']" type="primary" :loading="btnExportLoad" @click="templateDownload">导出Excel</el-button>
        <el-button type="primary" @click="changeSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :row-class-name="tableRowClassName"
      :data="tableData"
      row-key="id"
      border
    >
      <el-table-column
        prop="work_type"
        label="维护类别"
        min-width="20"
      />
      <el-table-column
        prop="plan_id"
        label="计划编号"
        width="130"
      />
      <el-table-column
        prop="plan_name"
        label="计划名称"
        width="160"
      />
      <el-table-column
        prop="equip_name"
        label="机台"
        width="130"
      />
      <el-table-column
        label="维护标准"
        min-width="20"
      >
        <template slot-scope="scope">
          <el-link
            v-if="scope.row.repair_standard_name"
            type="primary"
            @click="repairDialog(scope.row)"
          >{{ scope.row.repair_standard_name }}</el-link>
          <el-link
            v-if="scope.row.standard_name"
            type="primary"
            @click="repairDialog(scope.row)"
          >{{ scope.row.standard_name }}</el-link>
        </template>
      </el-table-column>
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
        prop="plan_source"
        label="来源"
        min-width="20"
      />
      <el-table-column
        prop="status"
        label="状态"
        min-width="20"
      />
      <el-table-column
        prop="planned_maintenance_date"
        label="计划维护日期"
        width="150"
      />
      <el-table-column
        prop="next_maintenance_date"
        label="下次维护日期"
        width="150"
      />
      <el-table-column
        prop="created_username"
        label="创建人"
        min-width="20"
      />
      <el-table-column
        prop="created_date"
        label="创建时间"
        width="150"
      />
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />

    <el-dialog
      title="维修作业标准详情"
      :visible.sync="dialogVisibleDefinition"
      width="80%"
    >
      <definition
        :show="dialogVisibleDefinition"
        :type-form="typeForm"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleDefinition=false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="维护作业标准详情"
      :visible.sync="dialogVisibleMaintain"
      width="80%"
    >
      <maintain
        :show="dialogVisibleMaintain"
        :type-form="typeForm1"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleMaintain=false">取 消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { debounce } from '@/utils'
import page from '@/components/page'
import definition from '../components/definition-dialog'
import maintain from '../components/definition-dialog1'
import { equipPlan, equipPlanDown, equipRepairStandard, equipMaintenanceStandard } from '@/api/jqy'
export default {
  name: 'MaintenanceQuery',
  components: { page, definition, maintain },
  data() {
    return {
      search: {
        page: 1,
        page_size: 10
      },
      tableData: [],
      total: 0,
      loading: false,
      dialogVisibleDefinition: false,
      dialogVisibleMaintain: false,
      btnExportLoad: false,
      options: ['巡检', '保养', '润滑', '标定'],
      options1: ['自动生成', '人工创建', '故障报修'],
      options2: ['未生成工单', '已生成工单', '计划执行中', '计划已完成'],
      options3: ['停机', '不停机'],
      options4: ['高', '中', '低'],
      multipleSelection: [],
      submit: false,
      typeForm: {},
      typeForm1: {},
      creatOrder: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await equipPlan('get', null, { params: this.search })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async repairDialog(row) {
      if (row.repair_standard_name) {
        try {
          const data = await equipRepairStandard('get', null, { params: { id: row.equip_repair_standard }})
          this.typeForm = data.results[0]
        } catch (e) {
          // this.dialogVisible = true
        }
        this.dialogVisibleDefinition = true
      } else if (row.standard_name) {
        try {
          const data = await equipMaintenanceStandard('get', null, { params: { id: row.equip_manintenance_standard }})
          this.typeForm1 = data.results[0]
        } catch (e) {
          // this.dialogVisible = true
        }
        this.dialogVisibleMaintain = true
      }
    },
    changeDebounce() {
      this.search.page = 1
      debounce(this, 'getList')
    },
    changeSearch() {
      this.search.page = 1
      this.getList()
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.timeout_color === '红色') {
        return 'red-row'
      } else {
        return 'white-style'
      }
    },
    templateDownload() {
      this.btnExportLoad = true
      const obj = Object.assign({ export: 1 }, this.search)
      const _api = equipPlanDown
      _api(obj)
        .then(res => {
          const link = document.createElement('a')
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = '设备维护计划.xlsx' // 下载的文件名
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          this.btnExportLoad = false
        }).catch(e => {
          this.btnExportLoad = false
        })
    }
  }
}
</script>

<style  lang="scss">
.maintenanceQuery{
  .el-table.white-style{
    background:#FFFFFF;
  }

  .el-table .red-row {
    background: red;
    color:black;
  }
  .el-table__row:hover > td {
    background-color: transparent !important;
  }
  .el-table__row--striped:hover > td {
    background-color: transparent !important;
  }}
</style>
