<template>
  <div>
    <!-- 停机原因定义 -->
    <el-form :inline="true">
      <el-form-item label="停机类型:">
        <shutdownMoldSelect @shutdownMoldChange="shutdownMoldChange" />
      </el-form-item>
      <el-form-item class="button-right">
        <el-button>新建</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="tableData"
      border
    >
      <el-table-column
        label="No"
        width="40"
        type="index"
      />
      <el-table-column
        prop="date"
        label="停机类型"
      />
      <el-table-column
        prop="name"
        label="停机编码"
      />
      <el-table-column
        prop="a"
        label="原因描述"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.a }}
          <el-popover
            v-model="scope.row.visible"
            placement="right"
            width="400"
            trigger="manual"
          >
            <el-input
              v-model="reason"
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
            />
            <i slot="reference" class="el-icon-edit slotIconStyle" @click="iconEdit(scope.row,scope.$index)" />
            <el-button style="float:right;margin-top:5px" size="mini" @click="submitFun(scope.row,scope.$index)">确定</el-button>
            <el-button style="float:right;margin-top:5px;margin-right:5px" size="mini" @click="scope.row.visible = false">取消</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="date"
        label="创建人"
      />
      <el-table-column
        prop="name"
        label="创建时间"
      />
      <el-table-column
        prop="address"
        label="操作"
      >
        <template slot-scope="{row}">
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import shutdownMoldSelect from '../components/shutdown-mold-select'
export default {
  components: { shutdownMoldSelect },
  data() {
    return {
      tableData: [],
      reason: ''
    }
  },
  created() {
    for (let i = 1; i < 5; i++) {
      this.tableData.push({ a: 777 })
    }
  },
  methods: {
    shutdownMoldChange() {},
    submitFun(row, index) {
      row.visible = false
    },
    iconEdit(row, index) {
      this.tableData.forEach((D) => {
        D.visible = false
      })
      row.visible = true
      this.reason = row.a
    },
    handleDelete(row) {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // deleteMaterialLocationBinding(row.id)
        //   .then(response => {
        //     this.$message({
        //       type: 'success',
        //       message: '删除成功!'
        //     })
        //     this.getParams.page = 1
        //     this.getList()
        //   })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .slotIconStyle{
    color: rgb(11, 189, 11);
    font-size: 20px;
    display: inline-block;
    width: 50px;
    height: 25px;
  }
</style>
