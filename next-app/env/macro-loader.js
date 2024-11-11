/**
 * @File        : macro-loader.js
 * @Author      : 정재백
 * @Since       : 2024-10-25
 * @Description : 빌드시 소스코드를 가로채어 변화시켜주는 웹팩 플러그인
 *                미리 만들어놓은 매크로를 사용해 소스를 변조해 준다.
 *                주의! 매크로는 반드시 1줄단위로 변조해 주어야 소스 라인수가 서로 맞는다.
 * @Site        : https://devlog.ntiple.com
 **/
const PTN_DEFINE = /\/\*[ \t]*#MACRO-DEFINE#[ \t]*.*\*\//
const PTN_I18N = /\/\*[ \t]*#MACRO-I18N#[ \t]*.*\*\//
const REPLACES_DEFINE = `
${''/** 라이브러리 임포트 */}
import __$FS from 'fs';
import __$GETCONFIG from 'next/config';
import * as C from '@/libs/constants';
import app from '@/libs/app-context';
import api from '@/libs/api';
import format from '@/libs/format';
import values from '@/libs/values';
import __$CRYPTO$ from '@/libs/crypto';
import dialog from '@/libs/dialog-context';
import userContext from '@/libs/user-context';
import commonCodes from '@/libs/common-codes';
import { Block, Button, Checkbox, Container, Content, DataGrid, EditorClassic, Editor, Form, Fragment, Image, Input, Link, Lottie, Modal, Page, Pagination, Portal, Select, Slider, Spinner, Textarea } from '@/components';
import { useForm, validateForm } from '@/components/form';
${''/** 필요한 메소드들 추출 */}
const { $t, asAny, asType, basepath, changeLang, clear, clone, copyExclude, copyExists, defineComponent, definePage, getFrom, getGlobalTmp, getLogger, getOpenerTmp, getParameter, getText, getUri, getUrl, goPage, isClient, isServer, matcher, mergeAll, mergeObj, modelValue, profile, pushAll, putAll, px2rem, randomStr, replacePage, rem2px, setGlobalTmp, setOpenerTmp, sleep, strm, toJSON, toString, until, useGlobalRef, useRef, useSetup } = app;
${''/** 페이지명 */}
const $PAGENAME$ = '#{PAGENAME}';
${''/** 지역로그 */}
const log = getLogger($PAGENAME$);
const encrypt = __$CRYPTO$.aes.encrypt;
const decrypt = __$CRYPTO$.aes.decrypt;
`.replace(/[ \r\n\t]+/gm, ' ').trim()

const REPLACES_EXPORT = `
export const getStaticPaths = async () => {
  ${''/** i18n 에서 generating 할 목록, i18n.ts 의 languages 항목에 의존한다.  */}
  const paths = [ ];
  for (const lang of $t.languages) { paths.push({ params: { lang } }); };
  return { paths, fallback: false };
};
export const getStaticProps = async (context) => {
  ${''/** 미리 한번만 컴파일 되기 때문에 큰 부하는 없을것으로 예상 */}
  const params = context.params;
  const locales = [ ];
  for (const lang of $t.languages) { locales.push(lang); };
  putAll(context, {
    locales,
    locale: params?.lang || '',
    defaultLocale: 'ko',
  });
  let langdata = '';
  let lang = params?.lang || '';
  let basepath = '/' + __$GETCONFIG()?.app?.distDir || 'dist';
  let modpath = String(__filename).substring(String(process.cwd() + basepath + '/server/pages').length);
  modpath = modpath.replace(/\.js$/g, '');
  if (lang) {
    modpath = modpath.replace(/\\[lang\\]/g, lang);
    langdata = JSON.stringify(await import('@/locales/' + lang + '/commons'));
  };
  const props = { lang, modpath, langdata };
  log.debug('CHECK:', modpath);
  ${''/** 페이지에서 props.pageProps 에 할당된다 */}
  return { props };
};
`.replace(/[ \r\n\t]+/gm, ' ').trim()

module.exports = function(source) {
  const pagepath = String(this.resourcePath).replace(/.*\/([^\/]+\/[^\/]+).jsx$/g, '$1')
  if (['pages/_app', 'pages/_document', 'pages/index'].indexOf(pagepath) !== -1) { return source }
  const namedata = pagepath.split(/\//g).reverse()
  let pagename = namedata[0]
  if (pagename == 'index' || /\[[^\[^\]]+\]/.test(pagename)) {
    pagename = namedata[1]
  }
  // console.log('SRCPATH:', pagename, this.resourcePath)
  let result = String(source || '')
  /** 치환데이터 저장소를 초기화 한다 */
  /** 소스코드에서 // #MACRO-IMPORTS# 가 발견되면 1회 치환한다 */
  if (PTN_DEFINE.test(result)) {
    // console.log('SRCPATH:', this.resourcePath)
    result = result.replace(PTN_DEFINE, REPLACES_DEFINE
      .replace('#{PAGENAME}', pagename)
    )
  }
  if (/\[lang\]/.test(pagepath) && PTN_I18N.test(result)) {
    console.log('PAGE:', pagepath)
    result = result.replace(PTN_I18N, REPLACES_EXPORT
    )
  }
  return result
}