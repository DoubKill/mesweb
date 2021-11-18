<template>
  <div>
    <!-- 接单巡检工单 -->
    <el-form :inline="true">
      <el-form-item label="计划巡检日期">
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
        <el-button v-permission="['equip_apply_order', 'receive']" type="primary" @click="order">接单</el-button>
        <el-button v-permission="['equip_apply_order', 'charge']" type="primary" @click="back">退单</el-button>
        <el-button v-permission="['equip_apply_order', 'close']" type="primary" @click="close">关闭</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="tableData"
      row-key="id"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="40"
        :reserve-selection="true"
      />
      <el-table-column
        prop="plan_id"
        label="计划编号"
        min-width="20"
      />
      <el-table-column
        prop="plan_name"
        label="计划名称"
        min-width="20"
      />
      <el-table-column
        prop="work_order_no"
        label="工单编号"
        min-width="20"
      />
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
  </div>
</template>

<script>
import page from '@/components/page'
import { mapGetters } from 'vuex'
import { equipInspectionOrder, multiUpdateInspection } from '@/api/jqy'
import { debounce } from '@/utils'
import EquipSelect from '@/components/EquipSelect/index'
export default {
  name: 'OrderPatrol',
  components: { EquipSelect, page },
  data() {
    return {
      search: { status: '已指派' },
      loading: false,
      btnExportLoad: false,
      dialogVisibleRepair: false,
      dialogVisibleDefinition: false,
      dialogVisibleMaintain: false,
      dateValue: [],
      tableData: [],
      total: 0,
      checkList: [],
      multipleSelection: [],
      submit: false,
      ruleForm: {},
      typeForm: {},
      typeForm1: {},
      creatOrder: {}
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.search.assign_to_user = this.name
    this.getList()
  },
  methods: {
    changeDebounce() {
      debounce(this, 'changeSearch')
    },
    changeDate(date) {
      this.search.planned_repair_date_after = date ? date[0] : ''
      this.search.planned_repair_date_before = date ? date[1] : ''
      this.changeSearch()
    },
    order() {
      if (this.multipleSelection.length > 0) {
        if (this.multipleSelection.every(d => d.status === '已指派')) {
          const obj = []
          this.multipleSelection.forEach(d => {
            obj.push(d.id)
          })
          this.$confirm('此操作将接单是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            multiUpdateInspection('post', null, { data: { pks: obj, status: '已接单', opera_type: '接单' }})
              .then(response => {
                this.$message({
                  type: 'success',
                  message: '接单成功'
                })
                this.$refs.multipleTable.clearSelection()
                this.getList()
              })
          })
        } else {
          this.$message.info('请勾选已指派状态列表')
        }
      } else {
        this.$message.info('请先勾选工单列表')
      }
    },
    back() {
      if (this.multipleSelection.length > 0) {
        if (this.multipleSelection.every(d => d.status === '已指派')) {
          const obj = []
          this.multipleSelection.forEach(d => {
            obj.push(d.id)
          })
          this.$confirm('此操作将退单是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            multiUpdateInspection('post', null, { data: { pks: obj, status: '已生成', opera_type: '退单' }})
              .then(response => {
                this.$message({
                  type: 'success',
                  message: '退单成功'
                })
                this.$refs.multipleTable.clearSelection()
                this.getList()
              })
          })
        } else {
          this.$message.info('请勾选已接单状态列表')
        }
      } else {
        this.$message.info('请先勾选工单列表')
      }
    },
    async close() {
      if (this.multipleSelection.length > 0) {
        if (this.multipleSelection.every(d => d.status === '已指派')) {
          const obj = []
          this.multipleSelection.forEach(d => {
            obj.push(d.id)
          })
          this.$confirm('此操作将关闭工单是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            multiUpdateInspection('post', null, { data: { pks: obj, status: '已关闭', opera_type: '关闭' }})
              .then(response => {
                this.$message({
                  type: 'success',
                  message: '关闭成功'
                })
                this.$refs.multipleTable.clearSelection()
                this.getList()
              })
          })
        } else {
          this.$message.info('请勾选已指派状态列表')
        }
      } else {
        this.$message.info('请先勾选工单列表')
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
    changeSearch() {
      this.search.page = 1
      this.getList()
    },
    equipSelected(obj) {
      this.$set(this.search, 'equip_no', obj ? obj.equip_no : '')
      this.changeSearch()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    }
  }
}
</script>

<style>

</style>
