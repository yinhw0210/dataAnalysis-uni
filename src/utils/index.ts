
interface ItemInfoType {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
}

// 没必要为了 qs 一个简单的功能引入 qs，手写一个
export const qs = {
  stringify: function (obj) {
    return Object.keys(obj)
      .map(
        (key) => encodeURIComponent(key) + "=" + encodeURIComponent(obj[key])
      )
      .join("&");
  },
};

// 转换为 aspect-ratio 
export const getAspectRatioString = (ratio: string) => {
  const [width, height] = ratio.split(":");
  if (width && height) {
    return `${width} / ${height}`;
  }
  return "1 / 1";
};

// 9:16 转换为 [1,0.5625]的形式
export const getAspectRatioArray = (ratio: string) => {
  const [width, height] = ratio.split(":");
  if (width && height) {
    const widthNum = Number(width);
    const heightNum = Number(height);
    const ratio = Math.min(widthNum / heightNum, heightNum / widthNum);
    if (widthNum > heightNum) {
      return [ratio, 1];
    } else {
      return [1, ratio];
    }
  }
  return [1, 1];
};

// 判断两个元素是否存在重叠，并且重叠面积占各自元素的比例在50%到100%之间
export const isOverlapRateBetween = (source: ItemInfoType, target: ItemInfoType,ratio: number | number[]) => {
  // 提取元素1的坐标和尺寸
  const { left: l1, right: r1, top: t1, bottom: b1, width: w1, height: h1 } = source;
  // 提取元素2的坐标和尺寸
  const { left: l2, right: r2, top: t2, bottom: b2, width: w2, height: h2 } = target;

  // 计算x轴重叠区域
  const xOverlapStart = Math.max(l1, l2);
  const xOverlapEnd = Math.min(r1, r2);
  // 计算y轴重叠区域
  const yOverlapStart = Math.max(t1, t2);
  const yOverlapEnd = Math.min(b1, b2);

  // 检查是否存在重叠
  if (xOverlapStart >= xOverlapEnd || yOverlapStart >= yOverlapEnd) {
      return false;
  }

  // 计算重叠区域的宽度和高度
  const overlapWidth = xOverlapEnd - xOverlapStart;
  const overlapHeight = yOverlapEnd - yOverlapStart;
  const overlapArea = overlapWidth * overlapHeight;

  // 计算两个元素的面积
  const area1 = w1 * h1;
  const area2 = w2 * h2;

  // 计算重叠面积占各自元素的比例
  if (Array.isArray(ratio)) {
    const ratio1 = overlapArea / area1;
    const ratio2 = overlapArea / area2;
    return (ratio1 >= ratio[0] && ratio1 <= ratio[1]) || (ratio2 >= ratio[0] && ratio2 <= ratio[1]);
  } else {
    const ratio1 = overlapArea / area1;
    const ratio2 = overlapArea / area2;
    return (ratio1 >= ratio && ratio1 <= 1) || (ratio2 >= ratio && ratio2 <= 1);
  }
}