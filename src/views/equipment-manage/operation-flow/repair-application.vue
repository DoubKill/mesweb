<template>
  <div class="repair-manage-style">
    <!-- 报修申请 -->
    <el-form :inline="true">
      <el-form-item label="报修编号">
        <el-input
          v-model="search.plan_id"
          style="width:200px"
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item label="报修部门">
        <el-select
          v-model="search.plan_department"
          style="width:150px"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in options1"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="机台">
        <equip-select
          style="width:150px"
          @equipSelected="equipSelected"
        />
      </el-form-item>
      <el-form-item label="故障原因">
        <el-input
          v-model="search.result_fault_cause"
          style="width:200px"
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item label="设备条件">
        <el-select
          v-model="search.equip_condition"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in ['停机','不停机']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="重要程度">
        <el-select
          v-model="search.importance_level"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in ['高','中','低']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="dialog(false,'新建报修申请')">新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      row-key="id"
      border
    >
      <el-table-column
        prop="plan_id"
        label="报修编号"
        min-width="20"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="dialog(scope.row,'报修申请详情')"
          >{{ scope.row.plan_id }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="plan_department"
        label="报修部门"
        min-width="20"
      />
      <el-table-column
        prop="equip_no"
        label="机台"
        min-width="20"
      />
      <el-table-column
        prop="part_name"
        label="部位名称"
        min-width="20"
      />
      <el-table-column
        prop="result_fault_cause_name"
        label="故障原因"
        min-width="20"
      />
      <el-table-column
        prop="result_fault_desc"
        label="故障描述"
        min-width="20"
      />
      <el-table-column
        prop="equip_condition"
        label="设备条件"
        min-width="20"
      />
      <el-table-column
        prop="importance_level"
        label="重要程度"
        min-width="20"
      />
      <el-table-column
        prop="plan_source"
        label="来源"
        min-width="20"
      />
      <el-table-column
        prop="status"
        label="状态"
        min-width="20"
      />
      <el-table-column
        prop="created_username"
        label="报修人"
        min-width="20"
      />
      <el-table-column
        prop="created_date"
        label="报修时间"
        width="160"
      />
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />

    <el-dialog
      :title="operateType"
      :visible.sync="dialogVisible"
      width="600"
      :before-close="handleClose"
    >
      <el-form
        ref="ruleFormHandle"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="设备条码" prop="equip_barcode">
          <el-input
            v-model="ruleForm.equip_barcode"
            :disabled="operateType==='报修申请详情'"
            style="width:250px"
            @input="searchBom"
          >
            <el-button
              slot="append"
              :disabled="operateType==='报修申请详情'"
              icon="el-icon-search"
              @click="Add1"
            />
          </el-input>
        </el-form-item>
        <el-form-item label="设备名称" prop="factory_name">
          <el-input
            v-model="ruleForm.factory_name"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="报修部门" prop="plan_department">
          <el-select
            v-model="ruleForm.plan_department"
            :disabled="operateType==='报修申请详情'"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in options1"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="故障发生时间" prop="fault_datetime">
          <el-date-picker
            v-model="ruleForm.fault_datetime"
            :disabled="operateType==='报修申请详情'"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="机台" prop="equip_no">
          <equip-select
            :is-create="true"
            :default-val="ruleForm.equip_no"
            style="width:200px"
            :is-disabled="operateType==='报修申请详情'||disable"
            @equipSelected="equipSelected1"
          />
        </el-form-item>
        <el-form-item label="设备部位" prop="equip_part_new">
          <el-select v-model="ruleForm.equip_part_new" :disabled="operateType==='报修申请详情'||disable" placeholder="请选择" clearable @visible-change="getEquipPart">
            <el-option
              v-for="item in options2"
              :key="item.id"
              :label="item.part_name"
              :value="item.part"
            />
          </el-select>
          <!-- <el-input
            v-model="ruleForm.part_name"
            :disabled="true"
            style="width:200px"
          /> -->
          <el-link v-if="ruleForm.equip_condition==='停机'&&ruleForm.id" style="margin-left:10px" type="warning">已停机</el-link>
          <el-link v-if="ruleForm.id&&ruleForm.equip_condition==='不停机'" style="margin-left:10px">不停机</el-link>
          <el-checkbox v-if="!ruleForm.id" v-model="ruleForm.equip_condition" :disabled="operateType==='报修申请详情'" style="margin-left:10px">已停机</el-checkbox>
        </el-form-item>
        <el-form-item label="故障原因" prop="result_fault_cause_name">
          <el-input
            v-model="ruleForm.result_fault_cause_name"
            :disabled="true"
            style="width:250px"
          >
            <el-button
              slot="append"
              :disabled="operateType==='报修申请详情'"
              icon="el-icon-search"
              @click="Add"
            />
          </el-input>
        </el-form-item>
        <el-form-item label="重要程度">
          <el-radio-group v-model="ruleForm.importance_level" :disabled="operateType==='报修申请详情'">
            <el-radio label="高">高</el-radio>
            <el-radio label="中">中</el-radio>
            <el-radio label="低">低</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="故障描述" prop="result_fault_desc">
          <el-input
            v-model="ruleForm.result_fault_desc"
            :disabled="operateType==='报修申请详情'"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
        <el-form-item label="上传图片">
          <el-upload
            v-if="operateType!=='报修申请详情'"
            ref="elUploadImg"
            action=""
            :auto-upload="false"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-change="onChangeImg"
            :on-exceed="onExceed"
            :limit="5"
          >
            <i class="el-icon-plus" />
          </el-upload>
          <template v-for="(item, index) in ruleForm.apply_repair_graph_url">
            <el-image
              v-if="operateType==='报修申请详情'&&ruleForm.apply_repair_graph_url.length>0"
              :key="index"
              style="width: 100px; height: 100px"
              :src="item"
              :preview-src-list="[item]"
            />
          </template>
          <div v-if="operateType==='报修申请详情'&&ruleForm.apply_repair_graph_url.length===0">
            暂无图片
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button v-if="operateType==='新建报修申请'" :loading="btnLoading" type="primary" @click="addSubmitFun">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="`故障原因`"
      :visible.sync="dialogVisible1"
      width="80%"
      :before-close="handleClose1"
    >
      <fault-classify
        ref="List"
        :is-dialog="true"
        :show="dialogVisible1"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose1(false)">取 消</el-button>
        <el-button type="primary" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="`设备部位选择`"
      :visible.sync="dialogVisible2"
      width="80%"
      :before-close="handleClose2"
    >
      <el-form :inline="true">
        <el-form-item label="所属主设备种类">
          <el-select v-model="formInline.equip_type" placeholder="请选择" clearable @change="changeSearch1">
            <el-option
              v-for="item in options"
              :key="item.category_no"
              :label="item.category_no"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部位分类">
          <el-select v-model="formInline.part_type" placeholder="请选择" clearable @change="changeSearch1">
            <el-option
              v-for="item in GlobalList"
              :key="item.global_name"
              :label="item.global_name"
              :value="item.global_name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部位代码">
          <el-input v-model="formInline.part_code" clearable placeholder="部位代码" @input="changeSearch1" />
        </el-form-item>
        <el-form-item label="部位名称">
          <el-input v-model="formInline.part_name" clearable placeholder="部位名称" @input="changeSearch1" />
        </el-form-item>
      </el-form>
      <el-table
        ref="singleTable"
        v-loading="loading1"
        :data="tableData1"
        highlight-current-row
        row-key="id"
        style="width: 100%"
        border
        @current-change="handleSelectionChange"
      >
        <el-table-column
          prop="equip_type"
          label="所属主设备种类"
          min-width="20"
        />
        <el-table-column
          prop="part_type"
          label="部位分类"
          min-width="20"
        />
        <el-table-column
          prop="equip_no"
          label="机台编号"
          min-width="20"
        />
        <el-table-column
          prop="node_id"
          label="部位条码"
          min-width="20"
        />
        <el-table-column
          prop="part_code"
          label="部位代码"
          min-width="20"
        />
        <el-table-column
          prop="part_name"
          label="部位名称"
          min-width="20"
        />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose2(false)">取 消</el-button>
        <el-button type="primary" @click="submitFun1">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import EquipSelect from '@/components/EquipSelect'
import FaultClassify from '../master-data/fault-classify'
import { sectionTree } from '@/api/base_w_four'
import page from '@/components/page'
import { equipBom } from '@/api/base_w_four'
import { debounce } from '@/utils'
import { equipApplyRepair, equipsCategory, getSupplierType, uploadImages } from '@/api/jqy'
import { mapGetters } from 'vuex'
import { checkPermission } from '@/utils'
export default {
  name: 'EquipmentRepair',
  components: { EquipSelect, page, FaultClassify },
  data() {
    return {
      options: [],
      options1: [],
      options2: [],
      disable: false,
      btnLoading: false,
      GlobalList: [],
      search: {},
      formInline: { level: 4 },
      loading: true,
      loading1: true,
      tableData: [],
      tableData1: [],
      dialogVisible: false,
      dialogVisible1: false,
      dialogVisible2: false,
      total: 0,
      multipleSelection: [],
      ruleForm: {},
      rules: {
        plan_department: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        fault_datetime: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        equip_no: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        result_fault_cause_name: [
          { required: true, message: '不能为空', trigger: 'change' }
        ]
      },
      dialogVisibleImg: false,
      dialogImageUrl: '',
      operateType: ''
    }
  },
  computed: {
    ...mapGetters([
      'userId'
    ])
  },
  created() {
    this.getList()
    this.getSection()
  },
  methods: {
    checkPermission,
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    async getSection() {
      try {
        const data = await sectionTree('get', null, { params: { all: 1 }})
        this.options1 = data.results || []
      } catch (e) {
        //
      }
    },
    async getEquipPart(val) {
      if (val) {
        if (this.ruleForm.equip_no) {
          try {
            const data = await equipBom('get', null, { params: { evel: 4, equip_info: this.ruleForm.equip_id, part__use_flag: true }})
            this.options2 = data || []
          } catch (e) {
            //
          }
        } else {
          this.options2 = []
          this.$message.info('请先选择机台')
        }
      }
    },
    searchBom() {
      debounce(this, 'searchBom1')
    },
    async searchBom1() {
      try {
        const data = await equipBom('get', null, { params: { level: 4, node_id: this.ruleForm.equip_barcode }})
        if (data.length > 0) {
          const data1 = await equipBom('get', null, { })
          this.options2 = data1 || []
          this.ruleForm.equip_no = data[0].equip_no
          this.ruleForm.factory_name = data[0].equip_name
          this.ruleForm.equip_part_new = data[0].part
          this.ruleForm.part_name = data[0].part_name
          this.disable = true
        } else {
          this.ruleForm.equip_barcode = ''
          this.ruleForm.equip_no = ''
          this.ruleForm.factory_name = ''
          if (this.ruleForm.equip_part_new) {
            this.ruleForm.equip_part_new = ''
          }
          this.ruleForm.part_name = ''
          this.disable = false
        }
      } catch (e) {
        //
      }
    },
    async getTypeNode() {
      try {
        const data = await equipsCategory('get', null, { params: { all: 1 }})
        this.options = data.results || []
      } catch (e) {
        //
      }
    },
    async getGlobal() {
      try {
        const data = await getSupplierType('get', null, { params: { all: 1, class_name: '部位分类' }})
        this.GlobalList = data.results
      } catch (error) {
        this.GlobalList = []
      }
    },
    debounceList() {
      debounce(this, 'changeSearch')
    },
    changeSearch() {
      this.search.page = 1
      this.tableData = []
      this.getList()
    },
    changeSearch1() {
      this.getList1()
    },
    async getList() {
      try {
        this.loading = true
        const data = await equipApplyRepair('get', null, { params: this.search })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async getList1() {
      try {
        this.loading1 = true
        const data = await equipBom('get', null, { params: this.formInline })
        this.tableData1 = data || []
        this.loading1 = false
      } catch (e) {
        this.loading1 = false
      }
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    },
    handleClose(done) {
      if (this.$refs.elUploadImg) {
        this.$refs.elUploadImg.clearFiles()
      }
      this.$refs.ruleFormHandle.clearValidate()
      this.dialogVisible = false
      this.disable = false
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
    Add() {
      this.dialogVisible1 = true
    },
    Add1() {
      this.dialogVisible2 = true
      this.getTypeNode()
      this.getGlobal()
      this.getList1()
    },
    submitFun() {
      if (this.$refs['List'].currentObj === null) {
        this.$refs['List'].currentObj = {}
      }
      if (this.$refs['List'].currentObj.fault_name) {
        this.ruleForm.result_fault_cause_name = this.$refs['List'].currentObj.fault_name
        this.ruleForm.result_fault_cause = this.$refs['List'].currentObj.id
        this.dialogVisible1 = false
      } else {
        this.$message.info('请选择一种原因')
      }
    },
    async submitFun1() {
      if (this.multipleSelection.length === 0) {
        this.$message.info('请选择一条数据')
      } else {
        const data = await equipBom('get', null, { })
        this.options2 = data || []
        this.ruleForm.equip_barcode = this.multipleSelection.node_id
        this.ruleForm.equip_no = this.multipleSelection.equip_no
        this.ruleForm.factory_name = this.multipleSelection.equip_name
        this.ruleForm.equip_part_new = this.multipleSelection.part
        this.ruleForm.part_name = this.multipleSelection.part_name
        this.disable = true
        this.dialogVisible2 = false
      }
    },
    async dialog(row, type) {
      if (row === false) {
        let dateTime = ''
        const yy = new Date().getFullYear()
        const mm = new Date().getMonth() + 1
        const dd = new Date().getDate()
        const hh = new Date().getHours()
        const mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
        const ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
        dateTime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
        this.operateType = type
        this.ruleForm = {
          fault_datetime: dateTime,
          image_url_list: [],
          importance_level: '高'
        }
      } else {
        const data = await equipBom('get', null, { })
        this.options2 = data || []
        this.operateType = type
        this.ruleForm = JSON.parse(JSON.stringify(row))
      }
      this.dialogVisible = true
    },
    equipSelected(obj) {
      this.$set(this.search, 'equip_no', obj ? obj.equip_no : '')
      this.changeSearch()
    },
    equipSelected1(obj) {
      this.$set(this.ruleForm, 'equip_no', obj ? obj.equip_no : '')
      this.$set(this.ruleForm, 'equip_id', obj ? obj.id : '')
      if (this.ruleForm.equip_part_new) {
        this.ruleForm.equip_part_new = ''
      }
    },
    onExceed() {
      this.$message.info('最多上传五张图片')
    },
    async onChangeImg(file, fileList) {
      const isJPG = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.raw.type)
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 jpeg、jpg 、png格式!')
        fileList.pop()
        return
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        fileList.pop()
        return
      }
      const picture = new FormData()
      picture.append('image_file_name', file.raw)
      picture.append('source_type', '维修')
      const data = await uploadImages('post', null, { data: picture })
      this.ruleForm.image_url_list.push(data.image_file_name)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
    },
    async addSubmitFun() {
      delete this.ruleForm.apply_repair_graph_url
      if (this.ruleForm.equip_condition === true) {
        this.ruleForm.equip_condition = '停机'
      } else {
        this.ruleForm.equip_condition = '不停机'
      }
      this.$refs.ruleFormHandle.validate(async(valid) => {
        if (valid) {
          try {
            this.btnLoading = true
            await equipApplyRepair('post', null, { data: this.ruleForm })
            this.$message.success('操作成功')
            this.handleClose(null)
            this.getList()
            this.btnLoading = false
            this.disable = false
          } catch (e) {
            this.btnLoading = false
            this.disable = false
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
.repair-manage-style{
  .el-button--mini{
        padding: 5px 7px;
  }
  .el-dialog__body{
        padding:12px 16px 0 !important;
  }
}

</style>
