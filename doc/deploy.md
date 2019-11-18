### 服務器部署相關
1. 在開發機上編譯`npm run build`生成前端編譯後代碼在build目錄下，打包時可以將前端src代碼去掉。
2. 將去掉src，並且包含build的代碼打包發送到服務器
3. 配置nginx，支持目錄轉發，主要是`/nodeapp`，`apis`,`wcapis`三個目錄
4. 配置nginx中靜態目錄`res`,`uploads`
```
sudo ln -s /home/dev/dl/ysj-client/uploads/ .
sudo ln -s /home/dev/dl/ysj-client/build/ res
```
5. 重啓nginx

### 配置實例
```
upstream nodejs__upstream__nb {
    server 127.0.0.1:3010;
    keepalive 64;
}

server {
	listen 80 default_server;
	listen [::]:80 default_server;

	root /var/www/html;

	index index.html index.htm index.nginx-debian.html;

	server_name _;

	location / {
		try_files $uri $uri/ =404;
	}

    location /nodeapp/ {
        proxy_set_header   X-Real-IP        $remote_addr;
        proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
        proxy_set_header   Host             $http_host;
        proxy_set_header   X-NginX-Proxy    true;
        proxy_set_header   Connection       "";
        proxy_http_version 1.1;
        proxy_pass         http://nodejs__upstream__nb;
    }
    location /apis/ {
        proxy_set_header   X-Real-IP        $remote_addr;
        proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
        proxy_set_header   Host             $http_host;
        proxy_set_header   X-NginX-Proxy    true;
        proxy_set_header   Connection       "";
        proxy_http_version 1.1;
        proxy_pass         http://nodejs__upstream__nb;
    }
    location /wcapis/ {
        proxy_set_header   X-Real-IP        $remote_addr;
        proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
        proxy_set_header   Host             $http_host;
        proxy_set_header   X-NginX-Proxy    true;
        proxy_set_header   Connection       "";
        proxy_http_version 1.1;
        proxy_pass         http://nodejs__upstream__nb;
    }

}
```
### 代碼中相關的改變
1. `src/store.js`中的改變，用於在react-router路徑前加前綴
```
- export const history = createHistory();
+ export const history = createHistory({ basename: '/nodeapp' });
```
2. `.env.production.local`中的改變，編譯後文件帶前綴
編譯出的資源文件（index.html, js, fonts, css, images）帶有前綴`/res`
```
+ PUBLIC_URL=/res
+ #PUBLIC_URL=http://cdn.aliyun.com/res
```
產生的結果：
```
["/res/index.html","73252a6292d41956607bbcf9c523aedd"],
["/res/static/css/main.d899f183.css","31036b53f394f81b44ddb7c462c4eb87"],
["/res/static/js/0.b3689a4f.chunk.js","60d1aaf9a3e7e905034066f14ebb9123"],
["/res/static/js/1.9bd06c68.chunk.js","b6660674b9138f9ef7e0d2a953b0aa85"],
["/res/static/js/10.705b292b.chunk.js","3721acc8d2859edd7d43b4b2758db59f"],
["/res/static/js/11.3bc0913e.chunk.js","f0c0038e81eaa573debb42bee89a6f43"],
......
```
3. `server/mainserver.js`中的改變，用於服務地址的改變
```
app.use(
  convert(
    historyApiFallback({
+      index:'/res/index.html',
      verbose: true
    })
  )
);

- app.use(app.coin.indexHtmlProcessor());
+ app.use(app.coin.indexHtmlProcessor({index:'/res/index.html'}));

- app.use(serve(path_client_dist));
+ app.use(mount('/res', serve(path_client_dist)));
```
4. 前端文件中引用`/ysj/*`改爲`/res/ysj/*`
```
./components/ListReactVirtualized.js
./components/slicks.js
./components/widgets/index.js
./components/widgets/FileInput.js
./components/dianping/ShopListItem.js
./containers/Admin/Hoe.js
./containers/App/dp.shop.js
./containers/App/Vote/List.js
./containers/App/Vote/List.scss
./containers/App/dp.order.js
./containers/App/bak.dp.index.js
./containers/Mine/Products/list.js
./containers/Mine/Main.js
./containers/Mine/Orders/list.js
./containers/Mine/Users/list.js
```

### 在centos上部署
1. 安裝必要軟件
```
yum install git
yum install redis
```

### 与tomcat7,nginx在ubuntu上共存
1. 安装tomcat7, `sudo apt-get install tomcat7`
安装后的相关目录主要有:  
+ /etc/tomcat7 为配置目录
+ /var/lib/tomcat7 为安装目录，其中的conf为/etc/tomcat的链接
+ /usr/share/tomcat7 为程序目录
+ /usr/share/tomcat7-root 为主应用目录
+ /usr/share/tomcat7-examples 为安装的例子目录

2. 配置tomcat7, 
```
cd /etc/tomcat7/Catalina/localhost
vi ROOT.xml
内容（注意，可以在这里修改docBase为自己的目录）：
<Context path="/" 
    docBase="/usr/share/tomcat7-root/default_root" allowLinking="true"/>
```
3. 如果有错误，可以到`/var/log/tomcat7`查看

4. 安装nodejs相关
+ nvm安装配置，见tip_aliyun_server.md
+ nodejs代码准备，见readme
+ 修改server/cfg/cfg.*.js

5. 安装配置nginx
+ 在 `/etc/nginx/sites-available`添加一个新的配置文件，并且在`sites-enabled`下做好链接。
+ 配置内容，见上面
+ 注意在nginx的根目录链接`res`到静态文件存放的目录`/data/nodejs/deploy/ysj-client/build`
+ 注意在nginx的根目录链接`uploads`到上传文件的目录`/data/nodejs/ysj-client/uploads`，（可能与上面的不一样）

6. mysql 导入数据库
```
#导出mysql
mysqldump -u USERNAME -pPASSWORD -h HOST -P PORT DBNAME > DBNAME.sql

#导入mysql
mysql -u yishunodejs -p -h rm-uf66gdy8l2z513gpv.mysql.rds.aliyuncs.com ysjclassnode < databack.sql
```
