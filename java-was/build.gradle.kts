/**
 * @File        : build.gradle.kts
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : gradle 빌드파일
 * @Site        : https://devlog.ntiple.com
 *
 * 다음과 같이 실행 및 빌드를 수행한다.
 *
 * 실행 (local)
 * > gradlew bootRun -Dspring.profiles.active=local
 *
 * 빌드 (dev)
 * > gradlew build -Dspring.profiles.active=dev
 * 
 * 테스트
 * sh gradlew cleanTest test -Dbuild.testlvl=MANUAL -i --no-watch-fs --tests "my.was.mywas.SimpleTest.testCrypto"  > test.log
 **/

import java.util.*
import java.io.*

plugins {
  id("java")
  id("war")
  /** spring 관련 */
  id("org.springframework.boot") version "3.2.4"
  id("io.spring.dependency-management") version "1.1.4"
  id("io.freefair.lombok") version "8.1.0"
}

group = "my.was"
version = "0.0.1"

java {
  sourceCompatibility = JavaVersion.VERSION_17
  targetCompatibility = JavaVersion.VERSION_17
}

configurations {
  compileOnly {
    extendsFrom(configurations.annotationProcessor.get())
  }

  all {
    exclude("commons-logging:commons-logging")
    exclude("org.apache.tomcat.embed:tomcat-embed-el")
    exclude("org.apache.tomcat.embed:tomcat-embed-websocket")
  }
}

var PROFILE = System.getenv("PROFILE")
var NEXUS_REPO = System.getenv("NEXUS_REPO")
var CURRENT_DIR = System.getProperty("user.dir")
var DOTENV = Properties()

var ENVFILE = File(CURRENT_DIR + "/.env")
if (ENVFILE.exists()) {
  DOTENV.load(ENVFILE.inputStream())
  var profile = DOTENV.getProperty("PROFILE")
  var nexusRepo = DOTENV.getProperty("NEXUS_REPO")
  if (profile != null && !"".equals(profile)) { PROFILE = profile }
  if (nexusRepo != null && !"".equals(nexusRepo)) { NEXUS_REPO = nexusRepo }
}

if (System.getProperty("spring.profiles.active") != null) {
  var profile = System.getProperty("spring.profiles.active")
  if (profile != null && !"".equals(profile)) { PROFILE = profile }
}
if (PROFILE == null || "".equals(PROFILE)) { PROFILE = "local" }

// println("PROFILE:" + PROFILE)
// println("NEXUS_REPO:" + NEXUS_REPO)

/**
 * 아래와 같이 넥서스 저장소 주소를 환경변수에 저장할 수 있다.
 * export NEXUS_REPO=http://192.168.0.2:8081/repository/maven-public/
 **/
repositories {
  maven(url = "https://repo.spring.io/milestone")
  if (NEXUS_REPO == null || "".equals(NEXUS_REPO)) {
    println("USE MAVEN CENTRAL REPOSITORY")
    mavenCentral()
    maven(url = "https://repo.spring.io/milestone")
  } else {
    println("USE NEXUS REPOSITORY : " + NEXUS_REPO)
    maven(url = NEXUS_REPO).isAllowInsecureProtocol = true
  }
}

dependencies {
  /** lombok 관련 */
  compileOnly("org.projectlombok:lombok")
  annotationProcessor("org.projectlombok:lombok")

  /** spring 베이스 */
  implementation("org.springframework.boot:spring-boot-starter-web")
  implementation("org.springframework.boot:spring-boot-starter-data-jpa")
  implementation("org.springframework.boot:spring-boot-starter-security")

  providedRuntime("org.springframework.boot:spring-boot-starter-tomcat")

  /** 기타 필요사항들 */
  implementation("commons-codec:commons-codec:1.15")
  implementation("com.ntiple:ntiple-utils:0.0.3-1")
  implementation("javax.validation:validation-api:2.0.1.Final")
  implementation("org.apache.httpcomponents:httpclient:4.5.14")
  implementation("org.apache.httpcomponents:httpmime:4.5.14")

  /** OpenAPI (swagger) */
  implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.2.0")

  /** 런타임 및 개발관련 */
  developmentOnly("org.springframework.boot:spring-boot-devtools")
  developmentOnly("org.springframework.boot:spring-boot-starter-tomcat")
  runtimeOnly("com.h2database:h2")

  /** jwt */
  implementation("io.jsonwebtoken:jjwt-api:0.11.5")
  runtimeOnly("io.jsonwebtoken:jjwt-impl:0.11.5")
  runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.11.5")
  /** yml, json */
  implementation("org.yaml:snakeyaml:2.2")
  implementation("org.json:json:20230618")
  /** 이메일 */
  implementation("com.sun.mail:jakarta.mail:2.0.1")
  /** 로그 */
  implementation("org.logback-extensions:logback-ext-spring:0.1.5")
  /** 기타 libs 폴더에 있는 jar 파일들 */
  implementation (fileTree(mapOf("dir" to "libs", "include" to listOf("*.jar"))))

  /** 테스트관련 */
  testCompileOnly("org.projectlombok:lombok")
  testAnnotationProcessor("org.projectlombok:lombok")
  testImplementation("org.springframework.boot:spring-boot-starter-test")
}

task("prebuildHook") {
  dependsOn(tasks.named("build"))
  dependsOn(tasks.named("bootRun"))
}

tasks {
  named<Test>("test") {
    var testlvl = System.getProperty("build.testlvl")
    if (testlvl == null || "".equals(testlvl)) { testlvl = "SIMPLE" }
    systemProperty("build.testlvl", testlvl)
    useJUnitPlatform()
  }
  named<JavaExec>("bootRun") {
    systemProperty("spring.profiles.active", PROFILE)
    println("================================================================================")
    println("데모 API")
    println("PROFILE:" + PROFILE)
    println("================================================================================")
  }
}
