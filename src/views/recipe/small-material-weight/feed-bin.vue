<template>
  <div>
    <!-- 料仓管理 -->
    <label style="margin-right:10px;">配料设备</label>
    <selectBatchingEquip v-model="equipValue" :created-is="true" :is-default="true" :multiple-is="true" @changeFun="selectBatchEquip" />
    <div v-for="(item,index) in allTable" :key="index" class="cardBoxMy">
      <h3 style="margin:10px 0 0 10px;float:left;">{{ item.equip_no }}料仓物料维护</h3>
      <el-button v-if="!item.btnState" style="float:right" type="primary" :loading="btnLoading" @click="showAdd(item,index)">保存</el-button>
      <el-button
        v-if="item.btnState&&checkPermission(['xl_bin','change'])"
        style="float:right"
        type="primary"
        @click="item.btnState=!item.btnState"
      >编辑</el-button>
      <el-row style="clear:both">
        <el-col :span="8">
          <ul>
            <li class="liStyle">
              <h3>料仓位置</h3>
              <h3>物料名称</h3>
            </li>
            <li v-for="(itemChild,indexChild) in item.A" :key="indexChild" class="liStyle">
              <span>{{ itemChild.bin }}</span>
              <span v-if="item.btnState">{{ itemChild.name }}</span>
              <el-select
                v-else
                v-model="itemChild.name"
                placeholder="请选择物料"
              >
                <el-option
                  v-for="(itemEquip,i) in item.equipOptions"
                  :key="i"
                  :label="itemEquip.name"
                  :value="itemEquip.name"
                />
              </el-select>
            </li>
          </ul>
        </el-col>
        <el-col :span="8">
          <ul>
            <li class="liStyle">
              <h3>料仓位置</h3>
              <h3>物料名称</h3>
            </li>
            <li v-for="(itemChild,indexChild) in item.B" :key="indexChild" class="liStyle">
              <span>{{ itemChild.bin }}</span>
              <span v-if="item.btnState">{{ itemChild.name }}</span>
              <el-select
                v-else
                v-model="itemChild.name"
                placeholder="请选择物料"
              >
                <el-option
                  v-for="(itemEquip,i) in item.equipOptions"
                  :key="i"
                  :label="itemEquip.name"
                  :value="itemEquip.name"
                />
              </el-select>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import selectBatchingEquip from '../components/select-batching-equip'
import { xlBin, xlMaterial, saveBin } from '@/api/base_w_three'
import { checkPermission } from '@/utils'
export default {
  name: 'SmallMaterialWeightFeedBin',
  components: { selectBatchingEquip },
  data() {
    return {
      equipValue: [],
      equipOptions: [],
      optionsMaterial: [],
      allTable: [
        // true为查看状态 false编辑状态
      ],
      currentSearch: {},
      btnLoading: false
    }
  },
  methods: {
    checkPermission,
    async getList() {
      try {
        const data = await xlBin('get', null, { params: this.currentSearch })
        return data
      } catch (e) {
        //
      }
    },
    async debounceList(index) {
      try {
        if (index) {
          this.currentIndex = index
        }
        //   获取当前改变的那个列表 替换上去
        const data = await this.getList()
        this.allTable[this.currentIndex].tableList = data
      } catch (e) {
        //
      }
    },
    async getEquip(equip_no) {
      try {
        const response = xlMaterial('get', null, { params: { equip_no: equip_no }})
        return response
      } catch (e) {
        //
      }
    },
    selectBatchEquip(val) {
      const record = this.allTable

      if (val) {
        this.allTable = []
        val.forEach(async d => {
          this.currentSearch = {
            equip_no: d.equip_no
          }
          const b = this.allTable.filter(D => D.equip_no === d.equip_no)
          if (b.length === 0) {
            const c = record.filter(D => D.equip_no === d.equip_no)
            if (c.length > 0) {
              this.allTable.push(...c)
            } else {
              const a = await this.getList()
              const b = await this.getEquip(d.equip_no)

              this.allTable.push(
                {
                  equip_no: d.equip_no,
                  btnState: true,
                  equipOptions: b,
                  ...a
                }
              )
            }
          }
        })
      }
    },
    async showAdd(item, index) {
      try {
        if (index) {
          this.currentIndex = index
        }
        const arr = [...item.A, ...item.B]
        this.btnLoading = true
        await saveBin('put', null, { data: {
          equip_no: item.equip_no,
          bin_data: arr
        }})
        this.btnLoading = false
        this.allTable[index].btnState = !item.btnState
      } catch (e) {
        this.btnLoading = false
      }
    },
    showEdit() {}
  }
}
</script>

<style lang='scss' scoped>
    .cardBoxMy{
        border:1px solid #eee;
        padding:5px;
        margin-top:6px;
        overflow: hidden;
    }
    .liStyle{
        display: flex;
      align-items: center;
      vertical-align: middle;
      border-bottom: 1px solid #eee;
      padding:6px;
        span{
            flex:1;
            align-items: center
        }
        h3{
            flex:1;
            align-items: center
        }
    }
</style>
