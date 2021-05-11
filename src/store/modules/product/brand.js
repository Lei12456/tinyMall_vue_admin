
import {post_json,get, post} from '@/http/axios'
export default {
    // 命名空间
    namespaced:true,
    state:{
        brandList:[]
    },
    getters:{
        
    },
    mutations:{
        initBrandList(state,brand){
            state.brandList = brand;
        }
    },
    actions:{
        async getAllBrand(context,params){
            let res = await get('brand/getAllBrand',params);
            /**
             * 查询到的品牌列表提交突变,到state中;
             */
            context.commit('initBrandList',res.data.result.brandsList);
            return res;
        },
        /**
         * 分页查询品牌列表
         */
        // async getBrandPage(context,params){
        //     let res = await get('brand/getBrandPage',params);
        //     return res;
        // },
         /**
         * 添加或者更新品牌
         */
        async addOrUpdateBrand(context,data){
            let res = await post_json('brand/addOrUpdateBrand',data);
            return res;
        },
        /**
         * 删除表
         */
        async deleteBrand(context,params){
            let res = await get('brand/deleteBrand',{id:params});
            return res;
        },
        /**
         * 根据名字筛选品牌
         */
        async getBrandByNamePage(context,params){
            let res = await get('brand/getBrandByName',params);
            return  res;
        },
        /**
         * 根据类型查询品牌
         */
         async getBrandBySubType(context,params){
            let res = await get('brand/getBrandBySubtype',params);
            return  res;
        }
    }
}