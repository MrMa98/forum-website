const errorData = [
  {
    code: 2024,
    message: 'toke失效或过期，请重新登陆',
    route: '/login',
  },
  {
    code: 2025,
    message: 'toke校验失败，请重新登陆',
    route: '/login',
  },
  {
    code: 2026,
    message: 'session失效或过期，请重新登陆',
    route: '/login',
  },
  {
    code: 2027,
    message: 'session校验失败，请重新登陆',
    route: '/login',
  },
  {
    code: 2028,
    message: '用户名或密码错误',
    route: '/login',
  },
  {
    code: 2029,
    message: '服务器异常注册失败',
    route: '/register',
  },
  {
    code: 2031,
    message: '请选择要删除的话题',
  },
  {
    code: 2032,
    message: '请填写要查询的关键字',
  },
  {
    code: 2033,
    message: '请填写要查询id',
  },
  {
    code: 2034,
    message: '请选择要修改的话题',
  },
];

export const errorMap = errorData.reduce((map, error) => {
  map.set(error.code, { message: error.message, route: error.route });
  return map;
}, new Map());

