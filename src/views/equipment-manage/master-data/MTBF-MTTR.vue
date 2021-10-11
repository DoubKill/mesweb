<template>
  <div class="MTBF-MTTR">
    <!-- 目标MTBF/MTTR设定 -->
    <el-button
      type="primary"
      style="margin-bottom:10px;float:right"
      :loading="btnLoading"
      @click="submitFun"
    >保存
    </el-button>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
    >
      <el-table-column
        prop="property_no"
        label="机台编号"
        min-width="20"
      />
      <el-table-column
        prop="property_no"
        label="机台名称"
        min-width="20"
      >
        <template slot-scope="{row}">
          <el-input v-model="row.name" />
        </template>
      </el-table-column>
      <el-table-column
        prop="property_no"
        label="目标MTBF"
        min-width="20"
      >
        <template slot-scope="{row}">
          <el-input-number v-model="row.need_weight" :precision="3" :min="0" />
        </template>
      </el-table-column>
      <el-table-column
        prop="property_no"
        label="目标MTTR"
        min-width="20"
      >
        <template slot-scope="{row}">
          <el-input-number v-model="row.need_weight" :precision="3" :min="0" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { equipUrl } from '@/api/base_w'
export default {
  name: 'EquipmentMasterDataMTBFMTTR',
  data() {
    return {
      options: [],
      tableData: [{}],
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
        const data = await equipUrl('get', { params: { all: 1, category_name: '密炼设备' }})
        this.options = data.results || []
      } catch (e) {
        //
      }
    },
    submitFun() {

    }
  }
}
</script>

<style lang="scss" scoped>
    .MTBF-MTTR{
        .el-input{
            width:200px;
        }
    }
</style>
