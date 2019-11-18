import request from '../fetch';
import FormData from 'form-data';

// 分块上传

/**
 * 初始化分块上传
 * @param  {Object}  params                                     参数对象，必须
 *     @param  {String}  params.Bucket                          Bucket名称，必须
 *     @param  {String}  params.Region                          地域名称，必须
 *     @param  {String}  params.Key                             object名称，必须
 *     @param  {String}  params.UploadId                        object名称，必须
 *     @param  {String}  params.CacheControl                    RFC 2616 中定义的缓存策略，将作为 Object 元数据保存，非必须
 *     @param  {String}  params.ContentDisposition              RFC 2616 中定义的文件名称，将作为 Object 元数据保存    ，非必须
 *     @param  {String}  params.ContentEncoding                 RFC 2616 中定义的编码格式，将作为 Object 元数据保存，非必须
 *     @param  {String}  params.ContentType                     RFC 2616 中定义的内容类型（MIME），将作为 Object 元数据保存，非必须
 *     @param  {String}  params.Expires                         RFC 2616 中定义的过期时间，将作为 Object 元数据保存，非必须
 *     @param  {String}  params.ACL                             允许用户自定义文件权限，非必须
 *     @param  {String}  params.GrantRead                       赋予被授权者读的权限 ，非必须
 *     @param  {String}  params.GrantWrite                      赋予被授权者写的权限 ，非必须
 *     @param  {String}  params.GrantFullControl                赋予被授权者读写权限 ，非必须
 *     @param  {String}  params.StorageClass                    设置Object的存储级别，枚举值：Standard，Standard_IA，Nearline，非必须
 * @param  {Function}  callback                                 回调函数，必须
 * @return  {Object}  err                                       请求失败的错误，如果请求成功，则为空。
 * @return  {Object}  data                                      返回的数据
 */
function multipartInit(params, callback) {
  var headers = {};

  headers['Cache-Control'] = params['CacheControl'];
  headers['Content-Disposition'] = params['ContentDisposition'];
  headers['Content-Encoding'] = params['ContentEncoding'];
  headers['Content-Type'] = params['ContentType'];
  headers['Expires'] = params['Expires'];

  headers['x-cos-acl'] = params['ACL'];
  headers['x-cos-grant-read'] = params['GrantRead'];
  headers['x-cos-grant-write'] = params['GrantWrite'];
  headers['x-cos-grant-full-control'] = params['GrantFullControl'];
  headers['x-cos-storage-class'] = params['StorageClass'];

  for (var key in params) {
    if (key.indexOf('x-cos-meta-') > -1) {
      headers[key] = params[key];
    }
  }

  submitRequest.call(
    this,
    {
      method: 'POST',
      Bucket: params.Bucket,
      Region: params.Region,
      Key: params.Key,
      action: '?uploads',
      headers: headers
    },
    function(err, data) {
      if (err) {
        return callback(err);
      }
      data = util.clone(data || {});
      if (data && data.InitiateMultipartUploadResult) {
        return callback(
          null,
          util.extend(data.InitiateMultipartUploadResult, {
            statusCode: data.statusCode,
            headers: data.headers
          })
        );
      }
      callback(null, data);
    }
  );
}

/**
 * 分块上传
 * @param  {Object}  params                     参数对象，必须
 *     @param  {String}  params.Bucket          Bucket名称，必须
 *     @param  {String}  params.Region          地域名称，必须
 *     @param  {String}  params.Key             object名称，必须
 * @param  {String}      params.ContentLength   RFC 2616 中定义的 HTTP 请求内容长度（字节），非必须
 * @param  {String}      params.Expect          当使用 Expect: 100-continue 时，在收到服务端确认后，才会发送请求内容，非必须
 * @param  {String}      params.ContentSha1     RFC 3174 中定义的 160-bit 内容 SHA-1 算法校验值，非必须
 * @param  {Function}  callback                 回调函数，必须
 * @return  {Object}  err                       请求失败的错误，如果请求成功，则为空。
 * @return  {Object}  data                      返回的数据
 *     @return  {Object}  data.ETag             返回的文件分块 sha1 值
 */
function multipartUpload(params, callback) {
  var headers = {};

  headers['Content-Length'] = params['ContentLength'];
  headers['Expect'] = params['Expect'];

  var PartNumber = params['PartNumber'];
  var UploadId = params['UploadId'];

  var action = '?partNumber=' + PartNumber + '&uploadId=' + UploadId;

  submitRequest.call(
    this,
    {
      TaskId: params.TaskId,
      method: 'PUT',
      Bucket: params.Bucket,
      Region: params.Region,
      Key: params.Key,
      action: action,
      headers: headers,
      onProgress: params.onProgress,
      body: params.Body || null
    },
    function(err, data) {
      if (err) {
        return callback(err);
      }
      data['headers'] = data['headers'] || {};
      callback(null, {
        ETag: data['headers']['etag'] || '',
        statusCode: data.statusCode,
        headers: data.headers
      });
    }
  );
}

/**
 * 完成分块上传
 * @param  {Object}  params                             参数对象，必须
 *     @param  {String}  params.Bucket                  Bucket名称，必须
 *     @param  {String}  params.Region                  地域名称，必须
 *     @param  {String}  params.Key                     object名称，必须
 *     @param  {Array}   params.Parts                   分块信息列表，必须
 *     @param  {String}  params.Parts[i].PartNumber     块编号，必须
 *     @param  {String}  params.Parts[i].ETag           分块的 sha1 校验值
 * @param  {Function}  callback                         回调函数，必须
 * @return  {Object}  err                               请求失败的错误，如果请求成功，则为空。
 * @return  {Object}  data                              返回的数据
 *     @return  {Object}  data.CompleteMultipartUpload  完成分块上传后的文件信息，包括Location, Bucket, Key 和 ETag
 */
function multipartComplete(params, callback) {
  var self = this;
  var headers = {};

  headers['Content-Type'] = 'application/xml';

  var UploadId = params.UploadId;

  var action = '?uploadId=' + UploadId;

  var Parts = params['Parts'];

  for (var i = 0, len = Parts.length; i < len; i++) {
    if (Parts[i]['ETag'].indexOf('"') == 0) {
      continue;
    }
    Parts[i]['ETag'] = '"' + Parts[i]['ETag'] + '"';
  }

  var PartData = {
    CompleteMultipartUpload: {
      Part: Parts
    }
  };

  var xml = util.json2xml(PartData);

  headers['Content-length'] = Buffer.byteLength(xml, 'utf8');
  headers['Content-MD5'] = util.binaryBase64(util.md5(xml));

  submitRequest.call(
    this,
    {
      method: 'POST',
      Bucket: params.Bucket,
      Region: params.Region,
      Key: params.Key,
      action: action,
      body: xml,
      headers: headers
    },
    function(err, data) {
      if (err) {
        return callback(err);
      }
      var url = getUrl({
        domain: self.options.Domain,
        bucket: params.Bucket,
        region: params.Region,
        object: params.Key,
        isLocation: true
      });
      var result = util.extend(data.CompleteMultipartUploadResult, {
        Location: url,
        statusCode: data.statusCode,
        headers: data.headers
      });
      callback(null, result);
    }
  );
}

/**
 * 分块上传任务列表查询
 * @param  {Object}  params                                 参数对象，必须
 *     @param  {String}  params.Bucket                      Bucket名称，必须
 *     @param  {String}  params.Region                      地域名称，必须
 *     @param  {String}  params.Delimiter                   定界符为一个符号，如果有Prefix，则将Prefix到delimiter之间的相同路径归为一类，定义为Common Prefix，然后列出所有Common Prefix。如果没有Prefix，则从路径起点开始，非必须
 *     @param  {String}  params.EncodingType                规定返回值的编码方式，非必须
 *     @param  {String}  params.Prefix                      前缀匹配，用来规定返回的文件前缀地址，非必须
 *     @param  {String}  params.MaxUploads                  单次返回最大的条目数量，默认1000，非必须
 *     @param  {String}  params.KeyMarker                   与upload-id-marker一起使用 </Br>当upload-id-marker未被指定时，ObjectName字母顺序大于key-marker的条目将被列出 </Br>当upload-id-marker被指定时，ObjectName字母顺序大于key-marker的条目被列出，ObjectName字母顺序等于key-marker同时UploadId大于upload-id-marker的条目将被列出，非必须
 *     @param  {String}  params.UploadIdMarker              与key-marker一起使用 </Br>当key-marker未被指定时，upload-id-marker将被忽略 </Br>当key-marker被指定时，ObjectName字母顺序大于key-marker的条目被列出，ObjectName字母顺序等于key-marker同时UploadId大于upload-id-marker的条目将被列出，非必须
 * @param  {Function}  callback                             回调函数，必须
 * @return  {Object}  err                                   请求失败的错误，如果请求成功，则为空。
 * @return  {Object}  data                                  返回的数据
 *     @return  {Object}  data.ListMultipartUploadsResult   分块上传任务信息
 */
function multipartList(params, callback) {
  var reqParams = {};

  reqParams['delimiter'] = params['Delimiter'];
  reqParams['encoding-type'] = params['EncodingType'];
  reqParams['prefix'] = params['Prefix'];

  reqParams['max-uploads'] = params['MaxUploads'];

  reqParams['key-marker'] = params['KeyMarker'];
  reqParams['upload-id-marker'] = params['UploadIdMarker'];

  reqParams = util.clearKey(reqParams);

  submitRequest.call(
    this,
    {
      method: 'GET',
      Bucket: params.Bucket,
      Region: params.Region,
      action: '/?uploads&' + queryString.stringify(reqParams)
    },
    function(err, data) {
      if (err) {
        return callback(err);
      }

      if (data && data.ListMultipartUploadsResult) {
        var Upload = data.ListMultipartUploadsResult.Upload || [];

        var CommonPrefixes =
          data.ListMultipartUploadsResult.CommonPrefixes || [];

        CommonPrefixes = util.isArray(CommonPrefixes)
          ? CommonPrefixes
          : [CommonPrefixes];
        Upload = util.isArray(Upload) ? Upload : [Upload];

        data.ListMultipartUploadsResult.Upload = Upload;
        data.ListMultipartUploadsResult.CommonPrefixes = CommonPrefixes;
      }
      var result = util.clone(data.ListMultipartUploadsResult);
      util.extend(result, {
        statusCode: data.statusCode,
        headers: data.headers
      });
      callback(null, result);
    }
  );
}

/**
 * 上传的分块列表查询
 * @param  {Object}  params                                 参数对象，必须
 *     @param  {String}  params.Bucket                      Bucket名称，必须
 *     @param  {String}  params.Region                      地域名称，必须
 *     @param  {String}  params.Key                         object名称，必须
 *     @param  {String}  params.UploadId                    标示本次分块上传的ID，必须
 *     @param  {String}  params.EncodingType                规定返回值的编码方式，非必须
 *     @param  {String}  params.MaxParts                    单次返回最大的条目数量，默认1000，非必须
 *     @param  {String}  params.PartNumberMarker            默认以UTF-8二进制顺序列出条目，所有列出条目从marker开始，非必须
 * @param  {Function}  callback                             回调函数，必须
 * @return  {Object}  err                                   请求失败的错误，如果请求成功，则为空。
 * @return  {Object}  data                                  返回的数据
 *     @return  {Object}  data.ListMultipartUploadsResult   分块信息
 */
function multipartListPart(params, callback) {
  var reqParams = {};

  reqParams['uploadId'] = params['UploadId'];
  reqParams['encoding-type'] = params['EncodingType'];
  reqParams['max-parts'] = params['MaxParts'];
  reqParams['part-number-marker'] = params['PartNumberMarker'];

  submitRequest.call(
    this,
    {
      method: 'GET',
      Bucket: params.Bucket,
      Region: params.Region,
      Key: params.Key,
      qs: reqParams
    },
    function(err, data) {
      if (err) {
        return callback(err);
      }
      var Part = data.ListPartsResult.Part || [];
      Part = util.isArray(Part) ? Part : [Part];

      data.ListPartsResult.Part = Part;
      var result = util.clone(data.ListPartsResult);
      util.extend(result, {
        statusCode: data.statusCode,
        headers: data.headers
      });
      callback(null, result);
    }
  );
}

/**
 * 抛弃分块上传
 * @param  {Object}  params                 参数对象，必须
 *     @param  {String}  params.Bucket      Bucket名称，必须
 *     @param  {String}  params.Region      地域名称，必须
 *     @param  {String}  params.Key         object名称，必须
 *     @param  {String}  params.UploadId    标示本次分块上传的ID，必须
 * @param  {Function}  callback             回调函数，必须
 *     @return  {Object}    err             请求失败的错误，如果请求成功，则为空。
 *     @return  {Object}    data            返回的数据
 */
function multipartAbort(params, callback) {
  var reqParams = {};

  reqParams['uploadId'] = params['UploadId'];
  submitRequest.call(
    this,
    {
      method: 'DELETE',
      Bucket: params.Bucket,
      Region: params.Region,
      Key: params.Key,
      qs: reqParams
    },
    function(err, data) {
      if (err) {
        return callback(err);
      }
      callback(null, {
        statusCode: data.statusCode,
        headers: data.headers
      });
    }
  );
}
