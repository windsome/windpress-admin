import _ from 'lodash';

export const CAPNAMES = {
  ROOT: '超级管理员',
  SHOP: '商家',
  TEACHER: '教师',
  VOTE: '投票管理',
  DEBUG: '调试'
};

export const hasCaps = (user, caps) => {
  if (!user || !user.caps) {
    console.log('warning! no user.caps! return false!', user, caps);
    return false;
  }

  if (!caps || caps.length <= 0) {
    console.log('warning! no caps, everyone can do.', user, caps);
    return true;
  }

  // clean need caps.
  if (_.isString(caps)) {
    caps = caps.split(',');
  }
  caps =
    caps &&
    caps.map(item => {
      return item.toUpperCase();
    });

  // clean user caps.
  let userCaps = user && user.caps;
  if (userCaps && _.isString(userCaps)) {
    // convert old string cap to array.
    userCaps = userCaps.split(',');
  }
  userCaps =
    userCaps &&
    _.isArray(userCaps) &&
    userCaps.map(item => {
      return item.toUpperCase();
    });

  if (userCaps.indexOf('ROOT') >= 0) {
    //console.log ("ROOT got! userCaps=", userCaps, ", needCaps=", caps);
    return true;
  }

  let noCaps = [];
  let canDo =
    userCaps &&
    caps &&
    caps.reduce((result, cap) => {
      let orCaps = cap.split('|');
      let canDo1 = false;
      for (let i = 0; i < orCaps.length; i++) {
        let cap1 = orCaps[i];
        if (userCaps.indexOf(cap1) >= 0) {
          canDo1 = true;
          break;
        }
      }
      if (!canDo1) {
        //console.log ("don't has cap="+cap);
        noCaps.push(cap);
      }
      return result && canDo1;
    }, true);

  // if (!canDo) {
  //   console.log('false! noCaps=', noCaps, ', userCaps=', userCaps);
  // }

  return !!canDo; // convert object/null to true/false.
};

export const isOwner = (user, owner) => {
  if (!user || !owner) {
    console.log('warning! user or <owner> is null!', user, owner);
    return false;
  }
  return user.id == owner;
};

export const addCap = (user, cap) => {
  if (!user || !cap) {
    console.log('warning! user or cap is null!', user, cap);
    return null;
  }
  cap = cap.toUpperCase();
  let caps = user.caps || [];
  let nextCaps = caps.map(item => {
    return item.toUpperCase();
  });
  let found = nextCaps.reduce((result, item) => {
    if (item == cap) return true;
    else return result;
  }, false);
  if (!found) {
    nextCaps.push(cap);
  }
  return nextCaps;
};
export const addCaps = (user, caps) => {
  if (!user || !caps) {
    console.log('warning! user or cap is null!', user, caps);
    return null;
  }
  let nextCaps = [...caps];
  nextCaps = nextCaps.concat(user.caps || []);
  nextCaps = nextCaps.map(item => {
    return item.toUpperCase();
  });
  return _.union(nextCaps);
};

export const delCap = (user, cap) => {
  if (!user || !cap) {
    console.log('warning! user or cap is null!', user, cap);
    return null;
  }
  cap = cap.toUpperCase();
  let caps = user.caps || [];
  let nextCaps = caps.map(item => {
    return item.toUpperCase();
  });

  return nextCaps.reduce((result, item) => {
    if (item == cap) return result;
    else return result.concat(item);
  }, []);
};
export const delCaps = (user, caps) => {
  if (!user || !caps) {
    console.log('warning! user or caps is null!', user, caps);
    return null;
  }

  caps = caps.map(item => {
    return item.toUpperCase();
  });
  let nextCaps = (user.caps || []).map(item => {
    return item.toUpperCase();
  });

  return nextCaps.reduce((result, item) => {
    let found = false;
    let i = 0;
    for (i = 0; i < caps.length; i++) {
      if (caps[i] == item) {
        found = true;
        break;
      }
    }
    if (found) return result;
    else return result.concat(item);
  }, []);
};

export default hasCaps;
