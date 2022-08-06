<template>
  <div>
    <!-- 原材料配比查询 -->
    <el-form :inline="true">
      <el-form-item label="状态">
        <el-select
          v-model="search.used_type"
          style="width: 120px"
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="item in rubberStateOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="生产机型">
        <equip-category-select
          v-model="search.dev_type"
        />
      </el-form-item>
      <el-form-item label="胶料编码">
        <el-input
          v-model="search.stage_product_batch_no"
          style="width: 200px"
          clearable
        />
      </el-form-item>
      <el-form-item label="配方类别">
        <el-select
          v-model="search.recipe_type"
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="item in categoryOptions"
            :key="item.id"
            :label="item.global_no"
            :value="item.global_name"
          />
        </el-select>
      </el-form-item>
      <br>
      <el-form-item label="原材料类别">
        <el-select
          v-model="materialType"
          multiple
          clearable
          placeholder="请选择"
          style="width:300px"
          @change="changeMaterialType"
        >
          <el-option
            v-for="item in materialTypeOptions"
            :key="item.id"
            :label="item.global_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="原材料名称">
        <el-select
          v-model="search.material_names"
          clearable
          placeholder="请选择"
          filterable
          multiple
          style="width:300px"
        >
          <el-option
            v-for="item in rawMaterialOptions"
            :key="item.id"
            :label="item.material_name"
            :value="item.material_name"
          />
        </el-select>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button @click="changeSearch">查询</el-button>
        <el-button type="primary" :loading="btnExportLoad" @click="exportTable">导出Excel</el-button>
      </el-form-item>
    </el-form>
    <div v-loading="loading">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column
          type="index"
          width="50"
          label="No"
        />
        <el-table-column
          prop="stage_product_batch_no"
          label="胶料配方编码"
        />
        <el-table-column
          prop="dev_type_name"
          label="炼胶机类型"
        />
        <el-table-column
          prop="used_type"
          label="状态"
          :formatter="usedTypeFormatter"
        />
        <el-table-column
          v-for="item in headList"
          :key="item"
          :label="item+'(kg)'"
        >
          <template slot-scope="{row}">
            <span v-if="row.detail.filter(d=>d.material_name===item).length">{{ row.detail.filter(d=>d.material_name===item)[0].weight }}
            </span>
          </template>
        </el-table-column>
      </el-table>

      <div v-show="false">
        <el-table
          v-if="btnExportLoad"
          id="out-table"
          :data="tableData1"
          border
          style="width: 100%"
        >
          <el-table-column
            type="index"
            width="50"
            label="No"
          />
          <el-table-column
            prop="stage_product_batch_no"
            label="胶料配方编码"
          />
          <el-table-column
            prop="dev_type_name"
            label="炼胶机类型"
          />
          <el-table-column
            prop="used_type"
            label="状态"
            :formatter="usedTypeFormatter"
          />
          <el-table-column
            v-for="item in headList"
            :key="item"
            :label="item+'(kg)'"
          >
            <template slot-scope="{row}">
              <span v-if="row.detail.filter(d=>d.material_name===item).length">{{ row.detail.filter(d=>d.material_name===item)[0].weight }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <page
      :total="total"
      :current-page="search.page"
      :old-page="false"
      @currentChange="currentChange"
    />
  </div>
</template>

<script>
import commonVal from '@/utils/common'
import EquipCategorySelect from '@/components/EquipCategorySelect'
import { globalCodesUrl, materialsUrl, productRatio } from '@/api/base_w'
import page from '@/components/page'
import { exportExcel } from '@/utils/index'
export default {
  name: 'RbMaterialCompare',
  components: { EquipCategorySelect, page },
  data() {
    return {
      rubberStateOptions: commonVal.rubberStateList,
      search: {},
      loading: false,
      materialType: [],
      categoryOptions: [],
      materialTypeOptions: [],
      rawMaterialOptions: [],
      btnExportLoad: false,
      total: 0,
      headList: [],
      tableData: [],
      tableData1: []
    }
  },
  created() {
    this.getFormulaType()
    this.getType()
    this.getRawMaterial()
  },
  methods: {
    async get_list() {
      try {
        if (!this.search.material_names || !this.search.material_names.length) {
          this.$message('请选择原材料名称')
          return
        }
        const obj = JSON.parse(JSON.stringify(this.search))
        obj.material_names = obj.material_names.join(',')
        if (this.btnExportLoad) {
          obj.page_size = 10000
        } else {
          this.loading = true
        }
        const data = await productRatio('get', null, { params: obj })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
        this.headList = this.search.material_names

        if (this.btnExportLoad) {
          this.tableData1 = data.results
          this.$nextTick(d => {
            exportExcel('原材料配比查询')
            this.btnExportLoad = false
          })
        }
      } catch (e) {
        this.loading = false
      }
    },
    changeSearch() {
      this.search.page = 1
      this.get_list()
    },
    async getFormulaType() {
      try {
        const data = await globalCodesUrl('get', { params: { class_name: '配方类别' }})
        this.categoryOptions = data.results
      } catch (e) {
        //
      }
    },
    getType() {
      globalCodesUrl('get', {
        params: {
          class_name: '原材料类别',
          all: 1
        }
      }).then((response) => {
        this.materialTypeOptions = response.results
      }).catch(function() {
      })
    },
    async getRawMaterial(arr = []) {
      try {
        const _arr = arr.join(',')
        const data = await materialsUrl('get', null, { params: { all: 1, material_type_ids: _arr }})
        this.rawMaterialOptions = data.results
        // 去掉-c-x后缀
        this.rawMaterialOptions.forEach((d, i) => {
          const a = d.material_name.slice(-2)
          if (['-C', '-X'].includes(a)) {
            d.material_name.slice(0, d.material_name.length - 2)
            d.material_name = d.material_name.slice(0, d.material_name.length - 2)
          }
        })

        // 去重
        var obj = {}
        var newArr = this.rawMaterialOptions.reduce((item, next) => {
          obj[next.material_name]
            ? ' '
            : (obj[next.material_name] = true && item.push(next))
          return item
        }, [])
        this.rawMaterialOptions = newArr || []
      } catch (e) {
        this.rawMaterialOptions = []
      }
    },
    async changeMaterialType(arr) {
      this.search.material_ids = []
      this.getRawMaterial(arr)
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.get_list()
    },
    usedTypeFormatter: function(row) {
      return this.usedTypeChoice(row.used_type)
    },
    usedTypeChoice: function(usedType) {
      switch (usedType) {
        case 1:
          return '编辑'
        case 2:
          return '提交'
        case 3:
          return '校对'
        case 4:
          return '启用'
        case 5:
          return '驳回'
        case 6:
          return '废弃'
        case 7:
          return '停用'
      }
    },
    exportTable() {
      this.btnExportLoad = true
      this.get_list()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
