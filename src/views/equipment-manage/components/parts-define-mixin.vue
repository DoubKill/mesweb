
<script>
import { equipSpareErp, erpSpareComponentRelation } from '@/api/jqy'
export default {
  data() {
    return {
      // 绑定备件弹框信息
      dialogVisible1: false,
      dialogForm1: {},
      loading1: false,
      tableData1: [],
      btnLoading1: false,
      dialogVisible2: false,
      dialogForm2: {},
      tableData2: [],
      total2: 0,
      id: null
    }
  },
  methods: {
    async showSpareDialog(row) {
      this.dialogForm1 = JSON.parse(JSON.stringify(row))
      this.id = row.id
      try {
        this.dialogVisible1 = true
        const data = await erpSpareComponentRelation('get', null, { params: { equip_component_id: this.id }})
        this.tableData1 = data.results || []
      } catch (e) {
        //
      }
    },
    handleClose1(done) {
      this.dialogVisible1 = false
      if (done) {
        done()
      }
    },
    async addDialogForm1() {
      this.dialogForm2.equip_component_type = this.dialogForm1.equip_component_type_name
      this.dialogVisible2 = true
      const data = await equipSpareErp('get', null, { params: this.dialogForm2 })
      this.tableData2 = data.results || []
      let data1 = []
      for (const i in this.tableData1) {
        data1 = data1.concat(this.tableData1[i].equip_spare_erp ? this.tableData1[i].equip_spare_erp : this.tableData1[i].id)
      }
      this.tableData2.forEach(row => {
        if (data1.indexOf(row.id) >= 0) {
          this.$refs.multipleTable.toggleRowSelection(row, true)
        }
      })
      this.total2 = data.count
    },
    delSpareDialog(row) {
      this.$confirm('此操作将删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (row.reuse_flag) {
          erpSpareComponentRelation('delete', row.id, {})
            .then(response => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.tableData1.forEach((item, index) => {
                if (row.id === item.id) {
                  this.tableData1.splice(index, 1)
                }
              })
              // this.showSpareDialog(this.dialogForm1)
              if (this.getList) {
                this.getList()
              }
            })
        } else {
          this.tableData1.forEach((item, index) => {
            if (row.id === item.id) {
              this.tableData1.splice(index, 1)
            }
          })
        }
      })
    },
    async submitFun1() {
      const obj = []
      this.tableData1.forEach(item => {
        if (!item.reuse_flag) {
          obj.push({ equip_component: this.id, equip_spare_erp: item.id })
        }
      })
      if (obj.length >= 1) {
        try {
          this.btnLoading1 = true
          await erpSpareComponentRelation('post', null, { data: obj })
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.dialogVisible1 = false
          this.btnLoading1 = false
          this.getList()
        } catch (e) {
          this.btnLoading1 = false
        }
      } else {
        this.dialogVisible1 = false
      }
    },
    handleClose2(done) {
      this.dialogVisible2 = false
      this.$refs.multipleTable.clearSelection()
      if (done) {
        done()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    currentChange2(page, pageSize) {
      this.dialogForm2.page = page
      this.dialogForm2.page_size = pageSize
      this.addDialogForm1()
    },
    submitFun2() {
      let data1 = []
      for (const i in this.tableData1) {
        data1 = data1.concat(this.tableData1[i].equip_spare_erp ? this.tableData1[i].equip_spare_erp : this.tableData1[i].id)
      }
      for (let index = 0; index < this.multipleSelection.length; index++) {
        if (data1.indexOf(this.multipleSelection[index].id) === -1) {
          this.tableData1.push(this.multipleSelection[index])
        }
      }
      this.dialogVisible2 = false
    }
  }
}
</script>
