import color from 'css-color-function';
/**
 * 转换结果如下
 * {
 *     "shade-1": "rgb(230, 147, 58)",
 *     "light-1": "rgb(255, 172, 83)",
 *     "light-2": "rgb(255, 181, 102)",
 *     "light-3": "rgb(255, 191, 121)",
 *     "light-4": "rgb(255, 200, 140)",
 *     "light-5": "rgb(255, 209, 160)",
 *     "light-6": "rgb(255, 218, 179)",
 *     "light-7": "rgb(255, 227, 198)",
 *     "light-8": "rgb(255, 237, 217)",
 *     "light-9": "rgb(255, 246, 236)"
 * }
 */
const generateColors = primary => {
  let colors = {};
  let formula = {
    'shade-1': 'color(primary shade(10%))',
    'light-1': 'color(primary tint(10%))',
    'light-2': 'color(primary tint(20%))',
    'light-3': 'color(primary tint(30%))',
    'light-4': 'color(primary tint(40%))',
    'light-5': 'color(primary tint(50%))',
    'light-6': 'color(primary tint(60%))',
    'light-7': 'color(primary tint(70%))',
    'light-8': 'color(primary tint(80%))',
    'light-9': 'color(primary tint(90%))'
  };
  Object.keys(formula).forEach(key => {
    const value = formula[key].replace(/primary/g, primary);
    // 转换颜色值为 rgb 值
    colors[key] = color.convert(value);
  });
  // console.log('colors:', colors);
  return colors;
};

export default generateColors;
