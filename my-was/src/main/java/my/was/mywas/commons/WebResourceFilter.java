package my.was.mywas.commons;

import static com.ntiple.commons.Constants.CHARSET;
import static com.ntiple.commons.Constants.CTYPE_HTML;
import static com.ntiple.commons.Constants.UTF8;
import static com.ntiple.commons.ConvertUtil.cat;
import static com.ntiple.commons.IOUtils.istream;
import static com.ntiple.commons.IOUtils.passthrough;
import static com.ntiple.commons.IOUtils.safeclose;
import static org.springframework.http.HttpMethod.GET;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.GenericFilterBean;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletResponseWrapper;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class WebResourceFilter extends GenericFilterBean {
  @Override public void doFilter(ServletRequest sreq, ServletResponse sres, FilterChain chain)
    throws IOException, ServletException {
    HttpServletRequest req = (HttpServletRequest) sreq;
    HttpServletResponse res = (HttpServletResponse) sres;
    ResponseWrap wres = new ResponseWrap(req, res);
    File base = null;
    File file = null;
    String uri = req.getRequestURI();
    try {
      URL resroot = this.getClass().getClassLoader().getResource("static");
      base = new File(resroot.getFile());
      file = new File(base, uri);
    } catch (Exception ignore) { }
    if (base == null || uri.startsWith("/api/")) {
      chain.doFilter(sreq, wres);
      return;
    } else {
      if (file != null && !file.exists()) { file = new File(base, cat(uri, ".html")); }
      if (file != null && !file.exists()) { file = new File(base, "index.html"); }
      log.debug("FILTER-URI:{} {}", uri, file);
      // chain.doFilter(sreq, wres);
      // if (Integer.valueOf(404).equals(req.getAttribute("STAT_CODE"))) {
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
      // }
    }
  }

  static class ResponseWrap extends HttpServletResponseWrapper {
    // extends HttpResponseAdopter
    HttpServletRequest req;
    public ResponseWrap(HttpServletRequest req, HttpServletResponse res) {
      super(res);
      this.req = req;
    }
    @Override public void sendError(int sc, String msg) throws IOException {
      if (sc == 404 && GET.name().equals(req.getMethod())) {
        req.setAttribute("STAT_CODE", sc);
      } else {
        super.sendError(sc, msg);
      }
    }
  }
}

