<template>
  <div class="order-container">
    <div class="order-search">
        <div class="icon-search">
          <i class="iconfont">&#xe624;</i> 
          <h3 style="margin-left:15px;display:inline-block;">订单搜索:</h3>
        </div>
        <div style="margin:10px 30px">
          <div class="filterDiv">
            <span>订单编号 </span>
            <el-input
              style="width:250px"
              placeholder="请输入订单编号"
              v-model="filterParams.number">
              <el-button @click="numberSearchHandle" slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </div>
          <div class="filterDiv">
            <span>订单状态  </span>
            <el-select style="width:200px" v-model="filterParams.status" placeholder="请选择订单状态">
              <el-option value="1" label="待发货" option>待发货</el-option>
              <el-option value="2" label="已发货">已发货</el-option>
              <el-option value="0" label="已关闭">已关闭</el-option>
            </el-select>
          </div>
    
          <div class="filterDiv">
            <span>提交时间 </span>
              <el-date-picker
                v-model="filterParams.submitTime"
                type="daterange"
                align="right"
                unlink-panels
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions">
              </el-date-picker>
          </div>
          <div class="filterDiv">
            <el-button type="primary" @click="searchHandle" icon="el-icon-search">搜索</el-button>
          </div>
        </div>
        <div class="order-delelte"> 
           <el-button size="mini" type="danger" @click="deleteOrderFunction(deleleIds)" plain>批量删除</el-button>
        </div>
    </div>
    <div class="order-list">
      <el-table
      ref="multipleTable"
      :data="orders"
      tooltip-effect="dark"
      style="width: 100%"
      border
      height="310"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="id"
        label="编号"
        width="50">
      </el-table-column>
      <el-table-column
        prop="number"
        label="订单编号"
        width="200">
      </el-table-column>
      <el-table-column
        prop="customer.customerAccount"
        label="用户账号"
        width="100">
      </el-table-column>
      <el-table-column
        :formatter="dateFormat"
        prop="submitTime"
        label="提交时间"
        width="300">
      </el-table-column>
      <el-table-column
        prop="amountSum"
        label="订单总额"
        width="120"
        show-overflow-tooltip>
         <template slot-scope="scope">
              {{scope.row.amountSum}}  ¥
         </template>
      </el-table-column>
      <el-table-column
        prop="payMethod"
        label="支付方式"
        width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="status"
        label="订单状态"
        width="120"
        show-overflow-tooltip>
         <template slot-scope="scope" >
           <span v-if="scope.row.status == 1">待发货</span>
           <span v-if="scope.row.status == 2">已发货</span>
           <span v-if="scope.row.status == 0">已关闭</span>
         </template>
      </el-table-column>
      <el-table-column
        label="操作"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button 
            plain
            size="mini"
            @click="showOrderDetail(scope.row)"
            type="info">订单详情</el-button>
          <el-button
            v-if="scope.row.status == 1"
            plain
            size="mini"
            type="primary"
            @click="handleEdit(scope.row)">订单发货</el-button>
          <el-button
            v-if="scope.row.status == 2"
            plain
            size="mini"
            type="danger"
            @click="handleEdit(scope.row)">关闭订单</el-button>
          <el-button
            v-if="scope.row.status == 0"
            plain
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)">删除订单</el-button>
        </template>
      </el-table-column>
      </el-table>
      <div class="page-container">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageParams.page"
          :page-sizes="[5, 10, 50]"
          :page-size="pageParams.pageSize"
          layout="sizes, prev, pager, next, jumper"
          :total="pageTotal">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions,mapState} from 'vuex'
import moment from 'moment'
export default {
  filters: {

  },
  data() {
    return {
      pageTotal:0,
      orders:[],
      pageParams:{
        page:1,
        pageSize:5
      },
      deleleIds:[],
      filterParams:{
        number:'',
        status:'',
        submitTime:'',
      },
      pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
      },
    }
  },
  computed:{
    //只监听日期和状态
    newFilterParams:function() {
        const { status, submitTime } = this.filterParams;
        return { status , submitTime}
    }
  },
  watch:{
    //深度监听搜索框参数
    newFilterParams: {
      handler:function(now,old){
          console.log(now);
          this.loadOrder();
      },
      deep: true
    },
  },
  mounted(){
  
  },
  created() {
    this.getAllOrderData();
    this.loadOrder();
  },
  methods: {
    ...mapActions('order',['getAllOrder','getOrderPage','deleteOrder','getOrderByNumber',
    'getOrderById','updateOrderStatus']),
    /**
     * 通过编号搜索
     * 
     */
    numberSearchHandle(){
      this.getOrderByNumber(this.filterParams.number).then(res => {
        if(res.data.code == 200){
            this.orders = res.data.result
            this.$message({
            message: '查询成功',
            type: 'success'
            })
        }else {
           this.$message.error('查询失败');
        }
      })
    },
    /**
     * 时间格式处理
     */
    dateFormat(row, column) {
        // 看不懂的可以分别打印row和column
        return moment(row[column.property]).format('YYYY-MM-DD hh:mm:ss')
    },
    /**
     * 订单详情
     */
    showOrderDetail(row){
       //携带参数跳转到编辑商品的页面
      this.$router.push({path:'order-detail',query:{orderData:row.id}})
    },
    /**
     * 多选框事件
     */
    handleSelectionChange(val){
      this.deleleIds = [];
      val.forEach(element =>{
         this.deleleIds.push(element.id);
      })
    },
    /**
     * 更改订单状态
     */
    handleEdit(row){
      let params = {
        id:row.id,
        status:row.status == 1 ? 2 : 0
      }
      this.updateOrderStatus(params).then(res => {
          if(res.data.code){
            this.loadOrder();
          }
      })
    },
    /**
     * 搜索按钮事件
     */
    searchHandle(){
      this.loadOrder();
    },
    /**
     * 通过id删除
     */
    handleDelete(row){
      let ids = [];
      ids.push(row.id);
      this.deleteOrderFunction(ids);
    },
    /**
     * 删除执行函数
     */
    deleteOrderFunction(ids){
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
         }).then(() => {
            this.deleteOrder(ids).then((res) => {
            if(res.data.code == 200){
              this.loadOrder();
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            }else {
                this.$message({
                type: 'warn',
                message: '删除失败!'
              });
            }
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });          
            });
        })
         .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });          
        });
    },
    /**
     * 分页数量改变事件
     */
    handleSizeChange(val){
      this.pageParams.pageSize = val;
      this.loadOrder();
    },
    /**
     * 当前页处理事件
     */
    handleCurrentChange(val) {
        this.pageParams.page = val;
        this.loadOrder();
    },
    toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
    },
    getAllOrderData(){
      // this.getAllOrder().then((res) => {
      //   if(res.data.code == 200){
      //      this.pageTotal  = res.data.result.length;
      //   }
      // })
    },
    loadOrder(){
      let params = {
        status:this.filterParams.status,
        submitTime:this.filterParams.submitTime,
        pageParams:this.pageParams
      }
      this.getOrderPage(params).then((res) => {
        if(res.data.code == 200){
          this.orders = res.data.result.orderList;
          this.pageTotal  = res.data.result.total;
          if(res.data.result.length == 0){
            this.pageParams.page - 1;
            //this.loadOrder();
          }
        }else {
  
        }
      })
    }
  }
}
</script>

<style scoped>
  .filterDiv {
    margin: 10px 10px;
    display: inline-block;
  }
  .order-delelte {
    margin: 10px 20px;
  }
  .order-list {
    margin: 20px;
  }
  .order-search {
    margin: 20px;
    width: 100%;
    height: 180px;
    border: 1px solid #CCC;
    border-radius: 5px;
  }
  .page-container {
    text-align: center;
    margin: 30px;
  }
</style>