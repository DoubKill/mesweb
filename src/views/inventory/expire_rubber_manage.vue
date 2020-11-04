<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="生产日期选择">
        <el-date-picker
          v-model="search.date"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="search.a" placeholder="请选择状态">
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="胶料编码">
        <ProductNoSelect @productBatchingChanged="productBatchingChanged" />
      </el-form-item>
    </el-form>
    <el-table
      :data="list"
      border
      fit
      style="width: 100%"
    >
      <el-table-column label="No" type="index" align="center" />
      <el-table-column label="生产日期" align="center" prop="" />
      <el-table-column label="lot追踪号" align="center" prop="" />
      <el-table-column label="班次" align="center" prop="" />
      <el-table-column label="机台" align="center" prop="" />
      <el-table-column label="胶料编码" align="center" prop="" />
      <el-table-column label="检测结果" align="center" prop="" />
      <el-table-column label="等级" align="center" prop="" />
      <el-table-column label="过期时间" align="center" prop="" />
      <el-table-column label="超时时间" align="center" prop="" />
      <el-table-column label="状态" align="center">
        <template slot-scope="{row}">
          {{ setOperation(row.state) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template>
          <el-button @click="dialogFormVisible=true">处理</el-button>
          <el-button @click="confirmFun">确认</el-button>
        </template>
      </el-table-column>
      <el-table-column label="处理结果" align="center" prop="" />
      <el-table-column label="处理人" align="center" prop="" />
    </el-table>
    <el-dialog
      title="处理弹框"
      :visible.sync="dialogFormVisible"
    >
      <el-form>
        <el-form-item label="处理">
          <el-select />
        </el-form-item>
        <el-form-item label="出库">
          <el-checkbox />
        </el-form-item>
        <el-form-item>
          <el-button>新建处理意见</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ProductNoSelect from '@/components/ProductNoSelect'
export default {
  components: { ProductNoSelect },
  data() {
    return {
      list: [{}],
      search: {},
      options1: [],
      dialogFormVisible: false
    }
  },
  methods: {
    getList() {},
    productBatchingChanged(val) {

    },
    setOperation(val) {
      switch (val) {
        case 1:
          return '待处理'
        case 2:
          return '待确定'
        case 3:
          return '已确定'
      }
    },
    confirmFun() {
      this.$confirm(
        '确认提交?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async() => {
        // await matTestMethods('delete', row.id)
        this.$message.success('操作成功')
        this.getList()
      }).catch(() => {
        //
      })
    }
  }
}
</script>
