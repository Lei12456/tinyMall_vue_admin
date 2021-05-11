

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
        /**
         * 获取所有用户列表
         */
        async getAllUser(context,params){
            let res = await get('userAdmin/getAllUserAdmin',params);
            return res;
        },
        /**
         * 获取所有角色列表
         */
         async getAllRole(context,params){
            let res = await get('userAdmin/getAllRole',params);
            return res;
        },
        /**
         * 添加用户
         */
         async addOrUpdateUser(context,params){
            let res = await post('/register',params);
            return res;
        },
        /**
         * 添加角色
         */
         async addOrUpdateRole(context,params){
            let res = await post('userAdmin/saveOrUpdateRole',params);
            return res;
        },
        /**
         * 删除角色或者用户
         */
         async deleteUserOrRole(context,params){
            let res = await get('userAdmin/deleteUserOrRole',params);
            return res;
        },
    }
}