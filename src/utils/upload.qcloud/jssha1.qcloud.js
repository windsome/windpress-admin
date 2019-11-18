/* eslint-disable */
const jsSHA = (function() {
  function r(r, i, f) {
    var s,
      l,
      E,
      b,
      v,
      g,
      A,
      d,
      F,
      w = 0,
      R = [],
      B = 0,
      U = !1,
      y = [],
      H = [],
      T = !1;
    if (
      ((f = f || {}),
      (s = f.encoding || 'UTF8'),
      (F = f.numRounds || 1) !== parseInt(F, 10) || 1 > F)
    )
      throw Error('numRounds must a integer >= 1');
    if ('SHA-1' !== r) throw Error('Chosen SHA variant is not supported');
    (v = 512),
      (g = h),
      (A = p),
      (b = 160),
      (d = function(r) {
        return r.slice();
      }),
      (E = u(i, s)),
      (l = c(r)),
      (this.setHMACKey = function(t, n, e) {
        var o;
        if (!0 === U) throw Error('HMAC key already set');
        if (!0 === T) throw Error('Cannot set HMAC key after calling update');
        if (
          ((s = (e || {}).encoding || 'UTF8'),
          (n = u(n, s)(t)),
          (t = n.binLen),
          (n = n.value),
          (o = v >>> 3),
          (e = o / 4 - 1),
          o < t / 8)
        ) {
          for (n = A(n, t, 0, c(r), b); n.length <= e; ) n.push(0);
          n[e] &= 4294967040;
        } else if (o > t / 8) {
          for (; n.length <= e; ) n.push(0);
          n[e] &= 4294967040;
        }
        for (t = 0; t <= e; t += 1)
          (y[t] = 909522486 ^ n[t]), (H[t] = 1549556828 ^ n[t]);
        (l = g(y, l)), (w = v), (U = !0);
      }),
      (this.update = function(r) {
        var t,
          n,
          e,
          o = 0,
          a = v >>> 5;
        for (
          t = E(r, R, B), r = t.binLen, n = t.value, t = r >>> 5, e = 0;
          e < t;
          e += a
        )
          o + v <= r && ((l = g(n.slice(e, e + a), l)), (o += v));
        (w += o), (R = n.slice(o >>> 5)), (B = r % v), (T = !0);
        return (function(r) {
          for (var t = '', n = 0; n < 5; n++)
            for (var e = 0; e < 4; e++) {
              var o = r[n] >>> (8 * e);
              o &= 255;
              var a = Number(o).toString(16);
              (a = a.length < 2 ? '0' + a : a), (t += a);
            }
          return t;
        })(l);
      }),
      (this.getHash = function(u, i) {
        var f, s, h, p;
        if (!0 === U) throw Error('Cannot call getHash after setting HMAC key');
        switch (((h = a(i)), u)) {
          case 'HEX':
            f = function(r) {
              return t(r, b, h);
            };
            break;
          case 'B64':
            f = function(r) {
              return n(r, b, h);
            };
            break;
          case 'BYTES':
            f = function(r) {
              return e(r, b);
            };
            break;
          case 'ARRAYBUFFER':
            try {
              s = new ArrayBuffer(0);
            } catch (E) {
              throw Error('ARRAYBUFFER not supported by this environment');
            }
            f = function(r) {
              return o(r, b);
            };
            break;
          default:
            throw Error('format must be HEX, B64, BYTES, or ARRAYBUFFER');
        }
        for (p = A(R.slice(), B, w, d(l), b), s = 1; s < F; s += 1)
          p = A(p, b, 0, c(r), b);
        return f(p);
      }),
      (this.getHMAC = function(u, i) {
        var f, s, h, p;
        if (!1 === U)
          throw Error('Cannot call getHMAC without first setting HMAC key');
        switch (((h = a(i)), u)) {
          case 'HEX':
            f = function(r) {
              return t(r, b, h);
            };
            break;
          case 'B64':
            f = function(r) {
              return n(r, b, h);
            };
            break;
          case 'BYTES':
            f = function(r) {
              return e(r, b);
            };
            break;
          case 'ARRAYBUFFER':
            try {
              f = new ArrayBuffer(0);
            } catch (E) {
              throw Error('ARRAYBUFFER not supported by this environment');
            }
            f = function(r) {
              return o(r, b);
            };
            break;
          default:
            throw Error('outputFormat must be HEX, B64, BYTES, or ARRAYBUFFER');
        }
        return (
          (s = A(R.slice(), B, w, d(l), b)),
          (p = g(H, c(r))),
          (p = A(s, b, v, p, b)),
          f(p)
        );
      });
  }

  function t(r, t, n) {
    var e = '';
    t /= 8;
    var o, a;
    for (o = 0; o < t; o += 1)
      (a = r[o >>> 2] >>> (8 * (3 + (o % 4) * -1))),
        (e +=
          '0123456789abcdef'.charAt((a >>> 4) & 15) +
          '0123456789abcdef'.charAt(15 & a));
    return n.outputUpper ? e.toUpperCase() : e;
  }

  function n(r, t, n) {
    var e,
      o,
      a,
      u = '',
      i = t / 8;
    for (e = 0; e < i; e += 3)
      for (
        o = e + 1 < i ? r[(e + 1) >>> 2] : 0,
          a = e + 2 < i ? r[(e + 2) >>> 2] : 0,
          a =
            (((r[e >>> 2] >>> (8 * (3 + (e % 4) * -1))) & 255) << 16) |
            (((o >>> (8 * (3 + ((e + 1) % 4) * -1))) & 255) << 8) |
            ((a >>> (8 * (3 + ((e + 2) % 4) * -1))) & 255),
          o = 0;
        4 > o;
        o += 1
      )
        u +=
          8 * e + 6 * o <= t
            ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.charAt(
                (a >>> (6 * (3 - o))) & 63
              )
            : n.b64Pad;
    return u;
  }

  function e(r, t) {
    var n,
      e,
      o = '',
      a = t / 8;
    for (n = 0; n < a; n += 1)
      (e = (r[n >>> 2] >>> (8 * (3 + (n % 4) * -1))) & 255),
        (o += String.fromCharCode(e));
    return o;
  }

  function o(r, t) {
    var n,
      e = t / 8,
      o = new ArrayBuffer(e);
    for (n = 0; n < e; n += 1)
      o[n] = (r[n >>> 2] >>> (8 * (3 + (n % 4) * -1))) & 255;
    return o;
  }

  function a(r) {
    var t = {
      outputUpper: !1,
      b64Pad: '=',
      shakeLen: -1
    };
    if (
      ((r = r || {}),
      (t.outputUpper = r.outputUpper || !1),
      !0 === r.hasOwnProperty('b64Pad') && (t.b64Pad = r.b64Pad),
      'boolean' != typeof t.outputUpper)
    )
      throw Error('Invalid outputUpper formatting option');
    if ('string' != typeof t.b64Pad)
      throw Error('Invalid b64Pad formatting option');
    return t;
  }

  function u(r, t) {
    var n;
    switch (t) {
      case 'UTF8':
      case 'UTF16BE':
      case 'UTF16LE':
        break;
      default:
        throw Error('encoding must be UTF8, UTF16BE, or UTF16LE');
    }
    switch (r) {
      case 'HEX':
        n = function(r, t, n) {
          var e,
            o,
            a,
            u,
            i,
            f = r.length;
          if (0 != f % 2)
            throw Error('String of HEX type must be in byte increments');
          for (t = t || [0], n = n || 0, i = n >>> 3, e = 0; e < f; e += 2) {
            if (((o = parseInt(r.substr(e, 2), 16)), isNaN(o)))
              throw Error('String of HEX type contains invalid characters');
            for (u = (e >>> 1) + i, a = u >>> 2; t.length <= a; ) t.push(0);
            t[a] |= o << (8 * (3 + (u % 4) * -1));
          }
          return {
            value: t,
            binLen: 4 * f + n
          };
        };
        break;
      case 'TEXT':
        n = function(r, n, e) {
          var o,
            a,
            u,
            i,
            f,
            s,
            c,
            h,
            p = 0;
          if (((n = n || [0]), (e = e || 0), (f = e >>> 3), 'UTF8' === t))
            for (h = 3, u = 0; u < r.length; u += 1)
              for (
                o = r.charCodeAt(u),
                  a = [],
                  128 > o
                    ? a.push(o)
                    : 2048 > o
                      ? (a.push(192 | (o >>> 6)), a.push(128 | (63 & o)))
                      : 55296 > o || 57344 <= o
                        ? a.push(
                            224 | (o >>> 12),
                            128 | ((o >>> 6) & 63),
                            128 | (63 & o)
                          )
                        : ((u += 1),
                          (o =
                            65536 +
                            (((1023 & o) << 10) | (1023 & r.charCodeAt(u)))),
                          a.push(
                            240 | (o >>> 18),
                            128 | ((o >>> 12) & 63),
                            128 | ((o >>> 6) & 63),
                            128 | (63 & o)
                          )),
                  i = 0;
                i < a.length;
                i += 1
              ) {
                for (c = p + f, s = c >>> 2; n.length <= s; ) n.push(0);
                (n[s] |= a[i] << (8 * (h + (c % 4) * -1))), (p += 1);
              }
          else if ('UTF16BE' === t || 'UTF16LE' === t)
            for (h = 2, u = 0; u < r.length; u += 1) {
              for (
                o = r.charCodeAt(u),
                  'UTF16LE' === t &&
                    ((i = 255 & o), (o = (i << 8) | (o >>> 8))),
                  c = p + f,
                  s = c >>> 2;
                n.length <= s;

              )
                n.push(0);
              (n[s] |= o << (8 * (h + (c % 4) * -1))), (p += 2);
            }
          return {
            value: n,
            binLen: 8 * p + e
          };
        };
        break;
      case 'B64':
        n = function(r, t, n) {
          var e,
            o,
            a,
            u,
            i,
            f,
            s,
            c = 0;
          if (-1 === r.search(/^[a-zA-Z0-9=+\/]+$/))
            throw Error('Invalid character in base-64 string');
          if (
            ((o = r.indexOf('=')),
            (r = r.replace(/\=/g, '')),
            -1 !== o && o < r.length)
          )
            throw Error("Invalid '=' found in base-64 string");
          for (
            t = t || [0], n = n || 0, f = n >>> 3, o = 0;
            o < r.length;
            o += 4
          ) {
            for (i = r.substr(o, 4), a = u = 0; a < i.length; a += 1)
              (e = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.indexOf(
                i[a]
              )),
                (u |= e << (18 - 6 * a));
            for (a = 0; a < i.length - 1; a += 1) {
              for (s = c + f, e = s >>> 2; t.length <= e; ) t.push(0);
              (t[e] |=
                ((u >>> (16 - 8 * a)) & 255) << (8 * (3 + (s % 4) * -1))),
                (c += 1);
            }
          }
          return {
            value: t,
            binLen: 8 * c + n
          };
        };
        break;
      case 'BYTES':
        n = function(r, t, n) {
          var e, o, a, u, i;
          for (
            t = t || [0], n = n || 0, a = n >>> 3, o = 0;
            o < r.length;
            o += 1
          )
            (e = r.charCodeAt(o)),
              (i = o + a),
              (u = i >>> 2),
              t.length <= u && t.push(0),
              (t[u] |= e << (8 * (3 + (i % 4) * -1)));
          return {
            value: t,
            binLen: 8 * r.length + n
          };
        };
        break;
      case 'ARRAYBUFFER':
        try {
          n = new ArrayBuffer(0);
        } catch (e) {
          throw Error('ARRAYBUFFER not supported by this environment');
        }
        n = function(r, t, n) {
          var e, o, a, u;
          for (
            t = t || [0], n = n || 0, o = n >>> 3, e = 0;
            e < r.byteLength;
            e += 1
          )
            (u = e + o),
              (a = u >>> 2),
              t.length <= a && t.push(0),
              (t[a] |= r[e] << (8 * (3 + (u % 4) * -1)));
          return {
            value: t,
            binLen: 8 * r.byteLength + n
          };
        };
        break;
      default:
        throw Error('format must be HEX, TEXT, B64, BYTES, or ARRAYBUFFER');
    }
    return n;
  }

  function i(r, t) {
    return (r << t) | (r >>> (32 - t));
  }

  function f(r, t) {
    var n = (65535 & r) + (65535 & t);
    return (
      ((((r >>> 16) + (t >>> 16) + (n >>> 16)) & 65535) << 16) | (65535 & n)
    );
  }

  function s(r, t, n, e, o) {
    var a = (65535 & r) + (65535 & t) + (65535 & n) + (65535 & e) + (65535 & o);
    return (
      ((((r >>> 16) +
        (t >>> 16) +
        (n >>> 16) +
        (e >>> 16) +
        (o >>> 16) +
        (a >>> 16)) &
        65535) <<
        16) |
      (65535 & a)
    );
  }

  function c(r) {
    if ('SHA-1' !== r) throw Error('No SHA variants supported');
    return [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
  }

  function h(r, t) {
    var n,
      e,
      o,
      a,
      u,
      c,
      h,
      p = [];
    for (
      n = t[0], e = t[1], o = t[2], a = t[3], u = t[4], h = 0;
      80 > h;
      h += 1
    )
      (p[h] =
        16 > h ? r[h] : i(p[h - 3] ^ p[h - 8] ^ p[h - 14] ^ p[h - 16], 1)),
        (c =
          20 > h
            ? s(i(n, 5), (e & o) ^ (~e & a), u, 1518500249, p[h])
            : 40 > h
              ? s(i(n, 5), e ^ o ^ a, u, 1859775393, p[h])
              : 60 > h
                ? s(i(n, 5), (e & o) ^ (e & a) ^ (o & a), u, 2400959708, p[h])
                : s(i(n, 5), e ^ o ^ a, u, 3395469782, p[h])),
        (u = a),
        (a = o),
        (o = i(e, 30)),
        (e = n),
        (n = c);
    return (
      (t[0] = f(n, t[0])),
      (t[1] = f(e, t[1])),
      (t[2] = f(o, t[2])),
      (t[3] = f(a, t[3])),
      (t[4] = f(u, t[4])),
      t
    );
  }

  function p(r, t, n, e) {
    var o;
    for (o = 15 + (((t + 65) >>> 9) << 4); r.length <= o; ) r.push(0);
    for (
      r[t >>> 5] |= 128 << (24 - t % 32),
        t += n,
        r[o] = 4294967295 & t,
        r[o - 1] = (t / 4294967296) | 0,
        t = r.length,
        o = 0;
      o < t;
      o += 16
    )
      e = h(r.slice(o, o + 16), e);
    return e;
  }
  return r;
})();

export default jsSHA;
