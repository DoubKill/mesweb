<template>
  <div
    v-loading="loading"
    element-loading-text="加载中..."
  >
    <!-- 胶料配方标准管理 -->
    <el-form :inline="true">
      <el-form-item label="状态">
        <el-select
          v-model="search.used_type"
          style="width: 150px"
          clearable
          placeholder="请选择"
          @change="changeSearch"
        >
          <el-option
            v-for="item in rubberStateOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="SITE">
        <SITESelect v-model="search.site" @returnBack="changeSearch" />
      </el-form-item>
      <el-form-item label="段次">
        <StageIdSelect
          v-model="search.stage_id"
          @change="changeSearch"
        />
      </el-form-item>
      <el-form-item label="胶料编码">
        <el-input
          v-model="search.stage_product_batch_no"
          style="width: 200px"
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item style="float: right">
        <el-button
          v-if="checkPermission(['productbatching','add'])"
          @click="newRubberClicked"
        >新建</el-button>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button
          v-if="checkPermission(['productbatching','change'])"
          :disabled="![1,4].includes(currentRow.used_type)"
          @click="showPutRubberMaterialDialog"
        >配料</el-button>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button
          v-if="checkPermission(['productbatching','add'])"
          :disabled="!currentRow.id"
          @click="copyClicked"
        >复制</el-button>
      </el-form-item>
    </el-form>
    <el-table
      highlight-current-row
      :data="tableData"
      border
      size="mini"
      @row-click="handleCurrentChange"
    >
      <el-table-column
        align="center"
        type="index"
        width="40"
        label="No"
      />
      <el-table-column
        min-width="20"
        prop="stage_product_batch_no"
        label="胶料配方编码"
      >
        <template slot-scope="scope">
          <el-link type="primary" :underline="false" @click="showGridTable(scope.row.id)">{{ scope.row.stage_product_batch_no }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        min-width="10"
        prop="product_name"
        label="胶料名称"
      />
      <el-table-column
        align="center"
        prop="site_name"
        label="site"
        width="40px"
      />
      <el-table-column
        align="center"
        prop="stage_name"
        label="段次"
        width="45px"
      />
      <el-table-column
        min-width="10"
        prop="dev_type_name"
        label="炼胶机类型"
      />
      <el-table-column
        min-width="10"
        prop="batching_weight"
        label="配料重量"
      />
      <el-table-column
        min-width="10"
        prop="production_time_interval"
        label="炼胶时间"
      />
      <el-table-column
        prop="used_type"
        label="状态"
        :formatter="usedTypeFormatter"
        width="40px"
      />
      <el-table-column
        align="center"
        width="148"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              v-if="scope.row.used_type === 5 && permissionObj.productbatching.indexOf('abandon')>-1"
              size="mini"
              @click="status_recipe_fun(scope.row.id,true)"
            >编辑</el-button>
            <el-button
              v-if="scope.row.used_type === 1 && checkPermission(['productbatching','submit'])"
              size="mini"
              @click="status_recipe_fun(scope.row.id,true)"
            >提交</el-button>
            <el-button
              v-if="scope.row.used_type === 2 && checkPermission(['productbatching','check'])"
              size="mini"
              @click="status_recipe_fun(scope.row.id,true)"
            >校对</el-button>
            <el-button
              v-if="scope.row.used_type === 3 && checkPermission(['productbatching','use'])"
              size="mini"
              @click="status_recipe_fun(scope.row.id,true)"
            >启用</el-button>
            <el-button
              v-if="(scope.row.used_type === 2 && checkPermission(['productbatching','check'])) |
                (scope.row.used_type === 3 && checkPermission(['productbatching','use']))"
              size="mini"
              @click="status_recipe_fun(scope.row.id,false)"
            >驳回</el-button>
            <el-button
              v-if="checkPermission(['productbatching','abandon'])&&
                [5,4].includes(scope.row.used_type)"
              size="mini"
              @click="status_recipe_fun(scope.row.id,false)"
            >废弃</el-button>
          </el-button-group>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        width="70px"
        label="发送到上辅机"
      >
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              v-if="scope.row.used_type === 4 && checkPermission(['productbatching','send'])"
              size="mini"
              @click="send_auxiliary(scope.row)"
            >发送</el-button>
          </el-button-group>
        </template>
      </el-table-column>
      <el-table-column
        min-width="10"
        prop="created_username"
        label="创建者"
      />
      <el-table-column
        min-width="10"
        prop="submit_username"
        label="提交者"
      />
      <el-table-column
        min-width="10"
        prop="check_username"
        label="校对者"
      />
      <el-table-column
        min-width="10"
        prop="used_username"
        label="启用者"
      />
      <el-table-column
        min-width="10"
        prop="reject_username"
        label="驳回者"
      />
      <el-table-column
        prop="obsolete_username"
        label="废弃者"
        min-width="10"
      />
      <el-table-column
        min-width="10"
        prop="created_date"
        label="创建时间"
      />
    </el-table>
    <page
      :total="total"
      :current-page="search.page"
      :old-page="false"
      @currentChange="currentChange"
    />
    <createdRubberMaterial
      ref="createdRubberMaterialRef"
      :show="dialogAddRubberMaterial"
      :material-form="materialForm"
      :is-view="isView"
      :is-copy="isCopy"
      @handleCloseMaterial="handleCloseMaterial"
      @refreshList="changeSearch"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { checkPermission } from '@/utils'
import commonVal from '@/utils/common'
import { getToken } from '@/utils/auth'
import { rubber_material_url, send_auxiliary_url } from '@/api/rubber_recipe_fun'
import StageIdSelect from '@/components/StageSelect/StageIdSelect'
import SITESelect from './components/SITESelect'
import createdRubberMaterial from './components/createdRubberMaterial'
import page from '@/components/page'

export default {
  components: { page, StageIdSelect, createdRubberMaterial, SITESelect },
  data() {
    return {
      loading: false,
      search: {},
      currentRow: {},
      rubberStateOptions: commonVal.rubberStateList,
      tableData: [],
      rubberMaterialForm: {},
      dialogAddRubberMaterial: false,
      materialForm: {},
      total: 0,
      // 是否是查看
      isView: false,
      // 是否是复制
      isCopy: false
    }
  },
  computed: {
    ...mapGetters(['permission'])
  },
  created() {
    this.permissionObj = this.permission
    this.rubber_material_list()
  },
  methods: {
    checkPermission,
    changeSearch() {
      this.search.page = 1
      this.rubber_material_list()
    },
    newRubberClicked() {
      this.materialForm = {
        factory: '',
        site: '',
        SITE_name: '',
        stage_name: '',
        stage: '',
        product_info: '',
        product_name: '',
        versions: '',
        precept: '',
        stage_product_batch_no: '',
        production_time_interval: ''
      }
      this.dialogAddRubberMaterial = true
    },
    copyClicked() {
      this.materialForm = {
        factory: this.currentRow.factory,
        site: this.currentRow.site,
        SITE_name: this.currentRow.site_name,
        stage_name: this.currentRow.stage_name,
        stage: this.currentRow.stage,
        product_info: this.currentRow.product_info,
        product_name: this.currentRow.product_name,
        versions: this.currentRow.versions,
        precept: this.currentRow.precept,
        stage_product_batch_no: this.currentRow.stage_product_batch_no,
        id: this.currentRow.id,
        dev_type: this.currentRow.dev_type,
        dev_type_name: this.currentRow.dev_type_name,
        production_time_interval: this.currentRow.production_time_interval || ''
      }
      this.dialogAddRubberMaterial = true
      this.isCopy = true
    },
    showPutRubberMaterialDialog() {
      if (this.$refs.createdRubberMaterialRef) {
        this.isView = false
        this.isCopy = false
        this.$refs.createdRubberMaterialRef.directBatching(this.currentRow.id, false)
      }
    },
    showGridTable(id) {
      if (this.$refs.createdRubberMaterialRef) {
        this.isView = true
        this.isCopy = false
        this.$refs.createdRubberMaterialRef.directBatching(id, false)
      }
    },
    handleCurrentChange(val) {
      this.currentRow = val
    },
    async status_recipe_fun(id, bool) {
      try {
        await rubber_material_url('patch', id, { data: { pass_flag: bool }})
        this.$message.success('状态切换成功')
        this.rubber_material_list()
      } catch (e) { throw new Error(e) }
    },
    async rubber_material_list() {
      try {
        this.loading = true
        const data = await rubber_material_url('get', null, { params: this.search })
        this.tableData = data.results
        this.total = data.count
        this.loading = false
        this.currentRow.used_type = -1
        this.currentRow.id = null
        return data
      } catch (e) {
        this.loading = false
        throw new Error(e)
      }
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.rubber_material_list()
    },
    async send_auxiliary(row) {
      try {
        const data = await send_auxiliary_url('post', {
          params: {
            'product_batching_id': row.id,
            'product_no': row.stage_product_batch_no
          }
        })
        this.$message.success('发送至上辅机成功')
        this.rubber_material_list()
        const url = data.auxiliary_url + '#/recipe/list'

        window.open(url + '?AAA=' + getToken() +
        '&batch_no=' + row.stage_product_batch_no)
      } catch (e) {
        //
      }
    },
    handleCloseMaterial() {
      this.dialogAddRubberMaterial = false
      this.materialForm = {}
      this.isView = false
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
      }
    }
  }
}
</script>

<style>

</style>
