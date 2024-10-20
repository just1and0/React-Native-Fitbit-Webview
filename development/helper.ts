export async function getFitBitVitals(
  userFitBitToken: string,
  currentDate: string,
  identifier: string,
) {
  const tokenEndpoint = `https://api.fitbit.com/1/user/-/activities/${identifier}/date/${currentDate}/1d.json`;
  try {
    const response = await fetch(tokenEndpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${userFitBitToken}`,
      },
    });


    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

export function getDateAndWeekAgo() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = ('0' + (currentDate.getMonth() + 1)).slice(-2);
  const currentDay = ('0' + currentDate.getDate()).slice(-2);
  const currentDateFormatted = currentYear + '-' + currentMonth + '-' + currentDay;

  // Date a week ago
  const weekAgoDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weekAgoYear = weekAgoDate.getFullYear();
  const weekAgoMonth = ('0' + (weekAgoDate.getMonth() + 1)).slice(-2);
  const weekAgoDay = ('0' + weekAgoDate.getDate()).slice(-2);
  const weekAgoDateFormatted = weekAgoYear + '-' + weekAgoMonth + '-' + weekAgoDay;

  return {
    currentDate: currentDateFormatted,
    weekAgoDate: weekAgoDateFormatted,
  };
}

export async function getFitBitVitalsWithRange(
  userFitBitToken: string,
  currentDate: string,
  weekAgoDate: string,
  identifier: string,
) {
  const tokenEndpoint = `https://api.fitbit.com/1.2/user/-/${identifier}/date/${weekAgoDate}/${currentDate}.json`;
  try {
    const response = await fetch(tokenEndpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${userFitBitToken}`,
      },
    });

    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

export async function exchangeCodeForTokens(authorizationCode: string, token: string) {
  const tokenEndpoint = `https://api.fitbit.com/oauth2/token?code=${authorizationCode}&grant_type=authorization_code&redirect_uri=http://localhost`;
  try {
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${token}`,
      },
    });

    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    } else {
      throw new Error('Failed to exchange code for tokens');
    }
  } catch (error) {
    return error;
  }
}

export const convertToBase64 = (value: string): string => {
  const Base64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    encode: function (e: string): string {
      let t = "";
      let n: number, r: number, i: number, s: number, o: number, u: number, a: number;
      let f = 0;
      e = this._utf8_encode(e);
      while (f < e.length) {
        n = e.charCodeAt(f++);
        r = e.charCodeAt(f++);
        i = e.charCodeAt(f++);
        s = n >> 2;
        o = (n & 3) << 4 | r >> 4;
        u = (r & 15) << 2 | i >> 6;
        a = i & 63;
        if (isNaN(r)) {
          u = a = 64;
        } else if (isNaN(i)) {
          a = 64;
        }
        t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a);
      }
      return t;
    },

    decode: function (e: string): string {
      let t = "";
      let n: number, r: number, i: number;
      let s: number, o: number, u: number, a: number;
      let f = 0;
      e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
      while (f < e.length) {
        s = this._keyStr.indexOf(e.charAt(f++));
        o = this._keyStr.indexOf(e.charAt(f++));
        u = this._keyStr.indexOf(e.charAt(f++));
        a = this._keyStr.indexOf(e.charAt(f++));
        n = s << 2 | o >> 4;
        r = (o & 15) << 4 | u >> 2;
        i = (u & 3) << 6 | a;
        t = t + String.fromCharCode(n);
        if (u != 64) {
          t = t + String.fromCharCode(r);
        }
        if (a != 64) {
          t = t + String.fromCharCode(i);
        }
      }
      t = this._utf8_decode(t);
      return t;
    },

    _utf8_encode: function (e: string): string {
      e = e.replace(/\r\n/g, "\n");
      let t = "";
      for (let n = 0; n < e.length; n++) {
        const r = e.charCodeAt(n);
        if (r < 128) {
          t += String.fromCharCode(r);
        } else if (r > 127 && r < 2048) {
          t += String.fromCharCode((r >> 6) | 192);
          t += String.fromCharCode((r & 63) | 128);
        } else {
          t += String.fromCharCode((r >> 12) | 224);
          t += String.fromCharCode(((r >> 6) & 63) | 128);
          t += String.fromCharCode((r & 63) | 128);
        }
      }
      return t;
    },

    _utf8_decode: function (e: string): string {
      let t = "";
      let n = 0;
      let r = 0, c1 = 0, c2 = 0;
      while (n < e.length) {
        r = e.charCodeAt(n);
        if (r < 128) {
          t += String.fromCharCode(r);
          n++;
        } else if (r > 191 && r < 224) {
          c2 = e.charCodeAt(n + 1);
          t += String.fromCharCode(((r & 31) << 6) | (c2 & 63));
          n += 2;
        } else {
          c2 = e.charCodeAt(n + 1);
          const c3 = e.charCodeAt(n + 2);
          t += String.fromCharCode(((r & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
          n += 3;
        }
      }
      return t;
    }
  };

  return Base64.encode(value);
};


export const handleOnUrlChanged = (data: any, handleVerifyUser: (code:string) => void) => {
  const { url } = data;
  if (url.startsWith('http://localhost') && url.includes('code=')) {
    const parts = url.split('code=');
    let codeValue = parts[1];

    if (codeValue.includes('#')) {
      codeValue = codeValue.split('#')[0];
    }
    handleVerifyUser(codeValue);
  }
};