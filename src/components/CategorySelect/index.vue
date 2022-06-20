<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <el-select
          :disabled="disabled"
          placeholder="请选择"
          v-model="cForm.catogory1Id"
          @change="handler1"
        >
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="(c1, index) in list1"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          :disabled="disabled"
          placeholder="请选择"
          v-model="cForm.catogory2Id"
          @change="handler2"
        >
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="(c2, index) in list2"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          :disabled="disabled"
          placeholder="请选择"
          v-model="cForm.catogory3Id"
          @change="handler3"
        >
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="(c3, index) in list3"
            :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  props: ["disabled"],
  data() {
    return {
      list1: [],
      list2: [],
      list3: [],
      cForm: {
        catogory1Id: "",
        catogory2Id: "",
        catogory3Id: "",
      },
    };
  },
  methods: {
    async getCategory1List() {
      let result = await this.$API.attr.reqCategory1List();
      if (result.code == 200) {
        this.list1 = result.data;
      }
    },
    async handler1() {
      this.list2 = [];
      this.list3 = [];
      this.cForm.catogory2Id = "";
      this.cForm.catogory3Id = "";
      const { catogory1Id } = this.cForm;
      this.$emit("getCategoryId", { catogoryId: catogory1Id, level: 1 });
      let result = await this.$API.attr.reqCategory2List(catogory1Id);
      if (result.code == 200) {
        this.list2 = result.data;
      }
    },
    async handler2() {
      this.list3 = [];
      this.cForm.catogory3Id = "";
      const { catogory2Id } = this.cForm;
      this.$emit("getCategoryId", { catogoryId: catogory2Id, level: 2 });
      let result = await this.$API.attr.reqCategory3List(catogory2Id);
      if (result.code == 200) {
        this.list3 = result.data;
      }
    },
    async handler3() {
      const { catogory3Id } = this.cForm;
      this.$emit("getCategoryId", { catogoryId: catogory3Id, level: 3 });
    },
  },
  mounted() {
    this.getCategory1List();
  },
};
</script>

<style>
</style>