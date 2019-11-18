### 用crontab生成定时任务，比如数据库备份
1. 安装以来包 `apt install cron`

2. 创建一个可执行脚本`/root/database/sqlbackup.sh`
```
/usr/bin/mysqldump -u USERNAME -pPASSWORD -h HOST -P PORT DATABASE > /root/database/DATABASE_`/bin/date +%F_%T`.sql
#注意替换其中大写字母代替的实际值
```
注意运行 `chmod +x sqlbackup.sh`

3. 编写脚本 `vi /root/database/cron.conf`
```
11 1 * * * /root/database/sqlbackup.sh
```
上述意思为每天1点11分操作一次  
参考[crontab定时任务写法](http://www.cnblogs.com/intval/p/5763929.html)  

4. 启动任务 `crontab /root/database/cron.conf`

5. 查看已启动的任务 `crontab -l`

6. 删除所有cron任务 `crontab -r`

