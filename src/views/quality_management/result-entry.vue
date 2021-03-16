<template>
  <div>
    <!-- 原材料临时快检结果录入 -->
    <el-form :inline="true">
      <el-form-item label="物料类型">
        <materielTypeSelect @changSelect="changMateriel" />
      </el-form-item>
      <el-form-item label="物料编码">
        <materialCodeSelect :is-all-obj="true" @changeSelect="changeMaterialCode" />
      </el-form-item>
      <el-form-item label="条码">
        <el-input
          ref="lot_no_input"
          v-model="search.lot_no"
          placeholder="请输入内容"
          @input="changeListLot"
        />
      </el-form-item>
      <el-form-item>
        <el-button :loading="btnExportLoad" @click="exportTable">导出</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="tableData"
      border
      element-loading-text="拼命加载中"
    >
      <el-table-column
        label="No"
        width="45"
        type="index"
      />
      <el-table-column
        prop="material_type"
        label="物料类型"
        min-width="20"
      />
      <el-table-column
        prop="material_no"
        label="物料编码"
        min-width="20"
      />
      <el-table-column
        prop="material_name"
        label="物料名称"
        min-width="20"
      />
      <el-table-column
        prop="lot_no"
        label="条码"
        min-width="20"
      />
      <el-table-column
        prop="container_no"
        label="托盘号"
        min-width="20"
      />
      <el-table-column
        prop="qty"
        label="库存数"
        min-width="20"
      />
      <el-table-column
        prop="unit_weight"
        label="单位重量(kg)"
        min-width="20"
      />
      <el-table-column
        prop="total_weight"
        label="总重量"
        min-width="20"
      />
      <el-table-column
        prop="quality"
        label="品质状态"
        min-width="20"
      >
        <template slot-scope="scope">
          {{ scope.row.quality }}
          <el-popover
            v-model="scope.row.visible"
            placement="right"
            width="160"
          >
            <el-select v-model="qualityValue" placeholder="请选择">
              <el-option
                v-for="item in ['合格','不合格']"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
            <div style="text-align: right; margin-top: 5px">
              <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="submitUser(scope.row,scope.$index)">确定</el-button>
            </div>
            <i slot="reference" class="el-icon-edit" style="font-size:20px" />
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />
  </div>
</template>

<script>
import materielTypeSelect from '@/components/select_w/materielTypeSelect'
import { barcodeQuality, barcodeQualityExport } from '@/api/base_w_three'
import Page from '@/components/page'
import materialCodeSelect from '@/components/materialCodeSelect'
import { debounce } from '@/utils'
export default {
  components: { Page, materielTypeSelect, materialCodeSelect },
  data() {
    return {
      tableData: [],
      search: {},
      total: 0,
      loading: true,
      qualityValue: '',
      btnExportLoad: false
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    if (this.$refs.lot_no_input) {
      this.$refs.lot_no_input.focus()
    }
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const { results, count } = await barcodeQuality('get', null, { params: this.search })
        this.tableData = results || []
        this.total = count || 0
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changMateriel(val) {
      this.search.material_type = val
      this.changeList()
    },
    changeMaterialCode(val) {
      this.search.material_no = val ? val.material_no : ''
      this.changeList()
    },
    changeList() {
      this.search.page = 1
      this.getList()
    },
    changeListLot() {
      debounce(this, 'changeList')
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    },
    async submitUser(row, index) {
      try {
        await barcodeQuality('post', null, { data: {
          quality_status: this.qualityValue,
          lot_no: row.lot_no
        }})
        this.tableData[index].quality = this.qualityValue
        this.tableData[index].visible = false
      } catch (e) {
        //
      }
    },
    exportTable() {
      this.btnExportLoad = true
      barcodeQualityExport()
        .then(res => {
          const link = document.createElement('a')
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = '原材料临时快检结果录入.xlsx' // 下载的文件名
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

<style>

</style>
