<template>
  <div>
    <!-- 物料需求汇总 -->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="日期">
        <el-date-picker
          v-model="getParams.production_factory_date"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          :clearable="false"
          @change="changeList"
        />
      </el-form-item>
      <el-form-item label="班次:">
        <class-select
          @classSelected="classChanged"
        />
      </el-form-item>
      <el-form-item label="生产机型">
        <equip-category-select
          v-model="getParams.dev_type"
          @change="changeList"
        />
      </el-form-item>
      <el-form-item label="物料编码:">
        <material-code-select
          ref="materialCodeSelect"
          :is-all-obj="true"
          @changeSelect="materialCreateForm"
        />
      </el-form-item>
      <el-form-item label="原材料类别">
        <el-select
          v-model="materialType"
          multiple
          clearable
          placeholder="请选择"
          @change="materialTypeChange"
        >
          <el-option
            v-for="item in materialTypeOptions"
            :key="item.id"
            :label="item.global_name"
            :value="item.id"
          />

        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button plain size="small">查看炭黑明细</el-button>
        <el-button plain size="small">查看料包明细</el-button>
        <el-button plain size="small" @click="sumDataTableVisible = true">新建汇总</el-button>
      </el-form-item>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="date"
          label="No"
          align="center"
          min-width="30"
        />
        <el-table-column
          prop="name"
          label="机型"
          align="center"
          min-width="30"
        />
        <el-table-column
          prop="address"
          label="机台"
          align="center"
          min-width="30"
        />
        <el-table-column
          prop="date"
          label="顺序"
          align="center"
          min-width="30"
        />
        <el-table-column
          prop="name"
          align="center"
          label="胶料配料编码"
          min-width="80"
        />
        <el-table-column
          prop="address"
          align="center"
          label="小料重量(kg)"
        />
        <el-table-column
          prop="date"
          align="center"
          label="物科类别"
        />
        <el-table-column
          prop="name"
          align="center"
          label="需求数量"
        />
        <el-table-column
          prop="address"
          align="center"
          label="需求重量"
        />
        <el-table-column
          prop="address"
          align="center"
          label="物料库存"
        />
      </el-table>
      <!-- page-size每页显示条目个数 -->
      <!-- page-sizes每页显示个数选择器的选项设置 -->
      <!-- current-page	当前页数 -->
      <Page
        :old-page="false"
        :total="total"
        :current-page="getParams.page"
        @currentChange="currentChange"
      />
    </el-form>
    <el-dialog
      title="新建汇总页面"
      :visible.sync="sumDataTableVisible"
      width="80%"
    >
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="日期">
          <el-date-picker
            v-model="getParams.production_factory_date"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :clearable="false"
            @change="changeList"
          />
        </el-form-item>
        <el-form-item label="班次:">
          <class-select
            @classSelected="classChanged"
          />
        </el-form-item>
        <el-form-item label="生产机型">
          <equip-category-select
            v-model="getParams.dev_type"
            @change="changeList"
          />
        </el-form-item>
        <el-form-item label="机台">
          <el-select
            v-model="equip_no"
            clearable
            multiple
            placeholder="请选择"
            @change="changeSearch"
            @visible-change="equipNoVisibleChange"
          >
            <el-option
              v-for="item in equipNoOptions"
              :key="item.equip_no"
              :label="item.equip_no"
              :value="item.equip_no"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="物料编码:">
          <material-code-select
            ref="materialCodeSelect"
            :is-all-obj="true"
            @changeSelect="materialCreateForm"
          />
        </el-form-item>
      </el-form>
      <el-table
        :data="sumData"
        border
        style="width:100%"
      >
        <el-table-column
          label="多选"
          align="center"
          min-width="20"
        />
        <el-table-column
          label="No"
          align="center"
          min-width="20"
        />
        <el-table-column
          label="顺序"
          align="center"
          min-width="20"
        />
        <el-table-column
          label="班次"
          align="center"
          min-width="20"
        />
        <el-table-column
          label="机型"
          align="center"
          min-width="20"
        />
        <el-table-column
          label="机台"
          align="center"
          min-width="20"
        />
        <el-table-column
          label="胶料配料编码"
          align="center"
        />
        <el-table-column
          label="计划车次"
          align="center"
        />
        <el-table-column
          label="完成车次"
          align="center"
        />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import classSelect from '@/components/ClassSelect'
import MaterialCodeSelect from '@/components/materialCodeSelect'
import { globalCodesUrl } from '@/api/base_w'
import EquipCategorySelect from '@/components/EquipCategorySelect'
import { getEquip } from '@/api/display_static_fun'
import Page from '@/components/page'
import { setDate } from '@/utils'
import { mapGetters } from 'vuex'
export default {
  components: { Page, classSelect, MaterialCodeSelect, EquipCategorySelect },
  data() {
    return {
      getParams: {
        page: 1,
        page_size: 10,
        production_factory_date: setDate(),
        dev_type: null,
        interval: '班次'
      },
      currentPage4: 4,
      tableData: [],
      total: 0,
      sumData: [],
      sumDataTableVisible: false,
      // 类别
      materialType: '',
      materialTypeOptions: [],
      // 机台
      equipNoOptions: [],
      equip_no: null
      // getParams.production_factory_date:''
    }
  },
  ...mapGetters(['permission']),
  created: function() {
    this.permissionObj = this.permission
    var app = this
    // this.getList()
    globalCodesUrl('get', {
      params: {
        class_name: '原材料类别',
        all: 1
      }
    }).then(function(response) {
      app.materialTypeOptions = response.results
    }).catch(function() {
    })
    globalCodesUrl('get', {
      params: {
        class_name: '包装单位'
      }
    }).then(function(response) {
      app.packingUnitOptions = response.results
    }).catch(function() {
    })
  },
  methods: {
    tanCh() {
      console.log('124')
    },
    //  班次
    classChanged() {},
    // 物料编码
    materialCreateForm(obj) {
      this.getParams.material_no = obj ? obj.material_no : ''
      this.changeList()
    },
    // 类别
    materialTypeChange: function(value) {
      console.log(value)
      // this.getParams.page = 1
      // this.getList()
    },
    changeSearch(value) {
      // this.getParams['search_time'] = this.search_time
      // this.getParams['equip_no'] = this.equip_no
      // this.getParams.page = 1
      // this.banbury_plan_list()
      console.log(value)
    },
    currentChange(page) {
      this.getParams.page = page
      this.getList()
    },
    // 选择日期
    changeList(value) {
      console.log(value)
      // if (!this.getParams.production_factory_date) {
      //   this.$message.info('请选择工厂日期')
      //   return
      // }
      // this.getParams.page = 1
      // this.getList()
    },
    // this.getList()
    equipNoVisibleChange(bool) {
      if (bool) {
        var app = this
        getEquip({ all: 1, category_name: '密炼设备' }).then(function(response) {
          app.equipNoOptions = response.results
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>>
