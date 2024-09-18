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
import static com.ntiple.commons.ConvertUtil.cat;
import static com.ntiple.commons.IOUtils.istream;
import static com.ntiple.commons.IOUtils.passthrough;
import static com.ntiple.commons.IOUtils.safeclose;

import java.io.File;
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
    File base = null;
    File file = null;
    String uri = req.getRequestURI();
    Matcher mat = null;
    try {
      /** /src/main/resources/static 폴더위치 */
      URL resroot = this.getClass().getClassLoader().getResource("static");
      base = new File(resroot.getFile());
      file = new File(base, uri);
    } catch (Exception ignore) { }
    if (
      /** 필터링 하지 않을 URI 경로들 (그대로 출력) */
      base == null ||
      uri.startsWith("/api/") ||
      uri.startsWith("/_next/") ||
      (file != null && file.exists()) ||
      !PTN_HAS_EXT.matcher(uri).find()
      ) {
      chain.doFilter(sreq, res);
      return;
    } else if (
      /** 동적 라우팅 페이지들 은 해당 페이지.html 로 변경 출력 */
      (mat = PTN_ATC.matcher(uri)).find() &&
      (file = new File(base, cat(mat.group(1), ".html"))) != null && file.exists()
    ) {
      writeStream(res, file);
    } else {
      /** 파일이 없는 페이지 요청은 /index.html 출력 */
      if (file != null && !file.exists()) { file = new File(base, cat(uri, ".html")); }
      if (file != null && !file.exists()) { file = new File(base, "index.html"); }
      log.debug("FILTER-URI:{} {}", uri, file);
      if (file != null && file.exists()) {
        writeStream(res, file);
      } else {
        chain.doFilter(sreq, res);
      }
    }
  }

  /** 파일출력 메소드 */
  public static void writeStream(HttpServletResponse res, File file) {
    InputStream istream = null;
    OutputStream ostream = null;
    try {
      if (file != null) {
        res.setContentType(cat(CTYPE_HTML, "; ", CHARSET, "=", UTF8));
        res.setContentLength((int) file.length());
        istream = istream(file);
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