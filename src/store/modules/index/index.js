
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
        /**
         * 查询统计数据
         */
        async showTotalData(context,params){
            let res = await get('index/showData',params);
            return res;
        },
        
    }
}