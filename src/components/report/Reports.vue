<template>
  <div>
    <!-- 导航面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <div id="main" style="width:1500px;height:780px;"></div>
    </el-card>
  </div>
</template>

<script>
//导入echarts
import * as echarts from 'echarts'
export default {
  data() {
    return {
      //需要合并的数据
      options: {
          title: {
            text: '用户来源'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3'
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              boundaryGap: false
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ]
        }
    }
  },
  mounted() {
    
  },
  //此时页面上的元素已经被渲染完毕了
  async mounted(){
    var myChart = echarts.init(document.getElementById('main'));
    const {data:res} = await this.$http.get('reports/type/1')
    if(res.meta.status!==200) return this.$message.error('获取图表数据失败')
    const result = Object.assign(this.options,res.data)
      myChart.setOption(result);
  }
}
</script>

<style>

</style>