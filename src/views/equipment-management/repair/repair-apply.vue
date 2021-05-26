<template>
  <div>
    <!-- 设备维修申请页面 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
    >
      <el-table-column
        label="No"
        width="40"
        type="index"
      />
      <el-table-column
        prop="process"
        label="工序"
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
        prop="equip_type"
        label="设备类型"
        min-width="20"
      />
      <el-table-column
        prop="status"
        label="状态"
        min-width="20"
      />
      <el-table-column
        label="正在维修部位"
        min-width="20"
      >
        <template slot-scope="{row}">
          {{ row.maintain_list?row.maintain_list.join(','):'--' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="user"
        label="操作人"
        min-width="20"
      />
      <el-table-column
        label="操作"
        min-width="20"
      >
        <template slot-scope="{row}">
          <el-button-group>
            <el-button
              v-if="['运行中','空转'].includes(row.status)&&checkPermission(['equip_current_status','maintenance'])"
              type="primary"
              size="mini"
              @click="clickDialog(row)"
            >维修申请</el-button>
            <el-button
              v-if="['停机','维修结束'].includes(row.status)&&checkPermission(['equip_current_status','affirm'])"
              type="primary"
              size="mini"
              @click="startUpFun(row)"
            >启动确认</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="searchPage"
      @currentChange="currentChange"
    />

    <el-dialog
      title="维修申请"
      :visible.sync="dialogVisible"
      width="600"
      :before-close="handleClose"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        label-width="120px"
      >
        <el-form-item
          label="日期"
          prop="note_time"
        >
          {{ ruleForm.note_time }}
        </el-form-item>
        <el-form-item
          label="设备"
          prop="equip"
        >
          {{ ruleForm.equip }}
        </el-form-item>
        <el-form-item
          label="设备部位"
          prop="equip_part"
        >
          <locationDefinitionDelect
            ref="locationDefinitionDelect"
            :equip-no="ruleForm.equip"
            @locationSelect="locationSelect"
          />
        </el-form-item>
        <el-form-item
          label="停机类型"
          prop="first_down_type"
        >
          <shutdownMoldSelect
            ref="shutdownMoldSelect"
            @shutdownMoldChange="shutdownMoldChange"
          />
          <el-checkbox
            v-model="ruleForm.down_flag"
            style="margin-left:10px"
          >已停机</el-checkbox>
        </el-form-item>
        <el-form-item
          label="原因"
          prop="first_down_reason"
        >
          <shutdownReasonSelect
            ref="shutdownReasonSelect"
            :equip-down-type-name="ruleForm.first_down_type"
            @shutdownReasonChange="shutdownReasonChange"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button
          :loading="loadingBtn"
          type="primary"
          @click="submitFun"
        >确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { setDate } from '@/utils'
import shutdownMoldSelect from '../components/shutdown-mold-select'
import shutdownReasonSelect from '../components/shutdown-reason-select'
import locationDefinitionDelect from '../components/location-definition-select'
import { equipCurrentStatus } from '@/api/base_w_two'
import page from '@/components/page'
import { checkPermission } from '@/utils'
export default {
  name: 'RepairApply',
  components: { page, locationDefinitionDelect, shutdownMoldSelect, shutdownReasonSelect },
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      ruleForm: {
        note_time: setDate('', true),
        down_flag: false
      },
      searchPage: 1,
      total: 0,
      page_size: 10,
      loadingBtn: false,
      loading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    checkPermission,
    async getList() {
      try {
        this.loading = true
        const data = await equipCurrentStatus('get', null,
          { params: { page: this.searchPage, page_size: this.page_size }})
        this.tableData = data.results || []
        this.total = data.count
      } catch (e) {
        //
      }
      this.loading = false
    },
    async submitFun() {
      try {
        if (!this.ruleForm.first_down_type) {
          this.$message.info('停机类型必填')
          return
        }
        if (!this.ruleForm.equip_part) {
          this.$message.info('设备部位必填')
          return
        }
        if (!this.ruleForm.first_down_reason) {
          this.$message.info('停机原因必填')
          return
        }
        const obj = JSON.parse(JSON.stringify(this.ruleForm))
        delete obj.equip
        this.loadingBtn = true
        await equipCurrentStatus('patch', this.ruleForm.id,
          { data: obj })
        this.$message.success('操作成功')
        this.getList()
        this.handleClose(false)
      } catch (e) {
        //
      }
      this.loadingBtn = false
    },
    currentChange(page, page_size) {
      this.searchPage = page
      this.page_size = page_size
      this.getList()
    },
    handleClose(done) {
      this.$refs.shutdownMoldSelect.className = ''
      this.$refs.shutdownReasonSelect.className = ''
      this.$refs.locationDefinitionDelect.className = ''
      this.ruleForm.equip_part = ''
      this.ruleForm.down_flag = false
      this.dialogVisible = false
      if (done) {
        done()
      }
    },
    clickDialog(row) {
      this.ruleForm.equip = row.equip_no
      this.ruleForm.id = row.id
      this.ruleForm.note_time = setDate('', true)
      this.dialogVisible = true
    },
    locationSelect(obj) {
      this.ruleForm.equip_part = obj ? obj.id : ''
    },
    startUpFun(row) {
      this.$confirm('是否启动?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        equipCurrentStatus('patch', row.id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '启动成功!'
            })
            this.getList()
          }).catch(e => {
            // this.$message.error('启动失败')
          })
      })
    },
    equipSelected() { },
    shutdownMoldChange(obj) {
      this.$set(this.ruleForm, 'first_down_type', obj ? obj.name : '')
      this.$refs.shutdownReasonSelect.className = ''
    },
    shutdownReasonChange(obj) {
      this.$set(this.ruleForm, 'first_down_reason', obj ? obj.desc : '')
    }
  }
}
</script>

<style>

</style>
