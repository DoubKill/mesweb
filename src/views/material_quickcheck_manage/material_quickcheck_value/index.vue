<template>
  <div class="material_quickcheck_value">
    <!-- 检测值管理 -->
    <el-form :inline="true">
      <el-form-item label="原材料名称">
        <el-input v-model="search.material_name" placeholder="请输入" @input="changeSearch" />
      </el-form-item>
      <el-form-item label="样品名称">
        <el-input v-model="search.sample_name" placeholder="请输入" @input="changeSearch" />
      </el-form-item>
      <el-form-item label="检测类型">
        <testTypeSelect @typeSelect="typeSelect" />
      </el-form-item>
      <el-form-item label="批次">
        <el-input v-model="search.batch" placeholder="请输入" @input="changeSearch" />
      </el-form-item>
      <el-form-item label="产地">
        <el-input v-model="search.supplier_name" placeholder="请输入" @input="changeSearch" />
      </el-form-item>
      <el-form-item label="抽样人">
        <el-input v-model="search.sampling_username" placeholder="请输入" @input="changeSearch" />
      </el-form-item>
      <el-form-item label="记录人">
        <el-input v-model="search.recorder_username" placeholder="请输入" @input="changeSearch" />
      </el-form-item>
      <el-form-item label="复测">
        <el-select v-model="search.re_examine" clearable placeholder="请选择" @change="selectSearch">
          <el-option
            v-for="(item,i) in [{name:'是',label:true},{name:'否',label:false}]"
            :key="i"
            :label="item.name"
            :value="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否合格">
        <el-select v-model="search.qualified" clearable placeholder="请选择" @change="selectSearch">
          <el-option
            v-for="(item,i) in [{name:'是',label:true},{name:'否',label:false}]"
            :key="i"
            :label="item.name"
            :value="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button type="primary" @click="heardFun">表头过滤</el-button>
        <!-- <el-button type="primFary" @click="downloadFun">下载模板</el-button>
        <el-button type="primary" @click="leadingInFun">导入</el-button> -->
        <el-button
          v-permission="['material_examine_value','add']"
          type="primary"
          @click="addFun"
        >添加</el-button>
      </el-form-item>
    </el-form>

    <div class="titleColor">绿色行为同批次原材料最新检测记录</div>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      border
      :row-class-name="tableRowClassName"
      :cell-style="cellStyle"
    >
      <el-table-column
        prop="examine_date"
        label="检测日期"
        min-width="20"
      />
      <el-table-column
        prop="transport_date"
        label="收货日期"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="原材料名称"
        min-width="20"
      />
      <el-table-column
        prop="sample_name"
        label="样品名称"
        min-width="20"
      />
      <el-table-column
        prop="batch"
        label="批次"
        min-width="20"
      />
      <el-table-column
        prop="supplier"
        label="产地"
        min-width="20"
      />
      <el-table-column
        prop="sampling_username"
        label="抽样人"
        min-width="20"
      />
      <el-table-column
        prop="recorder_username"
        label="记录人"
        min-width="20"
      />
      <!-- 动态表头 -->
      <el-table-column
        v-for="(item,index) in heardListModel"
        :key="index"
        :label="item.name"
        min-width="20"
      >
        <template v-if="scope.row.single_examine_results.find(d=>d.type === item.id)" slot-scope="scope">
          <span
            :style="{'color':scope.row.single_examine_results.find(d=>d.type === item.id).mes_decide_qualified?'':'red'}"
          >
            {{ scope.row.single_examine_results.find(d=>d.type === item.id).value }}
          </span>
          <span v-if="scope.row.single_examine_results.find(d=>d.type === item.id).interval_type===4">
            {{ scope.row.single_examine_results.find(d=>d.type === item.id).mes_decide_qualified?'合格':'不合格' }}
          </span>
        </template>
      </el-table-column>
      <!-- 动态表头end -->
      <el-table-column
        prop="re_examine"
        label="复测"
        min-width="15"
      >
        <template slot-scope="scope">
          {{ scope.row.re_examine ? '是':'否' }}
        </template>
      </el-table-column>
      <el-table-column
        label="本次判定"
        min-width="15"
      >
        <template slot-scope="scope">
          {{ scope.row.qualified ? '合格':'不合格' }}
        </template>
      </el-table-column>
      <el-table-column
        label="同批次最新结果"
        min-width="15"
      >
        <template slot-scope="scope">
          {{ scope.row.sample_qualified ? '合格':'不合格' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="创建时间"
        min-width="20"
      />
      <el-table-column
        prop="update_time"
        label="更新时间"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="操作"
        width="200"
      >
        <template slot-scope="{row}">
          <el-button-group>
            <el-button
              v-permission="['material_examine_value','change']"
              size="mini"
              @click="editFun(row,true)"
            >编辑
            </el-button>
            <el-button
              v-permission="['material_examine_value','add']"
              size="mini"
              @click="editFun(row,false)"
            >添加同批次检测值
            </el-button>
          </el-button-group>
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
      :title="(formData.id?'编辑':'添加')+'检测值'"
      :visible.sync="dialogVisible"
      width="1200px"
      :before-close="handleClose"
    >
      <el-form ref="formData" inline :rules="rulesFormData" :model="formData" label-width="100px">
        <el-form-item label="检测日期" prop="examine_date">
          <el-date-picker
            v-model="formData.examine_date"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="收货日期" prop="transport_date">
          <el-date-picker
            v-model="formData.transport_date"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="原材料" prop="material">
          <el-select
            v-model="formData.material"
            placeholder="请选择"
            :disabled="formData.id||formData._copy?true:false"
            @visible-change="visibleChange"
            @change="changeMaterial"
          >
            <el-option
              v-for="item in optionsMaterial"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <el-button size="mini" type="primary" style="margin-left:5px" @click="addMaterialFun">添加原材料</el-button>
        </el-form-item>
        <el-form-item label="样品名称">
          {{ formData.sample_name }}
        </el-form-item>
        <el-form-item label="批次">
          {{ formData.batch }}
        </el-form-item>
        <el-form-item label="产地">
          {{ formData.supplier }}
        </el-form-item>
        <el-form-item label="抽样人" prop="sampling_user">
          <userMangeSelect :default-val="formData.sampling_user" :is-created="true" @changeSelect="changeSelectUser" />
          <el-checkbox v-model="formData.re_examine">复测</el-checkbox>
        </el-form-item>
        <!-- 待定\合格\不合格 -->
        <!-- <el-form-item label="是否合格">
          {{ formData._qualified }}
        </el-form-item> -->

        <div v-for="(item,index) in formData.single_examine_results" :key="index" class="dialogLevel">
          <div style="width:100%;height:0.5px;background:#DCDFE6;margin-bottom:25px" />
          <el-form-item
            label="检测类型"
            :prop="'single_examine_results.' + index + '.type'"
            :rules="{
              required: true, message: '不能为空', trigger: 'change',
            }"
          >
            <testTypeSelect
              :default-val="formData.single_examine_results[index].type"
              :is-created="true"
              @typeSelect="formTypeSelect($event,index)"
            />
            <el-checkbox
              v-if="formData.single_examine_results[index].interval_type===4"
              v-model="formData.single_examine_results[index].mes_decide_qualified"
              style="margin-left:10px"
            >合格</el-checkbox>
          </el-form-item>
          <el-form-item
            v-if="formData.single_examine_results[index].interval_type!==4"
            label="检测值"
            :prop="'single_examine_results.' + index + '.value'"
            :rules="{
              required: true, message: '不能为空', trigger: 'change'
            }"
          >
            <div style="display:flex">
              <el-input
                v-model="formData.single_examine_results[index].value"
                style=""
                placeholder="请输入"
                @input="rangeWatchFun($event,index)"
              />
              <span style="width:60px;text-align:right">
                {{ setqualified(formData.single_examine_results[index].mes_decide_qualified) }}
              </span>
            </div>
          </el-form-item>
          <el-form-item
            v-if="formData.single_examine_results[index].interval_type!==4"
            label="检测值设备"
            :prop="'single_examine_results.' + index + '.equipment'"
          >
            <!-- :rules="{
              required: true, message: '不能为空', trigger: 'change'
            }" -->
            <el-select
              v-model="formData.single_examine_results[index].equipment"
              placeholder="请选择"
              clearable
              @visible-change="visibleChangeExamine($event,formData.single_examine_results[index].type)"
            >
              <el-option
                v-for="itemExamine in optionsExamine"
                :key="itemExamine.id"
                :label="itemExamine.equip_name"
                :value="itemExamine.id"
              />
            </el-select>
          </el-form-item>

          <i v-if="formData.single_examine_results.length!==1" title="删除检测值" class="el-icon-remove-outline dialogIconDEL" @click="delClick(index)" />
          <i v-if="index===formData.single_examine_results.length-1" title="添加此检测值" class="el-icon-circle-plus-outline dialogIconAdd" @click="addClick" />
          <!-- <div style="width:100%;height:0.5px;background:#DCDFE6;margin-bottom:20px" /> -->
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="添加原材料"
      :visible.sync="dialogVisible1"
      width="600px"
      :before-close="handleClose1"
    >
      <el-form ref="formMaterial" inline :rules="rulesMaterial" :model="formMaterial" label-width="100px">
        <el-form-item label="原材料" prop="name">
          <el-input v-model="formMaterial.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="样品名称" prop="sample_name">
          <el-input v-model="formMaterial.sample_name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="批次" prop="batch">
          <el-input v-model="formMaterial.batch" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="产地" prop="supplier">
          <el-input v-model="formMaterial.supplier" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose1(false)">取 消</el-button>
        <el-button type="primary" :loading="materialBtnLoading" @click="submitMaterialFun">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="表头过滤"
      :visible.sync="dialogVisible2"
      width="600px"
    >
      <el-checkbox-group v-model="heardListModel">
        <el-checkbox v-for="item in heardList" :key="item.id" :label="item">{{ item.name }}</el-checkbox>
      </el-checkbox-group>
    </el-dialog>
  </div>
</template>

<script>
import { debounce } from '@/utils'
import page from '@/components/page'
import { materialExamineResult, materialExamineType, materialEquipment } from '@/api/base_w_three'
import testTypeSelect from '../components/test-type-select'
// import equipTypeSelect from '../components/equip-type-select'
import userMangeSelect from '@/components/select_w/userMangeSelect'
import { examineMaterial, examineMaterialPost } from '@/api/material-check'
export default {
  components: { page, testTypeSelect, userMangeSelect },
  data() {
    return {
      search: {
        page: 1
      },
      tableData: [],
      dialogVisible: false,
      rulesFormData: {
        examine_date: [
          { required: true, message: '请选择时间', trigger: 'change' }
        ],
        transport_date: [
          { required: true, message: '请选择时间', trigger: 'change' }
        ],
        material: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        sampling_user: [
          { required: true, message: '请选择', trigger: 'blur' }
        ]
      },
      formData: {},
      optionsMaterial: [],
      optionsTestType: [],
      optionsExamine: [],
      formMaterial: {
        name: '',
        sample_name: '',
        batch: '',
        supplier: ''
      },
      rulesMaterial: {
        name: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        sample_name: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        batch: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        supplier: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      },
      dialogVisible1: false,
      dialogVisible2: false,
      heardList: [],
      heardListModel: [],
      total: 0,
      loading: false,
      btnLoading: false,
      materialBtnLoading: false
    }
  },

  created() {
    this.clearVal()
    this.getHeadList()
    this.getList()
    this.getexamineMaterial()
    this.getExamine()
  },

  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await materialExamineResult('get', null, { params: this.search })
        this.tableData = data.results
        this.total = data.count
        this.loading = false
      } catch (e) { this.loading = false }
    },
    currentChange(page, pageSize) {
      this.search.page = page
      this.search.page_size = pageSize
      this.getList()
    },
    heardFun() {
      this.dialogVisible2 = true
    },
    async getHeadList() {
      try {
        const equip_type_list = await materialExamineType('get', null, {
          params: { all: 1 }
        })
        this.heardListModel = equip_type_list.results.slice(0, 3) || []
        this.heardList = equip_type_list.results || []
      } catch (e) { throw new Error(e) }
    },
    downloadFun() {},
    leadingInFun() {},
    editFun(row, bool) {
      this.formData = JSON.parse(JSON.stringify(row))
      this.formData._copy = false
      if (!bool) {
        this.formData._copy = true
        delete this.formData.id
      }
      this.dialogVisible = true
    },
    addFun() {
      if (this.$refs.formData) {
        this.$refs.formData.clearValidate()
      }
      this.dialogVisible = true
    },
    changeSearch() {
      this.search.page = 1
      debounce(this, 'getList')
    },
    selectSearch() {
      this.search.page = 1
      this.getList()
    },
    handleClose(done) {
      this.dialogVisible = false
      this.$refs.formData.clearValidate()

      this.clearVal()
      this.getExamine()

      if (done) {
        done()
      }
    },
    clearVal() {
      this.formData = {
        examine_date: '',
        transport_date: '',
        material: '',
        sample_name: '',
        batch: '',
        supplier: '',
        sampling_user: '',
        re_examine: false,
        _qualified: '待定',
        single_examine_results: [{
          type: '',
          value: null,
          equipment: ''
        }] }
    },
    submitFun() {
      this.$refs.formData.validate(async(valid) => {
        if (valid) {
          try {
            const obj = JSON.parse(JSON.stringify(this.formData))
            const _api = this.formData.id ? 'patch' : 'post'
            this.btnLoading = true

            await materialExamineResult(_api, this.formData.id || '', { data: obj })
            this.handleClose(false)
            this.btnLoading = false
            this.$message.success('操作成功')
            this.getList()
          } catch (e) {
            this.btnLoading = false
          }
        } else {
          return false
        }
      })
    },
    addMaterialFun() {
      this.dialogVisible1 = true
    },
    handleClose1(done) {
      this.dialogVisible1 = false
      this.$refs.formMaterial.resetFields()
      if (done) {
        done()
      }
    },
    submitMaterialFun() {
      this.$refs.formMaterial.validate(async(valid) => {
        if (valid) {
          try {
            const obj = JSON.parse(JSON.stringify(this.formMaterial))
            this.materialBtnLoading = true
            await examineMaterialPost(obj)
            this.materialBtnLoading = false
            this.$message.success('操作成功')
            this.handleClose1()
          } catch (e) {
            this.materialBtnLoading = false
          }
        } else {
          return false
        }
      })
    },
    typeSelect(val) {
      this.search.type_id = val ? val.id : ''
      this.search.page = 1
      this.getList()
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.is_latest) {
        return 'warning-row'
      }
      return ''
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (!row.qualified && column.label === '本次判定') {
        return 'background: red;color:#fff'
      }
      if (!row.sample_qualified && column.label === '同批次最新结果') {
        return 'background: red;color:#fff'
      }
    },
    formTypeSelect(val, index) {
      this.$set(this.formData.single_examine_results[index], 'type', val ? val.id : '')
      this.$set(this.formData.single_examine_results[index], 'equipment', '')
      this.$set(this.formData.single_examine_results[index], 'qualified_range', val && val.qualified_range ? val.qualified_range : [])
      this.$set(this.formData.single_examine_results[index], 'interval_type', val && val.interval_type ? val.interval_type : '')
    },
    dialogEquipTypeSelect(val, index) {
      this.$set(this.formData.single_examine_results[index], 'equipment', val ? val.id : '')
    },
    async visibleChange(bool) {
      if (bool) {
        this.getexamineMaterial()
      }
    },
    async getexamineMaterial() {
      try {
        const data = await examineMaterial({ all: 1 })
        this.optionsMaterial = data.results
      } catch (e) {
        //
      }
    },
    async getExamine(type) {
      try {
        const data = await materialEquipment('get', null, { params: { examine_type: type, all: 1 }})
        this.optionsExamine = data.results
      } catch (e) {
        //
      }
    },
    visibleChangeExamine(bool, type) {
      if (bool) {
        this.getExamine(type)
      }
    },
    changeSelectUser(obj) {
      this.$set(this.formData, 'sampling_user', obj ? obj.id : '')
    },
    rangeWatchFun(val, index) {
      const a = Number(val)
      const _range = this.formData.single_examine_results[index].qualified_range
      const b = _range[0] === 0 || _range[0] ? _range[0] : -Infinity
      const c = _range[1] === 0 || _range[1] ? _range[1] : Infinity

      if (_range) {
        if ((b <= a && a <= c) || (b >= a && a >= c)) {
          this.formData.single_examine_results[index].mes_decide_qualified = true
        } else {
          this.formData.single_examine_results[index].mes_decide_qualified = false
        }
      } else {
        this.formData.single_examine_results[index].mes_decide_qualified = null
      }
    },
    changeMaterial(id) {
      const obj = this.optionsMaterial.find(d => d.id === id)
      this.formData.sample_name = obj.sample_name
      this.formData.batch = obj.batch
      this.formData.supplier = obj.supplier
    },
    delClick(i) {
      this.formData.single_examine_results.splice(i, 1)
    },
    addClick() {
      this.formData.single_examine_results.push({
        type: '',
        value: null,
        equipment: ''
      })
    },
    setqualified(val) {
      if (val === true) {
        return '合格'
      } else if (val === false) {
        return '不合格'
      } else if (val === null) {
        return '待定'
      }
    }
  }
}
</script>

<style lang='scss'>
.material_quickcheck_value{

.titleColor{
  clear:both;padding:10px;border:1px solid #eee;width:250px;background:#0dbd0bb0;color:#fff
}
.dialogLevel{
  position:relative;
  .dialogIconAdd{
    position:absolute;
    font-size:30px;
    bottom:27px;
    margin-left:20px;
    cursor: pointer;
  }
  .dialogIconDEL{
    position:absolute;
    font-size:30px;
    bottom:27px;
    margin-left:60px;
    cursor: pointer;
  }
}
.el-table tbody tr:hover>td {
    background-color:transparent
}
.warning-row{
  background:#0dbd0bb0;
  color:#fff;
}

}
</style>
