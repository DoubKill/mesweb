<template>
  <!-- 库内库存统计 -->
  <div v-loading="loading">
    <el-form :inline="true">
      <el-form-item label="库区">
        <el-select
          v-model="getParams.warehouse_name"
          clearable
          placeholder="请选择"
          style="width: 120px"
          @change="changeSearch"
        >
          <el-option
            v-for="item in ['终炼胶库','混炼胶库']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="段次">
        <el-select
          v-model="getParams.stage"
          style="width: 100px"
          clearable
          placeholder="请选择"
          @visible-change="RubberStageChange"
          @change="changeSearch"
        >
          <el-option
            v-for="item in RubberStageOptions"
            :key="item.global_name"
            :label="item.global_name"
            :value="item.global_name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="胶料编码">
        <materialCodeSelect
          :is-clearable="true"
          :store-name="getParams.warehouse_name"
          :is-allow-create="true"
          @changSelect="materialCodeFun"
        />
      </el-form-item>
      <el-form-item label="品质状态">
        <el-select
          v-model="getParams.aaa"
          style="width: 120px"
          clearable
          placeholder="请选择"
          @change="changeSearch"
        >
          <el-option
            v-for="item in ['一等品','三等品','待检品']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="巷道">
        <el-select
          v-model="getParams.aaa"
          style="width: 100px"
          clearable
          placeholder="请选择"
          @change="changeSearch"
        >
          <el-option
            v-for="item in ['1','2','3','4']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="有无封闭库位">
        <el-select
          v-model="getParams.aaa"
          style="width: 100px"
          clearable
          placeholder="请选择"
          @change="changeSearch"
        >
          <el-option
            v-for="item in [{name:'有',id:1},{name:'无',id:2}]"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="加硫：">
        共{{ sulfurAddition || 0 }}车
      </el-form-item>
      <el-form-item label="无硫：">
        共{{ sulfurFree || 0 }}车
      </el-form-item> -->
      <el-form-item style="float:right">
        <el-button
          type="primary"
          @click="exportTable(1)"
        >导出当前页面</el-button>
        <el-button
          type="primary"
          @click="exportTable('all')"
        >导出所有</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column prop="sn" label="No" align="center" min-width="6" />
      <el-table-column prop="material_type" label="胶料类型" align="center" min-width="16" />
      <el-table-column prop="material_no" label="胶料编码" align="center" min-width="28">
        <template slot-scope="{row}">
          <!-- <el-link type="primary" @click="clickMaterialNo">{{ row.material_no }}</el-link> -->
          {{ row.material_no }}
        </template>
      </el-table-column>
      <el-table-column prop="material_name" label="胶料名称" align="center" min-width="28" />
      <el-table-column prop="" label="库区" align="center" min-width="20" />
      <el-table-column label="一等品库存数(车)" align="center" min-width="20">
        <template slot-scope="{row}">
          <el-link type="primary" @click="clickVehicle(row,'一等品')">{{ row.bbb }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="" label="重量(kg)" align="center" min-width="20" />
      <el-table-column prop="" label="三等品库存数(车)" align="center" min-width="20">
        <template slot-scope="{row}">
          <el-link type="primary" @click="clickVehicle(row,'三等品')">{{ row.bbb }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="" label="重量(kg)" align="center" min-width="20" />
      <el-table-column label="待检品库存数(车)" align="center" min-width="20">
        <template slot-scope="{row}">
          <el-link type="primary" @click="clickVehicle(row,'待检品')">{{ row.aaa }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="" label="重量(kg)" align="center" min-width="20" />

      <el-table-column prop="" label="总库存数(车)" align="center" min-width="20" />
      <el-table-column prop="total_weight" label="总重量(kg)" align="center" min-width="20" />
      <el-table-column prop="" label="封存库存数(车)" align="center" min-width="20" />
      <el-table-column prop="" label="总重量(kg)" align="center" min-width="20" />

      <!-- :formatter="StandardFlagChoice" -->
    </el-table>
    <page :total="total" :current-page="getParams.page" @currentChange="currentChange" />

    <el-dialog
      title="库位列表"
      :visible.sync="dialogVisible"
      width="90%"
      :before-close="handleClose"
    >
      <generateAssignOutbound :warehouse-name="'混炼胶库'" :material-no="materialNo" :quality-status="qualityStatus" :show="dialogVisible" />
    </el-dialog>
  </div>
</template>

<script>
import page from '@/components/page'
// import { getMaterialInventoryManage } from '@/api/material-inventory-manage'
import { stage_global_url, inLibraryInventory } from '@/api/display_static_fun'
import materialCodeSelect from '@/components/select_w/materialCodeSelect'
import generateAssignOutbound from './generate_assign_outbound.vue'
export default {
  name: 'RubberRepertoryManage',
  components: { page, materialCodeSelect, generateAssignOutbound },
  data: function() {
    return {
      loading: false,
      tableData: [{ material_no: 'C-1MB-C911-03', aaa: '6' }],
      total: 0,
      getParams: {
        page: 1,
        page_size: 10
      },
      RubberStageOptions: [],
      dialogVisible: false,
      sulfurAddition: 0,
      sulfurFree: 0,
      qualityStatus: '',
      materialNo: ''
    }
  },
  created() {
    this.rubber_repertory_list()
  },
  methods: {
    async rubber_repertory_list() {
      try {
        this.loading = true
        const rubber_repertoryData = await inLibraryInventory('get', null, { params: this.getParams })
        this.tableData = rubber_repertoryData.results
        this.total = rubber_repertoryData.count
        // this.sulfurAddition = rubber_repertoryData.fm_count
        // this.sulfurFree = rubber_repertoryData.other_count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async stage_global_list() {
      try {
        const stage_global_list = await stage_global_url('get', {
          params: { }
        })
        if (stage_global_list.results.length !== 0) {
          this.RubberStageOptions = stage_global_list.results
        }
      } catch (e) { throw new Error(e) }
    },
    RubberStageChange: function(bool) {
      if (bool) {
        this.stage_global_list()
      }
    },
    materialCodeFun(obj) {
      this.getParams.page = 1
      this.getParams.material_no = obj ? obj.material_no : ''
      this.rubber_repertory_list()
    },
    StandardFlagChoice: function(standard_flag) {
      switch (standard_flag) {
        case true:
          return '合格'
        case false:
          return '不合格'
      }
    },
    changeSearch() {
      this.getParams.page = 1
      this.rubber_repertory_list()
    },
    currentChange(page) {
      this.getParams.page = page
      this.rubber_repertory_list()
    },
    handleClose(done) {
      done()
    },
    currentChangeDialog(page) {
      this.pageDialog = page
    },
    clickVehicle(row, str) {
      this.qualityStatus = str
      this.materialNo = row.material_no ? row.material_no : ''
      this.dialogVisible = true
    },
    exportTable(val) {
      // responseType: 'blob'  get请求
      inLibraryInventory('get', null, { params: { export: val }, responseType: 'blob' })
        .then(res => {
          const link = document.createElement('a')
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = '车间库存统计.xlsx' // 下载的文件名
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          this.btnExportLoad = false
        }).catch(e => {
          this.btnExportLoad = false
        })
    }
  }
}

</script>

<style lang="scss" scoped>
</style>

