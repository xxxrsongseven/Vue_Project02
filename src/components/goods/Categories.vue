<template>
  <div>
    <!-- 导航面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
        <el-row>
            <el-col>
                <el-button @click="showAddDialog" type="primary">添加分类</el-button>
            </el-col>
        </el-row>
        <!-- 表格 -->
        <tree-table style="font-size:20px" class="treeTable" :show-row-hover="false" border show-index index-text='' :expand-type="false" :selection-type="false" :data="catelist" :columns="columns">
            <!-- 是否有效 -->
            <template slot="isOk" slot-scope="scope">
                <i v-if="scope.row.cat_deleted===false" style="color:lightgreen;" class="el-icon-success"></i>
                <i v-else class="el-icon-error"  style="color:red;"></i>
            </template>
            <!-- 排序 -->
            <template slot="order" slot-scope="scope">
               <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
               <el-tag v-else-if="scope.row.cat_level===1" type="success">二级</el-tag>
               <el-tag v-else type="warning">三级</el-tag>
            </template>
            <!-- 操作 -->
            <template slot="opt" slot-scope="scope">
               <el-button @click="showEditDialog(scope.row.cat_id)" icon="el-icon-edit" type="primary">编辑</el-button>
               <el-button @click="showDeleteDialog(scope.row.cat_id)" icon="el-icon-delete" type="danger">删除</el-button>
            </template>
        </tree-table>
        <!-- 分页 -->
         <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 20, 30]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog
    @close="addCateDialogClosed"
  title="添加"
  :visible.sync="addDialogVisible"
  width="50%">
  <!-- 添加分类表单 -->
  <el-form :model="addCateForm" :rules="addCatFormeRules" ref="addCateFormRef" label-width="100px">
  <el-form-item label="分类名称" prop="cat_name">
    <el-input v-model="addCateForm.cat_name"></el-input>
  </el-form-item>
  <el-form-item label="父级分类">
      <!-- options用来指定数据源 -->
    <el-cascader
    clearable
    v-model="selectedKeys"
    :options="parentCateList"
    :props="cascaderProps"
    @change="parentCateChange"></el-cascader>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
</el-dialog>
<!-- 编辑分类对话框 -->
<el-dialog
  title="编辑分类"
  :visible.sync="editDialogVisible"
  width="50%">
  <el-form :model="editCateForm"  ref="editCateFormRef" label-width="100px">
  <el-form-item label="分类名称" prop="cat_name">
    <el-input v-model="editCateForm.cat_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editCate">确 定</el-button>
  </span>
</el-dialog>

  </div>
</template>

<script>
export default {
    data() {
        return {
            //商品分类列表，默认为空
            catelist:[],
            //总数据条数
            total:0,
            //查询条件
            queryInfo:{
                type:3,
                pagenum:1,
                pagesize:5
            },
            //为tabel指定列的定义
            columns:[
                {label:'分类名称',prop:'cat_name'},
                {label:'是否有效',type:'template',template:'isOk'},
                {label:'排序',type:'template',template:'order'},
                {label:'操作',type:'template',template:'opt'},
            ],
            //添加对话框的显示
            addDialogVisible:false,
            //编辑对话框显示
            editDialogVisible:false,
            //添加分类的表单数据
            addCateForm:{
                cat_name:'',
                cat_pid:0,
                cat_level:0
            },
            //编辑分类的表单数据
            editCateForm:{},
            //添加表单校验规则
            addCatFormeRules:{
                cat_name:[
                    {required:true,message:'请输入分类名称'}
                ]
            },
            //父级分类列表
            parentCateList:[],
            //指定级联选择器的配置对象
            cascaderProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children',
                expandTrigger: 'hover',
                checkStrictly:true
            },
            //选中的父级分类id
            selectedKeys:[],
        }
    },
    created(){
        this.getCateList()
    },
    methods:{
        //获取商品分类数据
        async getCateList(){
            const {data:res} = await this.$http.get('categories',{params:this.queryInfo})
            if(res.meta.status!==200) return this.$message.error('获取商品分类失败')
            this.catelist = res.data.result
            this.total = res.data.total
        },
        //监听pagesize改变事件
        handleSizeChange(newSize){
            this.queryInfo.pagesize=newSize
            this.getCateList()
        },
        //监听pagenum改变
        handleCurrentChange(newPage){
            this.queryInfo.pagenum=newPage
            this.getCateList()
        },
        //展示添加分类对话框
        showAddDialog(){
            this.getParentCateList()
            this.addDialogVisible=true
        },
        //获取父级分类数据列表
        async getParentCateList(){
            const {data:res} = await this.$http.get('categories',{params:{type:2}})
            if(res.meta.status!==200) return this.$message.error('获取父级分类失败')
            this.parentCateList=res.data
        },
        //选择项发生变化触发
        parentCateChange(){
            //如果selectedKeys数组中length>0证明选中了父级分类
            if(this.selectedKeys.length>0){
                //父级分类id
               this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1]
               //为当前分类等级赋值
               this.addCateForm.cat_level=this.selectedKeys.length
               return
            }else{
                 //父级分类id
               this.addCateForm.cat_pid = 0
               //为当前分类等级赋值
               this.addCateForm.cat_level=0
            }
        },
        //点击按钮添加新分类
        addCate(){
            this.$refs.addCateFormRef.validate(async valid=>{
                if(!valid) return
                const {data:res} = await this.$http.post('categories',this.addCateForm)
                if(res.meta.status!==201) return this.$message.error('添加分类失败')
                this.getCateList()
                this.addDialogVisible=false
                this.$message.success('添加分类成功')
            })
        },
        //监听对话框的关闭事件，重置表单
        addCateDialogClosed(){
            this.$refs.addCateFormRef.resetFields()
            this.selectedKeys=[]
            this.addCateForm.cat_level=0
            this.addCateForm.cat_pid=0
        },
        //编辑对话框打开
        async showEditDialog(id){
            const {data:res} = await this.$http.get('categories/'+id)
            if(res.meta.status!==200) return this.$message.error('获取分类失败')
            this.editCateForm = res.data 
            this.editDialogVisible=true
        },
        //提交编辑分类修改信息
        editCate(){
             this.$refs.editCateFormRef.validate(async valid=>{
                if(!valid) {return}else{
                const {data:res} = await this.$http.put('categories/'+this.editCateForm.cat_id,{cat_name:this.editCateForm.cat_name})
                if(res.meta.status!==200) return this.$message.error('编辑分类失败')
                this.editCateForm={}
                this.getCateList()
                this.editDialogVisible=false
                this.$message.success('编辑成功')
                }
             })
        },
        //删除分类信息
        async showDeleteDialog(id){
            const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).catch(err=>err)
            if(confirmResult==='confirm'){
         const {data:res} = await this.$http.delete('categories/'+id)
         if(res.meta.status!==200) return this.$message.error('删除失败，请稍后再试')
         this.getCateList()
         this.$message.success('删除成功！')
       }
        }
    }
}
</script>

<style scoped>
.treeTable{
    margin-top: 15px;
}
.el-cascader{
    width: 100%;
}
</style>