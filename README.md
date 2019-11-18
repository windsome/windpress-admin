## project info
This is YSJ frontend project. This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## backend interfaces.
1. wechat login.
2. wepay.

## backend database.
[数据库设计](./server/README.md)

## 开发步骤
1. ✔基础前端框架搭建
2. ✔基础后端/数据库框架搭建
3. ✔用户微信Oauth2登录机制开发
4. 前端APP部分静态页面开发
  + ✔首页
  + ✔机构列表
  + 机构详情
5. 前端个人中心静态页面开发
  + ✔个人中心主页
  + ✔编辑个人信息静态页面
  + 商户管理页面
    - ✔商户申请页面
    - ✔商户编辑信息系列页面
    - ✔商户列表管理页面
    - 教师（管理员）管理页面，包含关联教师/管理员，
    - 课程上传页面
    - 课程编辑页面
    - 课程管理页面
    - 比赛上传页面
    - 比赛编辑页面
    - 比赛管理页面
    - 活动上传页面
    - 活动编辑页面
    - 活动管理页面
  + 订单管理页面
    - 订单查看
    - 订单支付
    - 订单管理
6. 超级管理员管理静态页面
  + 会员分类管理
  + 商户分类管理页面
  + 商户类别管理
  + 标签管理
  + 首页显示内容管理
  + 广告管理
7. 所有静态页面对应的服务器端开发
  + 商户管理后台接口
  + 个人信息后台接口
  + 课程后台接口
  + 订单后台接口
  + 等等...
8. 前后台对接的各种整合
  + 商户前后台整合
  + 个人信息
  + 等等...
9. 扩展功能及其他关联系统
  + 比赛/考级系统
    - 成绩录入/excel导入
    - 成绩查询
    - 结果推送及与订单关联
  + 销课系统
    - 学生签到
    - 教师销课
    - 费用计算系统
  + 广告信息推送
  + 支付信息推送
  + 等等...
  

## 微信排队系统想法
吃饭时不用排几个小时队，不怕捡起过期的号码，不怕之前用过的号码重复用，提醒用户有排队消息。

## how to use async redux at frontend?
1. `redux-saga` use generator function, I don't like it.
2. Promise, I like it, but it is difficult.
3. use `async/await`, I like it.
    we can write some tool functions, like upload file, you can set action functions as parameters. we report progress from these action. I test it using `Promise _sleep()`. async/await will transfer to Promise. see at `containers/App/index.js`,compare `asyncIncrement` with `decrement`, you can press increment and decrement quickly, and wait for a while to watch what happend next.  
    see also [using async/await in react](https://medium.com/@kkomaz/react-to-async-await-553c43f243e2)

## 打包發布流程
1. 編譯
```
npm install
npm run build-css
npm run build
```
2. 打包
```
tar -cjvf ysj.tar.bz2 ysj-client --exclude=ysj-client/node_modules --exclude=ysj-client/.git --exclude=ysj-client/src  --exclude=ysj-client/public --exclude=ysj-client/uploads/* --exclude=ysj-client/build/*.map --exclude=ysj-client/package-lock.json

tar -cjvf ysj-client.tar.bz2 .babelrc package.json build  --exclude=build/*.map 

```

## issues
1. sass文件如何加入到项目中？[how-to-use-sass](https://medium.com/@dan_abramov/well-to-be-perfectly-clear-you-can-just-outside-of-create-react-app-setup-6e44f91cc086)
Well, to be perfectly clear, you can, just outside of Create React App setup: 
`node-sass ./src/app.scss -w -o ./src/css`
And import the resulting CSS.

2. npm install 很慢，经常不成功
需要改变npm registry，命令： `npm config set registry https://registry.npm.taobao.org`

3. 微信昵称等经常含有表情字符，mysql用utf8字符集会导致程序挂掉。
```
原有数据库如何转移字符集：
CREATE DATABASE `ysj` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER DATABASE `ysj` CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

新建一个支持表情字符集的数据库：
CREATE DATABASE `ysj` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

4. mysql中查询某个JSON数组字段中是否包含某一项。
```
Question:
SELECT id FROM table_name WHERE myfield = '5' -> this return can not echo id because ["2","4","1","6"]

Answer:
SELECT * FROM `tbl_tasks_weekly` WHERE FIND_IN_SET('1', REPLACE( REPLACE( REPLACE(`myfield`,']','') ,  '[',''),'\"','')) 
```

5. 简写的restful查询字符串的解析方案qs库：[qs解析](https://github.com/ljharb/qs)

6. 对`span,p,a,i,`等行内元素强制换行有时失效？
  行内元素的`display`属性默认为`inline`，inline是会随着内容而增长的，就算你在此元素上设置换行也无效果。
```
  .text-oneline {
  white-space: nowrap;
  word-wrap: normal;
  text-overflow: ellipsis;
  overflow: hidden;
}
```
解决方法有两个：  
+ 将本行内元素的`display`属性设置为`block`
+ 将换行的css增加到父节点为block的元素上

7. 使用pm2时，server端代码中包含import的不能被识别`SyntaxError: Unexpected token import`，需要做处理，见[babel-node替代运行node](http://pm2.keymetrics.io/docs/tutorials/using-transpilers-with-pm2#require-hook)
```
#- npm install -g babel-cli
#- pm2 start --interpreter babel-node index.es6
```

8. node-sass有时安装不上
```
npm install node-sass-chokidar --save-dev
```

9. `git commit`时报如下错误，找不到各种包，如`exit-hook`，`strip-eof`。此时，需要重新安装`lint-staged`，运行`npm install lint-staged`。
```
windsome@windsome-ThinkPad-T400:/home/dev/frontend/ysj-client/src$ git commit 
husky > npm run -s precommit (node v8.7.0)

module.js:529
    throw err;
    ^

Error: Cannot find module 'exit-hook'
    at Function.Module._resolveFilename (module.js:527:15)
    at Function.Module._load (module.js:476:23)
    at Module.require (module.js:568:17)
    at require (internal/module.js:11:18)
    at Object.<anonymous> (/home/dev/frontend/ysj-client/node_modules/listr-verbose-renderer/node_modules/restore-cursor/index.js:3:16)
    at Module._compile (module.js:624:30)
    at Object.Module._extensions..js (module.js:635:10)
    at Module.load (module.js:545:32)
    at tryModuleLoad (module.js:508:12)
    at Function.Module._load (module.js:500:3)

husky > pre-commit hook failed (add --no-verify to bypass)
```

10. `npm run build`时报错，重新安装`npm install react-scripts`。
```
windsome@windsome-ThinkPad-T400:/home/dev/frontend/ysj-client$ npm run build

> ysj@0.1.0 build /home/dev/frontend/ysj-client
> ln -sf .env.production.local .env && NODE_PATH=src react-scripts build

module.js:529
    throw err;
    ^

Error: Cannot find module 'universalify'
    at Function.Module._resolveFilename (module.js:527:15)
    at Function.Module._load (module.js:476:23)
    at Module.require (module.js:568:17)
    at require (internal/module.js:11:18)
    at Object.<anonymous> (/home/dev/frontend/ysj-client/node_modules/fs-extra/lib/fs/index.js:3:11)
    at Module._compile (module.js:624:30)
    at Object.Module._extensions..js (module.js:635:10)
    at Module.load (module.js:545:32)
    at tryModuleLoad (module.js:508:12)
    at Function.Module._load (module.js:500:3)
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! ysj@0.1.0 build: `ln -sf .env.production.local .env && NODE_PATH=src react-scripts build`
npm ERR! Exit status 1
npm ERR! 
npm ERR! Failed at the ysj@0.1.0 build script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.

npm ERR! A complete log of this run can be found in:
npm ERR!     /home/windsome/.npm/_logs/2017-10-22T14_10_29_628Z-debug.log
```

11. js函数的默认值
参考[javascript: Default parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters)
```
function multiply(a, b = 1) {
  return a * b;
}
function append(value, array = []) {
  array.push(value);
  return array;
}
function callSomething(thing = something()) {
 return thing;
}
function singularAutoPlural(singular, plural = singular + 's', 
                            rallyingCry = plural + ' ATTACK!!!') {
  return [singular, plural, rallyingCry]; 
}
function withDefaults(a, b = 5, c = b, d = go(), e = this, 
                      f = arguments, g = this.value) {
  return [a, b, c, d, e, f, g];
}
function f(x = 1, y) { 
  return [x, y]; 
}
function f([x, y] = [1, 2], {z: z} = {z: 3}) { 
  return x + y + z; 
}
const uploadFile = (
  {file=null, chunkSize=1 * 1024 * 1024, filename=null, onprogress=null, calcHash=true }
) => {
    console.log ("args:", file, chunkSize, filename, onprogress, calcHash);
}
const uploadFileList = (
  filelist,
  {
    chunkSize = 1 * 1024 * 1024, // optional
    onprogress = null, // optional
    calcHash = true // optional
  } = {} // 当参数可能没有时，需要设置个{}
) => {
  console.log ("uploadFileList:", chunkSize, onprogress, calcHash);
}
```

12. `react-router` v4的用户登录认证例程
[React Router v4: The Complete Guide](https://www.sitepoint.com/react-router-v4-complete-guide/)  
[All About React Router 4](https://css-tricks.com/react-router-4/)  

13. `redux-form` 需注意reducer要加入进去。不然输入框将无法输入内容

14. 整合到ysj-server部署可能遇到的问题。
+ `.env.prodapp.local`中的`PUBLIC_URL`的解释
  `PUBLIC_URL`这个变量代表了js存放的cdn目录（或者服务器端路径）前缀，即所有生成的js文件部署到服务器上后，都需加这个前缀才能被前端访问到。我这里设置成了`/res`，而我们编译出来的js文件存放在`/build`目录。部署时，我们需要将这两个目录做个映射。如编译出来了文件`/build/static/js/main.f9ae3c46.js`， 访问路径则是`%PUBLIC_URL%/static/js/main.f9ae3c46.js`
+ 为方便`nginx`和`nodejs`共同访问资源，任何一个服务器均能单独提供静态资源，我们建立一个`deployres`目录于`nodejs ysj-server服务器根目录`，在其中放置所有静态资源。
``` 
windsome@windsome:/home/dev/dl/ysj-server$ ll deployres/
总用量 8
drwxrwxr-x  2 windsome windsome 4096 4月  28 15:56 ./
drwxrwxr-x 12 windsome windsome 4096 4月  28 15:53 ../
lrwxrwxrwx  1 windsome windsome    8 2月   5 22:53 res -> ../build/
lrwxrwxrwx  1 windsome windsome   11 2月   3 18:31 uploads -> ../uploads//
lrwxrwxrwx  1 windsome windsome   13 4月  28 15:56 ysj -> ../build/ysj//

windsome@windsome:/home/dev/dl/ysj-server$ ll build/
总用量 84
drwxrwxr-x  4 windsome windsome  4096 4月  28 15:52 ./
drwxrwxr-x 12 windsome windsome  4096 4月  28 15:47 ../
-rw-rw-r--  1 windsome windsome  9781 4月  28 15:52 asset-manifest.json
-rw-rw-r--  1 windsome windsome 24838 4月  28 15:47 favicon.ico
-rw-rw-r--  1 windsome windsome   540 4月  28 15:52 index.html
-rw-rw-r--  1 windsome windsome 11590 4月  28 15:47 jweixin-1.2.0.js
-rw-rw-r--  1 windsome windsome  8415 4月  28 15:52 service-worker.js
drwxrwxr-x  5 windsome windsome  4096 4月  28 15:52 static/
drwxrwxr-x  6 windsome windsome  4096 4月  28 15:47 ysj/
```
+ 部署生成的js文件
  如果部署到nginx服务器，则需要在`server`节中将`/res`开头请求导向`deployres`目录，nginx启用gzip如下  
  ```
  server {
    ...
    location ~* ^/(res|ysj)/ {
      gzip on;
      gzip_min_length 1000;
      root /data/nodejs/ysj-server/deployres;
    }
  }
  ```
  如果部署到nodejs，则`ysj-server/mainserver.js`中添加如下语句。因为`deployres`中包含了`res`,`uploads`, `yjs`，这些都能被访问
  ```
  app.use(serve(path.resolve(process.cwd(), 'deployres')));
  ```
+ 部署`public`目录下静态资源，同上
+ 部署需要动态加载的js资源，如淘宝的客户端视频上传js，待加
