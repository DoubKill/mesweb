<template>
  <div class="patrolQuery">
    <!-- 巡检工单查询 -->
    <el-form :inline="true">
      <el-form-item label="计划巡检时间">
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
          clearable
          @input="changeDebounce"
        />
      </el-form-item>
      <el-form-item label="机台">
        <equip-select
          equip-type="密炼设备"
          @equipSelected="equipSelected"
        />
      </el-form-item>
      <el-form-item label="巡检标准">
        <el-input
          v-model="search.equip_repair_standard"
          style="width:200px"
          clearable
          @input="changeDebounce"
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
            v-for="item in ['已生成','已指派' ,'已接单','已开始', '已完成', '已关闭']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="接单人">
        <el-input
          v-model="search.receiving_user"
          style="width:200px"
          clearable
          @input="changeDebounce"
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
      <el-form-item>
        <el-button v-permission="['equip_inspection_order','export']" type="primary" :loading="btnExportLoad" @click="templateDownload">导出Excel</el-button>
        <el-button type="primary" @click="changeSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      size="mini"
      :data="tableData"
      :row-class-name="tableRowClassName"
      border
    >
      <el-table-column
        prop="plan_id"
        label="计划编号"
        min-width="20"
      />
      <el-table-column
        prop="plan_name"
        label="计划名称"
        min-width="20"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="dialogPatrol(scope.row)"
          >{{ scope.row.plan_name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="work_order_no"
        label="工单编号"
        min-width="20"
      />
      <!-- <template slot-scope="scope">
          <el-link
            type="primary"
            @click="dialogWorkNo(scope.row)"
          >{{ scope.row.work_order_no }}</el-link>
        </template>
      </el-table-column> -->
      <el-table-column
        prop="equip_no"
        label="机台"
        min-width="20"
      />
      <el-table-column
        prop="equip_repair_standard_name"
        label="巡检标准"
        min-width="20"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="repairDialog(scope.row)"
          >{{ scope.row.equip_repair_standard_name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="planned_repair_date"
        label="计划巡检日期"
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
        prop="repair_user"
        label="巡检人"
        min-width="20"
      />
      <el-table-column
        prop="repair_start_datetime"
        label="巡检开始时间"
        min-width="20"
      />
      <el-table-column
        prop="repair_end_datetime"
        label="巡检结束时间"
        min-width="20"
      />
      <el-table-column
        prop="created_username"
        label="录入人"
        min-width="20"
      />
      <el-table-column
        prop="created_date"
        label="录入时间"
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
      title="巡检详情"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-form
        :model="creatOrder"
        label-width="150px"
      >
        <el-form-item label="巡检计划名称">
          <el-input
            v-model="creatOrder.plan_name"
            style="width:250px"
            disabled
          />
        </el-form-item>
        <el-form-item label="工单编号">
          <el-input
            v-model="creatOrder.work_order_no"
            disabled
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="机台">
          <el-input
            v-model="creatOrder.equip_no"
            disabled
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="巡检标准">
          <el-input
            v-model="creatOrder.equip_repair_standard_name"
            style="width:250px"
            disabled
          />
        </el-form-item>
        <el-form-item>
          <el-table
            :data="creatOrder.work_content"
            border
            style="width: 651px"
          >
            <el-table-column
              label="序号"
              prop="job_item_sequence"
              width="50"
            />
            <el-table-column
              prop="job_item_content"
              label="作业明细"
              width="200"
            />
            <el-table-column
              prop="job_item_check_standard"
              label="判断标准"
              width="200"
            />
            <el-table-column
              prop="operation_result"
              label="处理结果"
              width="200"
            />
          </el-table>
        </el-form-item>
        <el-form-item label="巡检备注">
          <el-input
            v-model="creatOrder.result_repair_desc"
            disabled
            type="textarea"
            style="width:250px"
            :rows="3"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="上传图片">
          <template v-for="(item, index) in creatOrder.result_repair_graph_url">
            <el-image
              v-if="creatOrder.result_repair_graph_url.length>0"
              :key="index"
              style="width: 100px; height: 100px"
              :src="item"
              :preview-src-list="[item]"
            />
          </template>
          <div v-if="creatOrder.result_repair_graph_url.length===0">
            暂无图片
          </div>
        </el-form-item>
        <el-form-item label="巡检结论">
          <el-radio-group v-model="creatOrder.result_repair_final_result" disabled>
            <el-radio label="正常">正常</el-radio>
            <el-radio label="不正常">不正常</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible=false">取 消</el-button>
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
import maintain from '../components/definition-dialog1'
import { equipInspectionOrder, equipInspectionOrderDown, equipMaintenanceStandard } from '@/api/jqy'
import page from '@/components/page'
import EquipSelect from '@/components/EquipSelect/index'
export default {
  name: 'PatrolQuery',
  components: { EquipSelect, page, maintain },
  data() {
    return {
      search: {
        page: 1,
        page_size: 10
      },
      loading: false,
      dialogVisibleMaintain: false,
      creatOrder: { result_repair_graph_url: [] },
      dialogVisible: false,
      btnExportLoad: false,
      dateValue: [],
      tableData: [],
      typeForm1: {},
      total: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    changeDate(date) {
      this.search.planned_repair_date_after = date ? date[0] : ''
      this.search.planned_repair_date_before = date ? date[1] : ''
      this.changeSearch()
    },
    async repairDialog(row) {
      try {
        const data = await equipMaintenanceStandard('get', null, { params: { id: row.equip_repair_standard }})
        this.typeForm1 = data.results[0]
        this.dialogVisibleMaintain = true
      } catch (e) {
        // this.dialogVisible = true
      }
    },
    async getList() {
      try {
        this.loading = true
        const data = await equipInspectionOrder('get', null, { params: this.search })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changeDebounce() {
      this.search.page = 1
      debounce(this, 'getList')
    },
    dialogPatrol(row) {
      this.creatOrder = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
    },
    dialogWorkNo(row) {

    },
    changeSearch() {
      this.search.page = 1
      this.getList()
    },
    equipSelected(obj) {
      this.$set(this.search, 'equip_no', obj ? obj.equip_no : '')
      this.changeSearch()
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.timeout_color === '粉红色') {
        return 'pink-row'
      } else if (row.timeout_color === '红色') {
        return 'red-row'
      } else if (row.timeout_color === '酱红色') {
        return 'bigred-row'
      } else if (row.timeout_color === '橙色') {
        return 'orange-row'
      } else {
        return 'white-style'
      }
    },
    templateDownload() {
      this.btnExportLoad = true
      const obj = Object.assign({ export: 1 }, this.search)
      const _api = equipInspectionOrderDown
      _api(obj)
        .then(res => {
          const link = document.createElement('a')
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = '设备巡检工单.xlsx' // 下载的文件名
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

<style lang="scss">
.patrolQuery{
  .el-table.white-style{
    background:#FFFFFF;
  }
  .el-table .pink-row {
    background: pink;
    color:black;
  }
  .el-table .red-row {
    background: red;
    color:black;
  }
  .el-table .bigred-row {
    background: #B8741A;
    color:black;
  }
  .el-table .orange-row {
    background: #F59A23;
   color:black;
  }
  .el-table__row:hover > td {
    background-color: transparent !important;
  }
  .el-table__row--striped:hover > td {
    background-color: transparent !important;
  }}
</style>
