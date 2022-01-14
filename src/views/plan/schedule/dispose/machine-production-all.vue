<template>
  <div class="machine-production-all">
    <!-- 机台生产计划-整体列表 -->
    <el-form :inline="true">
      <el-form-item label="排程日时">
        <el-date-picker
          v-model="getParams.factory_date"
          type="date"
          :clearable="false"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          @change="changeListDate"
        />
      </el-form-item>
      <el-form-item label="排程单号">
        <el-select
          v-model="getParams.schedule_no"
          placeholder="请选择"
          @change="changeList"
        >
          <el-option
            v-for="item in scheduleNoList"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div v-if="data.length" style="margin-bottom:20px;text-align:right">
      <el-button v-permission="['aps_result','confirm']" type="primary" @click="submitFun">确定全部机台计划</el-button>
      <el-button v-permission="['aps_result','export']" type="primary" @click="exportTable">导出Excel</el-button>
      <!-- <el-upload
        style="display:inline-block;margin:0 6px"
        action="string"
        accept=".xls, .xlsx"
        :http-request="Upload"
        :show-file-list="false"
      >
        <el-button type="primary">导入Excel</el-button>
      </el-upload> -->
    </div>
    <div id="out-table">
      <div id="example0" style="" />
      <div id="example1" style="" />
      <div id="example2" style="" />
    </div>
    <div v-if="!data.length" class="noneData">暂无数据</div>
    <!-- <div id="load">8888888</div> -->
  </div>
</template>

<script>
import Handsontable from 'handsontable'
import { registerLanguageDictionary, zhCN } from 'handsontable/i18n'
import 'handsontable/dist/handsontable.full.css'
// import 'handsontable/dist/languages/zh-CN.js'
import { exportExcel, setDate } from '@/utils/index'
import { schedulingResult, scheduleNos } from '@/api/base_w_five'

registerLanguageDictionary(zhCN)
export default {
  name: 'ScheduleMachineProduction',
  components: {
  },
  data() {
    return {
      data: [],
      hot0: null,
      hot1: null,
      hot2: null,
      machineList: [],
      getParams: {
        factory_date: setDate(),
        schedule_no: ''
      },
      scheduleNoList: []
    }
  },
  created() {
    this.getScheduleNoList(true)
  },
  mounted() {
    for (let index = 0; index < 3; index++) {
      const a = document.getElementById('example' + index)
      this['hot' + index] = new Handsontable(a, {
        data: [],
        language: zhCN.languageCode,
        colHeaders: false,
        height: 'auto',
        width: 'auto',
        licenseKey: 'non-commercial-and-evaluation',
        contextMenu: ['row_above', 'row_below', 'remove_row', 'undo', 'alignment'],
        // contextMenu: true,
        rowHeaders: false,
        customBorders: true,
        multiColumnSorting: true,
        filters: true,
        manualRowMove: true,
        manualColumnResize: true,
        cells: (row, col, prop) => {
          // if (prop === 'plan_trains-Z01' && row === 1 && col === 1) {
          return { renderer: customRenderer }
          // }
        },
        colWidths(index) {
          if ((index % 4) === 0 || ((index + 1) % 4) === 0) {
            return 98
          } else {
            return 45
          }
        },
        afterChange: (change, source) => {
          if (source === 'loadData') {
            return
          }

          change.forEach(DD => {
            const key = DD[1]
            const _machine = DD[1].split('-')[1]
            const key1 = DD[1].split('-')[0]
            if (key1 === 'plan_trains' || key1 === 'time_consume') {
              const _index = _machine.slice(1, _machine.length)
              let __index = 0
              if (Number(_index) >= 6 && Number(_index) < 11) {
                __index = 1
              }
              if (Number(_index) >= 11) {
                __index = 2
              }
              const _arr = this.data[__index].slice(2, this.data[__index].length - 1)
              this.data[__index][this.data[__index].length - 1][key] = sum(_arr, key)
            }
          })
          this.data.forEach((d, i) => {
            this['hot' + i].loadData(d)
          })
        }
      })
    }
    // const load = document.querySelector('#load')
    // Handsontable.dom.addEvent(load, 'click', () => {
    //   // 更新数据
    //   hot.loadData(this.data)
    // })
  },
  methods: {
    async getList() {
      try {
        if (!this.getParams.factory_date) {
          this.$message.info('请选择日期')
          return
        }
        const data = await schedulingResult('get', null, { params: this.getParams })
        const arr = []
        let arrContent = []
        let obj = {}
        let objTitle = {}
        let objTotal = {}

        let i = 1
        for (const key in data) {
          if (Object.hasOwnProperty.call(data, key)) {
            this.machineList.push(key)
            const element = data[key]
            obj['recipe_name-' + key] = key
            obj['plan_trains-' + key] = element.dev_type
            obj['time_consume-' + key] = ''
            obj['desc-' + key] = ''

            objTitle['recipe_name-' + key] = '规格'
            objTitle['plan_trains-' + key] = '车数'
            objTitle['time_consume-' + key] = '耗时'
            objTitle['desc-' + key] = '备注'

            objTotal['recipe_name-' + key] = '合计'
            objTotal['plan_trains-' + key] = sum(element.data, 'plan_trains')
            objTotal['time_consume-' + key] = sum(element.data, 'time_consume')
            objTotal['desc-' + key] = ''

            element.data.forEach((d, _i) => {
              if (!arrContent[_i]) {
                arrContent[_i] = {
                  ['recipe_name-' + key]: d.recipe_name,
                  ['plan_trains-' + key]: d.plan_trains,
                  ['time_consume-' + key]: d.time_consume,
                  ['desc-' + key]: d.desc
                }
              } else {
                arrContent[_i]['recipe_name-' + key] = d.recipe_name
                arrContent[_i]['plan_trains-' + key] = d.plan_trains
                arrContent[_i]['time_consume-' + key] = d.time_consume
                arrContent[_i]['desc-' + key] = d.desc
              }
            })
            if (i % 5 === 0) {
              let __arr = [obj, objTitle]
              __arr = __arr.concat(arrContent)
              __arr = __arr.concat(objTotal)
              arr.push(__arr)
              obj = {}
              objTitle = {}
              objTotal = {}
              arrContent = []
            }
            i++
          }
        }
        // const arr1 = []
        // arr.forEach(D => {
        //   arr1.push(...D)
        // })
        arr.forEach((d, i) => {
          this['hot' + i].loadData(d)
        })

        this.data = arr
      } catch (e) {
        for (let index = 0; index < 3; index++) {
          if (this['hot' + index]) {
            this['hot' + index].loadData([])
          }
        }
        this.data = []
      }
    },
    async getScheduleNoList(bool) {
      try {
        const data = await scheduleNos('get', null, { params: { factory_date: this.getParams.factory_date }})
        this.scheduleNoList = data
        if (bool) {
          if (this.scheduleNoList.length) {
            this.getParams.schedule_no = this.scheduleNoList[0]
            this.getList()
          }
        }
      } catch (e) {
        this.scheduleNoList = []
      }
    },
    changeListDate() {
      this.getParams.schedule_no = ''
      for (let index = 0; index < 3; index++) {
        if (this['hot' + index]) {
          this['hot' + index].loadData([])
        }
      }
      this.data = []
      this.getScheduleNoList(false)
    },
    changeList() {
      this.machineList = []
      this.getList()
    },
    exportTable() {
      exportExcel('机台生产计划')
    },
    Upload(param) {
      const formData = new FormData()
      formData.append('file', param.file)
      // equipOrderAssignRuleImportXlsx('post', null, { data: formData }).then(response => {
      //   this.$message({
      //     type: 'success',
      //     message: response
      //   })
      // })
    },
    async submitFun() {
      const arr = []
      this.data.forEach((d, i) => {
        d.forEach((D, i) => {
          if (i > 1 && i < d.length - 1) {
            arr.push(D)
          }
        })
      })

      const obj = {}
      this.machineList.forEach(d => {
        obj[d] = []
      })
      for (let index = 0; index < arr.length; index++) {
        const ele = arr[index]
        this.machineList.forEach(d => {
          if ((ele['desc-' + d]) ||
          (ele['plan_trains-' + d]) ||
          (ele['recipe_name-' + d]) ||
          (ele['time_consume-' + d])) {
            obj[d].push({
              desc: ele['desc-' + d] || null,
              plan_trains: ele['plan_trains-' + d] || null,
              recipe_name: ele['recipe_name-' + d] || null,
              time_consume: ele['time_consume-' + d] || null
            })
          }
        })
      }

      try {
        await schedulingResult('post', null, { data: { schedule_no: this.getParams.schedule_no,
          plan_data: obj }})
        this.$message.success('提交成功')
      } catch (e) {
        //
      }
      // console.log(obj, 'obj')
    }
  }
}
function sum(arr, params) {
  var s = 0
  arr.forEach(function(val, idx, arr) {
    const a = val[params] ? Number(val[params]) : 0
    s += a
  }, 0)
  s = Math.round(s * 100) / 100
  return s
}
function customRenderer(instance, td) {
  Handsontable.renderers.NumericRenderer.apply(this, arguments)
  // td.style.backgroundColor = 'yellow'
}
</script>

<style src="../../../../../node_modules/handsontable/dist/handsontable.full.css"></style>
<style lang="scss">
.machine-production-all{
  #out-table{
  font-size: 10px;
  }
  .wtHolder{
    width: auto !important;
  }
  .ht__manualRowMove{
    display: inline-block;
  }
    .noneData {
    text-align: center;
    line-height: 50px;
    width: 100%;
    // border-bottom: 0.5px solid $border-color;
  }
}
</style>
