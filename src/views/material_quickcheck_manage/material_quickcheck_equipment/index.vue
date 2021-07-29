<template>
  <div class="material_quickcheck_equipment">
    <!-- 快检设备管理 -->
    <el-form :inline="true">
      <el-form-item label="设备名">
        <el-input v-model="search.equip_name" placeholder="请输入" @input="changeSearch" />
      </el-form-item>
      <el-form-item label="设备类型">
        <EquipTypeSelect ref="EquipTypeSelect" :is-created="true" @equipTypeSelect="searchList" />
      </el-form-item>
      <el-form-item style="float:right">
        <el-button v-permission="['material_equipment','add']" type="primary" @click="addFun">新增</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      border
    >
      <el-table-column
        prop="equip_name"
        label="设备名"
      />
      <el-table-column
        label="设备类型"
      >
        <template slot-scope="scope">
          <el-link type="primary" @click="clickEquipType(scope.$index,scope.row)">{{ scope.row.equip_type_name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
      >
        <template slot-scope="{row}">
          <el-button
            v-permission="['material_equipment','change']"
            size="mini"
            @click="editFun(row)"
          >编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <page
      :total="total"
      :old-page="false"
      :current-page="search.page"
      @currentChange="currentChange"
    />

    <el-dialog
      :title="formData.id?'编辑':'新增'"
      :visible.sync="dialogVisible1"
      width="600"
      :before-close="handleClose"
    >
      <el-form v-if="dialogVisible1" ref="formEquip" :rules="rulesEquip" :model="formData" label-width="80px">
        <el-form-item label="设备名" prop="equip_name">
          <el-input v-model="formData.equip_name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="设备类型" prop="equip_type">
          <EquipTypeSelect ref="EquipTypeSelect" :is-created="true" :default-val="formData.equip_type" @equipTypeSelect="dialogEquipTypeSelect" />
          <el-button
            style="margin-left:10px"
            size="mini"
            type="primary"
            @click="addEquipType"
          >添加设备类型
          </el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submitEquip">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="添加设备类型"
      :visible.sync="dialogVisible2"
      width="300"
      :before-close="handleClose1"
    >
      <el-input v-model="equipTypeName" placeholder="请输入类型名称" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose1(false)">取 消</el-button>
        <el-button
          v-permission="['material_equipment','add']"
          type="primary"
          :loading="typeBtnLoad"
          @click="submitEquipType"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!--<el-dialog
      title="可检测类型"
      :visible.sync="dialogVisible3"
      width="500px"
      :before-close="handleClose2"
    >
      <el-button
        size="mini"
        type="primary"
        @click="addEquipType"
      >编辑
      </el-button>
      <el-table
        :data="tableData1"
        style="width: 100%"
        border
      >
        <el-table-column
          prop="date"
          label="检测类型"
        />
      </el-table>
    </el-dialog> -->

    <el-dialog
      title="可检测类型"
      :visible.sync="dialogVisible3"
      width="500"
      :before-close="handleClose2"
    >
      <el-form ref="formTestType" :rules="rulesTestType" :model="formTestType" label-width="100px">
        <el-form-item label="设备类型名" prop="type_name">
          <el-input v-model="formTestType.type_name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="检测项" prop="examine_type">
          <el-select v-model="formTestType.examine_type" style="width:300px" multiple placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="addTestType">添加检测类型</el-button> -->
        <el-button @click="handleClose2(false)">取 消</el-button>
        <el-button
          v-permission="['material_equipment','add']"
          type="primary"
          :loading="testBtnLoad"
          @click="submitTestType"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { debounce } from '@/utils'
import EquipTypeSelect from '../components/equip-type-select'
import page from '@/components/page'
import { materialEquipmentType, materialEquipment, materialExamineType } from '@/api/base_w_three'
export default {
  name: 'MaterialQuickcheckEquipment',
  components: { EquipTypeSelect, page },
  data() {
    return {
      search: {},
      total: 0,
      tableData: [],
      dialogVisible1: false,
      formData: {
        equip_name: '',
        equip_type: ''
      },
      rulesEquip: {
        equip_name: [
          { required: true, message: '请输入设备名', trigger: 'blur' }
        ],
        equip_type: [
          { required: true, message: '请选择设备类型', trigger: 'change' }
        ],
        category: [{ required: true, message: '不能为空',
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error('请输入设备类型'))
            } else {
              callback()
            }
          }, trigger: 'change' }]
      },
      rulesTestType: {
        type_name: [
          { required: true, message: '请输入设备类型名', trigger: 'blur' }
        ],
        examine_type: [
          { required: true, message: '请选择检测项', trigger: 'change' }
        ]
      },
      dialogVisible2: false,
      dialogVisible3: false,
      equipTypeName: '',
      options: [],
      formTestType: {
        type_name: ''
      },
      btnLoading: false,
      typeBtnLoad: false,
      loading: true,
      testBtnLoad: false
    }
  },
  created() {
    this.getList()
    this.examineTypeList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await materialEquipment('get', null, { params: this.search })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
      } catch (e) { this.loading = false }
    },
    async examineTypeList() {
      try {
        this.loading = true
        const data = await materialExamineType('get', null, { params: { all: 1 }})
        this.options = data.results || []
      } catch (e) {
        //
      }
    },
    changeSearch() {
      this.search.page = 1
      debounce(this, 'getList')
    },
    searchList(val) {
      this.search.page = 1
      this.search.equip_type_name = val ? val.type_name : ''
      this.getList()
    },
    equipTypeSelect() {},
    editFun(row) {
      this.formData = JSON.parse(JSON.stringify(row))
      this.dialogVisible1 = true
    },
    addFun() {
      this.formData = {
        equip_name: '',
        equip_type: ''
      }
      this.dialogVisible1 = true
    },
    handleClose(done) {
      this.dialogVisible1 = false
      this.$refs.formEquip.resetFields()
      this.$refs.EquipTypeSelect.className = null
      if (done) {
        done()
      }
    },
    dialogEquipTypeSelect(val) {
      this.formData.equip_type = val ? val.id : ''
    },
    submitEquip() {
      this.$refs.formEquip.validate(async(valid) => {
        if (valid) {
          try {
            this.btnLoading = true
            const _api = this.formData.id ? 'patch' : 'post'
            await materialEquipment(_api, this.formData.id || '', { data: this.formData })
            this.$message.success('操作成功')
            this.getList()
            this.handleClose(false)
            this.btnLoading = false
          } catch (e) { this.btnLoading = false }
        } else {
          return false
        }
      })
    },
    addEquipType() {
      this.dialogVisible2 = true
    },
    handleClose1(done) {
      this.dialogVisible2 = false
      this.equipTypeName = ''
      if (done) {
        done()
      }
    },
    handleClose2(done) {
      this.dialogVisible3 = false
      setTimeout(() => {
        this.formTestType.examine_type = []
      }, 300)
      if (done) {
        done()
      }
    },
    async submitTestType() {
      try {
        this.testBtnLoad = true
        await materialEquipmentType('put', this.formTestType.equip_type || '', { data: this.formTestType })
        this.$message.success('操作成功')
        this.getList()
        this.testBtnLoad = false
        this.handleClose2(false)
      } catch (e) { this.testBtnLoad = false }
    },
    async submitEquipType() {
      if (!this.equipTypeName) return this.$message.info('请输入设备类型名称')
      this.typeBtnLoad = true
      await materialEquipmentType('post', null, { data: { type_name: this.equipTypeName }})
      this.$message.success('操作成功')
      this.handleClose1(false)
      this.typeBtnLoad = false
    },
    clickEquipType(index, row) {
      this.formTestType = JSON.parse(JSON.stringify(row))
      this.formTestType.type_name = this.formTestType.equip_type_name

      if (this.$refs.formTestType) {
        this.$refs.formTestType.clearValidate()
      }
      this.dialogVisible3 = true
    },
    addTestType() {

    },
    currentChange(page, pageSize) {
      this.search.page = page
      this.search.page_size = pageSize
      this.getList()
    }
  }
}
</script>

<style scoped lang='scss'>
.material_quickcheck_equipment{
  .el-input{
    width:210px !important;
  }
}

</style>
