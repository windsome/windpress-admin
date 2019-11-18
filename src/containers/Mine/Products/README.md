## 商品类型
1. 正式课程
2. 试听课
3. 比赛
4. 考级

## 通用属性
{
  id
- status（0：草案，1：已上架，2：已卖完，3：已下架）
+ name
- shopId（商户id）
- owner (创建者)
- desc (json商品通用的描述{name, content, mainImage, imageList, videoList})
- total (商品总量，-1表示不限量)
- paid (已支付订单数量)
- category (内容所属分类)
- priceList ( jsonArray [{name,price, originPrice, info}, {name, price, originPrice, info}])
- type (商品类型：正式课、试听课、活动)
- extend(json商品扩展信息，
    课程/活动：{term学期, schedule课程表, teacherList教师列表}，
    比赛/考级：{managerList比赛管理员列表, timePreview开始公示时间, timeMatch比赛开始时间, timeResult比赛结果公布时间}
  )
}

## 商品：正式课程extend
{
  //基础信息
  originPrice
  price
  soldoutTotal

  //基本信息1
  suitCrowds:"全年龄段"
  suitBase:"不限"
  classNum: "1对1"

  //课程亮点
  classHighlights:["一对一 上课 灵活约课","快速掌握弹唱","老师全程督促练习 "]

  //班级信息
  productItemInfoBeans:[
    {
      classContentList: [ {
        originPrice:4500
        times:"12"
        title:"一对一 "
      }]
      classLaw:"根据学员时间灵活预约"
      classStartTime:"随到随学"
      classTotalHours:"12 节 "
      discountDetailInfo:null
      discountInfo:null
      itemName:"零基础"
      originPrice:4500
      price:2000
      reducePrice:null
      reduceTag:null
    }
  ]

  // 课程详情-适用对象
  suitTargets:["零基础 想吉他弹唱的学员","想培养兴趣 学会一项乐器的学员"]
  // 课程详情-学习目标
  learningObjective:"短期内学会吉他弹唱的学员   想长期学习吉他演奏的学员"
  // 课程详情-授课老师
  teachers:[...]
  // 课程详情-课程特色
  classFeatures:[ 
    {
      text:"一对一 老师全程私教指导课"
      type:1
    }, {
      text:"//p1.meituan.net/education/d83fe1d959b5fe37760704a261c1dda4202135.jpg%401024w_1024h_0e_1l%7Cwatermark%3D0"
      type:2
    }
  ]

  // 购买说明
  buyDescriptionBean:{
    bookingInfo:"需提前1天预约"
    cannotRefund:false
    classChangeExplain:"全程随时调课 "
    otherInfo:null
    periodOfvalidity:"2017.04.12至2018.07.31"
    refundExplain:"验卷前可随时退款"
  }

  // 网友点评
  reviewList:[{
    dateStr:"11月02日"
    goodReviewCount:54
    nickName:"Elaine（R）"
    pic:"https://p1.meituan.net/relationwxpic/69bc15b25f7ba88868fc4986668ad70c4520.jpg%40120w_120h_1e_1c_1l%7Cwatermark%3D0"
    reviewAllLink:"//m.dianping.com/shop/66324359/review_all"
    reviewDetailLink:"//m.dianping.com/shop/66324359/review_all"
    reviewText:"跟着孙老师学的课程！大神级的人物！教的超级好！赞赞赞"
    star:50
  },{
    dateStr:"10月17日"
    goodReviewCount:54
    nickName:"dpuser_49396783245"
    pic:"https://p0.meituan.net/userheadpic/peach.png%40120w_120h_1e_1c_1l%7Cwatermark%3D0"
    reviewAllLink:"//m.dianping.com/shop/66324359/review_all"
    reviewDetailLink:"//m.dianping.com/shop/66324359/review_all"
    reviewText:"试听了好几个地方，来这边是孙晴老师的体验课，她一开口我就被她声音迷到了，教的特专业，果断报了课，现在上了一节正式课，特别棒，希望我以后在孙老师这可以学得特牛逼😂😂"
    star:50
  }
  ]
}

## 点评中商品的描述（钢琴课）
https://h5.dianping.com/app/app-education-sku-all/skudetail.html?productId=296129&shopId=66324359
```
detailData:{
  buyDescriptionBean:{
    bookingInfo:"需提前1天预约"
    cannotRefund:false
    classChangeExplain:"全程随时调课 "
    otherInfo:null
    periodOfvalidity:"2017.04.12至2018.07.31"
    refundExplain:"验卷前可随时退款"
  }
  courseDetailInfoBean:{
    classFeatures:[ 
      {
        text:"一对一 老师全程私教指导课"
        type:1
      }, {
        text:"//p1.meituan.net/education/d83fe1d959b5fe37760704a261c1dda4202135.jpg%401024w_1024h_0e_1l%7Cwatermark%3D0"
        type:2
      }
    ]
    learningObjective:"短期内学会吉他弹唱的学员   想长期学习吉他演奏的学员"
    suitTargets:["零基础 想吉他弹唱的学员","想培养兴趣 学会一项乐器的学员"]
    teachers:[
      {
        extraCharacter:"流行演唱"
        headPic:"//p0.meituan.net/education/7fbca3cad3a51ef0474f08428a40357f187889.jpg%40100w_100h_1e_1c_1l%7Cwatermark%3D0"
        likes:0
        name:"声乐老师袁老师"
        qualifications:" 星海音乐音乐学院音乐表演   硕士"
        subject:"声乐"
        teacherDetailURL:"https://g.dianping.com/app/app-edu-teacher-m/teacherdetail.html?personId=1296806"
        teacherId:1296806
        videoCoverPic:null
        videoDuration:null
        videoUrl:null
        workYears:"5年教龄"
      },{
        extraCharacter:"民谣古典吉他"
        headPic:"//p0.meituan.net/education/23dea0c073ebc1edf2cb392c76c20f21166829.jpg%40100w_100h_1e_1c_1l%7Cwatermark%3D0"
        likes:1
        name:"吉他老师小伍老师"
        qualifications:"西安音乐学院弦乐本科"
        subject:"吉他"
        teacherDetailURL:"https://g.dianping.com/app/app-edu-teacher-m/teacherdetail.html?personId=1258458"
        teacherId:1258458
        videoCoverPic:null
        videoDuration:null
        videoUrl:null
        workYears:"4年教龄"
      },{
        extraCharacter:""
        headPic:"//p0.meituan.net/wedding/18a8a77900d15b0bbc79afda512b7cf689685.jpg%40100w_100h_1e_1c_1l%7Cwatermark%3D0"
        likes:2
        name:"器乐导师冯老师"
        qualifications:"河南大学音乐学院吉他 弦乐本科"
        subject:"吉他 "
        teacherDetailURL:"https://g.dianping.com/app/app-edu-teacher-m/teacherdetail.html?personId=407163"
        teacherId:407163
        videoCoverPic:null
        videoDuration:null
        videoUrl:null
        workYears:"7年教龄"
      },{
        extraCharacter:""
        headPic:"//p0.meituan.net/wedding/4a40e0cebdae8c4b74ccc4a523eb0a8677500.jpg%40100w_100h_1e_1c_1l%7Cwatermark%3D0"
        likes:5
        name:"声乐导师瞿盼盼"
        qualifications:"四川音乐学院声乐本科"
        subject:"声乐"
        teacherDetailURL:"https://g.dianping.com/app/app-edu-teacher-m/teacherdetail.html?personId=407154"
        teacherId:407154
        videoCoverPic:null
        videoDuration:null
        videoUrl:null
        workYears:"5年教龄"
      }, {
        extraCharacter:""
        headPic:"//p0.meituan.net/education/72add9d55ede9215367f9f5299c93683371925.png%40100w_100h_1e_1c_1l%7Cwatermark%3D0"
        likes:0
        name:"Anne"
        qualifications:""
        subject:null
        teacherDetailURL:"https://g.dianping.com/app/app-edu-teacher-m/teacherdetail.html?personId=1258464"
        teacherId:1258464
        videoCoverPic:null
        videoDuration:null
        videoUrl:null
        workYears:"4年教龄"
      }
    ]
  }
  enrollLink:"https://h5.dianping.com/app/app-education-sku-all/skuorder.html?productId=296129&token=!&dpid=*"
  productDetailLink:"https://h5.dianping.com/edu/education-sku-detail/detail.html?productId=296129"
  productLink:"https://h5.dianping.com/app/app-education-sku-all/skudetail.html?productId=296129"
  relatedShopBean: {
    adaptLink:"https://h5.dianping.com/app/gfe-app-education-sku-shops-list/index.html?productId=296129"
    adaptNum:2
    address:"东方路1381号兰村大厦10楼10B"
    addressLink:"//m.dianping.com/shop/66324359/map"
    distance:">10km"
    link:"//m.dianping.com/shop/66324359"
    phone:"4001767061"
    shopName:"PADDY帕迪音乐工作室(八佰伴店)"
    shopPower:45
  }
  reviewList:[{
    dateStr:"11月02日"
    goodReviewCount:54
    nickName:"Elaine（R）"
    pic:"https://p1.meituan.net/relationwxpic/69bc15b25f7ba88868fc4986668ad70c4520.jpg%40120w_120h_1e_1c_1l%7Cwatermark%3D0"
    reviewAllLink:"//m.dianping.com/shop/66324359/review_all"
    reviewDetailLink:"//m.dianping.com/shop/66324359/review_all"
    reviewText:"跟着孙老师学的课程！大神级的人物！教的超级好！赞赞赞"
    star:50
  },{
    dateStr:"10月17日"
    goodReviewCount:54
    nickName:"dpuser_49396783245"
    pic:"https://p0.meituan.net/userheadpic/peach.png%40120w_120h_1e_1c_1l%7Cwatermark%3D0"
    reviewAllLink:"//m.dianping.com/shop/66324359/review_all"
    reviewDetailLink:"//m.dianping.com/shop/66324359/review_all"
    reviewText:"试听了好几个地方，来这边是孙晴老师的体验课，她一开口我就被她声音迷到了，教的特专业，果断报了课，现在上了一节正式课，特别棒，希望我以后在孙老师这可以学得特牛逼😂😂"
    star:50
  }
  ]
  shareBean:{
    content:"【课程】仅售2000元 | 零基础  学吉他 吉他弹唱   - PADDY帕迪音乐工作室(八佰伴店)"
    desc:"★★★★☆\n八佰伴 声乐\n一对一 上课 灵活约课,快速掌握弹唱,老师全程督促练习 "
    image:"https://p0.meituan.net/education/2be4a466cac838535271f47cd2ea34a52310234.png%40100w_100h_1e_1c_1l%7Cwatermark%3D0"
    title:"【课程】仅售2000元 | 零基础  学吉他 吉他弹唱   - PADDY帕迪音乐工作室(八佰伴店)"
    url:"https://h5.dianping.com/app/app-education-sku-all/skudetail.html?productId=296129"
  }
  skus:[]
  skusTypeName:"吉他"
}
```

```
rawData:
{
  appointUrl: "//h5.dianping.com/app/gfe-app-education-common-book/index.html?productId=296129&bookChannel=dp_product"
  basicInfoBean:{
    classCatergoryName:"吉他",
    classHighlights: ["一对一 上课 灵活约课","快速掌握弹唱","老师全程督促练习 "],
    classNum: "1对1",
    classStudyTime:null,
    endTime:"2018-07-31T23:59:59",
    haveIm:true
    headpics: [
      "//p0.meituan.net/education/2be4a466cac838535271f47cd2ea34a52310234.png%40640w_360h_1e_1c_1l%7Cwatermark%3D0",
      "//p1.meituan.net/education/de85de38e3c591b535c8174c06fb16e01264611.png%40640w_360h_1e_1c_1l%7Cwatermark%3D0",
      "//p1.meituan.net/education/d034729e560df6bde8b627f089bafa746496514.jpg%40640w_360h_1e_1c_1l%7Cwatermark%3D0",
      "//p1.meituan.net/education/7102fe2c821b03e89db251cf545dbffb7102092.jpg%40640w_360h_1e_1c_1l%7Cwatermark%3D0",
      "//p0.meituan.net/education/e171e2a8bc4191da0c7687c4ad9aa1b3125761.jpg%40640w_360h_1e_1c_1l%7Cwatermark%3D0"
    ]
    imUrl:"https://m.dianping.com/wedding/chat?d.user_type=user&d.destId=s66324359"
    maxCurrentPrice:2000
    minCurrentPrice:2000
    originPrice:4500
    productName:"零基础  学吉他 吉他弹唱  "
    soldoutTotal:1
    startTime:"2017-04-12T00:00:00"
    suitBase:"不限"
    suitCrowds:"全年龄段"
    teacherNationality:"中教"
    videoHeadpic:"//p1.meituan.net/education/8b4712353f9ed7862fc1ea87d9e2e25d36051.jpg%40640w_360h_1e_1c_1l%7Cwatermark%3D0"
    videoUrl:"//m.dianping.com/education/video/29371/4/296129"
  }
  bookingCount:7
  canBuy:true
  canRefund:true
  categoryId:2873
  categoryIds:[5],
  classDuration:"60分钟"
  enrollLink:"https://h5.dianping.com/app/app-education-sku-all/skuorder.html?productId=296129&token=!&dpid=*"
  hasCollect:false
  hasLogin:false
  haveAppoint:true
  phone:"4001767061"
  productDetailLink:"https://h5.dianping.com/edu/education-sku-detail/detail.html?productId=296129"
  productItemInfoBeans:[ {
    classContentList: [ {
      originPrice:4500
      times:"12"
      title:"一对一 "
    }]
    classLaw:"根据学员时间灵活预约"
    classStartTime:"随到随学"
    classTotalHours:"12 节 "
    discountDetailInfo:null
    discountInfo:null
    itemName:"零基础"
    originPrice:4500
    price:2000
    reducePrice:null
    reduceTag:null
  }]
  shareBean: {
    content:"【课程】仅售2000元 | 零基础  学吉他 吉他弹唱   - PADDY帕迪音乐工作室(八佰伴店)"
    desc:"★★★★☆\n八佰伴 声乐\n一对一 上课 灵活约课,快速掌握弹唱,老师全程督促练习 "
    image:"https://p0.meituan.net/education/2be4a466cac838535271f47cd2ea34a52310234.png%40100w_100h_1e_1c_1l%7Cwatermark%3D0"
    title:"【课程】仅售2000元 | 零基础  学吉他 吉他弹唱   - PADDY帕迪音乐工作室(八佰伴店)"
    url:"https://h5.dianping.com/app/app-education-sku-all/skudetail.html?productId=296129"
  }
  showTeacherNationality:false
}
```

## 试听课

