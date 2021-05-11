<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />
    <div class="setting-model">
      <el-dialog title="修改个人信息" :visible.sync="setting_visible" width="450px">
            <el-form :model="userForm">
                <el-form-item label=""  label-width="80px" style="display:none">
                  <el-input v-model="userForm.id" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="用户名" label-width="80px" >
                  <el-input v-model="userForm.username" autocomplete="off" ></el-input>
                </el-form-item>
                <el-form-item label="密码" label-width="80px">
                  <el-input v-model="userForm.password" autocomplete="off" ></el-input>
                </el-form-item>
                 <el-form-item label="用户头像" label-width="80px">
                    <el-upload
                        action="http://localhost:8084/file/upload"
                        list-type="picture-card"
                        :on-preview="handlePictureCardPreview"
                        :on-success='successHandler'>
                        <i class="el-icon-plus"></i>
                    </el-upload>
                </el-form-item>
                <!-- 图片上传 -->
               
                <!-- <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog> -->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="setting_visible = false">取 消</el-button>
                <el-button type="primary" @click="saveHandle()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
            <img :src="userInfo.picture" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              Home
            </el-dropdown-item>
          </router-link>
          <a target="_blank" @click.prevent="userSettingHandle()">
            <el-dropdown-item>Setting</el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="logoutHandler">
            <span style="display:block;">Log Out</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters,mapActions,mapState} from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ]),
    ...mapState('login',['userInfo'])
  },
  data(){
    return {
      setting_visible:false,
      dialogImageUrl:'',
      dialogVisible:false,
      updateHeaderPath:'',
      userForm:{}
      //userInfo:localStorage.getItem('userInfo')
    }
  },
  created(){
    this.info();
  },
  methods: {
    ...mapActions('login',['logout','info']),
    ...mapActions('user',['addOrUpdateUser']),
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    logoutHandler(){
      this.logout()
    },
    userSettingHandle(){
      this.setting_visible = true;
      this.userForm = this.userInfo;
      this.userForm.roleId = this.userInfo.role.id;
      //this.userForm.username = this.userInfo.username;
      //this.userForm.password = this.userInfo.password;
    },
    handlePictureCardPreview(){
      
    },
    successHandler(res){
     //this.dialogVisible = true;
    //  this.dialogImageUrl = res.result;
    //  this.updateHeaderPath = res.result;
     this.userForm.picture = res.result;
    },
    saveHandle(){
      console.log(this.userForm);
      this.addOrUpdateUser(this.userForm).then((res) => {
          if(res.data.code == 200){
            this.info();
            this.setting_visible = false;
          }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
