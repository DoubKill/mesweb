<template>
  <!-- 库内库存统计 -->
  <div v-loading="loading" class="rubber_repertory_manage">
    <el-form :inline="true">
      <el-form-item label="库区">
        <el-select
          v-model="getParams.warehouse_name"
          clearable
          placeholder="请选择"
          style="width:150px"
          @change="changeWarehouse"
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
      <el-form-item label="品质等级">
        <el-select
          v-model="getParams.quality_level"
          clearable
          placeholder="请选择"
          style="width:150px"
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
      <el-form-item label="机台">
        <selectEquip
          :equip_no_props.sync="getParams.equip_no"
          @changeSearch="changeSearch"
        />
      </el-form-item>
      <el-form-item label="锁定状态">
        <el-select
          v-model="getParams.locked_status"
          style="width:150px"
          clearable
          placeholder="请选择"
          @change="changeSearch"
        >
          <el-option
            v-for="item in [{label:'工艺锁定',value:1},{label:'快检锁定',value:2}]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="总货位数：">
        {{ allObj.total_goods_num || 0 }}
      </el-form-item>
      <el-form-item label="已占用货位数：">
        {{ allObj.used_goods_num || 0 }}
      </el-form-item>
      <el-form-item label="空货位数：">
        {{ allObj.empty_goods_num || 0 }}
      </el-form-item>
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
      :row-class-name="rowClassNameFn"
      :cell-class-name="cellClassName"
      @sort-change="sortChange"
    >
      <el-table-column
        label="No"
        width="70"
      >
        <template slot-scope="{row,$index}">
          {{ row.all===1?'汇总': row.all===2?"页面小计":$index+1 }}
        </template>
      </el-table-column>
      <el-table-column prop="stage" label="胶料类型" align="center" width="70" />
      <el-table-column prop="material_no" label="胶料编码" align="center" min-width="28">
        <template slot-scope="{row}">
          <!-- <el-link type="primary" @click="clickMaterialNo">{{ row.material_no }}</el-link> -->
          {{ row.material_no }}
        </template>
      </el-table-column>
      <el-table-column prop="material_no" label="胶料名称" align="center" min-width="28" />
      <el-table-column prop="warehouse_name" label="库区" align="center" min-width="20" />
      <el-table-column prop="location" label="巷道" align="center" min-width="10" />
      <el-table-column label="锁定车数" sortable="custom" align="center" min-width="20" prop="locked_trains">
        <template slot-scope="{row}">
          <el-link :type="row.all?'':'primary'" :underline="false" @click="clickVehicleLock(row)">
            {{ row.locked_trains?row.locked_trains:'' }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="一等品库存数(车)" align="center" min-width="20" sortable="custom" prop="1_qty">
        <template slot-scope="{row}">
          <el-link v-if="row['一等品']" :type="row.all?'':'primary'" :underline="false" @click="clickVehicle(row,'一等品')">
            {{ row['一等品'].qty }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="重量(kg)" align="center" min-width="20" sortable="custom" prop="1_weight">
        <template slot-scope="{row}">
          <span v-if="row['一等品']">
            {{ row['一等品'].total_weight }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="三等品库存数(车)" align="center" min-width="20" sortable="custom" prop="3_qty">
        <template slot-scope="{row}">
          <el-link v-if="row['三等品']" :type="row.all?'':'primary'" :underline="false" @click="clickVehicle(row,'三等品')">
            {{ row['三等品'].qty }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column sortable="custom" prop="3_weight" label="重量(kg)" align="center" min-width="20">
        <template slot-scope="{row}">
          <span v-if="row['三等品']">
            {{ row['三等品'].total_weight }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="待检品库存数(车)" align="center" min-width="20" sortable="custom" prop="2_qty">
        <template slot-scope="{row}">
          <el-link v-if="row['待检品']" :type="row.all?'':'primary'" :underline="false" @click="clickVehicle(row,'待检品')">
            {{ row['待检品'].qty }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="重量(kg)" align="center" min-width="20" sortable="custom" prop="2_weight">
        <template slot-scope="{row}">
          <span v-if="row['待检品']">
            {{ row['待检品'].total_weight }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="all_qty" label="总库存数(车)" align="center" min-width="20">
        <template slot-scope="{row}">
          <el-link v-if="row['all_qty']" :type="row.all?'':'primary'" :underline="false" @click="clickVehicle(row,'')">
            {{ row.all_qty }}
          </el-link>
        </template>
      </el-table-column>
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
      <el-table-column prop="active_qty" label="有效库存数(车)" align="center" min-width="20" />
      <!-- :formatter="StandardFlagChoice" -->
    </el-table>
    <page :old-page="false" :total="total" :current-page="getParams.page" @currentChange="currentChange" />
    <el-alert style="color:black" title="表格字体颜色说明：黄色-超过3天没出快检结果（品质状态还是待检品）； 浅红色-含有超期预警的物料；红色-含有已超期的物料。" type="success" />
    <el-dialog
      title="库位列表"
      :visible.sync="dialogVisible"
      width="90%"
      :before-close="handleClose"
    >
      <generateAssignOutbound :warehouse-name="warehouseName" :location-status="locationStatus" :material-no="materialNo" :quality-status="qualityStatus" :show="dialogVisible" />
    </el-dialog>

    <el-dialog
      title="库位列表"
      :visible.sync="dialogVisible1"
      width="90%"
      :before-close="handleClose"
    >
      <generateAssignOutboundLock :equip="getParams.equip_no" :locked-status="getParams.locked_status?getParams.locked_status:null" :warehouse-name="warehouseName" :tunnel="getParams.location" :material-no="materialNo" :quality-status="getParams.quality_level" :show="dialogVisible1" />
    </el-dialog>
  </div>
</template>

<script>
import page from '@/components/page'
import { setDate } from '@/utils/index'
// import { getMaterialInventoryManage } from '@/api/material-inventory-manage'
import { stage_global_url, inLibraryInventory } from '@/api/display_static_fun'
import materialCodeSelect from '@/components/select_w/materialCodeSelect'
import generateAssignOutboundLock from './generate_assign_outbound_lock.vue'
import generateAssignOutbound from './generate_assign_outbound.vue'
import selectEquip from '@/components/select_w/equip'
export default {
  name: 'RubberRepertoryManage',
  components: { selectEquip, page, materialCodeSelect, generateAssignOutbound, generateAssignOutboundLock },
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
      dialogVisible1: false,
      qualityStatus: '',
      materialNo: '',
      tunnel: '',
      locationStatus: '',
      warehouseName: '',
      btnLoading: false,
      allObj: {}
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
        this.allObj = {
          empty_goods_num: data.empty_goods_num,
          total_goods_num: data.total_goods_num,
          used_goods_num: data.used_goods_num
        }
        this.tableData = data.results
        this.tableData.push({
          all: 2,
          locked_trains: sum(this.tableData, '', 'locked_trains'),
          '一等品': { qty: sum(this.tableData, '一等品', 'qty'), total_weight: sum(this.tableData, '一等品', 'total_weight') },
          '待检品': { qty: sum(this.tableData, '待检品', 'qty'), total_weight: sum(this.tableData, '待检品', 'total_weight') },
          '三等品': { qty: sum(this.tableData, '三等品', 'qty'), total_weight: sum(this.tableData, '三等品', 'total_weight') },
          '封闭': { qty: sum(this.tableData, '封闭', 'qty'), total_weight: sum(this.tableData, '封闭', 'total_weight') },
          all_qty: sum(this.tableData, '', 'all_qty'),
          total_weight: sum(this.tableData, '', 'total_weight'),
          active_qty: sum(this.tableData, '', 'active_qty')
        }, {
          all: 1,
          locked_trains: data.total_locked_qty,
          '一等品': { qty: data.qty_1, total_weight: data.weight_1 },
          '待检品': { qty: data.qty_dj, total_weight: data.weight_dj },
          '三等品': { qty: data.qty_3, total_weight: data.weight_3 },
          '封闭': { qty: data.qty_fb, total_weight: data.weight_fb },
          all_qty: data.total_count,
          total_weight: data.total_weight,
          active_qty: Math.round((data.total_count - data.qty_fb) * 1000) / 1000
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
    changeWarehouse() {
      this.getParams.material_no = ''
      this.changeSearch()
    },
    currentChange(page, page_size) {
      this.getParams.page = page
      this.getParams.page_size = page_size
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
    clickVehicleLock(row) {
      if (row.all) return
      this.materialNo = row.material_no ? row.material_no : ''
      this.warehouseName = row.warehouse_name ? row.warehouse_name : ''
      this.dialogVisible1 = true
    },
    sortChange({ column, prop, order }) {
      this.getParams.ordering_field = prop
      this.getParams.order_by = order
      this.rubber_repertory_list()
    },
    exportTable(val) {
      this.btnLoading = true
      const obj = Object.assign({ export: val }, this.getParams)
      inLibraryInventory('get', null, { params: obj, responseType: 'blob' })
        .then(res => {
          const link = document.createElement('a')
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = `车间库存统计${setDate('', true)}.xlsx` // 下载的文件名
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          this.btnLoading = false
        }).catch(e => {
          this.btnLoading = false
        })
    },
    rowClassNameFn({ row, rowIndex }) {
      if (row.all) {
        return 'summary-cell-style'
      }
    },
    cellClassName({ row, column, rowIndex, columnIndex }) {
      if (column.label === '一等品库存数(车)' && row['一等品']) {
        if (row['一等品'].expire_flag) {
          return 'deepred-cell-style'
        }
        if (row['一等品'].yj_flag) {
          return 'red-cell-style'
        }
        if (row['一等品'].dj_flag) {
          return 'yellow-cell-style'
        }
      } else if (column.label === '三等品库存数(车)' && row['三等品']) {
        if (row['三等品'].expire_flag) {
          return 'deepred-cell-style'
        }
        if (row['三等品'].yj_flag) {
          return 'red-cell-style'
        }
        if (row['三等品'].dj_flag) {
          return 'yellow-cell-style'
        }
      } else if (column.label === '待检品库存数(车)' && row['待检品']) {
        if (row['待检品'].expire_flag) {
          return 'deepred-cell-style'
        }
        if (row['待检品'].yj_flag) {
          return 'red-cell-style'
        }
        if (row['待检品'].dj_flag) {
          return 'yellow-cell-style'
        }
      }
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

<style lang="scss" >
.rubber_repertory_manage{
    .red-cell-style{
    background: rgb(222, 126, 137);
  }
    .deepred-cell-style{
    background: red;
  }
    .yellow-cell-style{
    background: rgb(222, 190, 84);
  }
  .el-link.el-link--primary{
        color: #115091;
  }
}

</style>

