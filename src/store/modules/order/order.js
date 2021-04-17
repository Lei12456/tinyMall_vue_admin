
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
        async getAllOrder(context,params){
            let res = await get('order/getAllOrder',params);
            return res;
        },
        /**
         * 分页查询订单列表并且查询也可以分页
         */     
        async getOrderPage(context,data){
            let res = await post_json('order/getOrderBySubmitOrStatusPage',data);
            return res;
        },
        /**
         * 删除订单表   
         */
        async deleteOrder(context,params){
            let res = await post_json('order/deleteOrder',params);
            return res;
        },
        /**
         * 根据订单编号筛选订单
         */
        async getOrderByNumber(context,params){
            let res = await get('order/getOrderByNumber',{number:params});
            return  res;
        },
        /**
         * 查询订单详情
         */
         async getOrderById(context,params){
            let res = await get('order/getOrderById',{id:params});
            return  res;
        },
        /**
         * 更改订单状态
         */
        async updateOrderStatus(context,params){
            let res = await get('order/updateOrderStatus',params);
            return  res;
        }

    }
}