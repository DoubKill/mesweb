<template>
  <div>
    <!-- 原材料选择 -->
    <el-dialog
      :close-on-press-escape="false"
      width="70%"
      title="原材料选择"
      :visible.sync="dialogRawMaterialSync"
      :before-close="handleClose"
    >
      <el-form :inline="true">
        <el-form-item label="原材料类别">
          <MaterialTypeSelect
            v-model="search.material_type_id"
            @change="materialTypeChange"
          />
        </el-form-item>
        <el-form-item label="原材料编号">
          <el-input
            v-model="search.material_no"
            @input="materialTypeChange"
          />
        </el-form-item>
        <el-form-item label="原材料名称">
          <el-input
            v-model="search.material_name"
            @input="materialTypeChange"
          />
        </el-form-item>
      </el-form>

      <el-table
        highlight-current-row
        :data="tableRawMaterialData"
        border
      >
        <el-table-column
          align="center"
          label="S"
          type="index"
          width="30"
        />
        <el-table-column
          align="center"
          prop="material_no"
          label="原材料代码"
        />
        <el-table-column
          align="center"
          prop="material_name"
          label="原材料名称"
        />
        <el-table-column
          align="center"
          prop="material_type_name"
          label="原材料类别"
        />
        <el-table-column
          align="center"
          prop="is_binding"
          label="是否绑定物料"
        />
        <el-table-column
          align="center"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button-group>
              <el-button
                size="mini"
                @click="handleMaterialSelect(scope.row)"
              >选中
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <page
        :total="total"
        :current-page="search.page"
        :old-page="false"
        @currentChange="currentChange"
      />
    </el-dialog>
  </div>
</template>

<script>
import MaterialTypeSelect from '@/components/MaterialTypeSelect'
import { materials_url } from '@/api/rubber_recipe_fun'
import page from '@/components/page'
export default {
  components: { MaterialTypeSelect, page },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogRawMaterialSync: false,
      search: {
        use_flag: true
      },
      tableRawMaterialData: [],
      total: 0
    }
  },
  watch: {
    show(val) {
      this.dialogRawMaterialSync = val
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        const data = await materials_url('get', { params: this.search })
        this.total = data.count
        this.tableRawMaterialData = data.results
      } catch (e) {
        //
      }
    },
    materialTypeChange() {
      this.search.page = 1
      this.getList()
    },
    handleMaterialSelect(row) {
      if (row.is_binding === 'N') {
        this.$confirm('该原材料未绑定ERP物料信息，投料防错可能会不合格，是否继续选中?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$emit('handleMaterialSelect', row)
        }).catch(() => {
          return
        })
      } else {
        this.$emit('handleMaterialSelect', row)
      }
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    },
    clearVal() {
      this.search = {
        use_flag: true
      }
      this.getList()
    },
    handleClose(done) {
      this.$emit('handleCloseMaterialSelection')
      done()
    }
  }
}
</script>

<style>

</style>
