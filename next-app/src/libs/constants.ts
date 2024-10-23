/**
 * @File        : constants.ts
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 자주 사용되는 상수 정의
 * @Site        : https://devlog.ntiple.com
 **/
export const LOCAL = 'local'
export const DEV   = 'dev'
export const TEST  = 'test'
export const PROD  = 'prod'
export const MY = 'my'

export const KO = 'ko'
export const EN = 'en'

export const ROOT = 'ROOT'
export const DEBUG = 'debug'
export const INFO = 'info'
export const TRACE = 'trace'
export const WARN = 'warn'
export const ERROR = 'error'

export const UTF8 = 'utf-8'
export const TEXT = 'text'
export const STRING = 'string'
export const ALPHA = 'alpha'
export const ALPHASPC = 'alphaspc'
export const ALPHANUM = 'alphanum'
export const ALPHASTART = 'alphastart'
export const ALPHANUMSPC = 'alphanumspc'
export const ASCII = 'ascii'
export const HANGUL = 'hangul'
export const EMAIL = 'email'
export const PUBLIC_KEY = 'publickey'
export const PRIVATE_KEY = 'privatekey'
export const OBJECT = 'object'
export const BOOLEAN = 'boolean'
export const NUMBER = 'number'
export const NUMERIC = 'numeric'
export const PASSWORD = 'password'
export const DATE = 'date'
export const BYTES = 'b'
export const KBYTES = 'kb'
export const MBYTES = 'mb'
export const GBYTES = 'gb'

export const CONTENT_TYPE = 'content-type'
export const CHARSET = 'charset'
export const CTYPE_JSON = 'application/json'
export const CTYPE_GRAPHQL = 'application/graphql'
export const CTYPE_FORM = 'application/x-www-form-urlencoded'
export const CTYPE_XML = 'text/xml'
export const CTYPE_HTML = 'text/html'
export const CTYPE_TEXT = 'plain/text'
export const CTYPE_CSS = 'text/css'
export const CTYPE_OCTET = 'application/octet-stream'
export const CTYPE_MULTIPART = 'multipart/form-data'
export const APPSTATE_INIT = 0
export const APPSTATE_START = 1
export const APPSTATE_LIBS = 2
export const APPSTATE_ENV = 3
export const APPSTATE_USER = 4
export const APPSTATE_READY = 5
export const APPSTATE_ERROR = 999

export const UNDEFINED = undefined as any

export const HIDE_PRELOAD = 'hide-preload'

export const FN_NIL = (..._: any[]) => { }
export const HREF_NIL = 'javascript:{}'

export const WIDTH = 'width'
export const HEIGHT = 'height'

export const B641x1IMG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
export const B64IMG_PREFIX = 'data:image/png;base64,'

export const DATE_FORMAT_YM = 'YYYY-MM'
export const DATE_FORMAT_YMD = 'YYYY-MM-DD'
export const DATE_FORMAT_NORM = 'YYYY-MM-DD HH:mm:ss'
export const DATE_FORMAT_DTH = 'YYYY-MM-DD HH'
export const DATE_FORMAT_DTHM = 'YYYY-MM-DD HH:mm'
export const DATE_FORMAT_CODE = 'YYYYMMDDHHmmss'
export const DATE_FORMAT_FULL = 'YYYY-MM-DDTHH:mm:ss.SSS'
export const DATE_FORMAT_ISO8601 = 'YYYY-MM-DDTHH:mm:ssZ'

export const USER = 'user'
export const PAGES = 'pages'
export const DIALOG = 'dialog'
export const ALERT = 'alert'
export const CONFIRM = 'confirm'
export const FETCH = 'fetch'
export const EVENT = 'event'
export const VISIBLE = 'visible'
export const TRANSPARENT = 'transparent'

export const CLICK = 'click'

export const ASCENDING = 'ascending'
export const DESCENDING = 'descending'

export const BEARER = 'Bearer'
export const AUTHORIZATION = 'Authorization'
export const POST = 'post'
export const GET = 'get'
export const PUT = 'put'
export const DELETE = 'delete'
export const TOKEN_REFRESH = 'tokenRefresh'

export const EXTRA_TIME = 1000 * 5
export const EXPIRE_NOTIFY_TIME = 1000 * 60 * 2

export const REQUIRED = 'required'
export const ATLEAST = 'atleast'
export const AUTO = 'auto'

export const UPDATE_ENTIRE = 3
export const UPDATE_FULL = 2
export const UPDATE_SELF = 1
export const UPDATE_IF_NOT = 0

export const SC_OK = 200
export const SC_MOVED_PERMANENTLY = 301
export const SC_MOVED_TEMPORARILY = 302
export const SC_UNAUTHORIZED = 401
export const SC_FORBIDDEN = 403
export const SC_NOT_FOUND = 404
export const SC_METHOD_NOT_ALLOWD = 405
export const SC_BAD_REQUEST = 400
export const SC_INTERNAL_SERVER_ERROR = 500
export const SC_BAD_GATEWAY = 502
export const SC_SERVICE_UNAVAILABLE = 503
export const SC_GATEWAY_TIMEOUT = 504
export const SC_RESOURCE_LIMIT_IS_REACHED = 508
export const SC_UNKNOWN = -1

export const RESCD_OK = '0000'
/** 이 부분은 웹팩 플러그인(replace-loader)에 의해 자동으로 채워진다 */
export const CRYPTO_KEY = '{$$CRYPTO_KEY$$}'