<template>
  <div>
    <!-- mes与子系统物料信息映射 -->
    <el-form :inline="true">
      <el-form-item label="物料编码">
        <materialCodeSelect
          :is-all-obj="true"
          :default-val="search.material_no"
          @changeSelect="changeMaterialCode"
        />
      </el-form-item>
      <el-form-item label="物料名称">
        <materialCodeSelect
          :is-all-obj="true"
          :default-val="search.material_name"
          label-name="material_name"
          @changeSelect="changeMaterialCode"
        />
      </el-form-item>
      <el-form-item label="物料类型">
        <materielTypeSelect :is-multiple="true" :params-type="false" @changSelect="changMaterielType" />
      </el-form-item>
    </el-form>
    <el-button
      class="button-right"
      @click="add"
    >新增别称</el-button>
    <el-button
      class="button-right"
      @click="templateDownload"
    >下载模板</el-button>
    <el-upload
      class="button-right"
      action="string"
      accept=".xls, .xlsx"
      :http-request="Upload"
      :show-file-list="false"
    >
      <el-button>导入</el-button>
    </el-upload>

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
        label="物料类型"
        min-width="20"
      />
      <el-table-column
        prop="name"
        min-width="20"
        label="物料编码"
      />
      <el-table-column
        prop="address"
        min-width="20"
        label="物料名称"
      />
      <el-table-column
        label="操作"
        min-width="20"
      >
        <template slot-scope="{row}">
          <el-button @click="add(row)">新增别称</el-button>
        </template>
      </el-table-column>
      <div v-for="item in 3" :key="item">
        <el-table-column
          min-width="20"
          prop="date"
          label="物料编码别称"
        />
        <el-table-column
          min-width="20"
          prop="name"
          label="物料类型别称"
        />
      </div>
    </el-table>

    <el-dialog
      title="新增别称"
      :visible.sync="dialogVisible"
      width="800"
      :before-close="handleClose"
    >
      <el-form :inline="true">
        <el-form-item label="物料类型">
          //
        </el-form-item>
        <el-form-item label="物料编码">
          //
        </el-form-item>
        <el-form-item label="物料名称">
          //
        </el-form-item>
      </el-form>
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        label-width="120px"
      >
        <el-form-item label="子系统">
          <el-select v-model="ruleForm.value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="物料选择">
          <materialCodeSelect
            :is-all-obj="true"
            label-name="material_str"
            @changeSelect="changeMaterialCode"
          />
        </el-form-item>
        <el-form-item label="物料编码">
          <el-input v-model="ruleForm.a" />
        </el-form-item>
        <el-form-item label="物料名称">
          <el-input v-model="ruleForm.b" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import materialCodeSelect from '@/components/materialCodeSelect'
import materielTypeSelect from '@/components/select_w/materielTypeSelect'
export default {
  components: { materialCodeSelect, materielTypeSelect },
  data() {
    return {
      tableData: [],
      search: {},
      dialogVisible: false,
      currentObj: {},
      ruleForm: {},
      options: []
    }
  },
  methods: {
    add(row) {
      this.currentObj = row
      this.dialogVisible = true
    },
    handleClose(done) {
      done()
    },
    submitFun() {

    },
    changeMaterialCode(obj) {
      this.$set(this.search, 'material_no', obj ? obj.material_no : '')
      this.$set(this.search, 'material_name', obj ? obj.material_name : '')
    },
    changMaterielType(arr) {
      console.log(arr, 777)
    },
    templateDownload() {
    //   getSpareInventoryImportExport().then(response => {
    //   const link = document.createElement('a')
    //   const blob = new Blob([response], { type: 'application/vnd.ms-excel' })
    //   link.style.display = 'none'
    //   link.href = URL.createObjectURL(blob)
    //   link.download = 'mes与子系统物料信息映射.xls' // 下载的文件名
    //   document.body.appendChild(link)
    //   link.click()
    //   document.body.removeChild(link)
    //   })
    },
    Upload(param) {
      const formData = new FormData()
      formData.append('file', param.file)
      //   postSpareInventoryImportExport(formData).then(response => {
      //     this.$message({
      //       type: 'success',
      //       message: '导入成功!'
      //     })
      //     this.search.page = 1
      //     this.getList()
      //   }).catch(e=>{
      //   this.$message.error(e)
      // })
    }
  }
}
</script>

<style>

</style>
