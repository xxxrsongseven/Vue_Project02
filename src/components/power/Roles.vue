<template>
  <div>
       <!-- 导航面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
        <!-- 添加角色按钮区域 -->
      <el-row>
          <el-col>
            <el-button @click="addDialogVisible=true" type="primary">添加角色</el-button>
          </el-col>
      </el-row>
      <!-- 角色列表区 -->
       <el-table
       border
    :data="roleList"
    stripe
    style="width: 100%;font-size:20px">
    <!-- 展开列 -->
    <el-table-column type="expand">
      <template slot-scope="scope">
        <el-row :class="['bdbottom',index1===0 ? 'bdtop' : '','vcenter']" v-for="(item1,index1) in scope.row.children" :key="item1.id" >
          <!-- 渲染一级权限 -->
          <el-col :span="5" class="ycenter"><el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag><i class="el-icon-caret-right"></i></el-col>
          <!-- 渲染二级和三级权限 -->
          <el-col :span="19">
            <!-- 通过for循环嵌套渲染二级权限 -->
            <el-row :class="[index2===0?'':'bdtop','vcenter']" v-for="(item2,index2) in item1.children" :key="item2.id">
              <el-col :span="6"><el-tag closable @close="removeRightById(scope.row,item2.id)" type="success">{{item2.authName}}</el-tag><i class="el-icon-caret-right"></i></el-col>
              <el-col :span="18">
                <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </template>
    </el-table-column>
    <!-- 索引列 -->
    <el-table-column type="index"></el-table-column>
    <el-table-column label="角色名称" prop="roleName"></el-table-column>
    <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
    <el-table-column label="操作" width="180px">
        <template slot-scope="scope">
        <!-- 修改按钮 -->
        <el-button @click="showEditDialog(scope.row.id)" type="primary" icon="el-icon-edit" circle></el-button>
        <!-- 删除按钮 -->
        <el-button @click="removeRoleById(scope.row.id)"  type="danger" icon="el-icon-delete" circle></el-button>
        <!-- 分配权限按钮 -->
      <el-tooltip :enterable="false" effect="dark" content="角色权限" placement="top">
        <el-button @click="showSetRightDialog(scope.row)" type="warning" icon="el-icon-setting" circle> </el-button>
      </el-tooltip>
        </template>
    </el-table-column>
  </el-table>
  </el-card>
  <!-- 添加角色对话框 -->
  <el-dialog
  title="添加角色"
  :visible.sync="addDialogVisible"
  width="50%"
  @close="addDialogClosed">
  <!-- 内容主题区域 -->
  <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
  <el-form-item label="角色名称" prop="roleName">
    <el-input v-model="addForm.roleName"></el-input>
  </el-form-item>
    <el-form-item label="角色描述" prop="roleDesc">
    <el-input v-model="addForm.roleDesc"></el-input>
  </el-form-item>
  </el-form>
  <!-- 底部按钮区 -->
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRole">确 定</el-button>
  </span>
</el-dialog>
<!-- 修改角色对话框 -->
<el-dialog
@close="editDialogClosed"
  title="修改角色"
  :visible.sync="editDialogVisible"
  width="50%">
    <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="80px">
  <el-form-item label="ID">
    <el-input v-model="editForm.roleId" disabled></el-input>
  </el-form-item>
    <el-form-item label="角色名称" prop="roleName">
    <el-input v-model="editForm.roleName"></el-input>
  </el-form-item>
    <el-form-item label="角色描述" prop="roleDesc">
    <el-input v-model="editForm.roleDesc"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editRoleInfo">确 定</el-button>
  </span>
</el-dialog>
<!-- 分配权限对话框 -->
<el-dialog
  title="分配权限"
  :visible.sync="setRightDialogVisible"
  width="50%"
  @close="setRightDialogClose">
  <!-- 树形控件 -->
  <el-tree ref="treeRef" :data="rightslist" :props="treeProps" default-expand-all :default-checked-keys="defKeys" show-checkbox node-key="id"></el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
    data() {
        return {
            //所有角色列表数据
            roleList:[],
            //添加角色对话框显示
            addDialogVisible:false,
            //修改角色对话框显示
            editDialogVisible:false,
            //分配权限对话框显示
            setRightDialogVisible:false,
            //所有权限的数据
            rightslist:[],
            //树形控件的属性绑定对象
            treeProps:{
              label:'authName',
              children:'children'
            },
            //默认选中的的节点id
            defKeys:[],
            //当前即将分配权限角色的id
            roleId:'',
            //添加角色数据
            addForm:{
                roleName:'',
                roleDesc:''
            },
            //修改角色数据
            editForm:{},
            //添加角色规则
            addFormRules:{
                roleName:[{required:true,message:'请输入用户名',trigger:'blur'},],
            },
        }
    },
    mounted(){
        this.getRoleList()
    },
    methods:{
        //获取所有角色列表
        async getRoleList(){
            const {data:res} = await this.$http.get('roles')
            if(res.meta.status!==200)return this.$message.error('获取角色列表失败')
            this.roleList = res.data
        },
        //添加新角色
        addRole(){
             this.$refs.addFormRef.validate(async valid=>{
                 console.log(this.$refs);
        if (!valid) return
        const {data:res} = await this.$http.post('roles',this.addForm)
        if(res.meta.status!==201) return this.$message.error(res.meta.msg)
        this.$message.success('添加成功')
        this.addDialogVisible=false
        this.getRoleList()
        })
        },
        //监听添加角色对话框关闭事件
        addDialogClosed(){
          this.$refs.addFormRef.resetFields()
        },
        //展示修改对话框
        async showEditDialog(id){
          const {data:res} = await this.$http.get('roles/'+id)
          if(res.meta.status!==200) return this.$message.error('获取用户数据错误')
          this.editForm = res.data
          this.editDialogVisible=true
        },
        //修改角色
        editRoleInfo(){
        this.$refs.editFormRef.validate(async valid=>{
        if (!valid) return
        const {data:res} = await this.$http.put('roles/'+this.editForm.roleId,{roleId:this.roleId,roleName:this.editForm.roleName,roleDesc:this.editForm.roleDesc})
        if(res.meta.status!==200) return this.$message.error(res.meta.msg)
        this.editDialogVisible=false
        this.getRoleList()
        this.$message.success('修改成功')
      })
        },
        //监听修改用户对话框关闭
        editDialogClosed(){
          this.$refs.editFormRef.resetFields()
        },
        //弹出删除用户提示框
     async removeRoleById(id) {
       const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        //确认删除返回confirm  取消返回cancel
       if(confirmResult==='confirm'){
         const {data:res} = await this.$http.delete('roles/'+id)
         if(res.meta.status!==200) return this.$message.error('删除失败，请稍后再试')
         this.getRoleList()
         this.$message.success('删除成功！')
       }
     },
     //根据id删除对应的权限
    async removeRightById(role,rightId){
       //弹框提示用户是否删除
        const confirmResult = await this.$confirm('此操作将删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        if(confirmResult!=='confirm') return
        const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if(res.meta.status!==200) return this.$message.error('删除权限失败')
        role.children=res.data
        this.$message.success('删除成功')
     },
     //展示分配权限对话框
     async showSetRightDialog(role){
       this.roleId = role.id
      const {data:res} =await this.$http.get('rights/tree')
      if(res.meta.status !== 200) return this.$message.error('获取权限列表失败')
      //获取到的权限数据保存到data中
      this.rightslist = res.data
      //递归获取三级节点id
      this.getLeafKeys(role,this.defKeys)
      this.setRightDialogVisible=true
     },
     //通过递归形式获取角色下所有三级权限id保存到defKeys数组中
     getLeafKeys(node,arr){
       //如果当前节点不包含children属性，则是三级节点
       if(!node.children) {
         return arr.push(node.id)
      }
      node.children.forEach(item=>
        this.getLeafKeys(item,arr))
     },
     //监听分配权限对话框关闭
     setRightDialogClose(){
       this.defKeys=[]
     },
     //点击为角色分配权限
     async allotRights(){
       const keys=[
         ...this.$refs.treeRef.getCheckedKeys(),
         ...this.$refs.treeRef.getHalfCheckedKeys()
       ]
       const idStr = keys.join(',')
        const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
        if(res.meta.status!==200) return this.$message.error('分配权限失败')
        this.setRightDialogVisible=false
        this.getRoleList()
        this.$message.success('分配权限成功')
     }
    }

}
</script>

<style scoped>
.el-table{
    margin-top: 15px;
}
.el-tag{
  margin: 7px;
}
.bdtop{
  border-top: 1px solid #eee;
}
.bdbottom{
  border-bottom: 1px solid #eee;
}
.vcenter{
  display: flex;
  align-items: center;
}
.ycenter{
  text-align: center;
}
</style>