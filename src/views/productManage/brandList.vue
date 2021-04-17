<template>
  <div class="app-container">
    <div class="button-container"> 
      <h4 style="display: inline-block;margin-top:20px;margin-left:10px">品牌列表</h4>
      <el-button @click="handleAdd" type="primary" style="float:right;margin:10px" round>添加品牌</el-button>
      <div class="brand-search">
        <el-input placeholder="请输入名称" v-model="nameSearch" class="input-with-select">
            <el-button @click="searchBrandHandle" slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
    </div>
    <el-dialog :title="modelTitle" :visible.sync="dialogFormVisible" width="450px">
      <el-form :model="brandForm">
        <el-form-item label="编号" label-width="120px" style="display:none">
          <el-input v-model="brandForm.id" autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item label="名称" label-width="60px">
          <el-input v-model="brandForm.brandName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="英文名" label-width="60px">
           <el-input v-model="brandForm.englishName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Logo" label-width="60px">
            <el-upload
                class="upload-demo"
                action="http://localhost:8084/file/upload"
                :multiple="true"
                :on-success="successHandler"
                v-model="brandForm.logo"
                list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
        </el-form-item>
        <el-form-item label="赞助商" label-width="60px">
           <el-input v-model="brandForm.operators" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" label-width="60px">
           <el-input v-model="brandForm.description" autocomplete="off"></el-input>
        </el-form-item>
        </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveBrandHandle">确 定</el-button>
      </div>
    </el-dialog>
    <div class="brand-list">
      <el-table
        v-loading="listLoading"
        :data="brands"
        element-loading-text="Loading"
        border
        height="290"
        highlight-current-row>
        <el-table-column align="center" label="编号" width="95" prop="id">
        </el-table-column>
        <el-table-column label="品牌名" prop="brandName" width="95">
        </el-table-column>
        <el-table-column label="英文名" prop="englishName" width="95">
        </el-table-column>
        <el-table-column label="Logo" width="130" align="center" prop="logo">
          <template slot-scope="scope">
              <img style="height:50px;width:50px" :src="scope.row.logo" alt="图片暂无">
          </template>
        </el-table-column>
        <el-table-column label="赞助商" width="120" align="center" prop="operators">
        </el-table-column>
        <el-table-column label="品牌描述" align="center" prop="description">
        </el-table-column>
        <el-table-column label="操作" width="200" align="center" prop="description">
           <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit"  circle
               @click="handleEdit(scope.$index, scope.row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" circle
               @click="handleDelete(scope.$index, scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        :current-page.sync="pageParams.page"
        :page-size="pageParams.pageSize"
        :page-sizes="[3,5,10]"
        @current-change="handleCurrentChange"
        layout="sizes,prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {mapActions,mapState,mapMutations} from 'vuex'
export default {
  filters: {
    
  },
  data() {
    return {
      brandForm:{},
      pageParams:{
        page:1,
        pageSize:3
      },
      total:0,
      brands:[],
      listLoading:false,
      dialogFormVisible:false,
      modelTitle:'',
      nameSearch:''
    }
  },
  created() {
    this.getAllBrandData();
    this.loadBrand()
  },
  methods: {
    ...mapActions('brand',['getAllBrand']),
    ...mapActions('brand',['getBrandPage']),
    ...mapActions('brand',['addOrUpdateBrand']),
    ...mapActions('brand',['deleteBrand']),
    ...mapActions('brand',['getBrandByName']),
    handleSizeChange(val){
      this.pageParams.pageSize = val;
      this.loadBrand();
    },
    /**
     *  搜索
     */
    searchBrandHandle(){
      let params = {
        name:this.nameSearch,
        page:this.pageParams.page,
        pageSize:this.pageParams.pageSize
      }
      this.getBrandByName(params).then((res)=> {
          if(res.data.code == 200){
            this.brands = res.data.result;
            this.total = res.data.result.length;
            this.$message({
              message: '查询成功',
              type: 'success'
            });
          }else {
            this.$message.error('查询失败')
          }
      })
    },
    /**
     * 显示模态框
     */
    handleAdd(){
      this.modelTitle = '添加品牌' ;
      this.dialogFormVisible = true;
    },
    handleEdit(index,row){
       this.modelTitle = '更新品牌';
       this.brandForm.id = row.id;
       this.brandForm.id = row.id;
       this.brandForm = row;
        //更改typeForm的地址
       this.brandForm = Object.assign({}, this.brandForm)
       this.dialogFormVisible = true;
    },
    /**
     * 图片上传处理函数
     */
    successHandler(res){
      this.brandForm.logo = res.result;
    },
    /**
     * 删除
     */
    handleDelete(index,row){
      this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
            this.deleteBrand(row.id).then((res) => {
                if(res.data.code == 200){
                    this.$notify({
                      title: '删除',
                      message: ('i', { style: 'color: teal'}, '更新品牌列表成功'),
                      type:'success'
                    });
                    this.loadBrand();
                }else {
                    this.$notify({
                      title: '删除',
                      message: ('i', { style: 'color: teal'}, '更新品牌列表成功'),
                      type:'fail'
                    });
                }
            })
         })
         .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });          
          });
    },
    /**
     * 编辑保存
     */
    saveBrandHandle(){
      this.addOrUpdateBrand(this.brandForm).then((res) =>{
          if(res.data.code == 200){
            this.$notify({
              title: '更新',
              message: ('i', { style: 'color: teal'}, '更新品牌列表成功'),
              type:'success'
            });
            this.loadBrand();
            this.dialogFormVisible = false;
          }else{
            this.dialogFormVisible = false;
          }
      });    
    },
    getAllBrandData(){
      this.getAllBrand().then((res) => {
          if(res.data.code == 200){
            this.total = res.data.result.total;
          }
      })
    },
    loadBrand(){
      this.getBrandPage(this.pageParams).then((res) =>{
          if(res.data.code == 200){
            this.brands = res.data.result;
          }
      })
    },
    /**
     * 分页改变
     */
    handleCurrentChange(val){
      this.pageParams.page = val;
      this.loadBrand();
    }
  }
}
</script>
<style scoped>
  .brand-search{
    display: inline-block;
    margin: 10px;
    float:right;
  }
  .page-container {
    text-align: center;
    margin: 30px;
  }
  .brand-list{
    margin: 20px;
  }
  .button-container{
    height: 60px;
    margin: 20px;
    border: 1px solid #CCC;
    border-radius: 5px;
  }
</style>