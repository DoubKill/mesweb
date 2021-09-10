<template>
  <!-- 库内库存统计 -->
  <div v-loading="loading">
    <el-form :inline="true">
      <el-form-item label="库区">
        <el-select
          v-model="getParams.warehouse_name"
          clearable
          placeholder="请选择"
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
          clearable
          placeholder="请选择"
          style="width:120px"
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
      <!-- <el-form-item label="品质状态">
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
      </el-form-item> -->
      <el-form-item label="巷道">
        <el-select
          v-model="getParams.location"
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
          v-model="getParams.location_status"
          style="width: 100px"
          clearable
          placeholder="请选择"
          @change="changeSearch"
        >
          <el-option
            v-for="item in [{name:'有',id:'Y'},{name:'无',id:'N'}]"
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
          :loading="btnLoading"
          @click="exportTable(1)"
        >导出当前页面</el-button>
        <el-button
          type="primary"
          :loading="btnLoading"
          @click="exportTable('all')"
        >导出所有</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        label="no"
        width="75"
      >
        <template slot-scope="{row,$index}">
          {{ row.all===1?'汇总': row.all===2?"页面小计":$index+1 }}
        </template>
      </el-table-column>
      <el-table-column prop="material_type" label="胶料类型" align="center" min-width="16" />
      <el-table-column prop="material_no" label="胶料编码" align="center" min-width="28">
        <template slot-scope="{row}">
          <!-- <el-link type="primary" @click="clickMaterialNo">{{ row.material_no }}</el-link> -->
          {{ row.material_no }}
        </template>
      </el-table-column>
      <el-table-column prop="material_no" label="胶料名称" align="center" min-width="28" />
      <el-table-column prop="warehouse_name" label="库区" align="center" min-width="20" />
      <el-table-column label="一等品库存数(车)" align="center" min-width="20">
        <template slot-scope="{row}">
          <el-link v-if="row['一等品']" :type="row.all?'':'primary'" :underline="false" @click="clickVehicle(row,'一等品')">
            {{ row['一等品'].qty }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="" label="重量(kg)" align="center" min-width="20">
        <template slot-scope="{row}">
          <span v-if="row['一等品']">
            {{ row['一等品'].total_weight }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="" label="三等品库存数(车)" align="center" min-width="20">
        <template slot-scope="{row}">
          <el-link v-if="row['三等品']" :type="row.all?'':'primary'" :underline="false" @click="clickVehicle(row,'三等品')">
            {{ row['三等品'].qty }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="" label="重量(kg)" align="center" min-width="20">
        <template slot-scope="{row}">
          <span v-if="row['三等品']">
            {{ row['三等品'].total_weight }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="待检品库存数(车)" align="center" min-width="20">
        <template slot-scope="{row}">
          <el-link v-if="row['待检品']" :type="row.all?'':'primary'" :underline="false" @click="clickVehicle(row,'待检品')">
            {{ row['待检品'].qty }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="" label="重量(kg)" align="center" min-width="20">
        <template slot-scope="{row}">
          <span v-if="row['待检品']">
            {{ row['待检品'].total_weight }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="all_qty" label="总库存数(车)" align="center" min-width="20" />
      <el-table-column prop="total_weight" label="总重量(kg)" align="center" min-width="20" />
      <el-table-column label="封存库存数(车)" align="center" min-width="20">
        <template slot-scope="{row}">
          <el-link v-if="row['封闭']" :type="row.all?'':'primary'" :underline="false" @click="clickVehicle(row,'封存库存')">
            {{ row['封闭'].qty }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="" label="总重量(kg)" align="center" min-width="20">
        <template slot-scope="{row}">
          <span v-if="row['封闭']">
            {{ row['封闭'].total_weight }}
          </span>
        </template>
      </el-table-column>

      <!-- :formatter="StandardFlagChoice" -->
    </el-table>
    <page :total="total" :current-page="getParams.page" @currentChange="currentChange" />

    <el-dialog
      title="库位列表"
      :visible.sync="dialogVisible"
      width="90%"
      :before-close="handleClose"
    >
      <generateAssignOutbound :warehouse-name="warehouseName" :location-status="locationStatus" :material-no="materialNo" :quality-status="qualityStatus" :show="dialogVisible" />
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
      tableData: [],
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
      materialNo: '',
      locationStatus: '',
      warehouseName: '',
      btnLoading: false
    }
  },
  created() {
    this.rubber_repertory_list()
  },
  methods: {
    async rubber_repertory_list() {
      try {
        this.loading = true
        const data = await inLibraryInventory('get', null, { params: this.getParams })

        this.tableData = data.results
        this.tableData.push({
          all: 2,
          '一等品': { qty: sum(this.tableData, '一等品', 'qty'), total_weight: sum(this.tableData, '一等品', 'total_weight') },
          '待检品': { qty: sum(this.tableData, '待检品', 'qty'), total_weight: sum(this.tableData, '待检品', 'total_weight') },
          '三等品': { qty: sum(this.tableData, '三等品', 'qty'), total_weight: sum(this.tableData, '三等品', 'total_weight') },
          '封闭': { qty: sum(this.tableData, '封闭', 'qty'), total_weight: sum(this.tableData, '封闭', 'total_weight') },
          all_qty: sum(this.tableData, '', 'all_qty'),
          total_weight: sum(this.tableData, '', 'total_weight')
        }, {
          all: 1,
          '一等品': { qty: data.qty_1, total_weight: data.weight_1 },
          '待检品': { qty: data.qty_dj, total_weight: data.weight_dj },
          '三等品': { qty: data.qty_3, total_weight: data.weight_3 },
          '封闭': { qty: data.qty_fb, total_weight: data.weight_fb },
          all_qty: data.total_count,
          total_weight: data.total_weight
        }
        )
        this.total = data.count
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
      if (row.all) return
      if (str === '封存库存') {
        this.locationStatus = '封闭货位'
        this.qualityStatus = ''
      } else {
        this.qualityStatus = str
        this.locationStatus = ''
      }
      this.materialNo = row.material_no ? row.material_no : ''
      this.warehouseName = row.warehouse_name ? row.warehouse_name : ''
      this.dialogVisible = true
    },
    exportTable(val) {
      this.btnLoading = true
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
          this.btnLoading = false
        }).catch(e => {
          this.btnLoading = false
        })
    }
  }
}
function sum(arr, str, params) {
  var s = 0

  arr.forEach(function(val, idx, arr) {
    let a = 0
    if (!str) {
      a = val[params] ? Number(val[params]) : 0
    } else {
      a = val[str] ? Number(val[str][params]) : 0
    }
    s += a
  }, 0)
  s = Math.round(s * 1000) / 1000
  return s
}
</script>

<style lang="scss" scoped>
</style>

