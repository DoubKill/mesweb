<template>
  <div class="work-state-style">
    <!-- 设备运行现况 -->
    <el-tag
      v-for="(item,key) in stateList"
      :key="item"
      :color="item"
      effect="dark"
    >
      {{ key }}
    </el-tag>

    <el-row style="margin-top:40px" :gutter="20">
      <el-col v-for="(o,index) in dataList" :key="index" :span="8">
        <el-card :body-style="{ padding: '0px' }" class="el-card-style">
          <h3>{{ index }}</h3>
          <el-tag
            v-for="(itemO,i) in o"
            :key="i"
            :color="stateList[itemO.status]"
            effect="dark"
            class="el-tag-style"
          >
            {{ itemO.equip_no }}
            {{ itemO.user }}
          </el-tag>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { equipCurrentStatusList } from '@/api/base_w_two'
export default {
  name: 'WorkState',
  data() {
    return {
      stateList: {
        停机: '#ff9000', 故障: '#FF0000', 维修开始: '#81D3F8', 维修结束: '#F4B084', 空转: '#AAAAAA', 运行中: '#76C86F'
      },
      list: [
        { name: 111, type: '停机' }
      ],
      dataList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        const data = await equipCurrentStatusList('get')
        this.dataList = data.results || []
      } catch (e) {
      //
      }
    }
  }

}
</script>

<style lang="scss" scoped>
.el-tag--dark{
      border-color:#fff;
}
.el-card-style{
  padding:20px;
  padding-top:0px;
  margin-bottom:15px;
}
.el-tag-style{
  margin:5px;
}
</style>
