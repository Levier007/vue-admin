// 将product中的四个接口函数统一对外暴露
import * as attr from './product/attr';
import * as sku from './product/sku';
import * as spu from './product/spu';
import * as trademark from './product/trademark';

// 对外暴露
export default {
    attr,
    sku,
    spu,
    trademark
}