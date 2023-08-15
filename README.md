[TOC]

# 강습준비내용

## code-server 접속방법

- 최초 비밀번호 수정 및 `reboot`

- 터미널 workspace 폴더에서 `screen` 실행

- 소스제어 에서 git repository 초기화

- 기본적인 MD 문서 조회방법 등 설명 (이후는 이미지 등을 포함한 문서참고)

- .http 활용 (rest client)

- chat-gpt 활용방법 (openai-api 키 발급: `https://platform.openai.com/account/api-keys`)

- vue(nuxt) ↔ reactjs(next) 변경중점 등

## nuxt 기본 프로젝트 생성 및 실행

--------------------------------------------------------------------------------
```bash
$ npx nuxi init my-app 
$ cd my-app
$ git init
$ npm install
$ npx nuxt dev
```
--------------------------------------------------------------------------------

- vue3 (composition-api / script-setup) 간략설명

- nuxt / vite 프로젝트 차이점 간략설명

## 기본적인 설정 및 프로젝트 레이아웃

- `ts.shim.d.ts` 생성 (`import` 시 빨간줄 제거)

--------------------------------------------------------------------------------
```javascript
declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}
```
--------------------------------------------------------------------------------

- app.vue 삭제

- 패키지 설치 `sass` `postcss` `autoprefixer` `bootstrap` `mement` `lodash` `jquery`  등 

- `nuxt.config.ts` 수정 ( 기본설정 )

--------------------------------------------------------------------------------
```javascript
import env from 'dotenv'
/** OS 환경변수 읽어오기 */
env.config()
export default defineNuxtConfig({
  devtools: { enabled: true },
  vite: {
    server: {
      /** 방화벽 안쪽에서 바깥쪽과 hmr 통신하기 위한 설정 */
      hmr: {
        path: '/hmr',
        clientPort: Number(String(process.env['VITE_HMR_CLIENT_PORT'] || 24678))
      },
    },
  },
  /** 기본 CSS import */
  css: [
    '@/assets/css/globals.scss',
    'bootstrap/dist/css/bootstrap.css',
  ],
})
```
--------------------------------------------------------------------------------

## 기본 페이지 및 컴포넌트 추가

- `pages/index.vue` `layouts/default.vue` `components/commons/header.vue` `components/commons/footer.vue` 작성

--------------------------------------------------------------------------------
```html
<template>
  <div>
    INDEX
  <div>
</template>
<script setup lang="ts">
</script>
```

```html
<template>
  <main>
    <div>
      <Header></Header>
      <slot></slot>
      <Footer></Footer>
    </div>
  </main>
</template>
<script setup lang="ts">
import Header from '@/components/commons/header.vue'
import Footer from '@/components/commons/footer.vue'
</script>
```

```html
<template>
  <header>
    HEADER
  </header>
</template>
<script setup lang="ts">
</script>
```

```html
<template>
  <footer>
    FOOTER
  </footer>
</template>
<script setup lang="ts">
</script>
```
--------------------------------------------------------------------------------

- `components/commons/mybutton.vue` 추가 / 페이지 추가 후 alert 이벤트 발생 테스트

--------------------------------------------------------------------------------
```html
<template>
  <butto이마트n
    type="button"
    class="btn"
    v-bind="attrs"
    @click="emitClick"
    >
    <slot></slot>
  </button>
</template>
<script setup lang="ts">

const props = defineProps({ })
const attrs = useAttrs()
const emit = defineEmits(['click'])
const emitClick = async (e: any) => {
  emit('click', e)
}
</script>
```
--------------------------------------------------------------------------------

- `constants.ts` `log.ts` `api.ts` `shared.ts` `values.ts` 등 공통 유틸 생성 (공통된 상수 및 메소드 정리)

--------------------------------------------------------------------------------
```javascript
/** constants.ts */
... 생략 ...
export const UPDATE_MODEL_VALUE = 'update:modelValue'
export const CLICK = 'click'
export const KEYUP = 'keyup'

export const JSONV = 'json'
export const UTF8 = 'utf-8'
... 생략 ...
```

```javascript
/** log.ts */
const fnnill = (..._: any[]) => { }
const fndebug = console.log
const fnwarn = console.warn
const fnerror = console.error
const log = { trace: fnnill, debug: fndebug, warn: fnwarn, error: fnerror }
export { log }
```
--------------------------------------------------------------------------------

- `dialog.vue` `dialog.ts` 추가 ( 경고창 등 투박한 네이티브 제거 )
  ※ bootstrap 은 vue3 에서 사용시 dynamic-import 를 사용해야 한다. (layout 에 추가)

--------------------------------------------------------------------------------
```html
<template>
  <div
    ref="modal"
    class="modal fade"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="staticBackdropLabel"
    aria-hidden="true"
    >
    ... 생략 ...
  </div>
</template>
<script setup lang="ts">
... 생략 ...
const modal = ref()
const ctx = ref(reactive({
  element: {} as any as Element,
  instance: {} as any,
  current: {} as any,
  queue: [] as any[]
}))
watch(modal.value, async () => {
  const bootstrap = await import('bootstrap')
  $modal = new bootstrap.Modal(modal.value)
  dialog.alert = alert
  dialog.confirm = confirm
})
const alert = (msg: String) => {
  return new Promise<boolean>((resolve) => {
    ((c: any) => { c.msg = msg c.type = 1 c.resolve = resolve })(ctx.value)
    $modal.show()
  })
}
const confirm = (msg: String) => {
  return new Promise<boolean>((resolve) => {
    ((c: any) => { c.msg = msg c.type = 2 c.resolve = resolve })(ctx.value)
    $modal.show()
  })
}
... 생략 ...
</script>
```
```javascript
const dialog = {
  alert: async (msg: String) => new Promise<boolean>(() => { }),
  confirm: async (msg: String) => new Promise<boolean>(() => { })
}
export { dialog }
```
--------------------------------------------------------------------------------

## 통신 모듈 준비

- api.ts

--------------------------------------------------------------------------------
```javascript
import { log } from '@/libs/commons/log'
import * as C from '@/libs/commons/constants'
import axios, { AxiosRequestConfig } from 'axios'
let API_BASE = '.'
const headers = JSON.parse(`{ "${C.CONTENT_TYPE}": "${C.CTYPE_JSON}; ${C.CHARSET}=${C.UTF8}" }`)
const timeout = 30 * 1000
const dconf = {
  headers,
  responseType: C.JSONV,
  responseEncoding: C.UTF8,
  timeout: timeout
} as AxiosRequestConfig<string>
/** POST 메소드 */
const apiPost = async (prm: any, opt?: any) => {
  const ret = await axios.post(`${API_BASE}/api/${prm.act}`, JSON.stringify(prm.data), dconf) 
  return ret
}
/** PUT 메소드 */
const apiPost = async (prm: any, opt?: any) => {
const apiPut = async (prm: any, opt?: any) => {
  const ret = await axios.put(`${API_BASE}/api/${prm.act}`, JSON.stringify(prm.data), dconf) 
  return ret
}
/** GET 메소드 */
const apiGet = async (prm: any, opt?: any) => {
  const ret = await axios.get(`${API_BASE}/api/${prm.act}`, dconf) 
  return ret
}
/** DELETE 메소드 */
const apiDel = async (prm: any, opt?: any) => {
  const ret = await axios.delete(`${API_BASE}/api/${prm.act}`, dconf) 
  return ret
}
export { apiPost, apiGet, apiPut, apiDel }
```
--------------------------------------------------------------------------------

## 통신 proxy 준비

- nuxt.conf.ts

--------------------------------------------------------------------------------
```javascript
vite: {
  server: {
    ... 생략 ...
    proxy: {
      '^/api/.*': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        rewrite: (path) => {
          return path.replace(/^\/api\//g, '/');
        }
      }
    }
  }
}
```
  --------------------------------------------------------------------------------

## 데이터 셋팅

- 로그인, 게시판 구현을 위한 데이터

  --------------------------------------------------------------------------------
  ```sql
  CREATE TABLE a0000_user(
      id int NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      user_id VARCHAR(32),
      passwd VARCHAR(64),
      ctime TIMESTAMP,
      utime TIMESTAMP
  );
  CREATE TABLE a0000_board(
      id int NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      num NUMERIC,
      title VARCHAR(255),
      user_id VARCHAR(32),
      contents VARCHAR(99999),
      ctime TIMESTAMP,
      utime TIMESTAMP
  );
  ```
  --------------------------------------------------------------------------------

## was 셋팅 (데이터 흐름 파악을 위해)

- gradle 프로젝트 생성

  - lombok
  - spring web
  - spring security
  - spring data jpa
  - spring boot dev tools
  - postgresql driver

- application.yml 수정

  ```yaml
  server:
    port: 8081
  spring:
    datasource:
      url: jdbc:postgresql://172.17.0.1:5432/myworks
      username: myuser
      password: password
      driverClassName: org.postgresql.Driver
    jpa:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQL10Dialect
        ddl-auto: update
      properties:
        hibernate:
          format_sql: false
      show-sql: false
  logging:
    level:
      root: ERROR
      my.was: DEBUG
  ```

- spring security 작성

  --------------------------------------------------------------------------------
  ```java
  @Configuration @EnableWebSecurity
  public class SecurityConfig {
    @Bean SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
      http.authorizeHttpRequests(
        (authorizeHttpRequests) -> 
          authorizeHttpRequests.requestMatchers(
            new AntPathRequestMatcher("/**"))
          .permitAll()
      )
      .csrf((csrf) -> 
        csrf.ignoringRequestMatchers(new AntPathRequestMatcher("/**"))
      )
      .headers((headers) ->
        headers.addHeaderWriter(new XFrameOptionsHeaderWriter(
          XFrameOptionsHeaderWriter.XFrameOptionsMode.SAMEORIGIN
        ))
      );
      return http.build();
    }
  }
  ```
  --------------------------------------------------------------------------------

- api controller 작성 (post, put, get, delete)

  --------------------------------------------------------------------------------
  ```java
  ```
  --------------------------------------------------------------------------------


- service 작성

  --------------------------------------------------------------------------------
  ```java
  ```
  --------------------------------------------------------------------------------

- repository 작성

  --------------------------------------------------------------------------------
  ```java
  public interface BoardRepository extends JpaRepository<Board, Long> {
    Iterable<Board> findByTitleLike(String search);

    static final String SEARCH_CONDITION = 
      "(:#{#prm.searchType} is not null or true) and " +
      "(:#{#prm.searchType} != '1' or title like %:#{#prm.searchStr}%) and " +
      "(:#{#prm.searchType} != '2' or contents like %:#{#prm.searchStr}%) and " +
      "(:#{#prm.searchType} != '3' or (title like %:#{#prm.searchStr}% or contents like %:#{#prm.searchStr}%)) ";

    @Query(
      "select new Board(id, num, title, userId, '', ctime, utime) from Board " +
      "where " +
      SEARCH_CONDITION +
      "order by ctime desc"
    )
    Iterable<Board> searchContent(@Param("prm") BoardSearch prm);

    @Query( "select count(*) from Board " +
      "where " + SEARCH_CONDITION
    )
    int searchCount(@Param("prm") BoardSearch prm);

    @Query(
      "select count(*) from Board "
    )
    int totalCount(@Param("prm") BoardSearch prm);
  }
  ```
  --------------------------------------------------------------------------------

- ``./gradlew build -x test`` 빌드 수행

## 메뉴구성 (라우팅)

## 로그인 구현

## 게시판 구현

## 기타

- 콘솔에서 객체 보는 방법

- history 객체 다루는 이유 (SPA / back 시 데이터 사라짐 등)

- Pinia 를 이용한 영속저장

- 페이지 라이프 사이클 (onBeforeMount -> onMounted ...)

- 강습에 사용된 프로젝트 파일 추가 (repo 등 제거)

- .gitignore 등 기본 적으로 사용될 파일들 템플릿 제공

- 추천하는 플러그인 

  ``Markdown Preview Enhanced`` : md 문서 뷰어
  ``Mermaid Editor`` : mmd 도형 뷰어
  ``Draw.io Integration`` : 다이어그램 편집기

  --------------------------------------------------------------------------------

--------------------------------------------------------------------------------
- <style> img { border: 1px solid #ccc; } strong { color: #ff5500 !important; } code { font-family: FixedSys, GulimChe } hr { display: none !important; height: 1px !important; } hr+ul:last-child { display: none !important; } </style>