<template>
  <div>
    <!-- 投料重量设定 -->
    <el-form :inline="true">
      <el-form-item label="密炼机台">
        <selectEquip
          :equip_no_props.sync="searchForm.equip_id"
          @changeSearch="changeSearch"
        />
      </el-form-item>
      <!-- <el-form-item label="料罐类型">
        <el-select
          v-model="searchForm.tank_equiq_type"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in ['炭黑罐','粉料罐']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="罐号">
        <el-input v-model="searchForm.tank_no" type="number" clearable @input="changeSearch1" />
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      style="width: 100%"
      :data="tableData"
      border
    >
      <el-table-column
        prop="equip_id"
        label="密炼机台"
        min-width="20"
      />
      <!-- <el-table-column
        prop="tank_equip_type"
        label="料罐类型"
        min-width="20"
      /> -->
      <el-table-column
        prop="tank_no"
        label="罐号"
        min-width="20"
      />
      <el-table-column
        prop="tank_capacity_type"
        label="料罐类别"
        min-width="20"
      >
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.tank_capacity_type"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        prop="tank_capacity"
        label="罐容量（M3）"
        min-width="20"
      >
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.tank_capacity"
            placeholder="请输入内容"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="feed_capacity_low"
        label="低料位补料量（kg）"
        min-width="20"
      >
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.feed_capacity_low"
            placeholder="请输入内容"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="feed_capacity_mid"
        label="中料位补料量（kg）"
        min-width="20"
      >
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.feed_capacity_mid"
            placeholder="请输入内容"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="20"
      >
        <template slot-scope="scope">
          <el-button
            :loading="saveLoading"
            type="primary"
            size="mini"
            :disabled="update"
            @click="save(scope)"
          >保存
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import selectEquip from '@/components/select_w/equip'
import { rawWeight, saveRawWeight } from '@/api/jqy'
import { debounce } from '@/utils'
import { checkPermission } from '@/utils'
export default {
  name: 'RawWeightSet',
  components: { selectEquip },
  data() {
    return {
      searchForm: {},
      tableData: [],
      loading: false,
      saveLoading: false,
      options: [{
        value: 1,
        label: '大'
      }, {
        value: 0,
        label: '小'
      }],
      update: true
    }
  },
  created() {
    this.getList()
    if (checkPermission(['carbon_tank_set', 'update'])) {
      this.update = false
    }
  },
  methods: {
    checkPermission,
    async getList() {
      try {
        this.loading = true
        const data = await rawWeight('get', null, { params: this.searchForm })
        this.tableData = data || []
        this.loading = false
      } catch (e) { this.loading = false }
    },
    changeSearch() {
      this.loading = true
      this.getList()
    },
    changeSearch1() {
      if (this.searchForm.tank_no > 0 || this.searchForm.tank_no === '') {
        debounce(this, 'getList')
      } else {
        this.$message.info('请输入正确罐号')
      }
    },
    async save(scope) {
      try {
        this.saveLoading = true
        const id = scope.row.id || null
        await saveRawWeight('put', id, { data: JSON.parse(JSON.stringify(scope.row)) })
        this.$message.success('操作成功')
        this.saveLoading = false
      } catch (e) {
        this.$message.info('修改失败')
        this.saveLoading = false
      }
    }

  }
}
</script>
