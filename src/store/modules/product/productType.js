
import {post_json,get, post} from '@/http/axios'
export default {
    // 命名空间
    namespaced:true,
    state:{
        subTypeList:[],
        typeList:[]
    },
    getters:{
        
    },
    mutations:{
        initSubTypeList(state,subType){
            state.subTypeList = subType;
        },
        initType(state,type){
            state.typeList = type;
        }
    },
    actions:{
        async getAllType(context,params){
            let res = await get('productSubType/getAllProductType',params);
            context.commit('initType',res.data.result)

            context.dispatch('getAllSubType')
            return res;
        },
        async getAllSubType(context,params){
            let res = await get('productSubType/getAllProductSubType',params);
            /**
             * 查询到的类别列表提交突变,到state中;
             */
            context.commit('initSubTypeList',res.data.result);
            return res;
        },
        async getSubTypePage(context,params){
            let res = await get('productSubType/getSubTypePage',params);
            return res;
        },
        async getTypePage(context,params){
            let res = await get('productSubType/getTypePage',params);
            return res;
        },
        async addOrUpdateType(context,data){
            let res = await post_json('productSubType/addOrUpdateType',data);
            return res;
        },

        async deleteTypeOrSubType(context,params){
            let res = await get('productSubType/deleteTypeOrSubType',params);
            return res;
        },
        
    }
}