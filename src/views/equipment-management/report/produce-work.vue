<template>
  <div>
    <!-- 生产运行记录 -->
    <el-form :inline="true">
      <el-form-item label="工厂时间:">
        <el-date-picker
          v-model="search.date"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择工厂时间"
          @change="changeSearch"
        />
      </el-form-item>
      <el-form-item label="班次:">
        <class-select
          @classSelected="classChanged"
        />
      </el-form-item>
      <el-form-item style="float:right">
        <el-button>报表浏览</el-button>
        <el-button>导出</el-button>
      </el-form-item>
    </el-form>
    <table
      border="1"
      bordercolor="#EBEEF5"
      class="info-table"
    >
      <thead>
        <tr>
          <td>机台</td>
          <td>胶料编码</td>
          <td>计划量(车)</td>
          <td>完成量(车)</td>
          <td>达成率</td>
          <td>完成总量(车)</td>
          <td>投料人员</td>
          <td>生产时间</td>
          <td>设备启动率</td>
        </tr>
      </thead>
      <tbody>
        <div v-for="(item,index) in dataList" :key="index">
          <tr colspan="5">
            <td>{{ item.a }}</td>
          </tr>
        </div>
      </tbody>
    </table>
  </div>
</template>

<script>
import classSelect from '@/components/ClassSelect'
export default {
  components: { classSelect },
  data() {
    return {
      search: {},
      dataList: [
        {
          a: 'z01',
          list: [
            { a: 11,
              b: 22,
              c: 33
            }
          ],
          c: 11,
          d: 33
        }
      ]
    }
  },
  methods: {
    changeSearch() {},
    classChanged() {}
  }
}
</script>

<style lang="scss" scoped>
 table {
      width: 100%;
      border-collapse: collapse;

    }
   .info-table {
       td {
        min-width: 100px;
        padding: 5px 10px;
         font-size: 14px;
         color: #606266;
      }
       thead{
        font-weight: 700;
        td{
          color: #909399;
        }
       }

    }
</style>
