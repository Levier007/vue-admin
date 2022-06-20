<template>
  <div>
    <!-- 按钮 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0"
      @click="showDialog"
    >
      添加
    </el-button>
    <!-- 表格组件 以列为单位展示 prop:对应列内容的字段名 data为list数据,prop='tmName' 显示的就是list.tmName的值 -->
    <el-table :data="list" style="width: 100%" border>
      <el-table-column type="index" label="符号" width="80px" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="logoUrl" label="品牌logo" width="width">
        <!--el-table-column组件回传给父组件的数据为一个对象 {row,$index}为解构 index为索引 row为数据-->
        <template slot-scope="{ row }">
          <img :src="row.logoUrl" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      @size-change="handleSizeChange"
      @current-change="getPageList"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      :pager-count="7"
      layout="prev, pager, next, jumper,->, sizes, total"
      :total="total"
    >
    </el-pagination>
    <!-- 对话框 -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <!-- form表单 :model属性 这属性作用是把表单的数据收集到对象身上 将来用来表单验证  Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可。-->
      <el-form
        ref="rulesForm"
        style="width: 80%"
        :model="tmForm"
        :rules="rules"
      >
        <el-form-item label="品牌名称" label-width="80px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌logo" label-width="80px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 删除的弹框 -->
  </div>
</template>

<script>
export default {
  name: "TradeMark",
  data() {
    return {
      // 代表分页器第几页
      page: 1,
      // 当前页数展示数据的条数
      limit: 3,
      // 总共数据条数
      total: 0,
      // 列表展示的数据
      list: [],
      // 对话框显示与控制的属性
      dialogFormVisible: false,
      // 收集品牌信息
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      // 表单验证规则
      rules: {
        // required :必须要校验字段 前面会有星号 trigger 用户行为触发（主要针对文本框）
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "change",
          },
        ],
        logoUrl: [{ required: true, message: "请选择品牌logo" }],
      },
    };
  },
  methods: {
    async getPageList(pager = 1) {
      // 一开始默认第一页 当点击分页器页码时，回传点击的页码替换默认函数参数 是当前页为点击页 在发请求
      this.page = pager;
      const { limit, page } = this;
      let result = await this.$API.trademark.reqTradeMarkList(page, limit);
      if (result.code == 200) {
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    // 当分页器某一页需要展示数据条数发生变化时会触发 回传的参数为每页显示的条数
    handleSizeChange(limit) {
      this.limit = limit;
      this.getPageList();
    },
    showDialog() {
      this.dialogFormVisible = true;
      // 清空数据
      this.tmForm = { tmName: "", logoUrl: "" };
    },
    updateTradeMark(row) {
      // row 当前用户选中的这个品牌信息 将已有的品牌信息赋值给tmform展示
      console.log(row);
      this.dialogFormVisible = true;
      // 将服务器返回的品牌信息 直接赋值给tmForm进行展示 也就是tnForm中存储的即为服务器返回的品牌信息 this.tmForm = row; 但这么写不对
      // 此处要浅拷贝一份row  防止在对话框中修改数据时，导致表格中的数据实时变化，为了避免 故浅拷贝一份，此操作只会修改this.tnForm 不会修改list数组中的tnForm
      this.tmForm = { ...row };
    },
    // 图片上传成功
    handleAvatarSuccess(res) {
      this.tmForm.logoUrl = res.data;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    addOrUpdateTradeMark() {
      // 表单验证通过再进行后续操作 形参valid为表单验证是否成功 t or f
      this.$refs.rulesForm.validate(async (valid) => {
        if (valid) {
          this.dialogFormVisible = false;
          const { tmForm } = this;
          let result = await this.$API.trademark.reqAddOrUpdateTradeMark(
            tmForm
          );
          if (result.code == 200) {
            // 弹出信息框
            if (tmForm.id) {
              this.$message({ message: "修改成功", type: "success" });
            } else {
              this.$message({ message: "添加成功", type: "success" });
            }
            // 如果是添加品牌 留在第一页 但修改品牌 需停留在之前的页面
            this.getPageList(this.tmForm.id ? this.page : 1);
          }
        } else {
          this.$message({ message: "操作失败", type: "warning" });
          // 返回值false阻止事件的默认行为  例如给a标签一个点击事件 出了触发点击事件之外 a标签还有一个默认跳转事件 false可以取消这事件  例如表单submit类默认行为为提交表单数据
          return false;
        }
      });
    },
    // 删除品牌的操作
    deleteTradeMark(row) {
      this.$confirm(`确定删除${row.tmName}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 当用户点击确定按钮时会触发
          let result = await this.$API.trademark.reqDeleteTradeMark(row.id);
          console.log(result);
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            // 判断删除时当前页是否就一个商品，大于一个就停留在当前页 否则去前一页
            this.getPageList(this.list.length > 1 ? this.page : this.page - 1);
          } else {
            this.$message({ message: "操作失败", type: "warning" });
            return false;
          }
        })
        .catch(() => {
          // 取消时触发
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  mounted() {
    // 获取列表数据的方法
    this.getPageList();
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>