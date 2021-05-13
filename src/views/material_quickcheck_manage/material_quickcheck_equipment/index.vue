<template>
  <div class="material_quickcheck_equipment">
    <!-- 快检设备管理 -->
    <el-form :inline="true">
      <el-form-item label="设备名">
        <el-input v-model="search.a" placeholder="请输入" @input="changeSearch" />
      </el-form-item>
      <el-form-item label="设备类型">
        <EquipTypeSelect @equipTypeSelect="equipTypeSelect" />
      </el-form-item>
      <el-form-item style="float:right">
        <el-button type="primary" @click="addFun">新增</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="tableData"
      style="width: 100%"
      border
    >
      <el-table-column
        prop="date"
        label="设备名"
      />
      <el-table-column
        prop="name"
        label="设备类型"
      >
        <template slot-scope="scope">
          <el-link type="primary" @click="clickEquipType(scope.$index,scope.row)">{{ scope.row.name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
      >
        <template slot-scope="{row}">
          <el-button
            size="mini"
            @click="editFun(row)"
          >编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="formData.id?'编辑':'新增'"
      :visible.sync="dialogVisible1"
      width="600"
      :before-close="handleClose"
    >
      <el-form ref="formEquip" :rules="rulesEquip" :model="formData" label-width="80px">
        <el-form-item label="设备名" prop="a">
          <el-input v-model="formData.a" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="设备类型" prop="aaa">
          <EquipTypeSelect ref="EquipTypeSelect" :is-created="true" :default-val="formData.aaa" @equipTypeSelect="dialogEquipTypeSelect" />
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
        <el-button type="primary" @click="submitEquip">确 定</el-button>
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
        <el-button type="primary" @click="submitEquipType">确 定</el-button>
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
        <el-form-item label="设备类型名" prop="bb">
          <el-input v-model="formTestType.bb" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="检测项" prop="bbb">
          <el-select v-model="formTestType.bbb" style="width:300px" multiple placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addTestType">添加检测类型</el-button>
        <el-button @click="handleClose2(false)">取 消</el-button>
        <el-button type="primary" @click="submitTestType">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { debounce } from '@/utils'
import EquipTypeSelect from '../components/equip-type-select'
export default {
  components: { EquipTypeSelect },
  data() {
    return {
      search: {},
      tableData: [{ name: '设备类型' }],
      dialogVisible1: false,
      formData: {
        a: '',
        aaa: ''
      },
      rulesEquip: {
        a: [
          { required: true, message: '请输入设备名', trigger: 'blur' }
        ],
        aaa: [{ required: true, message: '不能为空',
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error('请输入设备类型'))
            } else {
              callback()
            }
          }, trigger: 'change' }]
      },
      rulesTestType: {
        bb: [
          { required: true, message: '请输入设备类型名', trigger: 'blur' }
        ],
        bbb: [
          { required: true, message: '请选择检测项', trigger: 'blur' }
        ]
      },
      dialogVisible2: false,
      dialogVisible3: false,
      equipTypeName: '',
      options: [],
      formTestType: {
        bb: '',
        bbb: ''
      }
    }
  },
  created() {

  },
  methods: {
    async getList() {
      try {
        // const data = await material_quantity_url('get', { params: this.getParams })
      } catch (e) { throw new Error(e) }
    },
    changeSearch() {
      debounce(this, 'getList')
    },
    equipTypeSelect() {},
    editFun() {
      this.dialogVisible1 = true
    },
    addFun() {
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
      this.formData.aaa = val ? val.global_no : ''
    },
    submitEquip() {
      this.$refs.formEquip.validate((valid) => {
        if (valid) {
          try {
            // const data = await material_quantity_url('get', { params: this.getParams })
          } catch (e) { throw new Error(e) }
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
      this.$refs.formTestType.resetFields()
      if (done) {
        done()
      }
    },
    submitTestType() {

    },
    submitEquipType() {
      if (!this.equipTypeName) return this.$message.info('请输入设备类型名称')
    },
    clickEquipType(index, row) {
      this.dialogVisible3 = true
    },
    addTestType() {

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
