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
export const EMAIL = 'email'
export const PASSWORD = 'password'
export const DATE = 'date'
export const DT = 'dt'
export const PHONE = 'phone'
export const PUBLIC_KEY = 'publickey'
export const PRIVATE_KEY = 'privatekey'
export const DATE_Y = 'date-y'
export const DATE_YM = 'date-ym'
export const DATETIME = 'datetime'
export const HIDDEN = 'hidden'
export const OBJECT = 'object'
export const BOOLEAN = 'boolean'
export const NUMBER = 'number'
export const NUMERIC = 'numeric'
export const BLANK = '_blank'
export const JSONV = 'json'
export const BLOBV = 'blob'
export const STREAM = 'stream'
export const VALID = 'valid'
export const INVALID = 'invalid'
export const SEQUENCE = 'Sequence'
export const KO = 'ko'
export const EN = 'en'
export const RESCD_OK = '0000'
export const RESCD_FAIL = '9999'

export const CLICK = 'click'

export const CONTENT_TYPE = 'content-type'
export const CHARSET = 'charset'
export const CTYPE_JSON = 'application/json'
export const CTYPE_FORM = 'application/x-www-form-urlencoded'
export const CTYPE_XML = 'text/xml'
export const CTYPE_HTML = 'text/html'
export const CTYPE_TEXT = 'plain/text'
export const CTYPE_CSS = 'text/css'
export const CTYPE_OCTET = 'application/octet-stream'
export const CTYPE_MULTIPART = 'multipart/form-data'

export const UNDEFINED = undefined as any

export const PAGE_TITLE = 'pageTitle'
export const HIDE_PRELOAD = 'hide-preload'
export const PAGE_CONFIG = '__page_config__'

export const DIV = 'div'
export const IMG = 'img'
export const SRC= 'src'
export const BODY = 'body'
export const ID = 'id'
export const TAGNAME = 'tagName'
export const CLASS = 'class'
export const BASE64 = 'base64'

export const FN_NIL = (..._: any[]) => { }

export const BEARER = 'Bearer'
export const AUTHORIZATION = 'Authorization'
export const POST = 'post'
export const GET = 'get'
export const PUT = 'put'
export const DELETE = 'delete'
export const UPLOAD = 'upload'
export const TOKEN_REFRESH = 'tokenRefresh'

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

export const AUTO = 'auto'
export const REQUIRED = 'required'

export const ASCENDING = 'ascending'
export const DESCENDING = 'descending'

export const DEFAULT_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSSZ'

/** 만료시간 여유 약 10초 */
export const EXTRA_TIME = 1000 * 10
/** 인증 만료 경고시간 약 2분 */
export const EXPIRE_NOTIFY_TIME = 1000 * 60 * 2

export const noerror = true
export const noprogress = true
export const getblob = true
export const getstream = true
export const getb64 = true
export const deep = true
export const $$forceupdate$$ = '$$forceupdate$$'
/** PING */
export const CMN00000 = 'cmn00000'
/** GET-ENV */
export const CMN01001 = 'cmn01001'
/** 로그인 */
export const LGN01001 = 'lgn01001'
/** 로그인 연장 */
export const LGN01002 = 'lgn01002'

/** 메인페이지 */
export const MAI01001S01 = '/mai/mai01001s01'
/** 로그인 페이지 */
export const LGN01001S01 = '/lgn/lgn01001s01'
/** 회원가입 페이지 */
export const USR01001S01 = '/usr/usr01001s01'
/** 마이페이지 */
export const USR01002S01 = '/usr/usr01002s01'
/**  */
export const ATC01001S01 = '/atc/atc01001s01'