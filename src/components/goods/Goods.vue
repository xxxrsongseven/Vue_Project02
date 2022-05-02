<template>
  <div>
    <!-- 导航面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
                <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
            </el-input>
            </el-col>
            <el-col :span="4">
                <el-button type="primary" @click="goAddPage">添加</el-button>
            </el-col>
        </el-row>
        <!-- tabel表格区 -->
        <el-table style="font-size:20px" :data="goodsList" border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="商品名称" prop="goods_name"></el-table-column>
            <el-table-column label="商品价格(元)" prop="goods_price" width="140px"></el-table-column>
            <el-table-column label="重量" prop="goods_weight" width="70px"></el-table-column>
            <el-table-column label="创建时间" prop="add_time" width="230px">
                <template slot-scope="scope">
                   {{scope.row.add_time | dateFormat}}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="210px">
                <template slot-scope="scope">
                    <el-button @click="showEditDialog(scope.row.goods_id)" type="primary" icon="el-icon-edit">编辑</el-button>
                    <el-button @click="removeById(scope.row.goods_id)" type="danger" icon="el-icon-delete">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
         <el-pagination
         background
         @size-change="handleSizeChange"
         @current-change="handleCurrentChange"
         :current-page="queryInfo.pagenum"
         :page-sizes="[5, 10, 15, 20]"
         :page-size="queryInfo.pagesize"
         layout="total, sizes, prev, pager, next, jumper"
         :total="total">
        </el-pagination>
    </el-card>
    <!-- 编辑对话框 -->
    <el-dialog
  title="编辑"
  :visible.sync="editDialogVisible"
  width="50%">
    <el-form :model="editForm" :rules="editFormRules" ref="addFormRef" label-width="100px">
  <el-form-item label="商品名称" prop="goods">
    <el-input v-model="editForm.goods_name"></el-input>
  </el-form-item>
  <el-form-item label="商品价格" prop="goods">
    <el-input v-model="editForm.goods_price"></el-input>
  </el-form-item>
  <el-form-item label="商品数量" prop="goods">
    <el-input v-model="editForm.goods_number"></el-input>
  </el-form-item>
  <el-form-item label="商品重量" prop="goods">
    <el-input v-model="editForm.goods_weight"></el-input>
  </el-form-item>
    </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editGoods">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
    data() {
        return {
            //查询参数对象
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:5
            },
            //商品列表
            goodsList:[],
            //总数据条数
            total:0,
            //编辑对话框的显示与隐藏
            editDialogVisible:false,
            //编辑表单数据对象
            editForm:{},
            //编辑表单校验规则对象
            editFormRules:{
                goods:[
                    {requried:true,message:'请输入以上信息',trigger:'blur'}
                ]
            }
        }
    },
    created(){
        this.getGoodsList()
    },
    methods:{
        //根据分页获取对应的商品列表
        async getGoodsList(){
             const {data:res} = await this.$http.get('goods',{params:this.queryInfo})
            if(res.meta.status!=200) return this.$message.error('获取商品列表失败')
            this.goodsList = res.data.goods
            this.total = res.data.total
        },
        //改变页面显示数量
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize
            this.getGoodsList()
        },
        //改变页码值
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage
            this.getGoodsList()
        },
        //删除商品
        async removeById(id){
          const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        if(confirmResult==='confirm'){
            const {data:res} = await this.$http.delete(`goods/${id}`)
            if(res.meta.status!==200) return this.$message.error(res.meta.msg)
            this.getGoodsList()
            this.$message.success('删除成功')
        }
        },
        //跳转至添加商品页面
        goAddPage(){
            this.$router.push('/goods/add')
        },
        //显示编辑对话框
        async showEditDialog(id){
            const {data:res} = await this.$http.get('goods/'+id)
            this.editForm = res.data
            this.editDialogVisible=true
        },
        async editGoods(){
            const {data:res} = await this.$http.put(`goods/${this.editForm.goods_id}`,this.editForm)
            if(res.meta.status ===200){
                this.getGoodsList()
                this.editDialogVisible=false
                this.$message.success('修改商品成功')

            } else{
                this.$message.error('修改失败')
            }

        }
    }
}
</script>

<style scoped>
.el-table{
    margin: 15px 0px;
}
</style>