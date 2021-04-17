

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
        async updateUserHeader(context,params){
           let res = await post('userAdmin/uploadUserHeader',params);
           return res;
        },
    }
}