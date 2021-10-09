<template>
  <div>
    <!-- 库存查询 -->
    <el-form :inline="true">
      <el-form-item label="备件分类">
        <el-input
          v-model="search.equip_no"
          style="width:200px"
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item label="备件代码">
        <el-input
          v-model="search.equip_no"
          style="width:200px"
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item label="备件名称">
        <el-input
          v-model="search.equip_no"
          style="width:200px"
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item label="规格型号">
        <el-input
          v-model="search.equip_no"
          style="width:200px"
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item style="float:right">
        <el-button type="primary">导出Excel</el-button>
        <el-button type="primary">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      row-key="id"
      border
    >
      <el-table-column
        prop="date"
        label="备件分类"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="备件代码"
        min-width="20"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="dialog1(scope.row)"
          >{{ scope.row.date }}</el-link>
        </template>
      </el-table-column>
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
        label="可用数量"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="锁定数量"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="标准单位"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="库存下限"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="库存上限"
        min-width="20"
      />
      <el-table-column
        label="操作"
        width="150"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="dialog(scope.row)"
          >编辑
          </el-button>
          <el-button
            type="danger"
            size="mini"
          >删除
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
      width="80%"
    >
      <el-form :inline="true">
        <el-form-item label="备件分类">
          <el-input :disabled="true" />
        </el-form-item>
        <el-form-item label="备件名称">
          <el-input :disabled="true" />
        </el-form-item>
        <el-form-item label="规格型号">
          <el-input :disabled="true" />
        </el-form-item>
      </el-form>
      <el-table
        v-loading="loadingView"
        :data="tableDataView"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="40"
          :reserve-selection="true"
        />
        <el-table-column
          prop="order_no"
          label="备件条码"
          min-width="20"
        />
        <el-table-column
          prop="sub_no"
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
          label="数量"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="状态"
          min-width="20"
        />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="generateFun">锁定</el-button>
        <el-button type="primary" @click="dialogVisible=false">返回</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="备件代码定义"
      :visible.sync="dialogVisible1"
      width="40%"
    >
      <el-form :inline="true" label-width="">
        <el-form-item label="备件分类" style="" prop="checkList">
          <el-input
            v-model="creatOrder.equip_no"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="关键部位" style="marginLeft:40px" prop="checkList">
          <el-input
            v-model="creatOrder.equip_no"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="备件代码" style="" prop="checkList">
          <el-input
            v-model="creatOrder.equip_no"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="库存下限" style="marginLeft:40px" prop="checkList">
          <el-input
            v-model="creatOrder.equip_no"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="备件名称" style="" prop="checkList">
          <el-input
            v-model="creatOrder.equip_no"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="库存上限" style="marginLeft:40px" prop="checkList">
          <el-input
            v-model="creatOrder.equip_no"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="规格型号" style="" prop="checkList">
          <el-input
            v-model="creatOrder.equip_no"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="计划价格" style="marginLeft:40px" prop="checkList">
          <el-input
            v-model="creatOrder.equip_no"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="技术参数" style="" prop="checkList">
          <el-input
            v-model="creatOrder.equip_no"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="材质" style="marginLeft:67px" prop="checkList">
          <el-input
            v-model="creatOrder.equip_no"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="标准单位" style="" prop="checkList">
          <el-input
            v-model="creatOrder.equip_no"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="有限期(天)" style="marginLeft:30px" prop="checkList">
          <el-input
            v-model="creatOrder.equip_no"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible1=false">返回</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import page from '@/components/page'
export default {
  name: 'InventoryQuery',
  components: { page },
  data() {
    return {
      search: {
        page: 1,
        page_size: 10
      },
      multipleSelection: [],
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
      this.dialogVisible = true
      console.log(obj, 'obj')
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
