import * as fs from 'fs';
const log = { trace: () => {}, debug: console.log, error: console.error };

export default async (opt: any) => {
  const { root, conf, req, res, next } = opt;
  const GC = await import(`${root}/modules/commons/globalConstants.js`);
  let ret = '';
  try {
    if (conf.PROFILE === GC.LOCAL || conf.PROFILE === GC.DEV) {
      const DIR = './';
      const param = { } as any;
      let uri = req.originalUrl;
      let query = /[?](.*$)/g.exec(String(uri))?.at(1) || '';
      log.debug('URI:', uri, query);
      for (let inx = 0; inx < 100; inx++) {
        const mat = /^[\&]*[\s]*([^=^\&]+)[\s]*[=][\s]*([^=^\&]+)[\s]*/g.exec(query);
        if (mat) {
          param[String(mat.at(1))] = String(mat.at(2));
          query = query.substring(mat[0].length);
        } else {
          break;
        }
      }
      switch(param.a) {
      case 'l': {
        const list: any[] = [];
        let path = DIR;
        if (param.d) { path = `${path}/${param.d}`; }
        for (const item of fs.readdirSync(path)) {
          const fpath = `${path}/${item}`;
          const stat = fs.statSync(fpath);
          if (stat?.isDirectory()) {
            ret += `[${item}]<br/>`;
          } else {
            ret += `${item}<br/>`;
          }
        }
        } break;
      case 'r': {
        const fpath = `${DIR}/${param.f}`;
        ret = String(fs.readFileSync(fpath, { encoding: GC.UTF8 }));
        } break;
      case 't': {
        console.log('URL:', JSON.stringify(param));
        } break;
      }
      res.header(GC.CONTENT_TYPE, `${GC.CTYPE_HTML}; charset=${GC.UTF8}`);
      res.status(200).end(`${ret}`);
      return;
    }
  } catch (ignore) { }
  res.status(404);
  next('');
};
