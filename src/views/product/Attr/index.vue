<template>
  <div>
    <el-card>
      <CategorySelect @getCategoryId="getCategoryId" :disabled='!isShowTable'></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!catogory3Id"
          @click="addAttr"
          >添加属性</el-button
        >
        <el-table :data="attrList" style="width: 100%" border>
          <el-table-column label="序号" width="80" align="center" type="index">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column label="属性值列表" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag
                type="success"
                v-for="(attr, index) in row.attrValueList"
                :key="attr.id"
                style="margin-right: 10px"
                >{{ attr.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              v-model="attrInfo.attrName"
              placeholder="请输入属性名"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrInfo"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button>取消</el-button>
        <el-table style="width: 100%" border :data="attrInfo.attrValueList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column label="属性名称" width="width" align="center">
            <template slot-scope="{ row, $index }">
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性名称"
                size="mini"
                v-if="row.flag"
                @blur="toLook(row, $index)"
                @keyup.native.enter="toLook(row)"
                :ref="$index"
              ></el-input>
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display: block"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80" align="center">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                :title="`确定删除${row.valueName}吗？`"
                @onConfirm="deleteAttrValue(row, $index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addOrUpdateAttr" :disabled="attrInfo.attrValueList.length<1?true:false">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
import CategorySelect from "@/components/CategorySelect";
export default {
  name: "Attr",
  components: { CategorySelect },
  data() {
    return {
      catogory1Id: "",
      catogory2Id: "",
      catogory3Id: "",
      attrList: [],
      isShowTable: true,
      attrInfo: {
        attrName: "",
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 3,
      },
      flag: true,
    };
  },
  methods: {
    async getCategoryId({ catogoryId, level }) {
      if (level == 1) {
        this.catogory1Id = catogoryId;
        this.catogory2Id = "";
        this.catogory3Id = "";
      } else if (level == 2) {
        this.catogory2Id = catogoryId;
        this.catogory3Id = "";
      } else {
        this.catogory3Id = catogoryId;
        this.getAttrList();
      }
    },
    async getAttrList() {
      const { catogory1Id, catogory2Id, catogory3Id } = this;
      let result = await this.$API.attr.reqAttrList(
        catogory1Id,
        catogory2Id,
        catogory3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    addAttrInfo() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: "",
        flag: true,
      });
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    addAttr() {
      this.isShowTable = false;
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: this.catogory3Id,
        categoryLevel: 3,
      };
    },
    updateAttr(attr) {
      this.isShowTable = false;
      this.attrInfo = cloneDeep(attr);
      this.attrInfo.attrValueList.forEach((item) => {
        this.$set(item, "flag", false);
      });
    },
    toLook(row, index) {
      if (row.valueName.trim() == "") {
        this.$message({ type: "warning", message: "请输入正确内容！" });
        return;
      }
      let isRepeat = this.attrInfo.attrValueList.some((item) => {
        if (row !== item) {
          return row.valueName == item.valueName;
        }
      });
      if (isRepeat) {
        this.$message({ type: "warning", message: "请勿重复添加！" });
        return;
      }
      row.flag = false;
    },
    toEdit(row, index) {
      row.flag = true;
      this.$nextTick(() => {
        console.log(this.$refs[index].focus());
      });
    },
    deleteAttrValue(row, index) {
      this.attrInfo.attrValueList.splice(index, 1);
    },
    async addOrUpdateAttr() {
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          if (item.valueName != "") {
            delete item.flag;
            return true;
          }
        }
      );
      let result = await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
      if (result.code == 200) {
        this.isShowTable = true
        this.$message({type:'success',message:'保存成功'})
        this.getAttrList()
      }else{
        this.$message({type:'error',message:'保存失败！'})
      }
    },
  },
  mounted() {},
};
</script>

<style>
</style>