<template>
  <div class="shutdown-reason">
    <!-- 设备停机原因定义 -->
    <el-row class="search-form-style">
      <el-col v-loading="loading" :span="10">
        <el-form inline>
          <el-form-item
            label="停机原因分类名称"
          >
            <el-input v-model="dataForm.name" />
          </el-form-item>
          <el-form-item
            label="是否启用"
          >
            <el-select v-model="dataForm.value" style="width:130px">
              <el-option
                v-for="item in []"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              style="margin-bottom:10px"
              @click="addArea(true)"
            >添加</el-button>
          </el-form-item>
        </el-form>

        <el-table
          ref="currentRow"
          :data="tableData"
          border
          highlight-current-row
          @current-change="handleCurrentChange"
        >
          <el-table-column
            prop="depot_name"
            label="库区名称"
          />
          <el-table-column
            prop="description"
            label="描述"
          />
          <el-table-column
            label="操作"
          >
            <template slot-scope="scope">
              <el-button-group>
                <el-button
                  size="mini"
                  @click="editArea(scope.row,true)"
                >编辑
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  plain
                  @click.stop="delArea(scope.row,true)"
                > 停用
                </el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col v-loading="loading1" :span="14">
        <el-form inline>
          <el-form-item
            label="停机原因名称"
          >
            <el-input v-model="dataForm1.name" />
          </el-form-item>
          <el-form-item
            label="是否启用"
          >
            <el-select v-model="dataForm1.value">
              <el-option
                v-for="item in []"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              style="margin-bottom:10px;float:right"
              :disabled="depot?false:true"
              type="primary"
              @click="addArea(false)"
            >添加</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="tableData1"
          border
        >
          <el-table-column
            prop="depot__depot_name"
            label="库区"
          />
          <el-table-column
            prop="depot_site_name"
            label="库位名称"
          />
          <el-table-column
            prop="description"
            label="描述"
          />
          <el-table-column
            label="操作"
          >
            <template slot-scope="scope">
              <el-button-group>
                <el-button
                  size="mini"
                  @click="editArea(scope.row,false)"
                >编辑
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  plain
                  @click="delArea(scope.row,false)"
                > 删除
                </el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

  </div>
</template>

<script>
export default {
  name: 'EquipmentMasterDataShutdownReason',
  data() {
    return {
      tableData: [],
      tableData1: [],
      dataForm: {},
      dataForm1: {},
      formObj: {},
      dialogVisible: false,
      loading: false,
      loading1: false,
      depot: null,
      rules: {
        depot_name: [
          { required: true, message: '请输入库区', trigger: 'blur' }
        ],
        depot_site_name: [
          { required: true, message: '请输入库位', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入描述', trigger: 'blur' }
        ],
        depot: [
          { required: true, message: '请选择库区', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    handleCurrentChange(row) {
      this.depot = row.id
    }
  }
}
</script>

<style lang="scss" scoped>
.shutdown-reason{
  .search-form-style{
    .el-input{
      width:140px;
    }
  }
  .el-dialog__wrapper .el-input{
    width:230px;
  }
  .el-input-number .el-input{
    width:auto;
  }
}
</style>
