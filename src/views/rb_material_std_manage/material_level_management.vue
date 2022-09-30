<template>
  <div class="material_level_management">
    <!-- 原材料门尼值等级管理 -->
    <el-form :inline="true">
      <el-form-item label="物料类型">
        <el-select
          v-model="search.material_type"
          clearable
          placeholder="请选择"
          @change="changeList"
          @visible-change="visibleChange"
        >
          <el-option
            v-for="item in materialTypeOptions"
            :key="item.global_name"
            :label="item.global_name"
            :value="item.global_name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="物料名称">
        <el-input v-model.number="search.material_name" clearable @input="debounceFun" />
      </el-form-item>
      <el-form-item style="float: right">
        <el-button v-permission="['wms_mooney_level','change']" type="primary" @click="showCreateDialog">批量设定门尼值等级</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      :data="tableData"
      style="width: 100%"
      border
      row-key="id"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        :reserve-selection="true"
      />
      <el-table-column
        type="index"
        label="No"
        width="55"
      />
      <el-table-column
        prop="material_type"
        label="物料类型"
        min-width="10"
      />
      <el-table-column
        prop="material_no"
        label="物料编码"
        min-width="25"
      />
      <el-table-column
        prop="material_name"
        label="物料名称"
        min-width="25"
      />
      <el-table-column
        label="低门尼"
        width="80"
        :formatter="(row)=>{
          if(row.l_lower_limit_value&&row.l_upper_limit_value){
            return row.l_lower_limit_value +'-' + row.l_upper_limit_value
          }
        }"
      />
      <el-table-column
        label="标准门尼"
        width="80"
        :formatter="(row)=>{
          if(row.m_lower_limit_value&&row.m_upper_limit_value){
            return row.m_lower_limit_value +'-' + row.m_upper_limit_value
          }
        }"
      />
      <el-table-column
        label="高门尼"
        width="80"
        :formatter="(row)=>{
          if(row.h_lower_limit_value&&row.h_upper_limit_value){
            return row.h_lower_limit_value +'-' + row.h_upper_limit_value
          }
        }"
      />
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              v-permission="['wms_mooney_level','change']"
              size="mini"
              @click="showEditDialog(scope.row)"
            >编辑等级</el-button>
            <el-button
              v-permission="['wms_mooney_level','change']"
              type="danger"
              size="mini"
              @click="handleDelete(scope.row)"
            >清除等级</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <page
      :old-page="false"
      :total="count"
      :current-page="search.page"
      @currentChange="changePage"
    />
    <el-dialog
      title="门尼值高中低等级设定"
      :visible.sync="dialogVisible"
      width="700"
    >
      <table
        border="1"
        bordercolor="black"
        class="info-table"
      >
        <tr>
          <td>等级</td>
          <td>下限</td>
          <td>上限</td>
        </tr>
        <tr>
          <td>高门尼</td>
          <td><el-input-number v-model="dialogObj.h_lower_limit_value" controls-position="right" :min="1" :max="dialogObj.h_upper_limit_value" /></td>
          <td><el-input-number v-model="dialogObj.h_upper_limit_value" controls-position="right" :max="999" :min="dialogObj.h_lower_limit_value" /></td>
        </tr>
        <tr>
          <td>标准门尼</td>
          <td><el-input-number v-model="dialogObj.m_lower_limit_value" controls-position="right" :min="1" :max="dialogObj.m_upper_limit_value" /></td>
          <td><el-input-number v-model="dialogObj.m_upper_limit_value" controls-position="right" :max="999" :min="dialogObj.m_lower_limit_value" /></td>
        </tr>
        <tr>
          <td>低门尼</td>
          <td><el-input-number v-model="dialogObj.l_lower_limit_value" controls-position="right" :min="1" :max="dialogObj.l_upper_limit_value" /></td>
          <td><el-input-number v-model="dialogObj.l_upper_limit_value" controls-position="right" :max="999" :min="dialogObj.l_lower_limit_value" /></td>
        </tr>
      </table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submitFun">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { globalCodesUrl, wmsMooneyLevel, clearLevel, levelBatchSet } from '@/api/base_w'
import page from '@/components/page'
export default {
  name: 'MaterialLevelManagement',
  components: { page },
  data() {
    return {
      search: {},
      materialTypeOptions: [],
      tableData: [],
      count: 0,
      loading: true,
      multipleList: [],
      dialogVisible: false,
      btnLoading: false,
      dialogObj: {},
      isBatch: null
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await wmsMooneyLevel('get', null, { params: this.search })
        this.tableData = data.results || []
        this.count = data.count
      } catch (e) {
        //
      }
      this.loading = false
    },
    changePage(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    },
    changeList() {
      this.search.page = 1
      this.getList()
    },
    async visibleChange(val) {
      if (val) {
        try {
          const data = await globalCodesUrl('get', { params: { all: 1, class_name: '原材料类别' }})
          const arr = data.results.filter(d => d.global_name.indexOf('胶') > -1)
          this.materialTypeOptions = arr || []
        } catch (e) {
          this.materialTypeOptions = []
        }
      }
    },
    debounceFun() {
      this.$debounce(this, 'changeList')
    },
    handleSelectionChange(arr) {
      this.multipleList = arr || []
    },
    showCreateDialog() {
      if (!this.multipleList.length) {
        this.$message('请选择物料')
        return
      }
      this.dialogVisible = true
      this.dialogObj = {}
      this.isBatch = true
    },
    showEditDialog(row) {
      this.dialogVisible = true
      this.dialogObj = JSON.parse(JSON.stringify(row))
      this.isBatch = false
    },
    handleDelete: function(row) {
      this.$confirm('此操作将清除等级是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        try {
          clearLevel('post', null, { data: { 'material_no': row.material_no }}).then(response => {
            this.$message({ message: '操作成功', type: 'success' })
            this.getList()
          })
        } catch (e) { e }
      }).catch(() => {
      })
    },
    async submitFun() {
      try {
        this.btnLoading = true
        let arr = []
        if (this.isBatch) {
          this.multipleList.forEach(element => {
            arr.push(element.material_no)
          })
        } else {
          arr = [this.dialogObj.material_no]
        }

        const obj = {
          ...this.dialogObj,
          material_no: arr
        }
        delete obj.id
        delete obj.material_name
        delete obj.material_type
        await levelBatchSet('post', null, { data: obj })
        this.$message.success('操作成功')
        this.getList()
        this.btnLoading = false
        this.dialogVisible = false
      } catch (e) {
        this.btnLoading = false
      }
    }
  }
}
</script>

<style lang="scss">
.material_level_management{
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: center;
    }
       .info-table {
      td {
        min-width: 100px;
        padding-top: 10px;
        padding-bottom: 10px;
      }
    }
}

</style>
