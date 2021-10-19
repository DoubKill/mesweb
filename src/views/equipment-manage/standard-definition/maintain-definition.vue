<template>
  <div class="maintain-definition">
    <!-- 维护作业标准定义 -->
    <el-form :inline="true" class="search-form-style">
      <el-form-item label="作业类型">
        <el-select
          v-model="getParams.type"
          placeholder="请选择"
        >
          <el-option
            v-for="item in ['巡检','保养','维修','润滑','标定']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="设备种类">
        <el-select v-model="getParams.category_no" placeholder="请选择" clearable @change="changeSearch">
          <el-option
            v-for="item in options"
            :key="item.category_name"
            :label="item.category_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部位名称">
        <el-input v-model="getParams.name" @input="changSelect" />
      </el-form-item>
      <el-form-item label="部件名称">
        <el-input v-model="getParams.name" @input="changSelect" />
      </el-form-item>
      <el-form-item label="重要程度">
        <el-select
          v-model="getParams.feed"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in ['高', '中', '低']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="设备条件">
        <el-select
          v-model="getParams.feedi"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="item in ['停机', '不停机']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所需物料名称">
        <el-input v-model="getParams.name" @input="changSelect" />
      </el-form-item>
      <el-form-item label="所需物料名称">
        <el-input v-model="getParams.name" @input="changSelect" />
      </el-form-item>
      <el-form-item style="float:right">
        <el-button type="primary" style="margin-right:8px" @click="templateDownload">导出Excel</el-button>
        <el-upload
          style="margin-right:8px;display:inline-block"
          action="string"
          accept=".xls, .xlsx"
          :http-request="Upload"
          :show-file-list="false"
        >
          <el-button type="primary">导入Excel</el-button>
        </el-upload>
        <el-button
          type="primary"
          @click="onSubmit"
        >新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="作业类型"
      />
      <el-table-column
        prop="name"
        label="标准编号"
      />
      <el-table-column
        prop="date"
        label="标准名称"
      />
      <el-table-column
        prop=""
        label="设备种类"
      />
      <el-table-column
        prop=""
        label="部位名称"
      />
      <el-table-column
        prop=""
        label="部件名称"
      />
      <el-table-column
        prop=""
        label="设备条件"
      />
      <el-table-column
        prop=""
        label="重要程序"
      />
      <el-table-column
        prop=""
        label="作业项目"
      />
      <el-table-column
        prop=""
        label="起始时间"
      />
      <el-table-column
        prop=""
        label="维护周期"
      />
      <el-table-column
        prop=""
        label="周期单位"
      />
      <el-table-column
        prop=""
        label="周期数"
      />
      <el-table-column
        prop=""
        label="所需人数"
      />
      <el-table-column
        prop=""
        label="作业时间"
      />
      <el-table-column
        prop=""
        label="作业时间单位"
      />
      <el-table-column
        prop=""
        label="物料所需名称"
      />
      <el-table-column
        prop=""
        label="录入人"
      />
      <el-table-column
        prop=""
        label="录入时间"
      />
      <el-table-column label="操作" width="130px">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              v-permission="['spare_type', 'change']"
              size="mini"
              @click="showDialog(scope.row)"
            >编辑</el-button>
            <el-button
              v-permission="['spare_type', 'delete']"
              size="mini"
              type="danger"
              plain
              @click="handleDelete(scope.row)"
            >{{ scope.row.delete_flag?'启用':'停用' }}
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="getParams.page"
      @currentChange="currentChange"
    />
    <el-dialog
      :title="`${typeForm.id?'修改':'新建'}作业项目标准`"
      width="70%"
      :visible.sync="dialogEditVisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="typeForm"
        :rules="rules"
        :model="typeForm"
        label-width="150px"
      >
        <el-row>
          <el-col :span="8">

            <el-form-item label="作业类型" prop="type">
              <el-select
                v-model="typeForm.type"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in ['巡检','保养','维修','润滑','标定']"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="标准编号" prop="nae">
              <el-input v-model="typeForm.nae" :disabled="typeForm.id" />
            </el-form-item>
            <el-form-item label="标准名称" prop="name">
              <el-input v-model="typeForm.name" />
            </el-form-item>
            <el-form-item label="设备种类">
              <el-select v-model="typeForm.category_no" placeholder="请选择" clearable>
                <el-option
                  v-for="item in options"
                  :key="item.category_name"
                  :label="item.category_name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="部位名称" prop="name">
              <el-input v-model="typeForm.name" />
            </el-form-item>
            <el-form-item label="部件名称">
              <el-select v-model="typeForm.category_no1" placeholder="请选择" clearable>
                <el-option
                  v-for="item in [';',';;']"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="设备条件">
              <el-select
                v-model="getParams.feedi"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in ['停机', '不停机']"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="重要程度">
              <el-select
                v-model="getParams.feed"
                placeholder="请选择"
                clearable
                @change="changeSearch"
              >
                <el-option
                  v-for="item in ['高', '中', '低']"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item
              label="作业项目"
              prop="equip_component_name"
            >
              <el-input v-model="typeForm.equip_component_name" placeholder="请输入内容" disabled>
                <el-button slot="append" icon="el-icon-search" />
              </el-input>
              <br>
              <el-input v-model="typeForm.equip_component_name" placeholder="请输入内容" />
            </el-form-item>
            <el-form-item label="周期单位" prop="nae">
              <el-select
                v-model="typeForm.type"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in ['日','小时','分钟','秒','车次']"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="作业详情内容">
              <el-button>添加</el-button>
              <el-table
                :data="tableData"
                border
                style="width: 100%"
              >
                <el-table-column
                  label="序号"
                  type="index"
                />
                <el-table-column
                  prop="date"
                  label="作业内容"
                />
                <el-table-column
                  prop="date"
                  label="判断标准/步骤说明"
                />
                <el-table-column
                  prop="date"
                  label="类型"
                />
              </el-table>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleEdit"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { putSpareType, deleteSpareType } from '@/api/spare-type'
import { equipsCategory } from '@/api/jqy'
import page from '@/components/page'
// import { errorRepeat } from '@/utils'

export default {
  name: 'MaintainDefinition',
  components: { page },
  data: function() {
    return {
      tableData: [{ id: '1' }],
      dialogEditVisible: false,
      options: [],
      typeName: '',
      typeForm: {
        no: '',
        name: ''
      },
      rules: {
        type: [{ required: true, message: '不能为空', trigger: 'blur' }],
        nae: [{ required: true, message: '不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      getParams: {
        page: 1,
        no: '',
        name: ''
      },
      currentPage: 1,
      total: 1
    }
  },
  created() {
    this.getList()
    this.getTypeNode()
  },
  methods: {
    async getTypeNode() {
      try {
        const data = await equipsCategory('get', null, { params: { all: 1 }})
        this.options = data.results || []
      } catch (e) {
        //
      }
    },
    changeSearch() {

    },
    getList() {

    },
    onSubmit() {
      this.dialogEditVisible = true
    },
    changSelect() {
      this.getParams.page = 1
      this.getList()
    },
    showDialog(row) {
      this.typeForm = JSON.parse(JSON.stringify(row))
      this.dialogEditVisible = true
    },
    handleEdit: function() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          putSpareType(this.typeForm, this.typeForm.id)
            .then(response => {
              this.dialogEditVisible = false
              this.$message(this.typeForm.name + '修改成功')
              this.getList()
              // this.currentChange(this.currentPage)
            })
        }
      })
    },
    handleDelete: function(row) {
      var str = row.delete_flag ? '启用' : '停用'
      this.$confirm('此操作将' + str + row.name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSpareType(row.id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getList()
          })
      })
    },
    currentChange(page, pageSize) {
      this.getParams.page = page
      this.getParams.page_size = pageSize
      this.getList()
    },
    templateDownload() {
    //   exportProperty('get').then(response => {
    //     const link = document.createElement('a')
    //     const blob = new Blob([response], { type: 'application/vnd.ms-excel' })
    //     link.style.display = 'none'
    //     link.href = URL.createObjectURL(blob)
    //     link.download = '设备资产模板.xls' // 下载的文件名
    //     document.body.appendChild(link)
    //     link.click()
    //     document.body.removeChild(link)
    //   })
    },
    Upload(param) {
      const formData = new FormData()
      formData.append('file', param.file)
    //   importProperty('post', null, { data: formData }).then(response => {
    //     this.$message({
    //       type: 'success',
    //       message: '导入成功!'
    //     })
    //     this.search.page = 1
    //     this.getList()
    //   })
    }
  }
}
</script>
<style lang="scss">
.maintain-definition{
  .search-form-style{
    .el-input{
      width:120px;
    }
  }
  .el-dialog__wrapper .el-input{
    width:200px;
  }
  .el-input-number .el-input{
    width:auto;
  }
}
</style>
