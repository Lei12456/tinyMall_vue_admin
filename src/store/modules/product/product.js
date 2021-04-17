
import {post_json,get, post} from '@/http/axios'
export default {
    // 命名空间
    namespaced:true,
    state:{
        productList:[]
    },
    getters:{
    
    },
    mutations:{
        initProductList(state,products){
            state.productList = products;
        }
    },
    actions:{
        async getAllProduct(context,params){
            let res = await get('product/getAllProduct',params);
            return res;
        },
        async addProduct(context,data){
            let res = await post_json('product/addOrUpdateProduct',data);
            return res;
        },
        async updatProductStatus(context,params){
            let res = await post('product/updateProductStatus',params)
            return res;
        },
        async getProductPage(context,params){
            let res = await get('product/getProductPage',params)
            return res;
        },
        async getProductByFilter(context,data){
            let res = await post_json('product/getProductByFilter',data)
            return res
        },
        async deleteProduct(context,params){
            let res = await post_json('product/deleteProduct',params);
            return res;
        }
    }
}