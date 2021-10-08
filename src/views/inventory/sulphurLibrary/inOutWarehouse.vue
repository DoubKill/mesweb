<template>
  <div class="liuh">
    <!-- 硫磺库  出入库管理-->
    <el-form :inline="true">
      <el-form-item label="名称:">
        <el-input v-model="search.name" clearable @input="changeDebounce" />
      </el-form-item>
      <el-form-item label="物料编码:">
        <el-input v-model="search.product_no" clearable @input="changeDebounce" />
      </el-form-item>
      <el-form-item label="供应商:">
        <el-input v-model="search.provider" clearable @input="changeDebounce" />
      </el-form-item>
      <el-form-item label="批号:">
        <el-input v-model="search.lot_no" clearable @input="changeDebounce" />
      </el-form-item>
      <el-form-item label="库区:">
        <el-select
          v-model="search.depot_name"
          clearable
          placeholder="请选择"
          @change="changeList"
          @visible-change="visibleChange"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.depot_name"
            :value="item.depot_name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="库位:">
        <el-select v-model="search.depot_site_name" clearable placeholder="请选择" @visible-change="visibleChange1" @change="changeList">
          <el-option
            v-for="item in options1"
            :key="item.id"
            :label="item.depot_site_name"
            :value="item.depot_site_name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="入库时间:">
        <el-date-picker
          v-model="search.enter_time"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          @change="changeList"
        />
      </el-form-item>
    </el-form>
    <el-form :inline="true" style="text-align:right">
      <!-- <div v-permission="['sulfur_data', 'enter']" style="display:inline-block">
        <el-form-item label="扫码入库:">
          <el-input v-model="scanCode" clearable @input="changeScanCode" />
        </el-form-item>
      </div> -->
      <el-form-item>
        <el-button v-permission="['sulfur_data', 'enter']" type="primary" @click="changeManual">手动入库</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
    >
      <el-table-column
        prop="name"
        label="名称"
        min-width="20"
      />
      <el-table-column
        prop="product_no"
        label="物料编码"
        min-width="20"
      />
      <el-table-column
        prop="provider"
        label="供应商"
        min-width="20"
      />
      <el-table-column
        prop="lot_no"
        label="批号"
        min-width="20"
      />
      <el-table-column
        prop="depot_name"
        label="库区"
        min-width="20"
      />
      <el-table-column
        prop="depot_site_name"
        label="库位"
        min-width="20"
      />
      <el-table-column
        prop="enter_time"
        label="入库时间"
        min-width="20"
      />
      <el-table-column
        label="操作"
        width="120"
      >
        <template slot-scope="{row}">
          <el-button
            v-permission="['sulfur_data', 'outer']"
            type="primary"
            @click="deliveryFun(row)"
          >出库</el-button>
        </template>
      </el-table-column>
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />
    <el-dialog
      :title="formObj.id?'硫磺出库':'硫磺入库'"
      :visible.sync="dialogVisible"
      width="700px"
      :before-close="handleClose"
    >
      <el-form
        ref="formObj"
        :model="formObj"
        :rules="rules"
        inline
        label-width="100px"
      >
        <el-form-item label="物料编码" prop="product_no">
          <el-autocomplete
            v-if="!formObj.id"
            v-model="formObj.product_no"
            :fetch-suggestions="querySearch"
            placeholder="请输入内容"
            value-key="product_no"
            :debounce="1000"
            @input="productSelect"
            @focus="productFocus(false)"
          />
          <span v-else>{{ formObj.product_no }}</span>
        </el-form-item>
        <el-form-item label="物料名称" prop="name">
          <el-autocomplete
            v-if="!formObj.id"
            v-model="formObj.name"
            :fetch-suggestions="querySearch"
            placeholder="请输入内容"
            value-key="name"
            :debounce="1000"
            @input="productSelect"
            @focus="productFocus(true)"
          />
          <span v-else>{{ formObj.name }}</span>
        </el-form-item>
        <el-form-item label="供应商" prop="provider">
          <el-autocomplete
            v-if="!formObj.id"
            v-model="formObj.provider"
            :fetch-suggestions="querySearch"
            placeholder="请输入内容"
            value-key="provider"
            :debounce="1000"
            @focus="productFocus(1)"
            @input="productSelect"
          />
          <span v-else>{{ formObj.provider }}</span>
        </el-form-item>
        <el-form-item label="批号" prop="lot_no">
          <el-input v-if="!formObj.id" v-model="formObj.lot_no" :disabled="formObj.id" />
          <span v-else>{{ formObj.lot_no }}</span>
        </el-form-item>
        <el-form-item label="库区" prop="depot">
          <el-select
            v-if="!formObj.id"
            v-model="formObj.depot"
            placeholder="请选择"
            @visible-change="visibleChange"
            @change="changeDepot"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.depot_name"
              :value="item.id"
            />
          </el-select>
          <span v-else>{{ formObj.depot_name }}</span>
        </el-form-item>
        <el-form-item label="库位" prop="depot_site">
          <el-select
            v-if="!formObj.id"
            v-model="formObj.depot_site"
            placeholder="请选择"
            @visible-change="visibleChange1"
          >
            <el-option
              v-for="item in formObj.depot?options1.filter(d=>d.depot === formObj.depot):[]"
              :key="item.id"
              :label="item.depot_site_name"
              :value="item.id"
            />
          </el-select>
          <span v-else>{{ formObj.depot_site_name }}</span>
        </el-form-item>
        <el-form-item label="单重（kg）" prop="weight">
          <el-input v-if="!formObj.id" v-model="formObj.weight" />
          <span v-else>{{ formObj.weight }}</span>
        </el-form-item>
        <el-form-item label="数量（包）" prop="num">
          <el-input-number v-model="formObj.num" controls-position="right" :min="0" :step="1" step-strictly />
        </el-form-item>
        <el-form-item label="总重（kg）" prop="ccc">
          <el-input v-model="formObj.ccc" disabled />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button type="primary" :loading="loadingBtn" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { debounce } from '@/utils'
import page from '@/components/page'
import { wmsMaterialSearch } from '@/api/base_w_three'
import { sulfurData, sulfurDepot, sulfurDepotSite } from '@/api/base_w_four'
export default {
  name: 'SulphurInOutWarehouse',
  components: { page },
  data() {
    return {
      search: {},
      options: [],
      options1: [],
      scanCode: '',
      tableData: [],
      dialogVisible: false,
      formObj: {},
      total: 0,
      rules: {
        name: [
          { required: true, message: '请输入物料名称', trigger: 'blur' }
        ],
        product_no: [
          { required: true, message: '请输入物料编码', trigger: 'blur' }
        ],
        provider: [
          { required: true, message: '请输入供应商', trigger: 'blur' }
        ],
        lot_no: [
          { required: true, message: '请输入批号', trigger: 'blur' }
        ],
        depot: [
          { required: true, message: '请选择库区', trigger: 'change' }
        ],
        depot_site: [
          { required: true, message: '请选择库位', trigger: 'change' }
        ],
        weight: [
          { required: true, message: '请输入单重', trigger: 'blur' }
        ],
        num: [
          { required: true, message: '请输入包数', trigger: 'blur' }
        ]
      },
      loadingBtn: false,
      restaurants: [],
      isProductName: false
    }
  },
  watch: {
    'formObj.num'() {
      const num = this.formObj.num ? this.formObj.num : 0
      const weight = this.formObj.weight ? this.formObj.weight : 0
      this.formObj.ccc = num * weight
    },
    'formObj.weight'() {
      const num = this.formObj.num ? this.formObj.num : 0
      const weight = this.formObj.weight ? this.formObj.weight : 0
      this.formObj.ccc = num * weight
    }
  },
  created() {
    this.getDepotList()
    this.getDepotSiteList()
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await sulfurData('get', null, { params: this.search })
        this.tableData = data.results
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async getDepotList() {
      try {
        const data = await sulfurDepot('get', null, { params: { all: 1 }})
        this.options = data.results
      } catch (e) {
        //
      }
    },
    async getDepotSiteList() {
      try {
        const data = await sulfurDepotSite('get', null, { params: { depot_site: 1 }})
        this.options1 = data.results
      } catch (e) {
        //
      }
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    },
    changeDebounce() {
      this.search.page = 1
      debounce(this, 'getList')
    },
    changeList() {
      this.search.page = 1
      this.search.s_time = this.search.enter_time ? this.search.enter_time[0] : ''
      this.search.e_time = this.search.enter_time ? this.search.enter_time[1] : ''
      this.getList()
    },
    visibleChange(bool) {
      if (bool) {
        this.getDepotList()
      }
    },
    visibleChange1(bool) {
      if (bool) {
        this.getDepotSiteList()
      }
    },
    changeScanCode() {
      // 去获取接口 在接口获取回来后去打开弹框
      if (this.scanCode) {
        debounce(this, 'getWmsMaterial')
      }
    },
    async getWmsMaterial() {
      try {
        // this.scanCode = 'BHZ12105311651140001'
        const arr = await wmsMaterialSearch('get', null, { params: { tmh: this.scanCode }})
        const obj = arr[0]
        this.formObj.product_no = obj.WLXXID
        this.formObj.name = obj.WLMC
        this.formObj.provider = obj.WLDWMC
        this.formObj.lot_no = obj.PH
        this.dialogVisible = true
      } catch (e) { throw new Error(e) }
    },

    changeManual() {
      this.dialogVisible = true
    },
    deliveryFun(row) {
      this.dialogVisible = true
      this.formObj = JSON.parse(JSON.stringify(row))
    },
    handleClose(done) {
      this.formObj = {}
      this.dialogVisible = false
      this.$refs.formObj.resetFields()
      if (done) {
        done()
      }
    },
    changeDepot() {
      this.$set(this.formObj, 'depot_site', undefined)
    },
    submitFun() {
      this.$refs.formObj.validate(async(valid) => {
        if (valid) {
          try {
            this.loadingBtn = true
            this.formObj.sulfur_status = this.formObj.id ? 2 : 1
            await sulfurData('post', null, { data: this.formObj })
            this.$message.success('入库成功')
            this.handleClose(false)
            this.getList()
            this.loadingBtn = false
          } catch (e) {
            this.loadingBtn = false
          }
        } else {
          return false
        }
      })
    },
    productSelect() {
      debounce(this, 'getProductSelect')
    },
    async getProductSelect() {
      try {
        const obj = {
          name: this.formObj.name,
          product_no: this.formObj.product_no,
          provider: this.formObj.provider
        }
        const data = await sulfurData('get', null, { params: obj })
        const _obj = data.results[0]
        this.$set(this.formObj, 'depot', _obj.depot)
        this.$set(this.formObj, 'depot_site', _obj.depot_site)
        this.$set(this.formObj, 'weight', _obj.weight)
      } catch (e) {
        //
      }
    },
    async productFocus(bool) {
      this.isProductName = bool
      this.restaurants = []
    },
    async querySearch(queryString, cb) {
      if (queryString) {
        try {
          let obj = {
            _name: this.formObj.name
          }
          if (this.isProductName === 1) {
            obj = {
              _provider: this.formObj.provider
            }
          } else if (!this.isProductName) {
            obj = {
              _product_no: this.formObj.product_no
            }
          }
          const data = await sulfurData('get', null, { params: obj })
          this.restaurants = data || []
        } catch (e) {
        //
        }
      }
      cb(this.restaurants)
    }
  }
}
</script>

<style lang="scss">
.liuh .el-input{
  width:209px;
}
.liuh {
  .el-input-number .el-input{
    width:auto !important;
  }

}
</style>
