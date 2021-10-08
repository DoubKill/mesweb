<template>
  <div>
    <!-- 设备部件定义 -->
    <el-form :inline="true" class="search-form-style">
      <el-form-item label="所属主设备种类">
        <el-select v-model="formInline.region" style="width:150px" clearable placeholder="所属主设备种类">
          <el-option
            v-for="item in ['浙江','大连']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所属设备部位">
        <el-select v-model="formInline.region" style="width:150px" clearable placeholder="所属设备部位">
          <el-option
            v-for="item in ['浙江','大连']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部件分类">
        <el-select v-model="formInline.region" style="width:150px" clearable placeholder="部件分类">
          <el-option
            v-for="item in ['浙江','大连']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部件名称">
        <el-input v-model="formInline.user" style="width:150px" clearable placeholder="部件名称" />
      </el-form-item>
      <el-form-item label="是否已绑定备件">
        <el-select v-model="formInline.region" style="width:150px" clearable>
          <el-option
            v-for="item in ['浙江','大连']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否启用">
        <el-select v-model="formInline.region" style="width:150px" clearable placeholder="是否启用">
          <el-option
            v-for="item in ['浙江','大连']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button type="primary" @click="onSubmit">导出Excel</el-button>
        <el-button type="primary" @click="onSubmit">导入Excel</el-button>
        <el-button type="primary" @click="onSubmit">新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      border
    >
      <el-table-column
        prop="date"
        label="信号编号"
        min-width="20"
      />
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'EquipmentMasterDataPartsDefine',
  data() {
    return {
      formInline: {},
      loading: false,
      tableData: []
    }
  },
  methods: {
    onSubmit() {

    }
  }
}
</script>

<style lang="scss" scoped>

</style>
