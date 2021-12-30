<template>
  <div>
    <!--细料胶块放行处理 -->
    <el-form :inline="true">
      <el-form-item label="原因类别">
        <el-select
          v-model="search.reason_type"
          style="width:150px"
          clearable
          placeholder="请选择"
          @change="changeList"
        >
          <el-option
            v-for="item in ['物料名不一致','重量不匹配','超过有效期','未到放置期']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="机台">
        <equip-select
          style="width:150px"
          @equipSelected="equipSelected"
        />
      </el-form-item>
      <el-form-item label="计划编号">
        <el-input v-model="search.plan_classes_uid" style="width:150px" clearable @input="debounceFun" />
      </el-form-item>
      <el-form-item label="配方编号">
        <el-input v-model="search.product_no" style="width:150px" clearable @input="debounceFun" />
      </el-form-item>
      <el-form-item label="物料名称">
        <el-input v-model="search.real_material" style="width:150px" clearable @input="debounceFun" />
      </el-form-item>
      <el-form-item label="物料条码">
        <el-input v-model="search.bra_code" style="width:150px" clearable @input="debounceFun" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="search.status"
          style="width:150px"
          clearable
          placeholder="请选择"
          @change="changeList"
        >
          <el-option
            v-for="item in ['未处理','已处理']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button v-permission="['replace_material', 'opera']" type="primary" :loading="submit" @click="feed('可投料')">可投料</el-button>
        <el-button v-permission="['replace_material', 'opera']" type="primary" :loading="submitNo" @click="feed('不可投料')">不可投料</el-button>
        <!-- <el-button type="primary">导出Excel</el-button> -->
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="tableData"
      row-key="id"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="40"
        :reserve-selection="true"
      />
      <el-table-column
        prop="reason_type"
        label="原因类别"
        min-width="20"
      />
      <el-table-column
        prop="equip_no"
        label="机台"
        min-width="20"
      />
      <el-table-column
        prop="plan_classes_uid"
        label="计划编号"
        min-width="20"
      />
      <el-table-column
        prop="product_no"
        label="配方编号"
        min-width="20"
      />
      <el-table-column
        prop="expire_datetime"
        label="有效期/放置期"
        min-width="20"
      />
      <el-table-column
        prop="recipe_material_no"
        label="配方投入标准"
        width="170"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.status==='已处理'">{{ scope.row.recipe_material_no }}</span>
          <el-select
            v-else
            v-model="scope.row.recipe_material_no"
            style="width:150px"
            clearable
            placeholder="请选择"
            @visible-change="getMaterial($event,scope.row)"
            @change="changeMaterial(scope.row)"
          >
            <el-option
              v-for="item in options"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        prop="recipe_material"
        label="配方投入物料名称"
        min-width="20"
      />
      <el-table-column
        prop="real_material_no"
        label="实际投入物料"
        min-width="20"
      />
      <el-table-column
        prop="real_material"
        label="实际投入物料名称"
        min-width="20"
      />
      <el-table-column
        prop="bra_code"
        label="实际投入物料条码"
        min-width="20"
      />
      <el-table-column
        prop="status"
        label="状态"
        min-width="20"
      />
      <el-table-column
        prop="created_username"
        label="处理人"
        min-width="20"
      />
      <el-table-column
        prop="created_date"
        label="处理时间"
        min-width="20"
      />
    </el-table>
  </div>
</template>

<script>
import EquipSelect from '@/components/EquipSelect'
import { debounce } from '@/utils'
import { replaceMaterial, materialMultiUpdate, materialDetailsAux } from '@/api/jqy'
export default {
  name: 'BanburyingSubstitutes',
  components: { EquipSelect },
  data() {
    return {
      search: {},
      submit: false,
      submitNo: false,
      multipleSelection: [],
      options: [],
      tableData: [],
      loading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await replaceMaterial('get', null, { params: this.search })
        this.tableData = data
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async getMaterial(val, row) {
      if (val) {
        try {
          const data = await materialDetailsAux('get', null, { params: { plan_classes_uid: row.plan_classes_uid, from_mes: 1 }})
          this.options = data
        } catch (e) {
          this.options = []
        }
      }
    },
    changeMaterial(row) {
      row.recipe_material = row.recipe_material_no
    },
    async feed(val) {
      const obj = []
      this.multipleSelection.forEach(d => {
        obj.push({ id: d.id, recipe_material: d.recipe_material, recipe_material_no: d.recipe_material_no })
      })
      if (this.multipleSelection.length > 0) {
        if (this.multipleSelection.every(d => d.status === '未处理')) {
          try {
            val === '可投料' ? this.submit = true : this.submitNo = true
            await materialMultiUpdate('post', null, { data: { update_material_list: obj, opera_type: val }})
            this.$message.success('操作成功')
            val === '可投料' ? this.submit = false : this.submitNo = false
            this.$refs.multipleTable.clearSelection()
            this.getList()
          } catch (e) {
            val === '可投料' ? this.submit = false : this.submitNo = false
          }
        } else {
          this.$message('已处理状态不能重复处理')
        }
      } else {
        this.$message.info('请选择数据')
      }
    },
    equipSelected(obj) {
      this.$set(this.search, 'equip_no', obj ? obj.equip_no : '')
      this.changeList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    debounceFun() {
      debounce(this, 'getList')
    },
    changeList() {
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
