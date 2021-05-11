<template>
  <div class="app-container">
      <div class="button-container"> 
      <h4 style="display: inline-block;margin-top:20px;margin-left:10px">类型列表</h4>
      <el-button @click="handleSubTypeAdd" type="primary" style="float:right;margin:10px" round>添加子类</el-button>
      <el-button @click="handleTypeAdd" type="primary" style="float:right;margin:10px" round>添加类型</el-button>
    </div>
    <el-dialog width="500px" :title="modelTitle" :visible.sync="dialogFormVisible1">
      <el-form :model="typeForm">
        <el-form-item label="编号" label-width="100px" style="display:none">
          <el-input v-model="typeForm.id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="名称" label-width="100px">
          <el-input style="width:250px" v-model="typeForm.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="saveTypeHandle">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog width="500px" :title="modelTitle" :visible.sync="dialogFormVisible2">
      <el-form :model="subTypeForm">
        <el-form-item label="编号" label-width="100px" style="display:none">
          <el-input v-model="subTypeForm.id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="名称" label-width="100px">
          <el-input style="width:250px" v-model="subTypeForm.subName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类名称"  label-width="100px">
          <el-select style="width:250px" v-model="subTypeForm.typeId" placeholder="请选择父类别">
                <el-option  v-for="item in typeList" v-bind:key="item.id" :label="item.name" :value="item.id">
                </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="saveSubTypeHandle">确 定</el-button>
      </div>
    </el-dialog>
    <div class="data-list">
      <div class="type-list">
        <el-table
          v-loading="listLoading"
          :data="types"
          element-loading-text="Loading"
          border
          height="315"
          highlight-current-row>
          <el-table-column align="center" label="编号" width="95" prop="id">
          </el-table-column>
          <el-table-column label="名称" prop="name" >
          </el-table-column>
          <el-table-column label="操作" width="200" align="center" prop="description">
            <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit"  circle
                @click="handleTypeEdit(scope.$index, scope.row)"></el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" circle
                @click="handleTypeDelete(scope.$index, scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-container">
          <el-pagination
            background
            :current-page.sync="typePageParams.page"
            :page-size="typePageParams.pageSize"
            @current-change="typeCurrentChange"
            layout="prev, pager, next"
            :total="typeTotal">
          </el-pagination>
        </div>
      </div>
      <div class="subType-list">
        <el-table
          v-loading="listLoading"
          :data="subTypes"
          element-loading-text="Loading"
          border
          height="315"
          highlight-current-row>
          <el-table-column align="center" label="编号" width="95" prop="id">
          </el-table-column>
          <el-table-column label="名称" prop="subName">
          </el-table-column>
          <el-table-column label="所属类型" prop="typeName" width="200">
          </el-table-column>
          <el-table-column label="操作" width="220" align="center" prop="description">
            <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit"  circle
                @click="handleSubTypeEdit(scope.$index, scope.row)"></el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" circle
                @click="handleSubTypeDelete(scope.$index, scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-container">
          <el-pagination
            background
            :current-page.sync="subTypePageParams.page"
            :page-size="subTypePageParams.pageSize"
            @current-change="subTypeCurrentChange"
            layout="prev, pager, next"
            :total="subTypeTotal">
          </el-pagination>
        </div>
    </div>
    </div>
  </div>
</template>

<script>
import {mapActions,mapState,mapMutations} from 'vuex'
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      subTypeForm:{},
      typeForm:{},
      subTypePageParams: {
        page:1,
        pageSize:5
      },
      typePageParams:{
        page:1,
        pageSize:5
      },
      typeTotal:0,
      subTypeTotal:0,
      subTypes:[],
      types:[],
      listLoading:false,
      dialogFormVisible1:false,
      dialogFormVisible2:false,
      modelTitle:'',
      nameSearch:''
    }
  },
  computed:{
    ...mapState('productType',['typeList'])
  },
  created() {
    this.loadDataList();
    this.getTotal();
  },
  methods: {
    ...mapActions('productType',['getAllType']),
    ...mapActions('productType',['getAllSubType']),
    ...mapActions('productType',['getSubTypePage']),
    ...mapActions('productType',['getTypePage']),
    ...mapActions('productType',['addOrUpdateType']),
    ...mapActions('productType',['deleteTypeOrSubType']),
    getTotal(){
      this.getAllType().then((res) => {
        if(res.data.code == 200){
          this.typeTotal = res.data.result.length;
        }
      })
      this.getAllSubType().then((res) => {
        if(res.data.code == 200){
          this.subTypeTotal = res.data.result.length;
        }
      })
    },
    loadDataList(){
      this.getTypePage(this.typePageParams).then((res) => {
          if(res.data.code == 200){
            this.types = res.data.result;
            this.getSubTypePage(this.subTypePageParams).then((res) => {
                if(res.data.code == 200){
                  let subTypeTemp = res.data.result;
                  this.types.forEach(ele => {
                    subTypeTemp.forEach(element =>{
                        ele.productSubTypes.forEach(ele2 => {
                          if(ele2.id == element.id){
                            element.typeName = ele.name;
                          }
                        })
                    })
                  })
                  this.subTypes = subTypeTemp;
                }
            })
          }
      })
      
    },
    /**
     * type事件
     */
    handleTypeEdit(index,row){
        this.dialogFormVisible1 = true;
        this.modelTitle = '更新分类';
        this.typeForm.id = row.id;
        this.typeForm = row;
        //更改typeForm的地址
        this.typeForm = Object.assign({}, this.typeForm)
    },
    handleTypeDelete(index,row){
      let params = {
        typeId:row.id,
        subTypeId:null
      }
      this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
            this.deleteTypeOrSubType(params).then((res) => {
                if(res.data.code == 200){
                    this.$notify({
                      title: '删除',
                      message: ('i', { style: 'color: teal'}, '更新品牌列表成功'),
                      type:'success'
                    });
                    this.loadDataList();
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
    handleTypeAdd(){
      this.typeForm = {};
      this.dialogFormVisible1 = true;
    },
    saveTypeHandle(){
      let params = {
        type : this.typeForm,
        subType:null
      }
      this.addOrUpdateType(params).then((res) => {
          if(res.data.code == 200){
            this.$notify({
              title: '更新',
              message: ('i', { style: 'color: teal'}, '更新列表成功'),
              type:'success'
            });
            this.loadDataList();
            this.dialogFormVisible1 = false;
          }else{
            this.dialogFormVisible1 = false;
          }
      })
    },
    /**
     * subTypes事件
     */
    handleSubTypeAdd(){
       this.typeForm = {};
       this.dialogFormVisible2 = true;
    },
    handleSubTypeEdit(index,row){
        this.dialogFormVisible2 = true;
        this.modelTitle = '更新分类';
        this.subTypeForm.id = row.id;
        this.subTypeForm.id = row.id;
        this.subTypeForm = row;
        //更改typeForm的地址
        this.subTypeForm = Object.assign({}, this.subTypeForm)
    },
    handleSubTypeDelete(index,row){
      let params = {
        typeId:null,
        subTypeId:row.id
      }
      this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
            this.deleteTypeOrSubType(params).then((res) => {
                if(res.data.code == 200){
                    this.$notify({
                      title: '删除',
                      message: ('i', { style: 'color: teal'}, '更新品牌列表成功'),
                      type:'success'
                    });
                    this.loadDataList();
                }else {
                    this.$notify({
                      title: '删除',
                      message: ('i', { style: 'color: teal'}, '更新品牌列表失败'),
                      type:'faild'
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
      saveSubTypeHandle(){
       let params = {
        type : null,
        subType:this.subTypeForm
      }
       this.addOrUpdateType(params).then((res) => {
          if(res.data.code == 200){
            this.$notify({
              title: '更新',
              message: ('i', { style: 'color: teal'}, '更新列表成功'),
              type:'success'
            });
            this.loadDataList();
            this.dialogFormVisible2 = false;
          }else{
            this.dialogFormVisible2 = false;
          }
      })
    },
    /**
     * 分页改变事件
     */
    subTypeCurrentChange(val){
      this.subTypePageParams.page = val;
      this.loadDataList();
    },
    typeCurrentChange(val){
      this.typePageParams.page = val;
      this.loadDataList();
    },
  }
}
</script>
<style scoped>
.data-list{
  margin: 20px;
  border: 1px solid #CCC;
  border-radius: 5px;
}
.type-list {
  margin: 10px;
  width: 40%;
  display: inline-block;
  
}
.subType-list {
  margin: 10px;
  width: 55%;
  display: inline-block;
}
.button-container{
    height: 60px;
    margin: 20px;
    border: 1px solid #CCC;
    border-radius: 5px;
}
</style>