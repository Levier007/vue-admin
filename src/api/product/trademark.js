// 该模块主要获取的是品牌管理的数据模块
import request from '@/utils/request';
// 获取品牌列表接口
export const reqTradeMarkList = (page, limit) => request({
    url: `/admin/product/baseTrademark/${page}/${limit}`,
    method: 'get'
});
// 新增或修改品牌 新增传给服务器不用传id 是服务器生成  但修改需要传递id  
export const reqAddOrUpdateTradeMark = (tradeMark) => {
    if (tradeMark.id) {
        return request({
            url: `/admin/product/baseTrademark/update`,
            method: 'put',
            data: tradeMark
        })
    } else {
        return request({
            url: `/admin/product/baseTrademark/save`,
            method: 'post',
            data: tradeMark
        })
    }
};
// 删除品牌 
export const reqDeleteTradeMark = (id) => request({
    url: `/admin/product/baseTrademark/remove/${id}`,
    method: 'delete'
});