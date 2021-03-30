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
      <!-- <el-form-item class="button-right">
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
      </el-form-item> -->
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
        prop="material_type_name"
        label="物料类型"
        min-width="20"
      />
      <el-table-column
        prop="material_no"
        min-width="20"
        label="物料编码"
      />
      <el-table-column
        prop="material_name"
        min-width="20"
        label="物料名称"
      />
      <el-table-column
        label="操作"
        min-width="20"
      >
        <template slot-scope="{row}">
          <el-button-group>
            <el-button
              size="mini"
              @click="add(row)"
            >新增别称</el-button>
            <el-button
              size="mini"
              @click="view(row)"
            >别称管理
            </el-button>
          </el-button-group>
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
      title="新增别称"
      :visible.sync="dialogVisible"
      width="800"
      :before-close="handleClose"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        label-width="120px"
      >
        <el-form-item label="子系统" prop="child_system">
          <el-select
            v-model="ruleForm.child_system"
            placeholder="请选择"
            @change="childSystemfun"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.global_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="物料编码" prop="material_no">
          <el-input v-model="ruleForm.material_no" />
        </el-form-item>
        <el-form-item label="物料名称" prop="material_name">
          <el-input v-model="ruleForm.material_name" />
        </el-form-item>
        <!-- <el-form-item label="条形码" prop="bra_code">
          <el-input v-model="ruleForm.bra_code" />
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button :loading="btnLoading" type="primary" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="别称列表"
      :visible.sync="dialogVisibleList"
      width="600"
    >
      <el-table
        :data="dialogList"
        border
      >
        <el-table-column
          prop="child_system_name"
          label="系统"
        />
        <el-table-column
          prop="material_name"
          label="物料名称"
        />
        <el-table-column
          prop="material_no"
          label="物料编码"
        />
        <!-- <el-table-column
          prop="bra_code"
          label="一维码"
        /> -->
      </el-table>
      <page
        :old-page="false"
        :total="totalDialog"
        :current-page="pageDialog"
        @currentChange="currentChangeDialog"
      />
    </el-dialog>
  </div>
</template>

<script>
import materialCodeSelect from '@/components/materialCodeSelect'
import materielTypeSelect from '@/components/select_w/materielTypeSelect'
import { getMaterialsAttribute } from '@/api/material-attribute-manage'
import { materialSupplierCollect } from '@/api/base_w_two'
import { globalCodesUrl } from '@/api/base_w'
import page from '@/components/page'
export default {
  components: { page, materialCodeSelect, materielTypeSelect },
  data() {
    return {
      tableData: [],
      search: { page: 1, page_size: 10 },
      dialogVisible: false,
      ruleForm: {
        child_system: '',
        material_name: '',
        material_no: ''
      },
      options: [],
      total: 0,
      totalDialog: 0,
      pageDialog: 1,
      pageSizeDialog: 10,
      dialogList: [],
      dialogVisibleList: false,
      btnLoading: false,
      currentId: ''
    }
  },
  created() {
    this.getList()
    this.getSubsystem()
  },
  methods: {
    getList() {
      getMaterialsAttribute(this.search)
        .then(response => {
          this.tableData = response.results
          this.total = response.count
        }).catch(e => {
          //
        })
    },
    getSubsystem() {
      globalCodesUrl('get', { params: { all: 1, class_name: '子系统' }})
        .then(response => {
          this.options = response.results
        }).catch(e => {
          //
        })
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    },
    changeList() {
      this.search.page = 1
      this.getList()
    },
    view(row) {
      this.dialogVisibleList = true
      this.currentId = row.id
      this.getDialogList()
    },
    async getDialogList() {
      try {
        const data = await materialSupplierCollect('get', null, { params: { material_id: this.currentId,
          page: this.pageDialog,
          page_size: this.pageSizeDialog }})
        this.totalDialog = data.count
        this.dialogList = data.results
      } catch (e) {
        //
      }
    },
    currentChangeDialog(page, page_size) {
      this.pageDialog = page
      this.pageSizeDialog = page_size
      this.getDialogList()
    },
    add(row) {
      this.ruleForm.material = row.id
      this.dialogVisible = true
    },
    handleClose(done) {
      this.$refs.ruleForm.resetFields()
      this.dialogVisible = false
      if (done) {
        done()
      }
    },
    childSystemfun(obj) {
      console.log(obj)
    },
    async submitFun() {
      if (!this.ruleForm.material_no || !this.ruleForm.material_name) {
        this.$message.info('物料编码、物料名称必填')
        return
      }
      if (!this.ruleForm.child_system) {
        this.$message.info('子系统必填')
        return
      }
      try {
        this.btnLoading = true
        await materialSupplierCollect('post', null, { data: this.ruleForm })
        this.dialogVisible = false
        this.$message.success('新增成功')
      } catch (e) {
        //
      }
      this.btnLoading = false
    },
    changeMaterialCode(obj) {
      this.$set(this.search, 'material_no', obj ? obj.material_no : '')
      this.$set(this.search, 'material_name', obj ? obj.material_name : '')
      this.changeList()
    },
    changMaterielType(arr) {
      const str = arr.length > 0 ? arr.join(',') : ''
      this.$set(this.search, 'material_type_ids', str)
      this.changeList()
    },
    changeMaterialCodeAdd() {},
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
