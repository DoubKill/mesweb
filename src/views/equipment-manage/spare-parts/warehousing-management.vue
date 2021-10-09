<template>
  <div>
    <!-- 入库管理 -->
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
          v-model="search.feeding"
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
          v-model="search.fe"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in ['未入库','入库中','已入库']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      row-key="id"
      border
    >
      <el-table-column
        label="操作"
        width="80"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="dialog(scope.row)"
          >入库
          </el-button>
        </template>
      </el-table-column>
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
        label="状态"
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
      :visible.sync="dialogVisible"
      width="80%"
    >
      <el-form :inline="true">
        <el-form-item label="单据条码">
          <el-input :disabled="true" />
        </el-form-item>
        <el-form-item label="状态">
          <el-input :disabled="true" />
        </el-form-item>
      </el-form>
      <el-table
        v-loading="loadingView"
        :data="tableDataView"
        border
      >
        <el-table-column
          label="操作"
          width="90"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="dialog1(scope.row)"
            >确定入库
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="order_no"
          label="备件条码"
          min-width="20"
        />
        <el-table-column
          prop="sub_no"
          label="备件代码"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="备件名称"
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
          label="总数量"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="已入库数量"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="标准单位"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="库区"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="库位"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="关键部件"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="出厂编码"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="出厂日期"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="供应商"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="制造商"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="入库人"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="入库时间"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="状态"
          min-width="20"
        />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible=false">关闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="备件人工入库"
      :visible.sync="dialogVisible1"
      width="30%"
    >
      <el-form :inline="true" label-width="150px">
        <el-form-item label="备件名称" style="" prop="checkList">
          <el-input
            v-model="creatOrder.equip_no"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="备件条码" style="" prop="checkList">
          <el-input
            v-model="creatOrder.equip_no"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="批号" style="" prop="checkList">
          <el-input
            v-model="creatOrder.equip_no"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="库区">
          <el-select
            v-model="creatOrder.feedi"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in ['库区1']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="库位">
          <el-select
            v-model="creatOrder.fei"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in ['库位1']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数量" style="" prop="checkList">
          <el-input
            v-model="creatOrder.equp_no"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="单位" style="" prop="checkList">
          <el-input
            v-model="creatOrder.eq"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button :loading="submit" type="primary" @click="generateFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import page from '@/components/page'
export default {
  name: 'WarehousingManagement',
  components: { page },
  data() {
    return {
      search: {
        page: 1,
        page_size: 10
      },
      dateValue: [],
      tableData: [{ date: '1' }],
      tableDataView: [{ date: '1' }],
      total: 0,
      checkList: [],
      loadingView: false,
      dialogVisible: false,
      dialogVisible1: false,
      submit: false,
      creatOrder: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    generateFun(obj) {
      this.dialogVisible1 = true
      console.log(obj, 'obj')
    },
    changeDate() {

    },
    getList() {

    },
    changeSearch() {
      this.getList()
    },
    dialog() {
      this.dialogVisible = true
    },
    dialog1() {
      this.dialogVisible1 = true
    },
    handleClose(done) {
      this.dialogVisible1 = false
      if (done) {
        done()
      }
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
