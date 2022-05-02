<template>
  <div>
    <!-- 导航面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
        <!-- 头部警告区 -->
        <el-alert center title="注意！只允许为第三级分类设置相关参数！" type="warning" show-icon close-text="知道了"></el-alert>
        <!-- 选择商品分类区 -->
        <el-row class="cat_opt">
            <el-col>
                <span>选择商品分类：</span>
                <!-- 选择商品分类的级联选择框 -->
                <el-cascader
                v-model="selectedKeys"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"></el-cascader>
            </el-col>
        </el-row>
        <!-- Tab页签区 -->
       <el-tabs v-model="activeName" @tab-click="handleTabClick">
           <!-- 添加动态参数 -->
        <el-tab-pane label="动态参数" name="many">
            <el-button @click="addDialogVisible=true" type="primary" :disabled="isBtnDisabled">添加参数</el-button>
            <!-- 动态参表格 -->
            <el-table  style="font-size:20px" :data="manyTableData" border stripe>
                <!-- 展开行 -->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <!-- 循环渲染tag标签 -->
                        <el-tag @close="handleClose(i,scope.row)" closable v-for="(item,i) in scope.row.attr_vals" :key="item.attr_id">
                            {{item}}
                        </el-tag>
                        <!-- 输入文本框 -->
                        <el-input
                        class="input-new-tag"
                        v-if="scope.row.inputVisible"
                        v-model="scope.row.inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)"
                        >
                        </el-input>
                        <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                    </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button @click="showEditDialog(scope.row.attr_id)" type="primary" icon="el-icon-edit">编辑</el-button>
                        <el-button @click="removeParams(scope.row.attr_id)" type="danger" icon="el-icon-delete">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
           <!-- 添加静态属性 -->
        <el-tab-pane label="静态属性" name="only">
            <el-button @click="addDialogVisible=true" type="primary" :disabled="isBtnDisabled">添加属性</el-button>
            <!-- 静态属性表格 -->
            <el-table style="font-size:20px" :data="onlyTableData" border stripe>    
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <!-- 循环渲染tag标签 -->
                        <el-tag @close="handleClose(item.attr_id,scope.row)" closable v-for="item in scope.row.attr_vals" :key="item.attr_id">
                            {{item}}
                        </el-tag>
                        <!-- 输入文本框 -->
                        <el-input
                        class="input-new-tag"
                        v-if="scope.row.inputVisible"
                        v-model="scope.row.inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)"
                        >
                        </el-input>
                        <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                    </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button @click="showEditDialog(scope.row.attr_id)" type="primary" icon="el-icon-edit">编辑</el-button>
                        <el-button @click="removeParams(scope.row.attr_id)" type="danger" icon="el-icon-delete">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
       </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog
    @close="addDialogClosed"
  :title="'添加'+titleText"
  :visible.sync="addDialogVisible"
  width="50%">
  <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
  <el-form-item :label="titleText" prop="attr_name">
    <el-input v-model="addForm.attr_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
  </span>
</el-dialog>
<!-- 修改参数对话框 -->
    <el-dialog
  :title="'修改'+titleText"
  :visible.sync="editDialogVisible"
  @close="editDialogClosed"
  width="50%">
  <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="100px">
  <el-form-item :label="titleText" prop="attr_name">
    <el-input v-model="editForm.attr_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editParams">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
    data() {
        return {
            //商品分类列表
            cateList:[],
            //级联选择框的配置项
            cateProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children',
                expandTrigger: 'hover'
            },
            //级联选择框双向绑定到的数组
            selectedKeys:[],
            //被激活的页签的名称
            activeName:'many',
            //动态参数数据
            manyTableData:[],
            //静态参数数据
            onlyTableData:[],
            //控制添加对话框的显示与隐藏
            addDialogVisible:false,
            //控制修改对话框的显示与隐藏
            editDialogVisible:false,
            //添加参数的表单数据对象
            addForm:{
                attr_name:''
            },
            //修改参数的表单数据对象
            editForm:{
                attr_name:''
            },
            //添加表单的验证规则对象
            addFormRules:{
                attr_name:[
                    {required:true,message:'请输入参数名称',trigger:'blur'}
                ]
            }
        }
    },
    mounted() {
        this.getCateList()
    },
    methods: {
        //获取所有的商品分类列表
        async getCateList(){
            const {data:res} = await this.$http.get('categories')
            if(res.meta.status!==200) return this.$message.error('获取商品分类列表失败')
            this.cateList = res.data
        },
        //级联选择框选中项变化会触发
        handleChange(){
            this.getParamsData()
        },
        //TAB页签点击事件的处理函数
        handleTabClick(){
            this.getParamsData()
        },
        //获取参数的列表数据
        async getParamsData(){
            //证明选中的不是三级分类
            if(this.selectedKeys.length!==3){
                this.selectedKeys=[]
                this.manyTableData=[]
                this.onlyTableData=[]
                return
            }
            //证明选中的是三级分类
            //根据所选分类的id和当前所处的面板获取对应的参数
            const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}})
            if(res.meta.status!==200) {return this.$message.error('获取参数列表失败')}
            //将获取的vals通过split划分成数组
            res.data.forEach(item=>{
                item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
                //控制文本框的显示与隐藏
                item.inputVisible = false
                //文本框中输入的值
                item.inputValue=''
            })
            if(this.activeName === 'many'){
                this.manyTableData = res.data
            }else{
                this.onlyTableData = res.data
            }
        },
        //监听添加对话框的关闭事件
        addDialogClosed(){
            this.$refs.addFormRef.resetFields()
        },
        //点击按钮添加参数
        addParams(){
            this.$refs.addFormRef.validate(async valid=>{
                if(!valid) return
                const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,{attr_name:this.addForm.attr_name,attr_sel:this.activeName})
                if(res.meta.status!==201) return this.$message.error('添加参数失败！')
                this.getParamsData()
                this.addDialogVisible=false
                this.$message.success('添加参数成功')
            })
        },
        //修改对话框打开
        async showEditDialog(id){
            //查询参数信息
            const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${id}`,{params:{attr_sel:this.activeName}})
            if(res.meta.status!==200) return this.$message.error('获取参数失败')
            this.editForm = res.data
            this.editDialogVisible=true
        },
        //点击按钮修改参数
        editParams(){
            this.$refs.editFormRef.validate(async valid=>{
                if(!valid) return
            const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{attr_name:this.editForm.attr_name,attr_sel:this.activeName})
            if(res.meta.status!==200) return this.$message.error('修改参数失败')
            this.getParamsData()
            this.editDialogVisible=false
            this.$message.success('修改参数成功')
            })
        },
        //修改对话框关闭事件(充值修改的表单)
        editDialogClosed(){
            this.$refs.editFormRef.resetFields()
        },
        //删除根据ID删除对应的参数
        async removeParams(id){
            const confirmResult = await this.$confirm('此操作将删除该参数, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).catch(err=>err)
            if(confirmResult==='confirm'){
         const {data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
         if(res.meta.status!==200) return this.$message.error('删除失败，请稍后再试')
         this.getParamsData()
         this.$message.success('删除成功！')
       }
        },
        //文本框失去焦点或按下enter都会触发
        handleInputConfirm(row){
            if(row.inputValue.trim().length===0){
                row.inputValue=''
                row.inputVisible=false
                return
            }
            //如果没有return则进行后续处理
            row.attr_vals.push(row.inputValue.trim())
            row.inputValue=''
            row.inputVisible=false
            //需要发起请求，保存操作
            this.saveAttrVals(row)
        },
        //将对attr_vals的操作保存到数据库
        async saveAttrVals(row){
            const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{attr_name:row.attr_name,attr_sel:row.attr_sel,attr_vals:row.attr_vals.join(' ')})
            if(res.meta.status!==200){ return this.$message.error('修改参数项失败')}
            this.$message.success('修改参数项成功')
        },
        //点击按钮展示文本输入框
        showInput(row){
            row.inputVisible=true
            //让文本框自动获取焦点
            this.$nextTick(()=>{
                this.$refs.saveTagInput.$refs.input.focus()
            })
        },
        //删除对应的参数可选项
        handleClose(i,row){
            row.attr_vals.splice(i,1)
            this.saveAttrVals(row)
        }
    },
    computed:{
        //如若按钮需要被禁用则返回true
        isBtnDisabled(){
            if(this.selectedKeys.length!==3) return true
            return false
        },
        //当前三级分类的id
        cateId(){
            if(this.selectedKeys.length===3) return this.selectedKeys[2]
            return null
        },
        //动态计算标题的文本
        titleText(){
            if(this.activeName==='many') return '动态参数'
            return '静态属性'
        }
    }
}
</script>

<style scoped>
.cat_opt{
    margin: 20px 0px;
}
.el-table{
    margin-top: 20px;
}
.el-tag{
    margin: 5px;
}
.input-new-tag{
    width: 120px;
}
</style>