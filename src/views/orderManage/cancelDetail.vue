<template>
    <div class="app-container">
         <div class="cancel-list">
            <div>
                <i class="iconfont">&#xe623;    </i><h4 style="display:inline-block">退货人信息:</h4>
            </div>
           <el-table
                border=""
                :data="cancelCusData"
                style="width: 100%">
                <el-table-column
                prop="customerName"
                label="姓名"
                width="200">
                  <template slot-scope="scope">
                      <el-popover trigger="hover" placement="top">
                      <p>客户姓名: {{ scope.row.customerName }}</p>
                      <p>客户账号: {{ scope.row.customerAccount }}</p>
                      <div slot="reference" class="name-wrapper">
                          <el-tag size="medium">{{ scope.row.customerName }}</el-tag>
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
                prop=""
                label="退货理由"
                width="200">
                {{reason}}
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
            <div class="checkDiv">
                <span style="margin-right:20px">是否审核</span>
                <el-switch
                        v-model="checked"
                        @change="switchChange(checked)"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        active-value="1"
                        inactive-value="0">
                </el-switch>      
            </div>
            <div>
                <el-button @click="enterHandle" type="primary" size="medium">确认退货</el-button>
                <el-button type="danger" size="medium">拒绝退货</el-button>
            </div>
        </div>
        
    </div>
</template>

<script>
import {mapActions,mapState} from 'vuex'
export default {
  data() {
    return {
        cancelOrderData:[],
        productData:[],
        cancelCusData:[],
        reason:'',
        checked:0,
        cancelOrderId:''
    }
  },
  computed:{
 
  },
  mounted(){
    this.cancelOrderId =this.$route.query.cancelOrderData;
    this.loadCancelOrderDetail();
  },
  created() {

  },
  methods: {
      ...mapActions('cancel',['getCancelOrderById','updateCancelOrderCheck','updateCancelOrderStatus']),
      /**
       * 确认退货
       */
    enterHandle(){
        if(this.checked == 0){
             this.$message({
                message: '您还未审核',
                type: 'warning'
             });
        }else {
            this.updateCancelOrderStatus({id:this.cancelOrderId,status:2}).then(res => {
                if(res.data.code == 200){
                    this.$message({
                    message: '已确认退货',
                    type: 'success'
                    })
                }else {
                     this.$message.error('确认退货失败');
                }
            })
        }
    },
      /**
       * 审核
       */
    switchChange(val){
        this.updateCancelOrderCheck({id:this.cancelOrderId,checked:val}).then((res) =>{
            if(res.data.code == 200){
                //this.loadCancelOrderDetail();
            }
        })
    },
    /**
     * 加载退货订单详情
     */
     loadCancelOrderDetail(){
         this.cancelCusData = [];
         this.getCancelOrderById(this.cancelOrderId).then((res) => {
            if(res.data.code == 200){
                let  cancel = res.data.result
                this.reason = cancel.reason;
                this.cancelCusData.push(cancel.cancelCus);
                this.productData = cancel.products;
                this.checked = cancel.isChecked;
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

    .checkDiv {
        margin: 20px;
        padding: 10px;
        text-align: right;
    }
</style>