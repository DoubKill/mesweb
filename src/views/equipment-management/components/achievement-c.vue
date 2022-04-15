<template>
  <div>
    <!-- 导出使用开始 -->
    <el-table
      :data="tableData"
      style="width: 100%"
      border
    >
      <el-table-column
        prop="name"
        label="名字"
        width="60"
      />
      <el-table-column
        prop="work_type"
        label="员工类别"
        width="60"
      />
      <el-table-column
        prop="是否定岗"
        label="是否独立上岗"
        width="40"
      >
        <template slot-scope="{row}">
          {{ row.是否定岗?'是':'否' }}
        </template>
      </el-table-column>
      <el-table-column v-for="(item,_index) in day" :key="item" :label="item+'日'">
        <el-table-column
          v-for="_item in groupList[_index]"
          :key="_item"
          :label="_item"
          width="65"
        >
          <template slot-scope="{row}">
            <el-link
              type="primary"
              @click="subsidyInfo(row,_item,item)"
            >{{ row[item+'_'+_item] }}</el-link>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        prop="hj"
        label="产量工资合计"
        width="65"
      />
      <el-table-column
        prop="超产奖励"
        label="超产奖励"
        width="65"
      >
        <template slot-scope="{row}">
          <el-link
            type="primary"
            @click="subsidyList(row,3)"
          >{{ row.超产奖励 }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="其他奖惩"
        label="其他奖惩"
        width="65"
      >
        <template slot-scope="{row}">
          <el-link
            type="primary"
            @click="subsidyList(row,1)"
          >{{ row.其他奖惩 }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="生产补贴"
        label="生产补贴"
        width="65"
      >
        <template slot-scope="{row}">
          <el-link
            type="primary"
            @click="subsidyList(row,2)"
          >{{ row.生产补贴 }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="all"
        label="工资总计"
        width="90"
      />
    </el-table>
    <!-- 导出使用结束 -->
  </div>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Array,
      default() {
        return []
      }
    },
    day: {
      type: Number,
      default() {
        return null
      }
    },
    groupList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    subsidyInfo() {
    },
    subsidyList() {}
  }
}
</script>

<style>

</style>
