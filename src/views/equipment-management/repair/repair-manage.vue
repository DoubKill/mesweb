<template>
  <div class="repair-manage-style">
    <!-- 设备维修单管理 -->
    <el-form :inline="true">
      <el-form-item label="日期:">
        <el-date-picker
          v-model="search.date"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          @change="changeList"
        />
      </el-form-item>
      <el-form-item label="设备编码:">
        <el-input v-model="search.equip_no" @input="changeList" />
      </el-form-item>
      <el-form-item label="设备名称:">
        <el-input v-model="search.equip_name" @input="changeList" />
      </el-form-item>
      <el-form-item label="单号:">
        <el-input v-model="search.order_uid" @input="changeList" />
      </el-form-item>
      <el-form-item class="button-right">
        <el-button v-permission="['equip_maintenance_order', 'add']" @click="add(false,'新建')">新建</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="tableData"
      border
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
    >
      <el-table-column
        type="index"
        label="No"
        width="40"
      />
      <el-table-column
        prop="down_time"
        label="故障时间"
        min-width="20"
      />
      <el-table-column
        prop="order_uid"
        label="单号"
        min-width="20"
      />
      <el-table-column
        prop="equip_no"
        label="设备编码"
        min-width="20"
      />
      <el-table-column
        prop="equip_name"
        label="设备名称"
        min-width="20"
      />
      <el-table-column
        prop="part_name"
        label="设备部位"
        min-width="20"
      />
      <el-table-column
        prop="first_down_reason"
        label="初步诊断"
        min-width="20"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          <el-link type="primary" @click="add(row,'初步诊断')">{{ row.first_down_reason }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        label="故障原因"
        width="104px"
      >
        <template slot-scope="{row}">
          <div v-if="checkPermission(['equip_maintenance_order','change'])">
            <el-button v-if="!row.down_reason" size="mini" @click="add(row,'故障原因')">添加故障原因</el-button>
            <el-link type="primary" @click="add(row,'故障原因')">{{ row.down_reason }}</el-link>
          </div>
          <span v-else>{{ row.down_reason }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        min-width="20"
        :formatter="usedTypeFormatter"
      />
      <el-table-column
        prop="maintenance_username"
        label="维修人"
        min-width="20"
      />
      <el-table-column
        prop="assign_username"
        label="指派人"
        min-width="20"
      />
      <el-table-column
        prop="created_username"
        label="创建人"
        min-width="20"
      />
      <el-table-column
        prop="address"
        label="操作"
        min-width="27"
      >
        <template
          v-if="!([6,4,5].includes(scope.row.status))"
          slot-scope="scope"
        >
          <el-popover
            v-if="scope.row.status === 1&&checkPermission(['equip_maintenance_order','designate'])"
            v-model="scope.row.visible"
            placement="right"
            width="160"
          >
            <userMangeSelect @changeSelect="changeSelectUser($event,scope.row)" />
            <div style="text-align: right; margin-top: 5px">
              <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="submitUser(scope.row)">确定</el-button>
            </div>
            <el-button
              v-if="scope.row.status !== 3"
              slot="reference"
              style="margin-bottom:2px"
              size="mini"
              type="primary"
            >指派
            </el-button>
          </el-popover>
          <el-button-group>
            <el-button
              v-if="
                ((scope.row.status===1&&scope.row.created_user===Number(userId))||([3,2].includes(scope.row.status)&&scope.row.maintenance_user===Number(userId)))
                  &&checkPermission(['equip_maintenance_order','close'])"
              style="margin-bottom:2px"
              size="mini"
              @click="claimFun(scope.row,'关闭',6)"
            >关闭
            </el-button>
            <el-button
              v-if="scope.row.status === 1&&checkPermission(['equip_maintenance_order','order'])"
              style="margin-bottom:2px"
              size="mini"
              type="warning"
              @click="claimFun(scope.row,'接单',2)"
            >接单
            </el-button>
            <el-button
              v-if="scope.row.assign_user === Number(userId)&&[3,2].includes(scope.row.status)
                &&checkPermission(['equip_maintenance_order','chargeback'])"
              style="margin-bottom:2px"
              size="mini"
              type="info"
              @click="claimFun(scope.row,'退单',7)"
            >退单
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
      <el-table-column
        prop="affirm_username"
        label="确认人"
        min-width="20"
      />
      <el-table-column
        prop="begin_time"
        label="维修开始时间"
        min-width="20"
      />
      <el-table-column
        prop="end_time"
        label="维修结束时间"
        min-width="20"
      />
      <el-table-column
        prop="take_time"
        label="维修时间"
        min-width="20"
      />
      <el-table-column
        prop="affirm_time"
        label="确认时间"
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
        <el-form-item label="故障时间" prop="down_time">
          <el-date-picker
            v-model="ruleForm.down_time"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            :disabled="!!ruleForm.id"
          />
        </el-form-item>
        <el-form-item label="设备" prop="equip_no">
          <EquipSelect :is-disabled="!!ruleForm.id" :default-val="ruleForm.equip_no" @equipSelected="equipSelected" />
        </el-form-item>
        <el-form-item label="设备部位" prop="equip_part">
          <locationDefinitionDelect :is-disabled="!!ruleForm.id" :is-created="true" :equip-no="ruleForm.equip_no" :default-val="ruleForm.equip_part" @locationSelect="locationSelect" />
        </el-form-item>
        <el-form-item v-if="operateType==='初步诊断'" label="申报人">
          {{ ruleForm.created_username }}
        </el-form-item>
        <el-form-item label="停机类型" prop="first_down_type">
          <shutdownMoldSelect
            ref="shutdownMoldSelect"
            :is-disabled="!!ruleForm.id"
            :default-val="ruleForm.first_down_type"
            @shutdownMoldChange="shutdownMoldChange"
          />
          <el-link v-if="ruleForm.down_flag&&ruleForm.id" style="margin-left:10px" type="warning">已停机</el-link>
          <el-link v-if="ruleForm.id&&!ruleForm.down_flag" style="margin-left:10px">未停机</el-link>
          <el-checkbox v-if="!ruleForm.id" v-model="ruleForm.down_flag" style="margin-left:10px">已停机</el-checkbox>
        </el-form-item>
        <el-form-item v-if="operateType !=='故障原因'" label="初诊原因" prop="first_down_reason">
          <shutdown-reason-select
            :is-disabled="!!ruleForm.id"
            :default-val="ruleForm.first_down_reason"
            :equip-down-type-name="ruleForm.first_down_type"
            @shutdownReasonChange="shutdownReasonChange"
          />
          <!-- operateType!=='新建'&&(operateType==='初步诊断'||!(ruleForm.maintenance_user === Number(userId)&&[3,4].includes(ruleForm.status))) -->
        </el-form-item>
        <el-form-item v-if="operateType ==='故障原因'" label="故障原因" prop="note">
          <el-input
            v-model="ruleForm.down_reason"
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
            :disabled="operateType!=='新建'&&(operateType==='初步诊断'||!(ruleForm.maintenance_user === Number(userId)&&[2,3].includes(ruleForm.status)))"
          />
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input
            v-model="ruleForm.note"
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
            :disabled="operateType!=='新建'&&(operateType==='初步诊断'||!(ruleForm.maintenance_user === Number(userId)&&[2,3].includes(ruleForm.status)))"
          />
        </el-form-item>
        <el-form-item label="上传图片">
          <el-upload
            v-if="operateType==='新建'"
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
        <el-button v-if="!(operateType!=='新建'&&(operateType==='初步诊断'||!(ruleForm.maintenance_user === Number(userId)&&[2,3].includes(ruleForm.status))))" type="primary" @click="addSubmitFun">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import EquipSelect from '@/components/EquipSelect'
import shutdownMoldSelect from '../components/shutdown-mold-select'
import locationDefinitionDelect from '../components/location-definition-select'
import shutdownReasonSelect from '../components/shutdown-reason-select'
// import { setDate } from '@/utils'
import { equipMaintenanceOrder } from '@/api/base_w_two'
import userMangeSelect from '@/components/select_w/userMangeSelect'
import page from '@/components/page'
import { mapGetters } from 'vuex'
import { checkPermission } from '@/utils'
export default {
  components: { shutdownReasonSelect, page, userMangeSelect, EquipSelect, shutdownMoldSelect, locationDefinitionDelect },
  data() {
    const validator = (rule, value, callback, _value, str) => {
      if (!_value && !value) {
        callback(new Error(str))
      } else {
        callback()
      }
    }
    return {
      search: {
        page: 1,
        page_size: 10
      },
      loading: true,
      tableData: [],
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
    this.getList()
  },
  methods: {
    checkPermission,
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
    add(val, type) {
      if (val) {
        this.ruleForm = JSON.parse(JSON.stringify(val))
      } else {
        this.ruleForm = {
          down_time: '',
          first_down_type: '',
          image: null,
          first_down_reason: '',
          equip_part: '',
          equip_no: '',
          down_flag: false
        }
      }
      this.operateType = type
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
        if (this.operateType === '新建') {
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
          return '新建'
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
