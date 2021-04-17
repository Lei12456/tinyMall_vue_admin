
import {post_json,get, post} from '@/http/axios'
export default {
    // 命名空间
    namespaced:true,
    state:{
    },
    getters:{
        
    },
    mutations:{
       
    },
    actions:{
        async getAllCancelOrder(context,params){
            let res = await get('cancelOrder/getAllCancelOrder',params);
            return res;
        },
        /**
         * 分页
         */
        async getCancelOrderPage(context,data){
            let res = await get('cancelOrder/getCancelOrderPage',data);
            return res;
        },
        /**
         * 查询订单详情
         */
         async getCancelOrderById(context,params){
            let res = await get('cancelOrder/getCancelOrderById',{id:params});
            return  res;
        },
        /**
         * 更改订单状态
         */
        async updateCancelOrderStatus(context,params){
            let res = await get('cancelOrder/updateCancelOrderStatus',params);
            return  res;
        },
        /**
         * 审核退货订单
         */
         async updateCancelOrderCheck(context,params){
            let res = await get('cancelOrder/updateCancelOrderCheck',params);
            return  res;
        }
    }
}