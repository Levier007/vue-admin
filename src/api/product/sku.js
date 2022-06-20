// 该模块主要管理的是SKU
import request from '@/utils/request';
// 获取sku表单  
export const reqSkuList = (page, limit) => request({
    url: `/admin/product/list/${page}/${limit}`,
    method: 'get'
});
// 上架  
export const reqSale = (skuId) => request({
    url: `/admin/product/onSale/${skuId}`,
    method: 'get'
});
// 下架  
export const reqCancel = (skuId) => request({
    url: `/admin/product/cancelSale/${skuId}`,
    method: 'get'
});
// 获取sku详情的接口  
export const reqSkuById = (skuId) => request({
    url: `/admin/product/getSkuById/${skuId}`,
    method: 'get'
});