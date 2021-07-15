<template>
  <div>
    <!-- 检测履历查询 -->
    <el-form :inline="true">
      <el-form-item label="实验区分">
        <el-select
          v-model="search.is_qualified"
          placeholder="请选择"
          clearable
          @change="searchList"
        >
          <el-option
            v-for="(item,i) in options"
            :key="i"
            :label="item.name"
            :value="item.bool"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="生产机号">
        <equip-select :equip_no_props="search.equip_no" @changeSearch="equipSearch" />
      </el-form-item>
      <el-form-item label="生产日期">
        <el-date-picker
          v-model="search.date"
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
        <el-input
          v-model="search.product_no"
          clearable
          @input="getDebounce"
        />
      </el-form-item>
      <el-form-item label="车次">
        <el-input-number
          v-model="search.num"
          controls-position="right"
          :min="1"
          :max="search.num1"
          size="mini"
          clearable
          @change="getDebounce"
        /> --
        <el-input-number
          v-model="search.num1"
          size="mini"
          controls-position="right"
          :min="search.num"
          clearable
          @change="getDebounce"
        />
      </el-form-item>
      <el-form-item label="检测日期">
        <el-date-picker
          v-model="search.date"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          clearable
          @change="searchList"
        />
      </el-form-item>
      <el-form-item label="检测班次">
        <class-select
          @classSelected="testClassChanged"
        />
      </el-form-item>
      <el-form-item label="检测班组">
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
      </el-form-item>
      <el-form-item label="检测机号">
        <equip-select :equip_no_props="search.equip_no" @changeSearch="equipSearch" />
      </el-form-item>
      <el-form-item label="检测计划">
        <el-input
          v-model="search.aaa"
          clearable
          @input="getDebounce"
        />
      </el-form-item>
      <el-form-item label="检测计划">
        <el-select
          v-model="search.bb"
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="group in [{name:'待检测'},{name:'已检测'}]"
            :key="group.id"
            :label="group.global_name"
            :value="group.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="检测人员">
        <el-input
          v-model="search.aaa"
          clearable
          @input="getDebounce"
        />
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="date"
        label="生产日期"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="生产机号"
        min-width="20"
      />
      <el-table-column
        prop="address"
        label="生产班组"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="胶料规格"
        min-width="20"
      />
      <el-table-column
        prop="address"
        label="车次"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="状态"
        min-width="20"
      />
      <el-table-column
        prop="address"
        label="收皮条码"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="检测计划编号"
        min-width="20"
      />
      <el-table-column
        prop="address"
        label="实验方法"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="实验次数"
        min-width="20"
      />
      <el-table-column
        prop="address"
        label="实验间隔"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="检测部门"
        min-width="20"
      />

      <el-table-column
        prop="address"
        label="检测人员"
        min-width="20"
      />
      <el-table-column
        prop="address"
        label="检测时间"
        min-width="20"
      />
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
import page from '@/components/page'
import classSelect from '@/components/ClassSelect'
import { debounce } from '@/utils'
import { globalCodesUrl } from '@/api/base_w'
export default {
  name: 'QuickCheckResume',
  components: { page, equipSelect, classSelect },
  data() {
    return {
      options: [],
      total: 0,
      groups: [],
      search: {},
      tableData: []
    }
  },
  created() {
  },
  methods: {
    searchList() {},
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
      this.search.classes = val
      this.getList()
    },
    testClassChanged(val) {
      this.search.page = 1
      this.search.classes = val
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
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
