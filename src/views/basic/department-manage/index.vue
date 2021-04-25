<template>
  <div>
    <!-- 位置点管理 基础信息里面的-->
  <el-form :inline="true">
      <el-form-item label="类型">
         <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="活动名称">
      <el-input v-model="form.region" />
  </el-form-item>
    <el-form-item style="float: right">
        <el-button @click=" dialogTableVisible = true">新建</el-button>
  </el-form-item>
  </el-form>
  <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="date"
        label="日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
      </el-table-column>
    </el-table>
    <page
          :total="total"
          :current-page="getParams.page"
          @currentChange="currentChange"
        />
        <el-dialog title="收货地址" :visible.sync="dialogTableVisible">
  <el-table :data="gridData">
    <el-table-column property="date" label="日期" width="150"></el-table-column>
    <el-table-column property="name" label="姓名" width="200"></el-table-column>
    <el-table-column property="address" label="地址"></el-table-column>
  </el-table>
</el-dialog>
  </div>
</template>

<script>
import { departmentManage } from '@/api/department-manage'
import page from '@/components/page'
export default {
  components: { page },
  data () {
    return {
      getParams: {
        page: 1
      },
      currentPage: 1,
      total: 1,
       form: {
          name: '',
          region: ''
        },
        sercialForm: {
        sercial: '',
        name: ''
      },
       dialogTableVisible: false,
        gridData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }],
       tableData: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }]
    }
  },

  created () {
    this.getTableDatas()
  },
  methods: {
      currentChange(page) {
      this.currentPage = page
      this.getParams.page = page
    },
    // showCreateDialog() {
    //   this.getTypeOptions()
     
    //   this.dialogCreateVisible = true
      
    // },
    getTableDatas: function(){
      console.log('11111111');
      departmentManage ({all:1}).then(response =>{
        console.log(response.results)
      })
    }
  } 
}
</script>

<style scoped lang='scss'>

</style>