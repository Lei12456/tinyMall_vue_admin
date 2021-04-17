<template>
  <div class="product-container">
    <div class="product-search">
        <div class="icon-search">
          <i class="iconfont">&#xe624;</i> 
          <h3 style="margin-left:15px;display:inline-block;">商品搜索:</h3>
        </div>
        <div style="margin:10px 30px">
          <span>类别搜索</span>
          <el-autocomplete
          style="margin:0 30px"
            popper-class="brand-search-com"
            v-model="searchParams.subTypeSearch"
            :fetch-suggestions="querySearchSubType"
            placeholder="请输入类别"
            @select="handleSelect">
            <i
              class="el-icon-edit el-input__icon"
              slot="suffix"
              @click="handleIconClick">
            </i>
            <template slot-scope="{ item }">
              <div class="name">{{ item.value }} <span class="addr" style="display:none">{{ item.id }}</span></div>
            </template>
          </el-autocomplete>
          <span>品牌搜索</span>
          <el-autocomplete
            style="margin:0 30px"
            popper-class="brand-search-com"
            v-model="searchParams.brandSearch"
            :fetch-suggestions="querySearchBrand"
            placeholder="请输入品牌"
            @select="handleSelect">
            <i
              class="el-icon-edit el-input__icon"
              slot="suffix"
              @click="handleIconClick">
            </i>
            <template slot-scope="{ item }">
              <div class="name">{{ item.value }}</div>
              <span class="addr" style="display:none">{{ item.id }}</span>
            </template>
          </el-autocomplete>
          <span>名称搜索</span>
          <el-input class="name-search" v-model="searchParams.nameSearch" placeholder="请输入内容"></el-input>
        </div>
        <div class="product-delelte"> 
            <el-button size="mini" type="danger" @click="deleteProductFunction(deleleIds)" round>批量删除</el-button>
        </div>
    </div>
    <div class="product-list">
      <el-table
      ref="multipleTable"
      :data="products"
      tooltip-effect="dark"
      style="width: 100%"
      border
      height="320"
       element-loading-text="Loading"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="id"
        label="商品编号"
        width="50">
      </el-table-column>
      <el-table-column
        prop="name"
        label="商品名称"
        width="150">
      </el-table-column>
      <el-table-column
        prop="picture"
        label="商品图片"
        show-overflow-tooltip>
        <template slot-scope="scope">
            <img style="height:50px;width:70px" :src="scope.row.picture" alt="图片暂无">
        </template>
      </el-table-column>
      <el-table-column
        prop="price"
        label="商品价格"
        width="100">
         <template slot-scope="scope">
              {{scope.row.price}}  ¥
         </template>
      </el-table-column>
      <el-table-column
        label="商品标签"
        width="150"
        show-overflow-tooltip>
         <template slot-scope="scope">
           <div>
              <el-switch
                  v-model="scope.row.flag"
                  @change="switchChange(scope.row)"
                  :active-value="1"
                  :inactive-value="0"
                  active-text="商品上新">
              </el-switch>
           </div>
            <div>
              <el-switch
                  v-model="scope.row.status"
                  @change="switchChange(scope.row)"
                  :active-value="1"
                  :inactive-value="0"
                  active-text="商品上架">
              </el-switch>
            </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="productSubType.subName"
        label="商品分类"
        width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="brand.brandName"
        label="商品品牌"
        width="150"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="stock"
        label="库存"
        width="80"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="salesVolume"
        label="销量"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="操作"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button 
            type="primary"
            icon="el-icon-edit" 
            circle
            @click="handleEdit(scope.$index, scope.row)"></el-button>
          <el-button
            type="danger" 
            icon="el-icon-delete" 
            circle @click="handleDelete(scope.row)"></el-button>
        </template>
      </el-table-column>
      </el-table>
      <div class="page-container">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageParams.currentPage"
          :page-sizes="[3, 5, 10]"
          :page-size="pageParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageTotal">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions,mapState} from 'vuex'
import Vue from 'vue'
export default {
  filters: {

  },
  data() {
    return {
      //currentPage:1,
      pageTotal:0,
      products:[],
      pageParams:{
        currentPage:1,
        pageSize:3
      },
      searchParams:{
        brandSearch:'',
        subTypeSearch:'',
        nameSearch:''
      },
      deleleIds:[]
    }
  },
  computed:{
    ...mapState('brand',['brandList']),
    ...mapState('productType',['subTypeList']),
  },
  watch:{
    //深度监听搜索框参数
    searchParams: {
      handler:function(now,old){
        let brandSearchId;
        let subTypeId;
        this.subTypeList.forEach(element => {
           if(element.subName == now.subTypeSearch){
              subTypeId = element.id;
           }
        });
       this.brandList.forEach(element => {
           if(element.brandName == now.brandSearch){
              brandSearchId = element.id;
           }
        });
        let filterParams = {
          brandSearch:brandSearchId != undefined ? brandSearchId : '',
          subTypeSearch: subTypeId != undefined ?  subTypeId : '',
          nameSearch:now.nameSearch
        }
        let params = {
          filterParams,
          pageParams:this.pageParams
        }
        this.getProductByFilter(params).then((res) =>{
            if(res.data.code == 200){
              console.log(res.data.result);
              this.products = res.data.result;
              let total = Math.floor(this.products.length / this.pageParams.currentPage) 
              this.pageTotal = total
            }
        })
      },
      deep: true
    },
    pageParams:{
      handler:function(now,old){
        this.loadProduct();
      },
      deep:true
    }
  },
  mounted(){
  
  },
  created() {
    this.loadProduct();
    this.getAllBrand();
    this.getAllSubType();
    this.getAllProductData();
  },
  methods: {
    ...mapActions('product',['getAllProduct','updatProductStatus',
                  'getProductPage','getProductByFilter','deleteProduct']),
    ...mapActions('productType',['getAllSubType']),
    ...mapActions('brand',['getAllBrand']),
    /**
     * 多选框事件
     */
    handleSelectionChange(val){
      this.deleleIds = [];
      val.forEach(element =>{
         this.deleleIds.push(element.id);
      })
      //this.deleteProductFunction(ids);
    },
    /**
     * 通过id删除商品
     */
    handleDelete(row){
      let ids = [];
      ids.push(row.id);
      this.deleteProductFunction(ids);
    },
    /**
     * 删除执行函数
     */
    deleteProductFunction(ids){
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
         }).then(() => {
            this.deleteProduct(ids).then((res) => {
            if(res.data.code == 200){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.loadProduct();
            }else {
                this.$message({
                type: 'warn',
                message: '删除失败!'
              });
            }
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });          
            });
        })
         .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });          
        });
    },
    /**
     * 搜索框事件
     */
    querySearchBrand(queryString, cb) {
      var restaurants = []
      this.brandList.forEach(element => {
          restaurants.push({'value':element.brandName,'id':element.id})
      });
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    querySearchSubType(queryString, cb){
      var restaurants = []
      this.subTypeList.forEach(element => {
          restaurants.push({'value':element.subName,'id':element.id})
      });
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
  
    },
    handleIconClick(ev) {
      console.log(ev);
    },
    /**
     * 分页数量改变事件
     */
    handleSizeChange(val){
      this.pageParams.pageSize = val;
      this.loadProduct();
    },
    /**
     * 当前页处理事件
     */
    handleCurrentChange(val) {
        this.pageParams.currentPage = val;
        this.loadProduct();
    },
    /**
     * flag标签改变事件
     */
    switchChange(row){
      let params = {
        'id':row.id,
        'status':row.status,
        'flag':row.flag
      }
      this.updatProductStatus(params).then((res) => {
          if(res.data.code == 200){
            this.getAllProduct()
          }
      })
    },
    toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
    },
    handleEdit(index,row){
      let productData = row;
      productData['brandId'] =  row['brand'].id;
      productData['subTypeId'] =  row['productSubType'].id;
      Vue.delete(productData,'brand');
      Vue.delete(productData,'productSubType');
      //携带参数跳转到编辑商品的页面
      this.$router.push({path:'product-add',query:{productData}})
    },
    getAllProductData(){
      this.getAllProduct().then((res) => {
        if(res.data.code == 200){
           this.pageTotal  = res.data.result.length;
        }
      })
    },
    loadProduct(){
      this.getProductPage(this.pageParams).then((res) => {
        if(res.data.code == 200){
          this.products = res.data.result;
          // this.pageTotal  = this.products.length;
          if(res.data.result.length == 0){
          this.pageParams.currentPage - 1;
          this.loadProduct();
          }
        }else {
          console.log('查询文章失败')
        }
      })
    }
  }
}
</script>

<style scoped>
  .product-delelte {
    margin: 10px 20px;
  }
  .name-search{
    margin: 0 30px;
    display: inline-block;
    width: 200px;
  }
  .icon-search{
    margin: 10px 30px;
  }
  .product-list {
    margin: 20px;
  }
  .brand-search-com {
      margin: 30px;
      padding: 30px;
  }
  .brand-search-com li {
      line-height: normal;
      padding: 7px;
  }
  .name {
      text-overflow: ellipsis;
      overflow: hidden; 
  }
  .addr {
      font-size: 12px;
      color: #b4b4b4;
  }

  .highlighted .addr {
    color: #ddd;
  }
  .product-search {
    margin: 20px;
    width: 100%;
    height: 180px;
    border: 1px solid #CCC;
    border-radius: 5px;
  }
  .page-container {
    text-align: center;
    margin: 30px;
  }
</style>