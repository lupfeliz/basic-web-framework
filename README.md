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

- 기본 폴더구조
--------------------------------------------------------------------------------
```yaml
+ ROOT
  # 공통으로 사용하는 함수(메소드) 등 모음
  + libs
  # 공통으로 사용하는 컴포넌트 (버튼, 입력박스, 폼) 등 모음
  + components
  # Nuxt Layout (Nuxt 예약 폴더)
  + layout
  # Nuxt 경로 Routing (Nuxt 예약 폴더)
  + pages
  # webpack 등에 의해 변형되지 않고 사용되는 리소스 (css, js, image, html..)
  + public
  # 모듈에서 사용하는 리소스 (css, js, image, html..)
  + assets
  # 스토어
  + store
```
--------------------------------------------------------------------------------

- `ts.shim.d.ts` 생성 (`import` 시 빨간줄 제거)

--------------------------------------------------------------------------------
```javascript
/** /ts.shims.d.ts */
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
/** /nuxt.config.ts */
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

- 아래 파일들을 추가한다.

--------------------------------------------------------------------------------
```html
<!-- /pages/index.vue -->
<template>
  <div>
    메인 페이지 본문 내용
  <div>
</template>
<script setup lang="ts">
</script>
```

```html
<!-- /layouts/default.vue -->
<template>
  <main>
    <div>
      <!-- 머리글 -->
      <Header></Header>
      <!-- 본문 (경로페이지) -->
      <slot></slot>
      <!-- 꼬리글 -->
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
<!-- /components/commons/header.vue -->
<template>
  <header>
    머리글
  </header>
</template>
<script setup lang="ts">
</script>
```

```html
<!-- /components/commons/footer.vue -->
<template>
  <footer>
    꼬리글
  </footer>
</template>
<script setup lang="ts">
</script>
```
--------------------------------------------------------------------------------

- `mybutton.vue` 추가 / 페이지 추가 후 alert 이벤트 발생 테스트 ( 이후 myinput, myeditor, myform 추가)

--------------------------------------------------------------------------------
```html
<!-- /components/commons/mybutton.vue -->
<template>
  <button
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
/** /libs/commons/constants.ts */
... 생략 ...
export const UPDATE_MODEL_VALUE = 'update:modelValue'
export const CLICK = 'click'
export const KEYUP = 'keyup'
export const ALERT = 'alert'
export const CONFIRM = 'confirm'

export const JSONV = 'json'
export const UTF8 = 'utf-8'
... 생략 ...
```

```javascript
/** /libs/commons/log.ts */
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

- Prmoise.resolve / async-await 기능 중점으로 설명

> Modal 컴포넌트 참고 : https://getbootstrap.com/docs/5.0/components/modal/

--------------------------------------------------------------------------------
```javascript
/** /libs/commons/dialog.ts */
const dialog = {
  alert: (msg: string) => new Promise<boolean>((resolve) => { }),
  confirm: (msg: string) => new Promise<boolean>((resolve) => { })
}
export { dialog }
```
```html
<!-- /components/commons/dialog.vue -->
<template>
  <div
    ref="modalElement"
    class="modal fade"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    aria-labelledby="staticBackdropLabel"
    aria-hidden="true"
    tabindex="-1"
    >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body">
          <p v-html="ctx.current?.msg"></p>
          <div class="text-center">
            <template v-if="ctx.current?.type === C.ALERT">
              <MyButton class="btn btn-primary mx-1" @click="click(1)">확인</MyButton>
            </template>
            <template v-if="ctx.current?.type === C.CONFIRM">
              <MyButton class="btn btn-primary mx-1" @click="click(1)">확인</MyButton>
              <MyButton class="btn btn-secondary mx-1" @click="click(2)">취소</MyButton>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import * as C from '@/libs/commons/constants'
import { log } from '@/libs/commons/log'
import { dialog } from '@/libs/commons/dialog'
import MyButton from '@/components/commons/mybutton.vue'
const modalElement = ref()
/** 대화창 상태저장소 */
const ctx = ref({
  element: {} as any as Element,
  instance: {} as any,
  current: {} as any,
  bootstrap: undefined as any
})
/** modalElement DOM 이 활성화 될때까지 대기 */
watch(modalElement, async () => {
  const bootstrap = await import('bootstrap')
  ctx.value.element = modalElement.value
  ctx.value.instance = new bootstrap.Modal(modalElement.value)
  dialog.alert = alert
  dialog.confirm = confirm
})
/** modal을 경고창 형태로 활성화(Promise.resolve 저장후 대기) */
const alert = (msg: String) => {
  return new Promise<boolean>((resolve) => {
    ((c: any) => { c.msg = msg; c.type = C.ALERT; c.resolve = resolve })(ctx.value.current)
    ctx.value.instance.show()
  })
}
/** modal을 선택창 형태로 활성화(Promise.resolve 저장후 대기) */
const confirm = (msg: String) => {
  return new Promise<boolean>((resolve) => {
    ((c: any) => { c.msg = msg; c.type = C.CONFIRM; c.resolve = resolve })(ctx.value.current)
    ctx.value.instance.show()
  })
}
/** 상태저장소에 저장된 Promise.resolve 를 수행하여 Promise 대기상태 해제 후 modal 해제 */
const click = async (cmd: any) => {
  switch (ctx.value.current.type) {
  case C.ALERT: if (ctx.value.current.resolve) { ctx.value.current.resolve(true) } break
  case C.CONFIRM: if (ctx.value.current.resolve) { ctx.value.current.resolve(cmd === 1 ? true : false) } break
  }
  ctx.value.current = {}
  ctx.value.instance.hide()
}
</script>
```
--------------------------------------------------------------------------------

## 스타일정리 (1차)

- Bootstrap Containers

  > https://getbootstrap.com/docs/5.1/layout/containers/

- Header Jumbotron ( Bootstrap )

  > https://www.w3schools.com/bootstrap5/bootstrap_jumbotron.php



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