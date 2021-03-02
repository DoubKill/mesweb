<template>
  <div>
    <!-- 小料配料标准管理 -->
    <el-form :inline="true">
      <el-form-item label="状态">
        <batching-used-type-select @usedTypeChange="usedTypeChange" />
      </el-form-item>
      <el-form-item label="段次">
        <stage-id-select
          v-model="getParams.stage_id"
          @change="stageChange"
        />
      </el-form-item>
      <el-form-item label="胶料编码">
        <el-input
          v-model="getParams.stage_product_batch_no"
          placeholder="请输入胶料编码"
          @input="stageChange"
        />
      </el-form-item>
      <el-form-item style="float: right">
        <el-button
          v-permission="['weight_batching','add']"
          @click="add"
        >新建</el-button>
      </el-form-item>
      <el-form-item
        style="float: right"
      >
        <el-button v-permission="['weight_batching','change']" :disabled="!currentRow||currentRow.used_type!==1" @click="batching">配料</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="weighBatchingList"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @current-change="handleCurrentChange"
    >
      <el-table-column label="No" type="index" align="center" />
      <el-table-column label="小料配方编码" width="165" prop="weight_batch_no" align="center">
        <template slot-scope="scope">
          <el-link type="primary" :underline="false" @click.stop="showDetail(scope.row)">{{ scope.row.weight_batch_no }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="胶料配方编码" width="130" prop="stage_product_batch_no" align="center" />
      <el-table-column label="炼胶机类型" prop="category_name" align="center" />
      <el-table-column label="炼胶时间" prop="production_time_interval" align="center" />
      <el-table-column
        label="状态"
        prop="used_type"
        :formatter="usedTypeFormatter"
        align="center"
      />
      <el-table-column label="操作" width="148" align="center">
        <template slot-scope="{row}">
          <el-button-group>
            <el-button
              v-if="(row.used_type === 5||row.used_type === 6)&&checkPermission(['weight_batching','edit'])"
              size="mini"
              @click="changeUsedType(row.id, 1)"
            >编辑</el-button>
            <el-button
              v-if="row.used_type === 1&&checkPermission(['weight_batching','submit'])"
              size="mini"
              @click="changeUsedType(row.id, null)"
            >提交</el-button>
            <el-button
              v-if="row.used_type === 2&&checkPermission(['weight_batching','check'])"
              size="mini"
              @click="changeUsedType(row.id, 3)"
            >校对</el-button>
            <el-button
              v-if="row.used_type === 3&&checkPermission(['weight_batching','use'])"
              size="mini"
              @click="changeUsedType(row.id, 4)"
            >启用</el-button>
            <el-button
              v-if="row.used_type === 2&&checkPermission(['weight_batching','refuse'])"
              size="mini"
              @click="changeUsedType(row.id, 5)"
            >驳回</el-button>
            <el-button
              v-if="(row.used_type === 5||row.used_type === 4)&&checkPermission(['weight_batching','abandon'])"
              size="mini"
              @click="changeUsedType(row.id, 6)"
            >废弃</el-button>
          </el-button-group>
        </template>
      </el-table-column>
      <el-table-column label="创建者" prop="created_username" align="center" />
      <el-table-column label="创建时间" width="150" prop="created_date" align="center" />
    </el-table>
    <page :total="total" :current-page="getParams.page" @currentChange="currentChange" />

    <el-dialog
      title="胶料配方列表"
      width="90%"
      :visible.sync="productBatchingListVisible"
    >
      <product-batching-list :show="productBatchingListVisible" @productBatchingSelect="productBatchingSelect" />
      <span slot="footer">
        <el-button @click="productBatchingListVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="!productBatching" @click="handleCreateWeighBatching">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="textMap[dialogStatus] + '小料配方称量信息'"
      width="90%"
      :visible.sync="dialogFormVisible"
    >
      <weigh-batching-detail-form
        :product-batching="productBatching"
        :edit="dialogStatus != 'show'"
        :is-create-text="dialogStatus==='create'"
        :current-id="currentId"
        @created="createdFun"
      />
    </el-dialog>
  </div>
</template>

<script>
import { weighBatchingList, changeUsedType, weighBatchingInfo } from '@/api/small-material-recipe'
// import { rubber_material_url } from '@/api/rubber_recipe_fun'
import page from '@/components/page'
import BatchingUsedTypeSelect from '@/components/BatchingUsedTypeSelect'
import StageIdSelect from '@/components/StageSelect/StageIdSelect'
import ProductBatchingList from './components/product_batching_list'
import WeighBatchingDetailForm from './components/weigh_batching_detail_form'
import { checkPermission } from '@/utils/index'
export default {
  components: { page, BatchingUsedTypeSelect, StageIdSelect, ProductBatchingList, WeighBatchingDetailForm },
  data() {
    return {
      total: 0,
      getParams: {
        page: 1,
        used_type: null,
        stage_id: null,
        stage_product_batch_no: ''
      },
      weighBatchingList: [],
      listLoading: true,
      productBatchingListVisible: false,
      productBatching: null,
      dialogStatus: '',
      dialogFormVisible: false,
      textMap: {
        update: '编辑',
        create: '创建',
        show: '显示'
      },
      currentRow: null,
      currentId: ''
    }
  },
  created() {
    this.getWeighBatchingList()
  },
  methods: {
    checkPermission,
    async showDetail(row) {
      this.productBatching = await weighBatchingInfo(row.id)
      this.productBatching.state = this.usedTypeFormatter(row)
      this.currentId = row.id
      this.dialogStatus = 'show'
      this.dialogFormVisible = true
    },
    async batching() {
      this.productBatching = await weighBatchingInfo(this.currentRow.id)
      this.productBatching.state = this.usedTypeFormatter(this.currentRow)
      this.currentId = this.currentRow.id
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    changeList() {
      this.getParams.page = 1
      this.getWeighBatchingList()
    },
    handleCurrentChange(val) {
      this.currentRow = val
    },
    async handleCreateWeighBatching() {
      // const response = await weighBatchingList({ product_batching: this.productBatching.product_batching })
      // if (response.results.length > 0) {
      //   this.$alert('该胶料配方已关联小料配方', '注意', {
      //     confirmButtonText: '确定'
      //   })
      //   return
      // }
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.productBatchingListVisible = false
    },
    productBatchingSelect(productBatching) {
      if (productBatching.id) {
        console.log(productBatching, 'productBatching')
        this.productBatching = {
          product_batching: productBatching.id,
          category_name: productBatching.dev_type_name,
          stage_product_batch_no: productBatching.stage_product_batch_no,
          product_name: productBatching.product_name,
          batching_weight: productBatching.batching_weight,
          production_time_interval: productBatching.production_time_interval
        }
      }
    },
    changeUsedType(id, target_used_type) {
      changeUsedType(id, target_used_type).then(response => {
        this.getWeighBatchingList()
      })
    },
    usedTypeFormatter(row, column) {
      switch (row.used_type) {
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
    },
    usedTypeChange(used_type) {
      this.getParams.used_type = used_type
      this.getParams.page = 1
      this.getWeighBatchingList()
    },
    stageChange() {
      this.getParams.page = 1
      this.getWeighBatchingList()
    },
    currentChange(page) {
      this.getParams.page = page
      this.getWeighBatchingList()
    },
    async getWeighBatchingList() {
      this.listLoading = true
      try {
        const response = await weighBatchingList(this.getParams)
        this.total = response.count
        this.weighBatchingList = response.results
      } catch {
        //
      }
      this.listLoading = false
    },
    add() {
      this.productBatching = null
      this.productBatchingListVisible = true
    },
    createdFun() {
      this.dialogFormVisible = false
      this.getParams.page = 1
      this.getWeighBatchingList()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
