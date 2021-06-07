<template>
  <div class="dashboard-container">
    <div class="outDiv">
      <div class="innerDiv">
       <label for="" class="labelClass">商品数量</label>
      </div>
      <div class="innerDiv2">
       <label for="" class="labelClass">{{sumData.productSum}}</label>
      </div>
    </div>
    <div class="outDiv">
      <div class="innerDiv">
       <label for="" class="labelClass">订单总数</label>
      </div>
      <div class="innerDiv2">
       <label for="" class="labelClass">{{sumData.orderSum}}</label>
      </div>
    </div>
    <div class="outDiv">
      <div class="innerDiv">
       <label for="" class="labelClass">类型数量</label>
      </div>
      <div class="innerDiv2">
       <label for="" class="labelClass">{{sumData.subTypeSum}}</label>
      </div>
    </div>
    <div class="outDiv">
      <div class="innerDiv">
       <label for="" class="labelClass">销售总额</label>
      </div>
      <div class="innerDiv2">
       <label for="" class="labelClass">{{sumData.totalSales}} ¥</label>
      </div>
    </div>
    <div class="orderChartDiv">
      <div id="orderChart"></div>
    </div>
  </div>
</template>

<script>
import {mapActions} from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
  },
  data() {
    return {
      orderOption:{},
      sumData:{
        productSum:0,
        orderSum:0,
        subTypeSum:0,
        totalSales:0,
      },
    }
  },
  created(){
    
  },
  mounted(){
    this.initOrderChartData();
  },
  methods:{
    ...mapActions('index',['showTotalData']),
    initOrderChartData(){
       let xDisplay = [];
       let yDisplayClose = [];
       let yDisplaydeliver = [];
       let yDisplaycomplete = [];
      this.showTotalData().then(res =>{
        if(res.data.code == 200){
          let result = res.data.result;
          this.sumData.productSum = result.productSum;
          this.sumData.subTypeSum = result.subTypeSum;
          this.sumData.orderSum = result.orderSum;
          this.sumData.totalSales = result.totalSales;
          //获取图表中的数据
          let closeOrderMap = result.closeOrderMap;
          let deliveredOrderMap = result.deliveredOrderMap;
          let completedOrderMap = result.completedOrderMap;
          for(let key in closeOrderMap){
            //xDisplay.push(key);
            yDisplayClose.push(closeOrderMap[key])
          }
          for(let key in deliveredOrderMap){
            xDisplay.push(key);
            yDisplaydeliver.push(deliveredOrderMap[key])
          }
          for(let key in completedOrderMap){
            //xDisplay.push(key);
            yDisplaycomplete.push(completedOrderMap[key])
          }
        }
      })
      this.orderOption = {
          title: {
              text: '订单统计图表'
          },
          tooltip: {
              trigger: 'axis'
          },
          legend: {
              data: ['待发货订单','已完成订单','已关闭订单']
          },
          grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
          },
          toolbox: {
              feature: {
                  saveAsImage: {}
              }
          },
          xAxis: {
              type: 'category',
              boundaryGap: false,
              data: xDisplay
          },
          yAxis: {
              type: 'value'
          },
          series: [
              {
                  name: '待发货订单',
                  type: 'line',
                  stack: '总量',
                  data: yDisplaydeliver
              },
              {
                  name: '已完成订单',
                  type: 'line',
                  stack: '总量',
                  data: yDisplaycomplete
              },
              {
                  name: '已关闭订单',
                  type: 'line',
                  stack: '总量',
                  data: yDisplayClose
              }, 
          ]   
      }
      setTimeout(() => {
        this.showOrderChart();  
      },500)
    },
    showOrderChart(){
      let myChart = this.$echarts.init(document.getElementById('orderChart'));
      myChart.setOption(this.orderOption)
    }
  }
}
</script>

<style lang="scss" scoped>
#orderChart {
  width: 1000px;
  height: 500px;
}
.dashboard {
  &-container {
    margin: 50px;
    margin-left: 150px;
  }
  
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.outDiv {
  display: inline-block;
  margin: 30px;
  width: 15%;
  height: 120px;
  border: 2px solid #CCC;
  border-radius: 5px;  
}
.innerDiv {	
    height: 50px;
    background-color:#CCC;
    border-radius: 5px;  
    text-align: center;
    line-height: 50px;
    vertical-align: middle;
}
.innerDiv2 {
   line-height: 70px;
   text-align: center;
   vertical-align: middle;
}
.labelClass{
  font-size: 20px;
  margin: 10px;
}
.orderChartDiv {
  margin: 30px;
  width: 1000px;
}
</style>
