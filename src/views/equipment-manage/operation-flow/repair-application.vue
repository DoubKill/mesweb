<template>
  <div class="repair-manage-style">
    <!-- 报修申请 -->
    <el-form :inline="true">
      <el-form-item label="报修编号">
        <el-input
          v-model="search.equip_no"
          style="width:200px"
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item label="保修部门">
        <el-select
          v-model="search.jg"
          style="width:150px"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in ['生产','工艺','设备']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="机台" prop="equip_no">
        <equip-select
          style="width:150px"
          equip-type="密炼设备"
          @equipSelected="equipSelected"
        />
      </el-form-item>
      <el-form-item label="故障原因">
        <el-input
          v-model="search.equi"
          style="width:200px"
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item label="设备条件">
        <el-select
          v-model="search.jg1"
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
          v-model="search.jg2"
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
      :data="tableData"
      row-key="id"
      borde
    >
      <el-table-column
        prop="date"
        label="报修编号"
        min-width="20"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="dialog(scope.row,'报修申请详情')"
          >{{ scope.row.date }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="date"
        label="报修部门"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="机台"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="部位名称"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="故障原因"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="故障描述"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="设备条件"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="重要程度"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="报修人"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="报修时间"
        min-width="20"
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
        <el-form-item label="设备条码">
          <el-input
            v-model="ruleForm.material_name"
            :disabled="operateType==='报修申请详情'"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="设备名称">
          <el-input
            v-model="ruleForm.material_name"
            :disabled="operateType==='报修申请详情'"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item style="" label="报修部门" prop="warehouse">
          <el-select
            v-model="ruleForm.mater"
            :disabled="operateType==='报修申请详情'"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in options"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="故障发生时间" prop="down_time">
          <el-date-picker
            v-model="ruleForm.down_time"
            :disabled="operateType==='报修申请详情'"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="机台" prop="equip_no">
          <equip-select
            equip-type="密炼设备"
            :is-disabled="operateType==='报修申请详情'"
            :is-multiple="true"
            :default-val="ruleForm.equip_no"
            @equipSelected="equipSelected"
          />
        </el-form-item>
        <el-form-item label="设备部位" prop="equip_part">
          <locationDefinitionDelect :is-disabled="operateType==='报修申请详情'" :is-created="true" :equip-no="ruleForm.equip_no" :default-val="ruleForm.equip_part" @locationSelect="locationSelect" />
          <el-link v-if="ruleForm.down_flag&&ruleForm.id" style="margin-left:10px" type="warning">已停机</el-link>
          <el-link v-if="ruleForm.id&&!ruleForm.down_flag" style="margin-left:10px">未停机</el-link>
          <el-checkbox v-if="!ruleForm.id" v-model="ruleForm.down_flag" :disabled="operateType==='报修申请详情'" style="margin-left:10px">已停机</el-checkbox>
        </el-form-item>
        <el-form-item label="停机原因">
          <el-input
            v-model="ruleForm.material_name"
            :disabled="operateType==='报修申请详情'"
            style="width:250px"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
            />
          </el-input>
        </el-form-item>
        <el-form-item label="重要程度">
          <el-radio-group v-model="ruleForm.feed" :disabled="operateType==='报修申请详情'">
            <el-radio label="1">高</el-radio>
            <el-radio label="2">中</el-radio>
            <el-radio label="3">低</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="故障描述" prop="note">
          <el-input
            v-model="ruleForm.note"
            :disabled="operateType==='报修申请详情'"
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
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
            :limit="1"
          >
            <i class="el-icon-plus" />
          </el-upload>
          <el-image
            v-else
            style="width: 100px; height: 100px"
            :src="ruleForm.image"
            :preview-src-list="[ruleForm.image]"
          >
            <div slot="error" class="image-slot">
              暂无图片
            </div>
          </el-image>
          <el-dialog :visible.sync="dialogVisibleImg" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button v-if="operateType==='新建报修申请'" type="primary" @click="addSubmitFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import EquipSelect from '@/components/EquipSelect'
import page from '@/components/page'
import locationDefinitionDelect from '../../equipment-management/components/location-definition-select'
import { equipMaintenanceOrder } from '@/api/base_w_two'
import { mapGetters } from 'vuex'
import { checkPermission } from '@/utils'
export default {
  name: 'EquipmentRepair',
  components: { EquipSelect, locationDefinitionDelect, page },
  data() {
    const validator = (rule, value, callback, _value, str) => {
      if (!_value && !value) {
        callback(new Error(str))
      } else {
        callback()
      }
    }
    return {
      options: ['巡检', '保养', '生产', '其他'],
      search: {
        page: 1,
        page_size: 10
      },
      loading: true,
      tableData: [{ date: '1' }],
      dialogVisible: false,
      total: 0,
      ruleForm: {
        down_time: '',
        first_down_type: '',
        image: null,
        first_down_reason: '',
        equip_part: '',
        equip_no: '',
        down_flag: false
      },
      rules: {
        down_time: [
          { required: true, message: '请选择故障时间', trigger: 'blur' }
        ],
        equip_no: [
          { required: true, trigger: 'blur', validator: (rule, value, callback) => {
            validator(rule, value, callback,
              this.ruleForm.equip_no, '请选择设备')
          }
          }
        ],
        equip_part: [
          { required: true, trigger: 'blur', validator: (rule, value, callback) => {
            validator(rule, value, callback,
              this.ruleForm.equip_part, '请选择设备部位')
          } }
        ],
        first_down_type: [
          { required: true, trigger: 'blur', validator: (rule, value, callback) => {
            validator(rule, value, callback,
              this.ruleForm.first_down_type, '请选择停机类型')
          } }
        ],
        first_down_reason: [{ required: true, trigger: 'blur', validator: (rule, value, callback) => {
          validator(rule, value, callback,
            this.ruleForm.first_down_reason, '请选择原因')
        } }]
      },
      dialogVisibleImg: false,
      dialogImageUrl: '',
      operateType: '',
      currentObj: {},
      // 指派给谁
      maintenance_user: ''
    }
  },
  computed: {
    ...mapGetters([
      'userId'
    ])
  },
  created() {
    // this.getList()
  },
  methods: {
    checkPermission,
    changeSearch() {

    },
    async getList() {
      try {
        this.loading = true
        const data = await equipMaintenanceOrder('get', null, { params: this.search })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changeList() {
      this.search.page = 1
      this.tableData = []
      this.getList()
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
      // this.$refs.ruleFormHandle.resetFields()
      this.$refs.ruleFormHandle.clearValidate()
      this.dialogVisible = false
      if (done) {
        done()
      }
    },
    dialog(row, type) {
      this.operateType = type
      this.ruleForm = {
        down_time: '',
        first_down_type: '',
        image: null,
        first_down_reason: '',
        equip_part: '',
        equip_no: '',
        down_flag: false
      }
      this.dialogVisible = true
    },
    locationSelect(obj) {
      this.ruleForm.equip_part = obj ? obj.id : ''
    },
    equipSelected(obj) {
      this.$set(this.ruleForm, 'equip_no', obj ? obj.equip_no : '')
      this.$set(this.ruleForm, 'equip_part', '')
    },
    shutdownMoldChange(obj) {
      this.ruleForm.first_down_reason = ''
      this.$set(this.ruleForm, 'first_down_type', obj ? obj.name : '')
    },
    shutdownReasonChange(obj) {
      this.$set(this.ruleForm, 'first_down_reason', obj ? obj.desc : '')
    },
    changeSelectUser(obj, row) {
      this.maintenance_user = obj ? obj.id : ''
    },
    submitUser(row) {
      row.visible = false
      if (!this.maintenance_user) {
        return
      }
      equipMaintenanceOrder('put', row.id, { data: { maintenance_user: this.maintenance_user, status: 2 }})
        .then(response => {
          this.$message({
            type: 'success',
            message: '指派成功!'
          })
          this.changeList()
        }).catch(e => {
          this.$message.error('指派失败')
        })
    },
    onExceed() {
      this.$message.info('最多上传一张图片')
    },
    onChangeImg(file, fileList) {
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
      this.$set(this.ruleForm, 'image', file.raw)
    },
    sendFun() {

    },
    claimFun(row, str, status) {
      this.$confirm('是否确定' + str + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        equipMaintenanceOrder('put', row.id, { data: { status: status }})
          .then(response => {
            this.$message({
              type: 'success',
              message: str + '成功!'
            })
            this.changeList()
          }).catch(e => {
            this.$message.error(str + '失败!')
          })
      })
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisibleImg = true
    },
    async addSubmitFun() {
      try {
        const formData = new FormData()
        let _api = ''
        if (this.operateType === '申请维修') {
          formData.append('image', this.ruleForm.image || '')
          _api = 'post'
        } else {
          _api = 'put'
        }
        if (this.operateType === '故障原因') {
          formData.append('down_reason', this.ruleForm.down_reason || '')
        }
        this.$refs['ruleFormHandle'].validate(async(valid) => {
          if (valid) {
            formData.append('down_time', this.ruleForm.down_time)
            formData.append('equip_no', this.ruleForm.equip_no)
            formData.append('equip_part', this.ruleForm.equip_part)
            formData.append('first_down_reason', this.ruleForm.first_down_reason)
            formData.append('first_down_type', this.ruleForm.first_down_type)
            formData.append('down_flag', this.ruleForm.down_flag || '')
            formData.append('note', this.ruleForm.note || '')
            await equipMaintenanceOrder(_api, this.ruleForm.id || null, { data: formData })
            this.$message.success('操作成功')
            this.handleClose(false)
            this.getList()
          } else {
            return false
          }
        })
      } catch (e) {
        //
      }
    },
    usedTypeFormatter(row) {
      switch (row.status) {
        case 1:
          return '申请维修'
        case 2:
          return '就绪'
        case 3:
          return '开始维修'
        case 4:
          return '维修结束'
        case 5:
          return '确认完成'
        case 6:
          return '关闭'
        case 7:
          return '退回'
      }
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
