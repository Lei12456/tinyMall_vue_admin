<template>
  <div class="product-add-container">
    <div class="progress-div">
       <el-steps :active="active" finish-status="success">
            <el-step title="填写商品信息"></el-step>
            <el-step title="检查商品信息"></el-step>
            <el-step title="完成"></el-step>
       </el-steps>
    </div>
    <el-form :rules="rules" ref="productForm" :model="productForm" label-width="100px" input-width="200px" class="demo-ruleForm">
        <el-form-item label="商品名称" prop="name">
            <el-input v-model="productForm.name"></el-input>
        </el-form-item>
        <el-form-item label="商品图片" prop="picture">
            <el-upload
                class="upload-demo"
                action="http://localhost:8084/file/upload"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :multiple="true"
                :on-success="successHandler"
                v-model="productForm.picture"
                list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
            <el-input v-model="productForm.price"></el-input>
        </el-form-item>
        <el-form-item label="商品类别" prop="type">
            <el-select v-model="productForm.typeId" @change="showSubTypeHandle($event)" placeholder="请选择商品父类别">
                <el-option  v-for="item in typeList" v-bind:key="item.id" :label="item.name" :value="item.id">
                </el-option>
            </el-select>
            <el-select v-model="productForm.subTypeId" placeholder="请选择商品类别">
                <el-option  v-for="item in subTypeData" v-bind:key="item.id" :label="item.subName" :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="商品品牌" prop="subType">
            <el-select v-model="productForm.brandId"  placeholder="请选择商品品牌">
                <el-option  v-for="item in brandList" v-bind:key="item.id" :label="item.brandName" :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="商品上架" prop="status">
            <el-switch
                v-model="productForm.status"
                active-value="1"
                inactive-value="0">
            </el-switch>
        </el-form-item>
        <el-form-item label="新品" prop="flag">
           <el-switch
                v-model="productForm.flag"
                active-value="1"
                inactive-value="0">
            </el-switch>
        </el-form-item>
        <el-form-item label="商品销量" prop="salesVolume">
            <el-input v-model="productForm.salesVolume"></el-input>
        </el-form-item>
        <el-form-item label="库存" prop="stock">
            <el-input v-model="productForm.stock"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button @click="resetProductForm('productForm')">重置</el-button>
            <el-button type="primary" @click="saveProductForm('productForm')">添加</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {mapActions,mapState} from 'vuex'
export default {
  filters: {

  },
  data() {
    return {
        productForm:{},
        rules: {
          name: [
            { message: '至少输入一个名称', trigger: 'blur' }
          ],
          type: [
            {required:false, message: '请选择商品类别', trigger: 'change' }
          ],
          brand: [
            {required:false, message: '请至少选择一个品牌', trigger: 'change' }
          ]
        },
        active: 0,
        visible:false,
        subTypeData:[],
        clearTypeSelect:false
    };
  },
  computed:{
      ...mapState('brand',['brandList']),
      ...mapState('productType',['subTypeList','typeList']),
  },
  mounted(){
    /**
     *获取编辑的时候商品信息
     */
    let productData = this.$route.query.productData;
    console.log(productData);
    if(productData != null){
        this.productForm = productData;
    }
  },
  created() {
    this.getAllBrand();
    this.getAllType();
  },
  methods: {
    ...mapActions('brand',['getAllBrand']),
    ...mapActions('productType',['getAllType']),
    ...mapActions('product',['addProduct']),
    /**
     * 上传图片成功函数
     */
    successHandler(res){
        this.productForm.picture = res.result;
    },
    /**
     * 显示子类别
     */
    showSubTypeHandle(event){
        this.typeList.forEach(item => {
            if(item.id == event){
                this.subTypeData = item.productSubTypes;
            }
        });
    },
    /**
     * 最后填完商品信息之后
     */
    // changeNext(){
    //  this.active = 1;
    // },
    /**
    * 提交表单
    */
    saveProductForm(formName) {
        this.$refs[formName].validate((valid) => {
            if (valid) {
                this.addProduct(this.productForm).then((res) => {
                    if(res.data.code == 200){
                        //刷新商品列表
                        this.getAllType();
                        this.$message({
                            showClose: true,
                            message: '操作成功',
                            type: 'success'
                        });
                    }else{
                        this.$message({
                            showClose: true,
                            message: res.data.msg,
                            type: 'error'
                        });
                    }
                    
                })
            } else {
                console.log('error submit!!');
                return false;
            }
        })
    },
        /**
         * 重置表单
         */
    resetProductForm(formName) {
        this.$refs[formName].resetFields()
    },
        /**
         * 删除图片
         */
    handleRemove(file, fileList) {
        console.log(file, fileList);
    },
    handlePreview(file) {
        console.log(file);
    },
    progressNext() {
        if (this.active++ > 2) this.active = 0;
    }
  }
}
</script>
<style scoped>
    .product-add-container {
      height: 100%;
      width: 50%;
      padding: 20px;
      margin: 20px auto;
      border:1px solid #333;
      border-radius: 2%;
    }
    .progress-div {
        height: 100%;
        width: 70%;
        margin: 20px auto;
    }
</style>    