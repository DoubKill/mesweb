<template>
  <div>
    <!-- 备件领料申请处理 -->
    <el-form :inline="true">
      <el-form-item label="单据条码">
        <el-input
          v-model="search.equip_no"
          style="width:200px"
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item label="提交人">
        <el-select
          v-model="search.jg"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in ['减速机','电机']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审核人">
        <el-input
          v-model="search.equi"
          style="width:200px"
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item label="提交起止时间">
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
      <el-form-item label="状态">
        <el-select
          v-model="search.feeding"
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
      <el-form-item>
        <el-button type="primary">审核通过</el-button>
        <el-button type="primary">退单</el-button>
        <el-button type="primary">关闭</el-button>
        <el-button type="primary" @click="dialog">新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
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
        prop="date"
        label="单据条码"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="提交部门"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="提交人"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="提交时间"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="审核部门"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="审核人"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="审核时间"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="状态"
        min-width="20"
      />
    </el-table>
    <el-dialog
      title="维修物料申请"
      :visible.sync="dialogVisible"
      width="70%"
    >
      <el-form :inline="true">
        <el-form-item label="领料申请单号">
          <el-input :disabled="true" />
        </el-form-item>
        <el-form-item label="单据状态">
          <el-input :disabled="true" />
        </el-form-item>
      </el-form>
      <el-table
        v-loading="loadingView"
        :data="tableDataView"
        border
      >
        <el-table-column
          prop="order_no"
          label="物料编码"
          min-width="20"
        />
        <el-table-column
          prop="sub_no"
          label="物料名称"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="备件分类"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="规格型号"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="技术参数"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="标准单位"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="库存数量"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="领料数量"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="是否交旧"
          min-width="20"
        >
          <template slot-scope="{row}">
            <el-checkbox v-model="row.checked" />
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="85"
        >
          <template slot-scope="{row}">
            <el-button type="danger" @click="deleteList(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button :loading="submit" type="primary" @click="generateFun">确 定</el-button>
      </span>
    </el-dialog>
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
export default {
  name: 'ApareParts',
  components: { page },
  data() {
    return {
      search: {
        page: 1,
        page_size: 10
      },
      dateValue: [],
      tableData: [],
      loadingView: false,
      tableDataView: [{ date: 1 }],
      total: 0,
      options: ['已提交', '已审核', '已退单', '已关闭'],
      multipleSelection: [],
      dialogImageUrl: '',
      dialogVisible: false,
      submit: false,
      creatOrder: {}
    }
  },
  methods: {
    generateFun(obj) {
      this.dialogVisible = true
      console.log(this.multipleSelection)
    },
    changeDate() {

    },
    deleteList(row) {
      console.log(row)
    },
    getList() {

    },
    changeSearch() {
      this.getList()
    },
    equipSelected(obj) {
      this.creatOrder.equip_no = obj || null
      console.log(this.creatOrder.equip_no)
    },
    dialog() {
      this.dialogVisible = true
    },
    handleClose(done) {
      this.dialogVisible = false
      if (done) {
        done()
      }
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
