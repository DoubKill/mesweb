<template>
  <div>
    <div style="float:right">
      <el-button type="primary" @click="exportTable">导出Excel</el-button>
      <el-button
        v-permission=""
        type="primary"
        style="margin-bottom:10px;float:right"
        :loading="btnLoading"
        @click="submitFun"
      >保存
      </el-button>
    </div>
    <div class="machineValueSetting">
      <!-- 机台目标值设定 -->

      <el-table
        id="out-table"
        v-loading="loading"
        width="80%"
        :data="tableData"
        border
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
      >
        <el-table-column
          prop="equip__equip_no"
          label="机台"
          min-width="20"
        />
        <el-table-column
          prop="property_no"
          label="机台目标值(车）"
          min-width="20"
        >
          <template slot-scope="{row}">
            <el-input-number v-model="row.property_no" :precision="3" :min="0" />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { exportExcel } from '@/utils/index'
import { equipTargetMtbmttrSettings } from '@/api/base_w_four'
export default {
  name: 'MachineValueSetting',
  data() {
    return {
      options: [],
      tableData: [],
      loading: false,
      btnLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        const data = await equipTargetMtbmttrSettings('get')
        this.tableData = data || []
      } catch (e) {
        //
      }
    },
    exportTable() {
      exportExcel('机台目标值设定')
    },
    async submitFun() {
      try {
        this.tableData.forEach(d => {
          if (!d.equip__equip_name || !d.target_mtb || !d.target_mttr) {
            throw new Error('每行数据必填')
          }
        })
        this.btnLoading = true
        await equipTargetMtbmttrSettings('post', null, { data: this.tableData })
        this.$message.success('保存成功')
        this.btnLoading = false
      } catch (e) {
        this.btnLoading = false
        if (e.message) {
          this.$message(e.message)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
    .machineValueSetting{
        width: 50%;
        margin-left: 25%;
        .el-input{
            width:200px;
        }
    }
</style>
