/**
 * @File        : WebResourceFilter.java 
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : SPA 용 웹 필터
 * @Site        : https://devlog.ntiple.com
 **/
package my.was.mywas.commons;

import static com.ntiple.commons.Constants.CHARSET;
import static com.ntiple.commons.Constants.CTYPE_HTML;
import static com.ntiple.commons.Constants.UTF8;
import static com.ntiple.commons.ConvertUtil.cast;
import static com.ntiple.commons.ConvertUtil.cat;
import static com.ntiple.commons.IOUtils.passthrough;
import static com.ntiple.commons.IOUtils.safeclose;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.GenericFilterBean;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j @Component
public class WebResourceFilter extends GenericFilterBean {

  /** 확장자를 가진 URI 인지 판단 */
  private static Pattern PTN_HAS_EXT = Pattern.compile("\\/[^.^\\/]+$");
  /** 동적 라우팅을 사용하고 있는 페이지들 */
  private static Pattern PTN_ATC = Pattern.compile("^(.*/atc/atc01001s(02|03|04))/[^/]+/?$");

  @Override public void doFilter(ServletRequest sreq, ServletResponse sres, FilterChain chain)
    throws IOException, ServletException {
    HttpServletRequest req = (HttpServletRequest) sreq;
    HttpServletResponse res = (HttpServletResponse) sres;
    // File base = null;
    // File file = null;
    InputStream istream = null;
    String uri = req.getRequestURI();
    Matcher mat = null;
    if (
      /** 필터링 하지 않을 URI 경로들 (그대로 출력) */
      uri.startsWith("/api/") ||
      uri.startsWith("/_next/") ||
      uri.startsWith("/_nuxt/") ||
      ((istream = getContent(uri)) != null) ||
      !PTN_HAS_EXT.matcher(uri).find()
      ) {
      safeclose(istream);
      chain.doFilter(sreq, res);
      return;
    } else if (
      /** 동적 라우팅 페이지들 은 해당 페이지.html 로 변경 출력 */
      (mat = PTN_ATC.matcher(uri)).find() &&
      (istream = getContent(cat(mat.group(1), ".html"))) != null) {
      writeStream(res, istream);
    } else {
      /** 파일이 없는 페이지 요청은 /index.html 출력 */
      if (istream == null) { istream = getContent(cat(uri, ".html")); }
      if (istream == null) { istream = getContent(cat("index.html")); }
      if (istream != null) {
        writeStream(res, istream);
        safeclose(istream);
      } else {
        chain.doFilter(sreq, res);
      }
    }
  }

  public InputStream getContent(String path) {
    InputStream ret = null;
    try {
      /** /src/main/resources/static 폴더위치 */
      URL url = this.getClass().getClassLoader().getResource(cat("static/", path));
      if (url != null) { ret = cast(url.getContent(), ret); }
    } catch (Exception ignore) { }
    return ret;
  }

  /** 파일출력 메소드 */
  public static void writeStream(HttpServletResponse res, InputStream file) {
    InputStream istream = null;
    OutputStream ostream = null;
    try {
      if (file != null) {
        res.setContentType(cat(CTYPE_HTML, "; ", CHARSET, "=", UTF8));
        istream = file;
        ostream = res.getOutputStream();
        passthrough(istream, ostream);
        ostream.flush();
      }
    } catch (Exception e) {
      log.debug("E:{}", e.getMessage());
    } finally {
      safeclose(istream);
      safeclose(ostream);
    }
  }
}