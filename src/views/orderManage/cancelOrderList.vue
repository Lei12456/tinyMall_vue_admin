<template>
  <div class="cancelOrder-container">
    <div class="cancelOrder-list">
      <el-table
      :data="cancelOrders"
      tooltip-effect="dark"
      height="315"
      border>
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
        width="150">
      </el-table-column>
      <el-table-column
        prop="submitTime"
        label="提交时间"
        :formatter='dateFormat'>
      </el-table-column>
      <el-table-column
        prop="amountReturn"
        label="退款金额"
        width="120"
        show-overflow-tooltip>
         <template slot-scope="scope">
              {{scope.row.amountReturn}}  ¥
         </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="订单状态"
        width="120"
        show-overflow-tooltip>
         <template slot-scope="scope" >
           <span v-if="scope.row.status == 1">未处理</span>
           <span v-if="scope.row.status == 2">已退货</span>
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
            @click="showCancelOrderDetail(scope.row)"
            type="info">订单详情</el-button>
          <el-button
            v-if="scope.row.status == 1"
            plain
            size="mini"
            type="danger"
            @click="handleEdit(scope.row)" disabled>关闭订单</el-button>
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
  data() {
    return {
      pageTotal:0,
      cancelOrders:[],
      pageParams:{
        page:1,
        pageSize:5
      },
    }
  },
  computed:{
  },
  created() {
    this.getAllCancelOrderData();
    this.loadCancelOrder();
  },
  methods: {
    ...mapActions('cancel',['getAllCancelOrder','getCancelOrderPage']),
    /**
     * 时间格式处理
     */
    dateFormat(row, column) {
        // 看不懂的可以分别打印row和column
        return moment(row[column.property]).format('YYYY-MM-DD hh:mm:ss')
    },
    showCancelOrderDetail(row){
       //携带参数跳转到编辑商品的页面
      this.$router.push({path:'cancel-detail',query:{cancelOrderData:row.id}})
    },
    /**
     * 分页数量改变事件
     */
    handleSizeChange(val){
      this.pageParams.pageSize = val;
      this.loadCancelOrder();
    },
    /**
     * 当前页处理事件
     */
    handleCurrentChange(val) {
        this.pageParams.page = val;
        this.loadCancelOrder();
    },
    getAllCancelOrderData(){
      this.getAllCancelOrder().then((res) => {
        if(res.data.code == 200){
           this.pageTotal  = res.data.result.length;
        }
      })
    },
    loadCancelOrder(){
      this.getCancelOrderPage(this.pageParams).then((res) => {
        if(res.data.code == 200){
          this.cancelOrders = res.data.result;
          if(res.data.result.length == 0){
            this.pageParams.page - 1;
            this.loadCancelOrder();
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
  .cancelOrder-delelte {
    margin: 10px 20px;
  }
  .cancelOrder-list {
    margin: 20px;
  }
  .page-container {
    text-align: center;
    margin: 30px;
  }
</style>