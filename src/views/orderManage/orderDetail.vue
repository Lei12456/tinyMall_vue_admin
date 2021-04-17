<template>
    <div class="app-container">
          <div class="progress-div">
            <el-steps :active="active" finish-status="success">
                  <el-step title="订单已发货"></el-step>
                  <el-step title="商品运输中"></el-step>
                  <el-step title="完成订单"></el-step>
            </el-steps>
          </div>
         <div class="order-list">
            <div>
                <i class="iconfont">&#xe623;    </i><h4 style="display:inline-block">收货人信息:</h4>
            </div>
           <el-table
           border=""
                :data="receiverData"
                style="width: 100%">
                <el-table-column
                prop="receiverName"
                label="收货人姓名"
                width="200">
                  <template slot-scope="scope">
                      <el-popover trigger="hover" placement="top">
                      <p>客户姓名: {{ scope.row.customer.customerName }}</p>
                      <p>客户账号: {{ scope.row.customer.customerAccount }}</p>
                      <div slot="reference" class="name-wrapper">
                          <el-tag size="medium">{{ scope.row.receiverName }}</el-tag>
                      </div>
                      </el-popover>
                  </template>
                </el-table-column>
                <el-table-column
                prop="telephone"
                label="手机号码"
                width="200">
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="收货地址"
                  width="270">
                </el-table-column>
                <el-table-column
                  prop="postcode"
                  label="邮政编码"
                  width="200">
                </el-table-column>
            </el-table>
        </div>
        <div class="product-list">
            <div>
                <i class="iconfont">&#xe61e;     </i><h4 style="display:inline-block">商品信息:</h4>
            </div>
            <el-table
            :data="productData"
            border
            show-summary
            :summary-method="getSummaries"
            style="width: 100%">
            <el-table-column
            prop="id"
            label="货号"
            width="180">
            </el-table-column>
            <el-table-column
            prop="picture"
            label="商品图片">
                <template slot-scope="scope">
                    <img style="height:80px;width:120px" :src="scope.row.picture" alt="图片暂无">
                </template>
            </el-table-column>
            <el-table-column
            prop="name"
            label="名称">
            </el-table-column>
            <el-table-column
            prop="price"
            sortable
            label="小计">
                <template slot-scope="scope">
                {{scope.row.price}}  ¥
                </template>
            </el-table-column>
        </el-table>
        </div>
    </div>
</template>

<script>
import {mapActions,mapState} from 'vuex'
export default {
  data() {
    return {
        orderData:[],
        productData:[],
        receiverData:[],
        active:0
    }
  },
  computed:{
 
  },
  mounted(){
    let orderId =this.$route.query.orderData;
    this.loadOrderDetail(orderId);
  },
  created() {

  },
  methods: {
      ...mapActions('order',['getOrderById']),
      
    /**
     * 加载订单详情
     */
     loadOrderDetail(data){
         this.orderData = [];
         this.getOrderById(data).then((res) => {
            if(res.data.code == 200){
                if(res.data.result.status == 1){
                  this.active = 0
                }else if(res.data.result.status == 2){
                  this.active = 2
                }else if(res.data.result.status == 0){
                  this.active = 3;
                }
                this.receiverData.push(res.data.result.receiver);
                this.productData = res.data.result.products;
            }
         })
     },
     /**
       * 
       */
      getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总计';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] += ' ¥';
          } else {
            sums[index] = 'N/A';
          }
        });

        return sums;
      },
  }
}
</script>

<style scoped>
    .app-container {
      height: 100%;
      width: 70%;
      padding: 20px;
      margin: 20px auto;
      border:1px solid #CCC;
      border-radius: 2%;
    }
    .progress-div {
      width: 70%;
      margin: 30px auto;
    }
</style>