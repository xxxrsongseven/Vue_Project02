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
                    <el-button type="primary" icon="el-icon-edit">编辑</el-button>
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
            total:0
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
        }
    }
}
</script>

<style scoped>
.el-table{
    margin: 15px 0px;
}
</style>