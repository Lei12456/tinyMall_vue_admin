
import {post_json,get} from '@/http/axios'
export default {
    // 命名空间
    namespaced:true,
    state:{
        token:'',
        userInfo:''
    },
    getters:{},
    mutations:{
        // 登录的突变
        refreshToken(state,token){
            state.token = token
        },
        // 用于控制登录完之后页面自动跳转
        initToken(state){
            let token = localStorage.getItem('token')
            state.token = token;
        },
        // 用户信息的突变
        refreshInfo(state,userInfo){
            state.userInfo = userInfo
        }
    },
    actions:{
        // 登录
        async login(context,params){
            let res = await get('/login',params);
            // 将token设置到浏览器
            localStorage.setItem('token', res.data.result.token)
            // 将token设置到state中
            context.commit('refreshToken',res.data.result.token)
            // 调用info方法
            context.dispatch('info')
            return res
        },
        // 根据token换取用户信息
        async info(context){
            let token = localStorage.getItem('token')
            let res = await get('/userAdmin/getUserInfo',{token})
            // 将用户信息放入浏览器
            localStorage.setItem('userInfo',JSON.stringify(res.data.result));
            // 将用户信息放入state
            context.commit('refreshInfo',res.data.result);
        },
        async logout(context){
            localStorage.clear();
            location.reload();
        }
    }
}