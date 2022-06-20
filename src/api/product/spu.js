// 该模块主要管理的是SPU
import request from '@/utils/request';
// 获取spu列表数据接口
export const reqSpuList = (page, limit, category3Id) => request({
    url: `/admin/product/${page}/${limit}`,
    method: 'get',
    // 因为category3Id没有在路径中携带 故用params参数带过去
    params: { category3Id }
});
// 添加|修改页面 获取某一个spu信息（修改时展示）
export const reqSpu = (spuId) => request({
    url: `/admin/product/getSpuById/${spuId}`,
    method: 'get',
});
// 添加|修改页面 展示品牌列表
export const reqTradeMarkList = () => request({
    url: `/admin/product/baseTrademark/getTrademarkList`,
    method: 'get',
});
// 添加|修改页面 获取spu图片的接口
export const reqSpuImageList = (spuId) => request({
    url: `/admin/product/spuImageList/${spuId}`,
    method: 'get',
});
// 获取平台销售属性   整个平台销售属性都是3个
export const reqbaseSaleAttrList = () => request({
    url: `/admin/product/baseSaleAttrList`,
    method: 'get',
});
// 添加或修改spu 添加传给服务器不用传id 是服务器生成  但修改需要传递id  
export const reqAddOrUpdateSpu = (spuInfo) => {
    if (spuInfo.id) {
        return request({
            url: `/admin/product/updateSpuInfo`,
            method: 'post',
            data: spuInfo
        })
    } else {
        return request({
            url: `/admin/product/saveSpuInfo`,
            method: 'post',
            data: spuInfo
        })
    }
};

// 删除spu
export const reqDeleteSpu = (spuId) => request({
    url: `/admin/product/deleteSpu/${spuId}`,
    method: 'delete',
    data: spuId
});


// 获取销售属性数据接口
export const reqSpuSaleAttrList = (spuId) => request({
    url: `/admin/product/spuSaleAttrList/${spuId}`,
    method: 'get',
});
// 获取平台属性数据
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: 'get'
});
// 添加sku 
export const reqAddSku = (skuInfo) => request({
    url: `/admin/product/saveSkuInfo`,
    method: 'post',
    data: skuInfo
});
// 获取sku列表数据的接口 
export const reqSkuList = (spuId) => request({
    url: `/admin/product/findBySpuId/${spuId}`,
    method: 'get'
});