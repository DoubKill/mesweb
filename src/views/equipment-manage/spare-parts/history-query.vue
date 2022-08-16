<template>
  <div class="history-query">
    <!-- 备件出入库履历查询 -->
    <el-form :inline="true">
      <el-form-item label="起止时间">
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
      <el-form-item label="出库/入库">
        <el-select
          v-model="search.status"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in ['出库','入库']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="出入库时间">
        <el-date-picker
          v-model="search.real_time"
          type="date"
          value-format="yyyy-MM-dd"
          @change="changeSearch"
        />
      </el-form-item>
      <el-form-item label="出入库单号">
        <el-input
          v-model="search.order_id"
          style="width:200px"
          clearable
          @input="debounceSearch"
        />
      </el-form-item>
      <el-form-item label="操作人">
        <el-input
          v-model="search.created_user"
          style="width:100px"
          clearable
          @input="debounceSearch"
        />
      </el-form-item>
      <el-form-item label="领用人">
        <el-input
          v-model="search.receive_user"
          style="width:100px"
          clearable
          @input="debounceSearch"
        />
      </el-form-item>
      <el-form-item label="是否撤销">
        <el-select
          v-model="search.revocation"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in ['Y','N']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备件代码">
        <el-input
          v-model="search.spare_code"
          style="width:200px"
          clearable
          @input="debounceSearch"
        />
      </el-form-item>
      <el-form-item label="备件分类">
        <el-input
          v-model="search.equip_component_type"
          style="width:200px"
          clearable
          @input="debounceSearch"
        />
      </el-form-item>
      <el-form-item label="备件名称">
        <el-input
          v-model="search.spare_name"
          style="width:200px"
          clearable
          @input="debounceSearch"
        />
      </el-form-item>
      <el-form-item label="规格型号">
        <el-input
          v-model="search.specification"
          style="width:200px"
          clearable
          @input="debounceSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="['equip_warehouse_record', 'export']"
          type="primary"
          :loading="btnExportLoad"
          @click="exportTable"
        >导出Excel</el-button>
        <el-button type="primary" @click="changeSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      size="mini"
      :data="tableData"
      border
    >
      <el-table-column
        prop="status"
        label="出库/入库"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="出入库单号"
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
            @click="dialogShow(scope.row)"
          >{{ scope.row.work_order_no }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="spare_code"
        label="备件代码"
        min-width="20"
      />
      <el-table-column
        prop="spare_name"
        label="备件名称"
        min-width="20"
      />
      <el-table-column
        prop="component_type_name"
        label="备件分类"
        min-width="20"
      />
      <el-table-column
        prop="specification"
        label="规格型号"
        min-width="20"
      />
      <el-table-column
        prop="technical_params"
        label="用途"
        min-width="20"
      />
      <el-table-column
        prop="cost"
        label="单价"
        min-width="20"
      />
      <el-table-column
        prop="quantity"
        label="数量"
        min-width="20"
      />
      <el-table-column
        prop="unit"
        label="单位"
        min-width="20"
      />
      <el-table-column
        prop="money"
        label="金额"
        min-width="20"
      />
      <el-table-column
        prop="area_name"
        label="库区"
        min-width="20"
      />
      <el-table-column
        prop="location_name"
        label="库位"
        min-width="20"
      />
      <el-table-column
        prop="receive_user"
        label="领用人"
        min-width="20"
      />
      <el-table-column
        prop="created_username"
        label="操作人"
        min-width="20"
      />
      <el-table-column
        prop="real_time"
        label="出入库时间"
        min-width="20"
      />
      <el-table-column
        prop="last_updated_date"
        label="操作时间"
        min-width="20"
      />
      <el-table-column
        prop="revocation"
        label="是否撤销"
        min-width="20"
      />
      <el-table-column
        prop="revocation_desc"
        label="撤销备注"
        min-width="20"
      />
      <el-table-column
        label="操作"
        width="80"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.revocation==='N'"
            v-permission="['equip_warehouse_record', 'revocation']"
            type="primary"
            size="mini"
            @click="dialogRevoke(scope.row)"
          >撤销
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />
    <el-dialog
      :visible.sync="dialogVisible"
      width="500px"
      title="处理维修工单"
      class="dialogStyle"
    >
      <el-form v-loading="loadingView" label-width="150px">
        <el-form-item label="计划/报销名称">
          <el-input v-model="currentObj.plan_name" :disabled="true" />
        </el-form-item>
        <el-form-item label="工单编号">
          <el-input v-model="currentObj.work_order_no" :disabled="true" />
        </el-form-item>
        <el-form-item label="机台">
          <el-input v-model="currentObj.equip_no" :disabled="true" />
        </el-form-item>
        <el-form-item label="维修标准/故障原因">
          <el-input v-model="currentObj.fault_name" :disabled="true" />
        </el-form-item>
        <el-form-item label="故障详情描述">
          <el-input
            v-model="currentObj.result_fault_desc"
            :disabled="true"
            type="textarea"
            style="width:200px"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible=false">返回</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogVisibleRevoke"
      width="500px"
      title="入出库撤销操作 备注说明"
      class="dialogStyle"
    >
      <el-form label-width="150px" :model="currentRevoke">
        <el-form-item label="出库/入库">
          <el-input
            v-model="currentRevoke.status"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item label="单据号">
          <el-input v-model="currentRevoke.order_id" :disabled="true" />
        </el-form-item>
        <el-form-item label="备件代码">
          <el-input v-model="currentRevoke.spare_code" :disabled="true" />
        </el-form-item>
        <el-form-item label="备注说明">
          <el-input
            v-model="currentRevoke.revocation_desc"
            type="textarea"
            style="width:200px"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisibleRevoke=false">返回</el-button>
        <el-button :loading="submit" type="primary" @click="generateFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import page from '@/components/page'
import { mapGetters } from 'vuex'
import { equipWarehouseRecord } from '@/api/base_w_five'
export default {
  name: 'HistoryQuery',
  components: { page },
  data() {
    return {
      search: {
        page: 1,
        page_size: 10
      },
      dateValue: [],
      tableData: [],
      total: 0,
      submit: false,
      loading: false,
      dialogVisibleRevoke: false,
      btnExportLoad: false,
      dialogVisible: false,
      loadingView: false,
      tableDataView: [],
      currentObj: {},
      currentRevoke: {}
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.getList()
  },
  methods: {
    changeDate(arr) {
      this.search.s_time = arr ? arr[0] : ''
      this.search.e_time = arr ? arr[1] : ''
      this.search.page = 1
      this.getList()
    },
    changeSearch() {
      this.search.page = 1
      this.getList()
    },
    debounceSearch() {
      this.$debounce(this, 'changeSearch')
    },
    async generateFun() {
      if (this.currentRevoke.revocation_desc === undefined) {
        this.currentRevoke.revocation_desc = null
      }
      try {
        this.submit = true
        await equipWarehouseRecord('put', this.currentRevoke.id, { data:
        { revocation_desc: this.currentRevoke.revocation_desc,
          equip_spare: this.currentRevoke.equip_spare,
          equip_warehouse_location: this.currentRevoke.equip_warehouse_location
        }})
        this.$message.success('撤销成功')
        this.submit = false
        this.dialogVisibleRevoke = false
        this.getList()
      } catch (e) {
        this.submit = false
        this.dialogVisibleRevoke = true
      }
    },
    dialogRevoke(row) {
      if (row.revocation === 'N') {
        if (row.created_username === this.name) {
          this.currentRevoke = JSON.parse(JSON.stringify(row))
          this.dialogVisibleRevoke = true
        } else {
          this.$message('只能撤销本人的单子')
        }
      } else {
        this.$message('撤销过的单子不能再次撤销')
      }
    },
    async getList() {
      try {
        this.loading = true
        const obj = {}
        Object.assign(obj, this.search)
        const data = await equipWarehouseRecord('get', null, { params: obj })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    },
    async dialogShow(row) {
      this.dialogVisible = true
      try {
        const data = await equipWarehouseRecord('get', null, { params: { work_order_no: row.work_order_no }})
        this.currentObj = data
        this.loadingView = false
      } catch (e) {
        this.loadingView = false
      }
    },
    exportTable() {
      this.btnExportLoad = true
      const obj = Object.assign({ export: 1 }, this.search)
      const _api = equipWarehouseRecord
      _api('get', null, { params: obj, responseType: 'blob' })
        .then(res => {
          const link = document.createElement('a')
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = '备件出入库履历.xlsx' // 下载的文件名
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

<style lang="scss" scoped>
.history-query{
.dialogStyle .el-input{
  width:200px;
}
}

</style>
