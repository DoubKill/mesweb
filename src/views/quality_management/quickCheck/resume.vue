<template>
  <div>
    <!-- 检测履历查询 -->
    <el-form :inline="true">
      <el-form-item label="实验区分">
        <el-select
          v-model="search.test_indicator_name"
          placeholder="请选择"
          clearable
          @change="searchList"
          @visible-change="visibleChange"
        >
          <el-option
            v-for="(item,i) in options"
            :key="i"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="生产机号">
        <equip-select :equip_no_props="search.equip_no" @changeSearch="equipSearch" />
      </el-form-item>
      <el-form-item label="生产日期">
        <el-date-picker
          v-model="search.factory_date"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          clearable
          @change="searchList"
        />
      </el-form-item>
      <el-form-item label="生产班次">
        <class-select
          @classSelected="classChanged"
        />
      </el-form-item>
      <el-form-item label="胶料规格">
        <allProductNoSelect @productBatchingChanged="productBatchingChanged" />
      </el-form-item>
      <el-form-item label="检测时间">
        <el-date-picker
          v-model="search.test_time"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择检测时间"
          clearable
          @change="searchList"
        />
      </el-form-item>
      <el-form-item label="检测班次">
        <class-select
          @classSelected="testClassChanged"
        />
      </el-form-item>
      <!-- <el-form-item label="检测班组">
        <el-select
          v-model="search.group"
          clearable
          placeholder="请选择"
          @visible-change="changeGroup"
        >
          <el-option
            v-for="group in groups"
            :key="group.id"
            :label="group.global_name"
            :value="group.id"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="检测机号">
        <el-select
          v-model="search.test_equip"
          clearable
          placeholder="请选择"
          @visible-change="changeTestEquip"
          @change="searchList"
        >
          <el-option
            v-for="group in testEquipList"
            :key="group.id"
            :label="group.no"
            :value="group.no"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="检测计划编号">
        <el-input
          v-model="search.plan_uid"
          clearable
          @input="getDebounce"
        />
      </el-form-item>
      <el-form-item label="检测状态">
        <el-select
          v-model="search.status"
          clearable
          placeholder="请选择"
          @change="searchList"
        >
          <el-option
            v-for="(item,key) in statusList"
            :key="key"
            :label="item"
            :value="key"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="检测人员">
        <el-input
          v-model="search.aaa"
          clearable
          @input="getDebounce"
        />
      </el-form-item> -->
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="factory_date"
        label="生产日期"
        min-width="20"
      />
      <el-table-column
        prop="equip_no"
        label="生产机号"
        min-width="20"
      />
      <el-table-column
        prop="production_group"
        label="生产班组"
        min-width="20"
        :formatter="(row)=>{
          return row.production_classes+'/'+row.production_group
        }"
      />
      <el-table-column
        prop="product_no"
        label="胶料规格"
        min-width="20"
      />
      <el-table-column
        prop="actual_trains"
        label="车次"
        min-width="20"
      />
      <el-table-column
        label="状态"
        min-width="20"
        :formatter="(row)=>{
          let obj = statusList[row.status]
          return obj
        }"
      />
      <el-table-column
        prop="lot_no"
        label="收皮条码"
        min-width="20"
      />
      <el-table-column
        prop="test_equip"
        label="检测机台"
        min-width="20"
      />
      <el-table-column
        prop="plan_uid"
        label="检测计划编号"
        min-width="20"
      />
      <el-table-column
        prop="test_method_name"
        label="实验方法"
        min-width="20"
      />
      <el-table-column
        prop="test_times"
        label="实验次数"
        min-width="20"
      />
      <el-table-column
        prop="test_interval"
        label="实验间隔"
        min-width="20"
      />
      <el-table-column
        prop="values"
        label="检测值"
        min-width="20"
      />
      <el-table-column
        prop="test_user"
        label="检测人员"
        min-width="20"
      />
      <el-table-column
        prop="test_time"
        label="检测时间"
        min-width="20"
      />
      <!-- <el-table-column
        label="钢拔检测数据查看"
        min-width="20"
      /> -->
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
import equipSelect from '@/components/select_w/equip'
import allProductNoSelect from '@/components/select_w/allProductNoSelect.vue'
import page from '@/components/page'
import classSelect from '@/components/ClassSelect'
import { debounce } from '@/utils'
import { globalCodesUrl, testIndicators } from '@/api/base_w'
import { productTestResume, productReportEquip } from '@/api/base_w_four'
export default {
  name: 'QuickCheckResume',
  components: { page, equipSelect, classSelect, allProductNoSelect },
  data() {
    return {
      options: [
        { name: '门尼', id: 1 },
        { name: '流变', id: 2 },
        { name: '物性', id: 3 },
        { name: '钢拔', id: 4 }
      ],
      total: 0,
      groups: [],
      search: {},
      tableData: [],
      loading: false,
      statusList: { 1: '待检测', 2: '完成', 4: '强制结束' },
      testEquipList: []
    }
  },
  created() {
    // this.getTestIndicators()
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await productTestResume('get', null, { params: this.search })
        this.loading = false
        this.tableData = data.results
        this.total = data.count
      } catch (e) {
        this.loading = false
      }
    },
    searchList() {
      this.search.page = 1
      this.getList()
    },
    visibleChange(bool) {
      // if (bool) {
      //   this.getTestIndicators()
      // }
    },
    async getTestIndicators() {
      try {
        const data = await testIndicators('get', null, { params: { all: 1 }})
        this.options = data
      } catch (e) {
        //
      }
    },
    async getTestEquipList() {
      try {
        const data = await productReportEquip('get', null, { params: { all: 1 }})
        this.testEquipList = data
      } catch (e) {
        //
      }
    },
    changeTestEquip(bool) {
      if (bool) {
        this.getTestEquipList()
      }
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    },
    equipSearch(val) {
      this.search.equip_no = val
      this.search.page = 1
      this.getList()
    },
    classChanged(val) {
      this.search.page = 1
      this.search.production_classes = val
      this.getList()
    },
    testClassChanged(val) {
      this.search.page = 1
      this.search.test_classes = val
      this.getList()
    },
    getDebounce() {
      this.search.page = 1
      debounce(this, 'getList')
    },
    changeGroup(bool) {
      if (bool) {
        this.getClassGroup()
      }
    },
    getClassGroup() {
      globalCodesUrl('get', {
        params: {
          class_name: '班组'
        }
      }).then((response) => {
        this.groups = response.results
      }).catch(function() {
      })
    },
    productBatchingChanged(val) {
      this.search.product_no = val ? val.material_no : ''
      this.searchList()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
