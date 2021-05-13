<template>
  <div>
    <!-- 检测值管理 -->
    <el-form :inline="true">
      <el-form-item label="原材料名称">
        <el-input v-model="search.aa" placeholder="请输入" @input="changeSearch" />
      </el-form-item>
      <el-form-item label="样品名称">
        <el-input v-model="search.aa" placeholder="请输入" @input="changeSearch" />
      </el-form-item>
      <el-form-item label="检测类型">
        <el-input v-model="search.aa" placeholder="请输入" @input="changeSearch" />
      </el-form-item>
      <el-form-item label="批次">
        <el-input v-model="search.aa" placeholder="请输入" @input="changeSearch" />
      </el-form-item>
      <el-form-item label="产地">
        <el-input v-model="search.aa" placeholder="请输入" @input="changeSearch" />
      </el-form-item>
      <el-form-item label="抽样人">
        <el-input v-model="search.aa" placeholder="请输入" @input="changeSearch" />
      </el-form-item>
      <el-form-item label="记录人">
        <el-input v-model="search.aa" placeholder="请输入" @input="changeSearch" />
      </el-form-item>
      <el-form-item label="复检">
        <el-select v-model="search.aaa" placeholder="请选择" @change="selectSearch">
          <el-option
            v-for="item in ['是','否']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否合格">
        <el-select v-model="search.aaa" placeholder="请选择" @change="selectSearch">
          <el-option
            v-for="item in ['是','否']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button type="primary" @click="heardFun">表头过滤</el-button>
        <el-button type="primary" @click="downloadFun">下载模板</el-button>
        <el-button type="primary" @click="leadingInFun">导入</el-button>
        <el-button type="primary" @click="addFun">添加</el-button>
      </el-form-item>
    </el-form>

    <div class="titleColor">绿色行为同批次原材料最新检测记录</div>
    <el-table
      :data="tableData"
      style="width: 100%"
      border
    >
      <el-table-column
        prop="date"
        label="日期"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="姓名"
        min-width="20"
      />
      <el-table-column
        prop="address"
        label="地址"
        min-width="20"
      />
    </el-table>
  </div>
</template>

<script>
import { debounce } from '@/utils'
export default {
  data() {
    return {
      search: {},
      tableData: []
    }
  },

  created() {

  },

  methods: {
    async getList() {
      try {
        // const data = await material_quantity_url('get', { params: this.getParams })
        this.loading = false
      } catch (e) { this.loading = false }
    },
    heardFun() {},
    downloadFun() {},
    leadingInFun() {},
    addFun() {},
    changeSearch() {
      debounce(this, 'getList')
    },
    selectSearch() {

    }
  }
}
</script>

<style scoped lang='scss'>
.titleColor{
  clear:both;padding:10px;border:1px solid #eee;width:250px;background:#0dbd0bb0;color:#fff
}
</style>
