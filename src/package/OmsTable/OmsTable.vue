<template>
    <div class="oms-table">
        <div class="table-top">
            <div>
                <span class="table-title">{{ title }}</span>
                <span v-if="explain" class="explain">{{explain}}</span>
            </div>
            <div>
                <el-button
                    v-for="(item,index) in functionalityBtn"
                    :key="index"
                    :type="item.type || 'primary'"
                    :disabled="typeof item.disabled === 'function'?item.disabled():item.disabled"
                    :plain="item.plain || true"
                    :size="item.size || 'mini'"
                    :round="item.round || true"
                    @click="item.funClick && item.funClick(item)"
                >{{ typeof item.title === 'function'?item.title() : item.title}}
                </el-button>
            </div>
        </div>
        <el-table
            v-if="showChart"
            highlight-current-row
            :data="tableList"
            :empty-text="'暂无数据'"
            :default-sort="{prop : option.defaultProp,order : option.defaultSort}"
            style="width: 100%;"
            ref="omsTable"
            @selection-change="handleSelectionChange"
            @sort-change="sortChange"
            @current-change="handleCurrentChange"
        >
            <el-table-column
                type="selection"
                align="center"
                width="55"
                v-if="option.ismultiple"
            />
            <template v-for="item in newHeaderList">
                <template v-if="isShowTableHeader(item) ">
                    <el-table-column
                        v-if="!item.type && !item.show"
                        v-bind="setAttribute(item)"
                    >
                        <template slot-scope="scope">
                            <template v-if="scope.row.isEdit">
                                <el-input v-if="item.itemtype === 'input'" v-model.trim="scope.row[item.prop]" size='small'></el-input>
                                <el-select
                                    :popperAppendToBody="false"
                                    v-model="scope.row[item.prop]"
                                    placeholder="请选择"
                                    v-else-if="item.itemtype === 'select'"
                                >
                                    <el-option
                                        v-for="optionItem in item.data"
                                        :key="optionItem.title"
                                        :label="optionItem.title"
                                        :value="optionItem.title">
                                    </el-option>
                                </el-select>
                                <span class="table-text" v-else v-html="getTableText(item,scope)"></span>
                            </template>
                            <span v-else class="table-text" v-html="getTableText(item,scope)"></span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-bind="setAttribute(item)"
                        v-else-if="item.type === 'switch'"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <el-switch
                                v-model="scope.row[item.prop]"
                                :active-value="item.switchShow"
                                :inactive-value="item.switchHide"
                                :disabled="item.isDisabled"
                                @change="item.change(scope.row)"
                                active-color="#13ce66"
                            >
                            </el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-bind="setAttribute(item)"
                        v-else-if="item.type === 'button'"
                    >
                        <template slot-scope="scope">
                            <el-button
                                @click="item.onClick && item.onClick(scope.row)"
                                :type="item.btnType || 'text'"
                                :size="item.size || 'mini'"
                            >{{getBtnText(item,scope)}}
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-bind="setAttribute(item)"
                        v-else-if="item.type === 'tag'"
                    >
                        <template slot-scope="scope">
                            <el-tag
                                v-if="scope.row.color"
                                :color="scope.row.color"
                            >{{scope.row[item.prop]}}</el-tag>
                            <el-tag
                                v-else-if="scope.row.tagType"
                                :type="scope.row.tagType"
                            >{{scope.row[item.prop]}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-bind="setAttribute(item)"
                        align="right"
                        headerAlign="center"
                        fixed="right"
                        v-else-if="item.type === 'buttons'"
                    >
                        <template slot-scope="scope">
                            <template>
                                <el-button
                                    v-for="(itemBtn, index) in scope.row.butList?scope.row.butList:item.butList"
                                    :key="index"
                                    @click="itemBtn.onClick(scope,itemBtn)"
                                    :type="itemBtn.type || 'text'"
                                    :size="itemBtn.size || 'mini'"
                                    :disabled="btnIsDisabled(itemBtn,scope)"
                                >{{ itemBtn.title }}
                                </el-button>
                            </template>
                        </template>
                    </el-table-column>
                </template>
            </template>
            <el-table-column
                v-if="!option.isHideSetting"
                width="40"
                fixed="right"
            >
                <template slot-scope="scope" slot="header">
                    <div class="setting-container">
                        <el-dropdown trigger="click" @command="handleCommand">
                            <div class="setting">
                                <i class="el-icon-setting"></i>
                            </div>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="1">
                                    <div>字段设置</div>
                                </el-dropdown-item>
                                <el-dropdown-item command="2">
                                    <div>冻结设置</div>
                                </el-dropdown-item>
                                <el-dropdown-item command="3">
                                    <div>
                                        {{isFullScreen?'取消全屏':'表格全屏'}}
                                    </div>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div v-else>
          <slot name="chart"></slot>
        </div>
        <oms-custom-page
            :dialog.sync="customDialog"
            title="选择需要展示的数据项"
        >
            <template v-slot:content>
                <el-checkbox-group
                    v-model="checkedColumn"
                    @change="handleCheckedCitiesChange"
                >
                    <div class="check-item" v-for="col in allColumn" :key="col">
                        <el-checkbox :label="col">{{col}}</el-checkbox>
                    </div>
                </el-checkbox-group>
            </template>
            <template v-slot:footer>
                <div class="btn-container">
                    <div class="btn-left">
                        <el-checkbox
                            v-model="checkAll"
                            @change="handleCheckAllChange"
                        >全选</el-checkbox>
                        <el-checkbox
                            v-model="checkNoAll"
                            @change="handleNoCheckAllChange"
                        >反选</el-checkbox>
                    </div>
                    <div class="btn-right">
                        <el-button @click="customDialog = false" round>取 消</el-button>
                        <el-button type="primary" round @click="confirmChecked">确 定</el-button>
                    </div>
                </div>
            </template>
        </oms-custom-page>
        <oms-custom-page
            :dialog.sync="customFixedDialog"
            title="选择需要冻结的列(不超过5列)"
        >
            <template v-slot:content>
                <el-checkbox-group
                    v-model="fixedList"
                    :max="5"
                    @change="handleFixedChange"
                >
                    <div class="check-item" v-for="fixedCol in allFixed" :key="fixedCol">
                        <el-checkbox
                            :label="fixedCol"
                        >{{fixedCol}}
                        </el-checkbox>
                    </div>
                </el-checkbox-group>
            </template>
            <template v-slot:footer>
                <el-button @click="customFixedDialog = false" round>取 消</el-button>
                <el-button type="primary" @click="confirmFixedCol" round>确 定</el-button>
            </template>
        </oms-custom-page>
    </div>
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    name: "OmsTable",
    props: {
      title: {
        type: String,
        default: "",
      },
      explain: {
        type: String,
        default: "",
      },
      functionalityBtn: {
        type: Array,
        default: () => [],
      },
      option: {
        type: Object,
        default: () => ({}),
      },
      tableHeaderList: {
        type: Array,
        default: () => [],
      },
      tableList: {
        type: Array,
        default: () => [],
      },
      showChart: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        checkAll: true,
        checkNoAll: false,
        customDialog: false,
        isIndeterminate: false,
        fullscreen: false,
        customFixedDialog: false,
        newHeaderList: [],
        checkedColumn: [],
        allColumn: [],
        confirmCheckeds: [],
        fixedList: [],
        checkedFixedList: [],
        allFixed: [],
      };
    },
    computed: {
      ...mapState(['isFullScreen'])
    },
    methods: {
      getBtnText (item,scope) {
        return item.formatter ? item.formatter(scope) : item.label
      },
      btnIsDisabled (itemBtn,scope) {
        return itemBtn.formatter ? itemBtn.formatter(scope) : itemBtn.disabled
      },
      setAttribute (item) {
        return {
          headerAlign : 'center',
          prop : item.prop,
          fixed : item.fixed,
          label : item.title,
          width : item.width || 'auto',
          align : item.align || 'center',
          minWidth : item.minWidth?item.minWidth:'150',
          key : item.title,
          sortable : item.sortable,
          showOverflowTooltip : true
        }
      },
      getTableText (item,scope) {
        let text = (item.formatter?item.formatter(scope):scope.row[item.prop])
        return (text || text == '0') ? text : '-'
      },
      sortChange(e) {
        this.$emit('sortChange', e)
      },
      handleCommand(command) {
        let settingArr = [
          this.showCustomDialog,
          this.showCustomFixedDialog,
          this.tableScreen
        ]
        settingArr[command - 1]()
      },
      showCustomDialog () {
        this.customDialog = true
      },
      showCustomFixedDialog () {
        this.customFixedDialog = true
      },
      tableScreen() {
        if (!this.isFullScreen) {
          this.$message({
            message : '按ESC键退出表格全屏模式',
            customClass : 'message-bule-style'
          })
        }
        this.$store.commit('fullScreen', this.isFullScreen ? false : true)
      },
      isShowTableHeader(item) {
        if (this.confirmCheckeds.indexOf(item.title) !== -1 || item.type === 'buttons' || item.isFilter) {
          return true
        }
        return false
      },
      async confirmChecked() {
        if (!this.checkedColumn.length) {
          this.$message.warning('至少选择一个字段')
          return
        }
        let saveKey = []
        for (let { title, prop } of this.newHeaderList) {
          if (this.checkedColumn.indexOf(title) !== -1) {
            saveKey.push(prop)
          }
        }
        let { status } = await this.$api.table.setUserGrid({
          pageKey: this.$route.name,
          settings : saveKey
        })
        if (status === 1) {
          this.$message.success('保存成功')
        }
        this.confirmCheckeds = this.checkedColumn
        this.customDialog = false
      },
      isAllSelect (val) {
        this.checkAll = val.length === this.allColumn.length
      },
      // 全选自定义字段
      handleCheckAllChange(val) {
        if (val) {
          this.checkNoAll = false
          this.checkedColumn = this.allColumn
        } else {
          this.checkedColumn = []
        }
      },
      //反选
      handleNoCheckAllChange(val) {
        this.checkNoAll = val
        let column = this.allColumn
        let newColumn = []
        column.forEach((item) => {
          if (this.checkedColumn.indexOf(item) === -1) {
            newColumn.push(item)
          }
        })
        this.checkedColumn = newColumn
      },
      handleCheckedCitiesChange(value) {
        this.checkedColumn = value
        let checkedCount = value.length
        let len = this.allColumn.length
        this.checkAll = checkedCount === len
        this.isIndeterminate = checkedCount > 0 && checkedCount < len
      },
      handleFixedChange(val) {
        this.fixedList = val
      },
      // 多选
      handleSelectionChange(val) {
        this.$emit("handleSelectionChange", val);
      },
      //单选
      handleCurrentChange (val) {
        this.$emit('handleCurrentChange',val)
      },
      //取消单选
      setCurrent (row = '') {
        this.$refs.omsTable.setCurrentRow(row)
      },
      confirmFixedCol() {
        let saveKey = []
        for(let {title,prop} of this.newHeaderList) {
          if(this.fixedList.indexOf(title) !== -1) {
            saveKey.push(prop)
          }
        }
        let queryFixed = {
          pageKey:this.$route.name,
          settings:saveKey
        }
        this.$api.table.setFrozenColunm(queryFixed).then((res)=>{
          if(res.status == 1) {
            this.$message.success('保存成功')
          }
        }) 
        this.newHeaderList.forEach((headItem, index) => {
          if (this.fixedList.indexOf(headItem.title) !== -1) {
            this.$set(this.newHeaderList, index, {
              ...headItem,
              fixed: headItem.type === 'buttons' ? 'right' : 'left'
            })
          } else {
            this.$set(this.newHeaderList, index, {
              ...headItem,
              fixed: false
            })
          }
        })
        this.customFixedDialog = false
      },
      async setTableHeader() {
        this.newHeaderList = this.$tools.deepClone(this.tableHeaderList)
        let { data } = await this.$api.table.getUserGridSet({
          pageKey : this.$route.name
        })
        let defaultFixedList = []
        let allColumn = []
        let allFixed = []
        for (let item of this.tableHeaderList) {
          if (item.type !== 'buttons') {
            if (Array.isArray(data.allList) && data.allList.length && !this.option.isHideSetting) {
              if (data.allList.indexOf(item.prop) !== -1 && !item.isFilter) {
                this.confirmCheckeds.push(item.title)
              }
            } else {
              if (!item.isFilter) {
                this.confirmCheckeds.push(item.title)
              }
            }
            if (item.fixed) {
              defaultFixedList.push(item.title)
            }
            if (!item.isFilter) {
              allColumn.push(item.title)
              allFixed.push(item.title)
            }
          }
        }
        this.allColumn = allColumn
        this.checkedColumn = this.confirmCheckeds

        this.fixedList = data.frozenList
        this.newHeaderList.forEach((headItem, index) => {
          if (this.fixedList.indexOf(headItem.prop) !== -1) {
            this.checkedFixedList.push(headItem.title)
            this.$set(this.newHeaderList, index, {
              ...headItem,
              fixed: headItem.type === 'buttons' ? 'right' : 'left'
            })
          } else {
            this.$set(this.newHeaderList, index, {
              ...headItem,
              fixed: false
            })
          }
        })
        this.fixedList = this.checkedFixedList
        this.allFixed = allFixed

      }
    },
    watch: {
      tableHeaderList: {
        handler: 'setTableHeader',
        immediate: true
      },
      checkedColumn : {
        handler: 'isAllSelect',
      }
    },
    mounted() {
      // this.setTableFixedCulumn()
    }
  };
</script>

<style lang="less" scoped>
    .oms-table {
        margin-top: 16px;
        box-sizing: border-box;
        background-color: #fff;
        padding: 24px;
        .table-text {
            color: #626673;
            font-size: 13px;
        }
        /deep/.el-table thead {
            color: #363940;
        }
        /deep/ .el-table th, .el-table tr {
            background-color: #F4F5F8;
        }
        /deep/ .el-table th.is-sortable {
            cursor: default;
        }
        .table-top {
            background-color: #fff;
        }
        /deep/.linkto {
            color: #409EFF;
            text-decoration: none;
            font-size: 12px;
            font-weight: 500;
        }
        /deep/.no-first {
            margin-left: 5px;
        }
    }
    .table-top {
        display: flex;
        justify-content: space-between;
        width: 100%;
        margin-bottom: 18px;
        .table-title {
            font-size: 18px;
            color: #15151A;
            display: inline-block;
            vertical-align: middle;
        }
        .explain {
          display: inline-block;
          vertical-align: middle;
          margin-left: 10px;
          color: red;
          font-size: 12px;
        }
    }
    /deep/ .setting {
        width: 20px;
        height: 20px;
        cursor: pointer;
    }
    .btn-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .check-item {
        display: inline-flex;
        width: 25%;
        flex-wrap: wrap;
        margin-bottom: 16px;
        /*margin-right: 30px;*/
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
    /deep/ .el-table th.gutter {
        display: table-cell !important;
    }

    /deep/ .el-table th > .cell {
        display: inline-block;
        white-space: nowrap;
        word-break: keep-all;
        text-overflow: unset;
    }
    /deep/ .el-button.is-plain:hover {
      border-color: transparent!important;
    }
    /deep/ .el-table__row td{
      font-size: 13px;
      color: #626673;
    }
    /deep/ .el-table__row .el-button--mini {
        font-size: 13px!important;
        min-width: auto!important;
        padding: 0!important;
    }
    /deep/ .el-button--primary.is-plain:hover,.el-button--primary.is-plain:focus {
      background: #ecf5ff;
      color: #176DE6;
      border-color: #176DE6!important;
    }
    /deep/ .el-table .caret-wrapper {
      width: 0;
    }
</style>
