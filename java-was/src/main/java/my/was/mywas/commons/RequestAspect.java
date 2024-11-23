/**
 * @File        : RequestAspect.java
 * @Author      : 정재백
 * @Since       : 2024-10-29
 * @Description : 공통적으로 사용할 Aspect, 인증 및 오류처리 등에 관련된 사항들을 처리한다.
 * @Site        : https://devlog.ntiple.com
 **/
package my.was.mywas.commons;

import static com.ntiple.commons.ReflectionUtil.cast;
import static com.ntiple.commons.StringUtil.cat;
import static com.ntiple.commons.WebUtil.curRequest;
import static com.ntiple.commons.WebUtil.remoteAddr;
import static my.was.mywas.works.cmn.CommonService.secureOut;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import my.was.mywas.commons.CommonEntity.AuthResult;
import my.was.mywas.commons.CommonEntity.InitObj;

@Component @Aspect @Slf4j
public class RequestAspect {
  @Pointcut("@annotation(org.springframework.web.bind.annotation.GetMapping)")
  public void getMapPointcut() { }
  @Pointcut("@annotation(org.springframework.web.bind.annotation.PostMapping)")
  public void postMapPointcut() { }
  @Pointcut("@annotation(org.springframework.web.bind.annotation.PutMapping)")
  public void putMapPointcut() { }
  @Pointcut("@annotation(org.springframework.web.bind.annotation.PatchMapping)")
  public void patchMapPointcut() { }
  @Pointcut("@annotation(org.springframework.web.bind.annotation.DeleteMapping)")
  public void delMapPointcut() { }
  @Pointcut("@annotation(org.springframework.web.bind.annotation.RequestMapping)")
  public void reqMapPointcut() { }

  @Autowired SystemSettings settings;

  private static final Pattern PTN_WORK = Pattern.compile("^[/][a-z]{3}[/](?<cate>[a-z]{3})(?<wkno>[0-9]{2}[0-9]{3})(?<rqty>[a-z])(?<stno>[0-9]{2})$");

  @Around("(execution(* my.was.mywas.works.*.*(..))) && (getMapPointcut() || postMapPointcut() || putMapPointcut() || patchMapPointcut() || delMapPointcut() || reqMapPointcut())")
  public Object aroundAdvice(ProceedingJoinPoint joint) throws Throwable {
    HttpHeaders hdrs = new HttpHeaders();
    HttpStatus status = HttpStatus.OK;
    Object res = null;
    try {
      HttpServletRequest req = curRequest(HttpServletRequest.class);
      String ipaddr = remoteAddr(req);
      String uri = req.getRequestURI();
      String cbase = req.getContextPath();
      if (cbase.length () > 0 && uri.startsWith(cbase) && !uri.equals(cbase)) { uri = cat(uri.substring(req.getContextPath().length())); }
      Matcher mat = null;
      String cate = "", wkno = "", rqty = "", stno = "";
      if ((mat = PTN_WORK.matcher(uri)) != null && mat.find()) {
        req.setAttribute("category", cate = mat.group("cate"));
        req.setAttribute("worknumber", wkno = mat.group("wkno"));
        req.setAttribute("reqtype", rqty = mat.group("rqty"));
        req.setAttribute("stepnumber", stno = mat.group("stno"));
        // if (ret == null || "".equals(ret)) { ret = cat("/", cate, wkno, rqty, stno); }
      }
      log.debug("BEFORE:{} / {}", uri, joint.toShortString());
      try {
        res = joint.proceed();
      } catch (Exception e) {
        log.debug("E:", e);
      }
      log.debug("AFTER:{} / {} / {} / {}", uri, joint.toShortString(), res);
      if (res instanceof String) {
      } else if (res instanceof AuthResult) {
      } else if (res instanceof InitObj) {
      }
    } catch (Exception e) {
      log.debug("E:", e);
    }
    return res;
    // ResponseEntity<?> ret = cast(new ResponseEntity<>(secureOut(res), hdrs, status), ret = null);
    // log.debug("RESULT-OK:{}", hdrs);
    // return ret;
  }
}
