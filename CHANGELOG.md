Changelog
=========

0.0.2
-------------
### Features
* 
### Improvements
* database change.
alter table Products ADD type varchar(255) NOT NULL DEFAULT '';
alter table Orders ADD type varchar(255) NOT NULL DEFAULT '';
alter table Orders ADD reserved1 int(11) NOT NULL DEFAULT '0';
alter table Products ADD reserved1 int(11) NOT NULL DEFAULT '0';
alter table Products ADD reserved2 int(11) NOT NULL DEFAULT '0';
update Settings set `desc`='[\"课程\",\"试听课\",\"活动\",\"比赛\",\"考级\",\"投票\"]' where name='producttype';

0.0.1
-------------
### Features
* 
### Improvements
* database change.
alter table Products ADD type text NOT NULL DEFAULT '';

