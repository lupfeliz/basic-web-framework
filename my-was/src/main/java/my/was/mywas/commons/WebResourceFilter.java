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

@Slf4j
@Component
public class WebResourceFilter extends GenericFilterBean {

  private static Pattern ptn = Pattern.compile("\\/[^.^\\/]+$");

  @Override public void doFilter(ServletRequest sreq, ServletResponse sres, FilterChain chain)
    throws IOException, ServletException {
    HttpServletRequest req = (HttpServletRequest) sreq;
    HttpServletResponse res = (HttpServletResponse) sres;
    File base = null;
    File file = null;
    String uri = req.getRequestURI();
    try {
      URL resroot = this.getClass().getClassLoader().getResource("static");
      base = new File(resroot.getFile());
      file = new File(base, uri);
    } catch (Exception ignore) { }
    if (
      base == null ||
      uri.startsWith("/api/") ||
      uri.startsWith("/_next/") ||
      (file != null && file.exists()) ||
      !ptn.matcher(uri).find()
      ) {
      chain.doFilter(sreq, res);
      return;
    } else {
      if (file != null && !file.exists()) { file = new File(base, cat(uri, ".html")); }
      if (file != null && !file.exists()) { file = new File(base, "index.html"); }
      log.debug("FILTER-URI:{} {}", uri, file);
      if (file != null && file.exists()) {
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
      } else {
        chain.doFilter(sreq, res);
      }
    }
  }
}