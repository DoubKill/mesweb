<template>
  <div>
    <!-- 投料重量设定 -->
    <el-row>
      <el-col :span="15">
        <el-form :inline="true">
          <h2>
            粉料罐 物料设定
          </h2>
        </el-form>
      </el-col>
      <el-col :span="9">
        <el-form :inline="true">
          <h2>
            油料罐 物料设定
          </h2>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="15">
        <el-form :inline="true">
          <el-form-item label="密炼机台">
            <selectEquip
              :equip_no_props.sync="searchForm.equip_no"
              @changeSearch="changeSearch"
            />
          </el-form-item>
        </el-form>
        <el-table
          v-loading="loading"
          style="width: 90%"
          :data="tableData"
          border
        >
          <el-table-column
            prop="equip_no"
            label="密炼机台"
            min-width="20"
          />
          <el-table-column
            prop="tank_no"
            label="粉料罐号"
            min-width="20"
          />
          <el-table-column
            prop="bar_code"
            label="料罐条码"
            min-width="20"
          />
          <el-table-column
            prop="material_name"
            label="料罐物料名称"
            min-width="20"
          >
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.material"
                placeholder="请选择"
                clearable
                @change="currentChange2(scope)"
              >
                <el-option
                  v-for="item in machineList"
                  :key="item.id"
                  :label="item.material_name"
                  :value="item.id"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="use_flag"
            label="使用状态"
            min-width="20"
          >
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.use_flag"
                style="display: block"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="启用"
                inactive-text="停用"
                @change="currentChange(scope)"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="9">
        <el-table
          v-loading="loading1"
          style="width: 100%"
          :data="tableData1"
          border
        >
          <el-table-column
            prop="tank_no"
            label="油料罐号"
            min-width="20"
          />
          <el-table-column
            prop="bar_code"
            label="料罐条码"
            min-width="20"
          />
          <el-table-column
            prop="material_name"
            label="料罐物料名称"
            min-width="20"
          >
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.material"
                placeholder="请选择"
                clearable
                @change="currentChange3(scope)"
              >
                <el-option
                  v-for="item in machineList"
                  :key="item"
                  :label="item.material_name"
                  :value="item.id"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="use_flag"
            label="使用状态"
            min-width="20"
          >
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.use_flag"
                style="display: block"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="启用"
                inactive-text="停用"
                @change="currentChange1(scope)"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import selectEquip from '@/components/select_w/equip'
import { materialsUrl } from '@/api/base_w'
import { pinkSet, oliSet, pinkSetPut, oliSetPut } from '@/api/jqy'
export default {
  name: 'PinkSet',
  components: { selectEquip },
  data() {
    return {
      searchForm: {},
      tableData: [],
      tableData1: [],
      loading: false,
      loading1: false,
      machineList: []
    }
  },
  created() {
    this.getList()
    this.getList1()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await pinkSet('get', null, { params: this.searchForm })
        const data1 = await materialsUrl('get', null, { params: { page_size: 400 }})
        this.machineList = data1.results || null
        this.tableData = data.results
        this.loading = false
      } catch (e) { this.loading = false }
    },
    async getList1() {
      try {
        this.loading1 = true
        const data = await oliSet('get', null, { params: {}})
        const data1 = await materialsUrl('get', null, { params: { page_size: 400 }})
        this.machineList = data1.results || null
        this.tableData1 = data.results
        this.loading1 = false
      } catch (e) { this.loading1 = false }
    },
    changeSearch() {
      this.loading = true
      this.getList()
    },
    currentChange(scope) {
      try {
        if (scope.row.use_flag === true) {
          scope.row.use_flag = 1
        } else {
          scope.row.use_flag = 0
        }
        const id = scope.row.id || null
        pinkSetPut('put', id, { data: JSON.parse(JSON.stringify(scope.row)) })
        if (scope.row.use_flag === 1 || scope.row.use_flag === true) {
          scope.row.use_flag = true
        } else {
          scope.row.use_flag = false
        }
      } catch (e) {
        if (scope.row.use_flag === 1 || scope.row.use_flag === true) {
          scope.row.use_flag = true
        } else {
          scope.row.use_flag = false
        }
        scope.row.use_flag = !scope.row.use_flag
      }
    },
    currentChange1(scope) {
      try {
        if (scope.row.use_flag === true) {
          scope.row.use_flag = 1
        } else {
          scope.row.use_flag = 0
        }
        const id = scope.row.id || null
        oliSetPut('put', id, { data: JSON.parse(JSON.stringify(scope.row)) })
        if (scope.row.use_flag === 1 || scope.row.use_flag === true) {
          scope.row.use_flag = true
        } else {
          scope.row.use_flag = false
        }
      } catch (e) {
        if (scope.row.use_flag === 1 || scope.row.use_flag === true) {
          scope.row.use_flag = true
        } else {
          scope.row.use_flag = false
        }
        scope.row.use_flag = !scope.row.use_flag
      }
    },
    currentChange2(scope) {
      try {
        const id = scope.row.id || null
        pinkSetPut('put', id, { data: JSON.parse(JSON.stringify(scope.row)) })
      } catch (e) { this.getList() }
    },
    currentChange3(scope) {
      try {
        const id = scope.row.id || null
        oliSetPut('put', id, { data: JSON.parse(JSON.stringify(scope.row)) })
      } catch (e) { this.getList1() }
    }

  }

}

</script>
