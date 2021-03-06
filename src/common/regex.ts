// 参考 https://juejin.im/post/6844903831264837645

/* eslint-disable */

// 用户名正则，字母开头4到16位（字母，数字，下划线，减号）
export const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_-]{3,15}$/
// 用户名正则，字母、中文开头4到16位（字母，数字，下划线，减号, 中文）
export const usernameCnRegex = /^[a-zA-Z\u4E00-\u9FA5][a-zA-Z0-9\u4E00-\u9FA5_-]{3,16}$/

// 邮箱正则
export const emailRegex = /^.*(?=.{3,24})^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/
// 包含中文邮箱正则
export const emailCnRegex = /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/
/**
 * 限定邮箱
 * 如果白名单太长可以将邮箱域名白名单写成数组，利用正则表达式做初步验证，用白名单做域名的二次验证
 * var domains= ["qq.com","163.com","vip.163.com","263.net","yeah.net","sohu.com","sina.cn","sina.com","eyou.com","gmail.com","hotmail.com"];
 */
export const emailLimitRegex = /^([A-Za-z0-9_\-\.])+\@(163.com|qq.com|30ke.cn)$/

// 密码强度正则，6-16位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符 eg: iFat3#
export const passwordRegex = /^.*(?=.{6,16})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*?\.-_=+]).*$/

// 手机号正则 eg: 18600000000
export const phoneRegex = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/

// 身份证号（18位）正则 eg: 11010519880605371X
export const idCordRegex = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/

// RGB Hex颜色正则 eg: #b8b8b8
export const colorRegex = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/

// URL正则 eg: http://difflife.cn
export const urlRegex = /^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/

// ipv4地址正则 eg: 115.28.47.26
export const ip4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/

// IPV6正则 eg: fe80:0000:0000:0000:0204:61ff:fe9d:f156
export const ip6Regex = /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/

// 日期正则，复杂判定 eg: 2017-02-11
export const dataRegex = /^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/

// QQ号正则，5至11位 eg: 243958407
export const qqPattern = /^[1-9][0-9]{4,10}$/

// 微信号正则，6至20位，以字母开头，字母，数字，减号，下划线 eg: RuilongMao
export const wxRegex = /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/

// 车牌号正则 eg: 京K39006
export const cPattern = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/

// 包含中文正则 eg: 42度
export const cnRegex = /[\u4E00-\u9FA5]/

/* eslint-enable */
