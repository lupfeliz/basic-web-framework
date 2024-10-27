/**
 * @File        : macro-loader.js
 * @Author      : 정재백
 * @Since       : 2024-10-25
 * @Description : 빌드시 소스코드를 가로채어 변화시켜주는 웹팩 플러그인
 *                미리 만들어놓은 매크로를 사용해 소스를 변조해 준다.
 *                주의! 매크로는 반드시 1줄단위로 변조해 주어야 소스 라인수가 서로 맞는다.
 * @Site        : https://devlog.ntiple.com
 **/
const PTN_IMPORT = /\/\*[ \t]*#MACRO-DEFINE#[ \t]*.*\*\//
const REPLACES = `
${''/** 라이브러리 임포트 */}
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
const { $t, asAny, asType, basepath, changeLang, clear, clone, copyExclude, copyExists, defineComponent, definePage, getFrom, getGlobalTmp, getLogger, getOpenerTmp, getParameter, getText, getUri, getUrl, goPage, isClient, isServer, matcher, mergeAll, mergeObj, modelValue, profile, pushAll, putAll, px2rem, randomStr, rem2px, setGlobalTmp, setOpenerTmp, sleep, strm, toJSON, toString, until, useGlobalRef, useRef, useSetup } = app;
${''/** 페이지명 */}
const $PAGENAME$ = '#{PAGENAME}';
${''/** 지역로그 */}
const log = getLogger($PAGENAME$);
const encrypt = __$CRYPTO$.aes.encrypt;
const decrypt = __$CRYPTO$.aes.decrypt;
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
  if (PTN_IMPORT.test(result)) {
    // console.log('SRCPATH:', this.resourcePath)
    result = result.replace(PTN_IMPORT, REPLACES.replace('#{PAGENAME}', pagename))
  }
  return result
}