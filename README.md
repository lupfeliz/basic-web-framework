[TOC]

# 강습준비내용

## 절차

### code-server 접속방법

- 최초 비밀번호 수정 및 ``reboot``

- 터미널 workspace 폴더에서 ``screen`` 실행

- 소스제어 에서 git repository 초기화

- 기본적인 MD 문서 조회방법 등 설명 (이후는 이미지 등을 포함한 문서참고)

- .http 활용 (rest client)

- chat-gpt 활용방법 (openai-api 키 발급: ``https://platform.openai.com/account/api-keys``)

- vue(nuxt) ↔ reactjs(next) 변경중점 등

### nuxt 기본 프로젝트 생성 및 실행

- ``npx nuxi init``

- ``npm install``

- ``npx nuxt dev``

- ``git init`` 실행

- vue3 (script-setup) 에서는 this 키워드를 사용할 수 없다.

- nuxt / vite 프로젝트 차이점

  - nuxt 프로젝트 : 

  - vite 프로젝트 : 

### 기본적인 설정 및 프로젝트 레이아웃

- ``ts.shim.d.ts`` 생성 (import 시 빨간줄 제거)

  --------------------------------------------------------------------------------
  ```javascript
  declare module '*.vue' {
    import Vue from 'vue'
    export default Vue
  }
  ```
  --------------------------------------------------------------------------------

- app.vue 삭제

- ``layouts`` ``pages`` ``components/commons`` ``libs/commons`` ``assets`` ``plugins`` 폴더 생성

- ``sass`` ``postcss`` ``autoprefixer`` ``bootstrap`` ``mement`` 등 패키지 설치 (bootstrap-vue 는 기타 이슈로 인해 사용X)

  --------------------------------------------------------------------------------
  ```javascript
  /** nuxt.config.ts 내용추가 */
  css: [
    'bootstrap/dist/css/bootstrap.css',
  ]
  ```
  --------------------------------------------------------------------------------

- ``jquery`` ``jquery-ui`` ``@types/jquery`` ``@types/jqueryui`` 등 패키지 추가 설치

- ``constants.ts`` ``log.ts`` ``api.ts`` ``shared.ts`` ``values.ts`` 생성

  --------------------------------------------------------------------------------
  ```javascript
  /** log.ts */
  const fnnull = (...arg: any[]) => { }
  const fndbug = console.log;
  const fnwarn = console.warn;
  const fnerrr = console.error;
  const log = { trace: fnnull, debug: fndbug, warn: fnwarn, error: fnerrr }
  export { log }
  ```
  --------------------------------------------------------------------------------

- ``pages/index.vue`` ``pages/main/main.vue`` ``components/commons/header`` ``components/commons/footer.vue`` 생성

- ``nuxt.config.ts`` 설정

- ``hmr`` 설정 (clientPort 는 별도 제공 / nginx 로 구동)

  --------------------------------------------------------------------------------
  ```javascript
  vite: {
    server: {
      hmr: {
        path: '/hmr',
        clientPort: Number(String(process.env['VITE_HMR_CLIENT_PORT'] || '24678'))
      },
    }
  },
  ```
  --------------------------------------------------------------------------------

- page route 설정

- 삭제할 파일들

### 기본 페이지 및 컴포넌트 추가

- ``mybutton.vue`` 추가

  --------------------------------------------------------------------------------
  ```html
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
  import * as C from '@/libs/commons/constants'
  import { log } from '@/libs/commons/log'

  const attrs = useAttrs()
  const emit = defineEmits([C.CLICK])

  onMounted(async () => {
  })

  const emitClick = async (e: any) => {
    emit(C.CLICK, e)
  }
  </script>
  ```
  --------------------------------------------------------------------------------

- ``dialog.vue``, ``dialog.ts`` 추가
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
  onMounted(async () => {
    $modal = new s.bootstrap.Modal(modal.value)
    dialog.alert = alert
    dialog.confirm = confirm
  })
  const alert = (msg: String) => {
    return new Promise<boolean>((resolve, reject) => {
      ((c: any) => {
        c.msg = msg
        c.type = 1
        c.resolve = resolve
        c.reject = reject
        log.debug('CTX:', c)
      })(ctx.value)
      $modal.show()
    })
  }
  const confirm = (msg: String) => {
    return new Promise<boolean>((resolve, reject) => {
      ((c: any) => {
        c.msg = msg
        c.type = 2
        c.resolve = resolve
        c.reject = reject
      })(ctx.value)
      $modal.show()
    })
  }
  ... 생략 ...
  </script>
  ```

  --------------------------------------------------------------------------------
  ```javascript
  const dialog = {
    alert: async (msg: String) => new Promise<boolean>(() => { }),
    confirm: async (msg: String) => new Promise<boolean>(() => { })
  }
  export { dialog }
  ```
  --------------------------------------------------------------------------------

### 통신 모듈 준비

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

### 통신 proxy 준비

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

### 데이터 셋팅

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

### was 셋팅 (데이터 흐름 파악을 위해)

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

### 메뉴구성 (라우팅)

### 로그인 구현

### 게시판 구현

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

<style>
<!--
img { border: 1px solid #ccc; }
strong { color: #ff5500 !important; }
code { font-family: FixedSys, GulimChe }
hr { display: none !important; height: 1px !important; }
-->
</style>