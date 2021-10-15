<template>
  <div class="equip-fault-signal">
    <!-- 设备故障信号定义 -->
    <el-form :inline="true" class="search-form-style">
      <el-form-item label="设备编号">
        <equip-select
          @equipSelected="equipSelected"
        />
      </el-form-item>
      <el-form-item label="设备名称">
        <el-input v-model="formInline.equip_name" clearable placeholder="设备名称" @input="changeSearch" />
      </el-form-item>
      <el-form-item label="信号名称">
        <el-input v-model="formInline.signal_name" clearable placeholder="信号名称" @input="changeSearch" />
      </el-form-item>
      <el-form-item label="报警是否停机">
        <el-select v-model="formInline.alarm_signal_down_flag" clearable placeholder="是否停机" @change="changeSearch">
          <el-option
            v-for="item in [{label:'Y',value:true},{label:'N',value:false}]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="故障是否停机">
        <el-select v-model="formInline.fault_signal_down_flag" clearable placeholder="是否停机" @change="changeSearch">
          <el-option
            v-for="item in [{label:'Y',value:true},{label:'N',value:false}]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否启用">
        <el-select v-model="formInline.use_flag" clearable placeholder="是否启用" @change="changeSearch">
          <el-option
            v-for="item in [{label:'Y',value:true},{label:'N',value:false}]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button type="primary" :loading="btnExportLoad" @click="exportTable">导出Excel</el-button>
        <el-upload
          style="margin:0 8px;display:inline-block"
          action="string"
          accept=".xls, .xlsx"
          :http-request="Upload"
          :show-file-list="false"
        >
          <el-button type="primary">导入Excel</el-button>
        </el-upload>
        <el-button type="primary" @click="onSubmit">新建</el-button>

      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      border
    >
      <el-table-column
        prop="signal_code"
        label="信号编号"
        min-width="20"
      />
      <el-table-column
        prop="signal_name"
        label="信号名称"
        min-width="20"
      />
      <el-table-column
        prop="equip_no"
        label="机台编号"
        min-width="20"
      />
      <el-table-column
        prop="equip_name"
        label="机台名称"
        min-width="20"
      />
      <el-table-column
        prop="equip_part_name"
        label="设备部位"
        min-width="20"
      />
      <el-table-column
        prop="equip_component_name"
        label="设备部件"
        min-width="20"
      />
      <el-table-column
        prop="signal_variable_name"
        label="信号变量名"
        min-width="20"
      />
      <el-table-column
        prop="signal_variable_type"
        label="信号数据类型"
        min-width="20"
      />
      <el-table-column
        prop="alarm_signal_minvalue"
        label="报警下限值"
        min-width="20"
      />
      <el-table-column
        prop="alarm_signal_maxvalue"
        label="报警上限值"
        min-width="20"
      />
      <el-table-column
        prop="alarm_signal_duration"
        label="报警持续时间（秒）"
        min-width="20"
      />
      <el-table-column
        prop="alarm_signal_down_flag"
        label="报警是否停机"
        min-width="20"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.alarm_signal_down_flag===true">Y</span>
          <span v-if="scope.row.alarm_signal_down_flag===false">N</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="alarm_signal_desc"
        label="报警停机描述"
        min-width="30"
      />
      <el-table-column
        prop="fault_signal_minvalue"
        label="故障下限值"
        min-width="20"
      />
      <el-table-column
        prop="fault_signal_maxvalue"
        label="故障上限值"
        min-width="20"
      />
      <el-table-column
        prop="fault_signal_duration"
        label="故障持续时间（秒）"
        min-width="20"
      />
      <el-table-column
        prop="fault_signal_down_flag"
        label="故障是否停机"
        min-width="20"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.fault_signal_down_flag===true">Y</span>
          <span v-if="scope.row.fault_signal_down_flag===false">N</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="fault_signal_desc"
        label="故障停机描述"
        min-width="30"
      />
      <el-table-column
        prop="use_flag"
        label="是否启用"
        min-width="20"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.use_flag===true">Y</span>
          <span v-if="scope.row.use_flag===false">N</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140px">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              size="mini"
              @click="showEditDialog(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              plain
              @click="handleDelete(scope.row)"
            >{{ scope.row.use_flag?'停用':'启用' }}
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="formInline.page"
      @currentChange="currentChange"
    />
    <el-dialog
      :title="`${dialogForm.id?'编辑':'新建'}设备故障信号定义`"
      :visible.sync="dialogVisible"
      width="900px"
      :before-close="handleClose"
    >
      <el-form
        ref="createForm"
        :rules="rules"
        label-width="150px"
        :model="dialogForm"
        :inline="true"
      >
        <el-form-item
          label="信号编号"
          prop="signal_code"
        >
          <el-input v-model="dialogForm.signal_code" :disabled="dialogForm.id?true:false" />
        </el-form-item>
        <el-form-item
          label="报警持续时间(S)"
          prop="alarm_signal_duration"
        >
          <el-input-number v-model="dialogForm.alarm_signal_duration" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item
          label="信号名称"
          prop="signal_name"
        >
          <el-input v-model="dialogForm.signal_name" />
        </el-form-item>
        <el-form-item
          label="报警是否停机"
          prop="alarm_signal_down_flag"
        >
          <el-select v-model="dialogForm.alarm_signal_down_flag" placeholder="请选择">
            <el-option
              v-for="item in [{value:true,label:'是'},{value:false,label:'否'}]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="机台编号"
          prop="equip"
        >
          <el-select v-model="dialogForm.equip" @change="editEquipName">
            <el-option
              v-for="item in options"
              :key="item.equip_no"
              :label="item.equip_no"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="报警停机描述"
          prop="alarm_signal_desc"
        >
          <el-input v-model="dialogForm.alarm_signal_desc" />
        </el-form-item>
        <el-form-item
          label="设备名称"
          prop="equip_name"
        >
          <el-input v-model="dialogForm.equip_name" disabled />
        </el-form-item>
        <el-form-item
          label="故障下限值"
          prop="fault_signal_minvalue"
        >
          <el-input-number v-model="dialogForm.fault_signal_minvalue" controls-position="right" :min="0" />
        </el-form-item>

        <el-form-item
          label="设备部位"
          prop="equip_part_name"
        >
          <el-input v-model="dialogForm.equip_part_name" disabled>
            <el-button slot="append" icon="el-icon-search" @click="dialog" />
          </el-input>
        </el-form-item>
        <el-form-item
          label="故障上限值"
          prop="fault_signal_maxvalue"
        >
          <el-input-number v-model="dialogForm.fault_signal_maxvalue" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item
          label="设备部件"
          prop="equip_component_name"
        >
          <el-input v-model="dialogForm.equip_component_name" placeholder="请输入内容" disabled>
            <el-button slot="append" icon="el-icon-search" @click="dialog1" />
          </el-input>
        </el-form-item>
        <el-form-item
          label="故障持续时间(S)"
          prop="fault_signal_duration"
        >
          <el-input-number v-model="dialogForm.fault_signal_duration" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item
          label="信号变量名"
          prop="signal_variable_name"
        >
          <el-input v-model="dialogForm.signal_variable_name" />
        </el-form-item>
        <el-form-item
          label="故障是否停机"
          prop="fault_signal_down_flag"
        >
          <el-select v-model="dialogForm.fault_signal_down_flag" placeholder="请选择">
            <el-option
              v-for="item in [{value:true,label:'是'},{value:false,label:'否'}]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="信号数据类型"
          prop="signal_variable_type"
        >
          <el-input v-model="dialogForm.signal_variable_type" />
        </el-form-item>
        <el-form-item
          label="故障停机描述"
          prop="fault_signal_desc"
        >
          <el-input v-model="dialogForm.fault_signal_desc" />
        </el-form-item>
        <el-form-item
          label="报警下限值"
          prop="alarm_signal_minvalue"
        >
          <el-input-number v-model="dialogForm.alarm_signal_minvalue" controls-position="right" :min="0" />
        </el-form-item>
        <br>
        <el-form-item
          label="报警上限值"
          prop="alarm_signal_maxvalue"
        >
          <el-input-number v-model="dialogForm.alarm_signal_maxvalue" controls-position="right" :min="0" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button type="primary" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="`设备部位`"
      :visible.sync="dialogVisible1"
      width="80%"
      :before-close="handleClose1"
    >
      <region
        ref="List"
        :equip-type="equipType1"
        :is-multiple="dialogVisible1"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose1(false)">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submitFun1">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="`设备部件`"
      :visible.sync="dialogVisible2"
      width="80%"
      :before-close="handleClose2"
    >
      <partsDefine
        ref="List1"
        :equip-type="equipType"
        :is-multiple="dialogVisible2"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose2(false)">取 消</el-button>
        <el-button type="primary" @click="submitFun2">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import page from '@/components/page'
import EquipSelect from '@/components/EquipSelect/index'
import region from './region'
import partsDefine from './parts-define'
import { getEquip } from '@/api/banburying-performance-manage'
import { equipFaultSignal, equipFaultSignalImport, equipFaultSignalDown } from '@/api/jqy'
export default {
  name: 'EquipmentMasterDataFaultSignal',
  components: { page, EquipSelect, region, partsDefine },
  data() {
    return {
      formInline: {},
      tableData: [],
      total: 0,
      options: [],
      equipType: {},
      equipType1: '',
      loading: false,
      btnExportLoad: false,
      dialogVisible: false,
      dialogVisible1: false,
      dialogVisible2: false,
      rules: {
        signal_code: [{ required: true, message: '不能为空', trigger: 'blur' }],
        equip: [{ required: true, message: '不能为空', trigger: 'blur' }],
        equip_name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        signal_name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        signal_variable_name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        signal_variable_type: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      dialogForm: {},
      btnLoading: false
    }
  },
  created() {
    this.getList()
    this.getList1()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await equipFaultSignal('get', null, { params: this.formInline })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async getList1() {
      const obj = { all: 1 }
      getEquip(obj).then(response => {
        this.options = response.results
      })
    },
    editEquipName(val) {
      this.dialogForm.category = this.options.filter(item => {
        return item.id === val
      })[0].category
      this.dialogForm.category_no = this.options.filter(item => {
        return item.id === val
      })[0].category__category_name
      this.dialogForm.equip_name = this.options.filter(item => {
        return item.id === val
      })[0].equip_name
    },
    changeSearch() {
      this.formInline.page = 1
      this.getList()
    },
    currentChange(page, pageSize) {
      this.formInline.page = page
      this.formInline.page_size = pageSize
      this.getList()
    },
    equipSelected(obj) {
      this.formInline.equip_no = obj || null
      this.getList()
    },
    onSubmit() {
      this.dialogForm = { signal_code: 'IO000X', fault_signal_down_flag: false, alarm_signal_down_flag: false }
      this.dialogVisible = true
    },
    Upload(param) {
      const formData = new FormData()
      formData.append('file', param.file)
      equipFaultSignalImport('post', null, { data: formData }).then(response => {
        this.$message({
          type: 'success',
          message: '导入成功!'
        })
        this.formInline.page = 1
        this.getList()
      })
    },
    exportTable() {
      this.btnExportLoad = true
      const obj = Object.assign({ export: 1 })
      const _api = equipFaultSignalDown
      _api(obj)
        .then(res => {
          const link = document.createElement('a')
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = '设备故障信号定义.xlsx' // 下载的文件名
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          this.btnExportLoad = false
        }).catch(e => {
          this.btnExportLoad = false
        })
    },
    showEditDialog(row) {
      this.dialogForm = JSON.parse(JSON.stringify(row))
      if (this.dialogForm.fault_signal_duration === null) {
        this.dialogForm.fault_signal_duration = undefined
      }
      if (this.dialogForm.fault_signal_minvalue === null) {
        this.dialogForm.fault_signal_minvalue = undefined
      }
      if (this.dialogForm.fault_signal_maxvalue === null) {
        this.dialogForm.fault_signal_maxvalue = undefined
      }
      if (this.dialogForm.alarm_signal_duration === null) {
        this.dialogForm.alarm_signal_duration = undefined
      }
      if (this.dialogForm.alarm_signal_minvalue === null) {
        this.dialogForm.alarm_signal_minvalue = undefined
      }
      if (this.dialogForm.alarm_signal_maxvalue === null) {
        this.dialogForm.alarm_signal_maxvalue = undefined
      }
      this.dialogVisible = true
    },
    dialog() {
      if (this.dialogForm.category_no) {
        this.equipType1 = this.dialogForm.category
        this.dialogVisible1 = true
      } else {
        this.$message.info('请先选择机台编号')
      }
    },
    dialog1() {
      if (this.dialogForm.equip_part_name) {
        this.equipType.category_no = this.dialogForm.category
        this.equipType.equip_part_name = this.dialogForm.equip_part
        this.dialogVisible2 = true
        console.log(this.equipType)
      } else {
        this.$message.info('请先选择设备部位')
      }
    },
    handleDelete: function(row) {
      var str = row.use_flag ? '停用' : '启用'
      this.$confirm('此操作将' + str + row.signal_name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        equipFaultSignal('delete', row.id, {})
          .then(response => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getList()
          })
      })
    },
    handleClose(done) {
      this.dialogVisible = false
      if (done) {
        done()
      }
    },
    handleClose1(done) {
      this.dialogVisible1 = false
      if (done) {
        done()
      }
    },
    handleClose2(done) {
      this.dialogVisible2 = false
      if (done) {
        done()
      }
    },
    submitFun() {
      this.$refs.createForm.validate(async(valid) => {
        if (valid) {
          try {
            this.btnLoading = true
            const _api = this.dialogForm.id ? 'put' : 'post'
            await equipFaultSignal(_api, this.dialogForm.id || null, { data: this.dialogForm })
            this.$message.success('操作成功')
            this.handleClose(null)
            this.getList()
            this.btnLoading = false
          } catch (e) {
            this.btnLoading = false
          }
        } else {
          return false
        }
      })
    },
    submitFun1() {
      this.dialogForm.equip_part = this.$refs['List'].getVal().id
      this.dialogForm.equip_part_name = this.$refs['List'].getVal().part_name
      this.handleClose1(null)
    },
    submitFun2() {
      this.dialogForm.equip_component = this.$refs['List1'].getVal().id
      this.dialogForm.equip_component_name = this.$refs['List1'].getVal().component_name
      this.handleClose2(null)
    }
  }
}
</script>

<style lang="scss">
.equip-fault-signal{
  .search-form-style{
    .el-input{
      width:120px;
    }
  }
  .el-dialog__wrapper .el-input{
    width:200px;
  }
  .el-input-number .el-input{
    width:auto;
  }
}
</style>
