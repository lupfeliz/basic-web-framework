/**
 * @File        : TestUtil.java
 * @Version     : $Rev$
 * @Author      : 정재백
 * @History     : 2024-01-18 최초 작성
 * @Description : 테스트 레벨링 모듈
 **/
package my.was.mywas;

import static com.ntiple.commons.ConvertUtil.EMPTY_CLS;
import static com.ntiple.commons.ConvertUtil.EMPTY_OBJ;
import static com.ntiple.commons.ConvertUtil.capitalize;
import static com.ntiple.commons.ConvertUtil.cast;
import static com.ntiple.commons.ConvertUtil.cat;
import static com.ntiple.commons.ConvertUtil.snakeCase;

import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Parameter;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Proxy;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Id;
import jakarta.persistence.Query;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import lombok.extern.slf4j.Slf4j;
import my.was.mywas.commons.JPAExtender;

@Slf4j
public class TestUtil {
  public static enum TestLevel {
    NONE(0),
    SIMPLE(1),
    DBCON(2),
    API(3),
    FULL(4),
    MANUAL(99);
    
    private final int value;
    TestLevel(int value) { this.value = value; }
    public int value() { return value; }
  }

  public static boolean isEnabled(String testName, TestLevel lvl) {
    boolean ret = false;
    if (lvl == null) { lvl = TestLevel.NONE; }
    String enabled = "";
    try {
      enabled = System.getProperty("build.testlvl");
      if (enabled == null || "".equals(enabled)) { enabled = TestLevel.SIMPLE.name(); }
      TestLevel target = TestLevel.valueOf(enabled);
      if (target.value() >= lvl.value()) { ret = true; }
      log.info("LEVEL CHECK:{} / {}[{}] / {}[{}], {}, {}", testName,
        target, target.value(), lvl, lvl.value(), enabled, ret);
    } catch (Exception ignore) { }
    return ret;
  }

  public static <T> T simpleJpaRepository(EntityManager em, Class<T> rcls) {
    JPAExtender.getInstance(em);
    T repo = cast(
      Proxy.newProxyInstance(rcls.getClassLoader(),new Class[] { rcls },  new InvocationHandler() {
        @Override public Object invoke(Object proxy, Method mtd, Object[] args) throws Throwable {
          Object ret = null;
          // log.debug("INVOKE:{} / {} / {}", mtd.getDeclaringClass(), mtd, args);
          Class<?> pcls = null;
          String mtdName = mtd.getName();
          Map<String, Object> mprm = new LinkedHashMap<>();
          {
            // Class<?> cls = mtd.getDeclaringClass();
            Type[] infs = rcls.getGenericInterfaces();
            if (infs != null && infs.length > 0) {
              for (Type type : infs) {
                ParameterizedType ptype = cast(type, ptype = null);
                if (ptype.getRawType() == JpaRepository.class) {
                  Type[] gtyps = ptype.getActualTypeArguments();
                  if (gtyps != null && gtyps.length > 0) {
                    pcls = cast(gtyps[0], Class.class);
                    // log.debug("CHECK:{}", pcls);
                  }
                }
              }
            }
          }
          {
            Parameter[] prms = mtd.getParameters();
            for (int inx = 0; inx < prms.length; inx++) {
              Parameter prm = prms[inx];
              Annotation[] atyp = prm.getAnnotations();
              if (atyp != null && atyp.length > 0 && (atyp[0].annotationType()).isAssignableFrom(Param.class)) {
                Param panon = cast(atyp[0], panon = null);
                // log.debug("PRM:{} / {} = {}", prm, panon.value(), args[inx]);
                mprm.put(panon.value(), args[inx]);
              } else {
                mprm.put(prm.getName(), args[inx]);
              }
            }
          }
          {
            Query query = null;
            Annotation[] canons = mtd.getAnnotations();
            if (canons != null && canons.length > 0) {
              for (Annotation anon : canons) {
                if (pcls != null && anon instanceof Query) {
                  // Query qanon = cast(anon, qanon = null);
                  String jpakey = cat(pcls.getSimpleName(), ".", mtdName);
                  // log.debug("ANON:{} / {}", jpakey, qanon);
                  query = em.createNamedQuery(jpakey);
                  break;
                }
              }
            } else if (pcls != null) {
              String jpakey = cat(pcls.getSimpleName(), ".", mtdName);
              try {
                query = em.createNamedQuery(jpakey);
              } catch (Exception e) {
                log.debug("NAMED-QUERY NOT FOUND!:{}", jpakey);
              }
            }
            if (query != null) {
              // log.debug("RET-TYPE:{}", mtd.getReturnType().isAssignableFrom(pcls));
              // log.debug("RET-TYPE:{}", mtd.getReturnType().isAssignableFrom(List.class));
              for (String key : mprm.keySet()) { query.setParameter(key, mprm.get(key)); }
              try {
                if (mtd.getReturnType().isAssignableFrom(List.class)) {
                  ret = query.getResultList();
                } else {
                  ret = query.getSingleResult();
                }
              } catch (Exception e) {
                log.debug("EXCEPTION EXECUTE QUERY:{}", e.getMessage());
              }
            } else if ("save".equals(mtdName) && pcls != null) {
              log.debug("SAVE...{}", args[0]);
              StringBuilder queryStr = new StringBuilder();
              // em.setFlushMode(FlushModeType.AUTO); 
              // em.getTransaction().begin();
              // em.persist(args[0]);
              List<String> idls = new ArrayList<>();
              List<String> cols = new ArrayList<>();
              Map<String, Object> vals = new LinkedHashMap<>();
              // List<Object> vals = new ArrayList<>();
              Field[] fields = pcls.getDeclaredFields();
              Method method = null;
              // log.debug("FIELDS:{}{}", "", fields);
              for (Field field : fields) {
                String fname = field.getName();
                Annotation[] fanons = field.getAnnotations();
                for (Annotation anon : fanons) {
                  method = pcls.getMethod(cat("get", capitalize(field.getName())), EMPTY_CLS);
                  if (anon instanceof EmbeddedId || anon instanceof Id) {
                    if (method != null && args != null && args.length > 0) {
                      idls.add(fname);
                      vals.put(fname, method.invoke(args[0], EMPTY_OBJ));
                    }
                  } else if (anon instanceof Column) {
                    if (method != null && args != null && args.length > 0) {
                      cols.add(fname);
                      vals.put(fname, method.invoke(args[0], EMPTY_OBJ));
                    }
                  }
                }
              }
              {
                /** try update */
                log.debug("COLUMNS:{} / {}", cols, vals);
                if (cols.size() > 0) {
                  queryStr = new StringBuilder();
                  queryStr.append("update ")
                    .append(pcls.getSimpleName())
                    .append(" set ");
                  for (int cinx = 0; cinx < cols.size(); cinx++) {
                    String col = cols.get(cinx);
                    if (cinx > 0) { queryStr.append(", "); }
                    queryStr.append(col)
                      .append(" = :")
                      .append(col);
                  }
                  queryStr.append(" where ");
                  for (int cinx = 0; cinx < idls.size(); cinx++) {
                    String col = idls.get(cinx);
                    if (cinx > 0) { queryStr.append("and "); }
                    queryStr.append(col)
                      .append(" = :")
                      .append(col);
                  }
                  log.debug("CHECK:{} / {}", queryStr, vals);
                  query = em.createQuery(String.valueOf(queryStr));
                  for (String key : vals.keySet()) {
                    Object val = vals.get(key);
                    query.setParameter(key, val);
                  }
                  ret = query.executeUpdate();
                }
              }
              {
                /** try insert if not exists */
                if (cols.size() > 0 && Integer.valueOf(0).equals(ret)) {
                  queryStr = new StringBuilder();
                  StringBuilder valusStr = new StringBuilder();
                  queryStr.append("insert into ")
                    .append(pcls.getSimpleName())
                    .append(" ( ");
                  for (int sinx = 0; sinx < 2; sinx++) {
                    List<String> list = null;
                    if (sinx == 0) {
                      list = idls;
                    } else {
                      list = cols;
                    }
                    for (int cinx = 0; cinx < list.size(); cinx++) {
                      String col = list.get(cinx);
                      if (sinx > 0 || cinx > 0) {
                        queryStr.append(", ");
                        valusStr.append(", ");
                      }
                      queryStr.append(col);
                      valusStr.append(":")
                        .append(col);
                    }
                  }
                  queryStr.append(" ) values ( ").append(valusStr).append(")");
                  log.debug("CHECK:{} / {}", queryStr, vals);
                  query = em.createQuery(String.valueOf(queryStr));
                  for (String key : vals.keySet()) {
                    Object val = vals.get(key);
                    query.setParameter(key, val);
                  }
                  ret = query.executeUpdate();
                }
              }
              {
                em.flush();
                em.clear();
                em.getTransaction().commit();
              }
              {
                /** 커밋후 반드시 조회가 이루어져야 persist 된다. */
                queryStr = new StringBuilder();
                queryStr.append("select a from ")
                  .append(pcls.getSimpleName())
                  .append(" a where ")
                  .append("");
                for (int cinx = 0; cinx < idls.size(); cinx++) {
                  String id = idls.get(cinx);
                  if (cinx > 0) { queryStr.append(" and "); }
                  queryStr.append(" ")
                    .append(id).append(" =:").append(id);
                }
                query = em.createQuery(String.valueOf(queryStr));
                for (String id : idls) { query.setParameter(id, vals.get(id)); }
                List<?> list = query.getResultList();
                if (list.size() > 0) {
                  log.debug("LIST:{}", list.get(0));
                  // em.persist(list.get(0));
                }
              }
            } else if ("saveAll".equals(mtdName) && pcls != null) {
              log.debug("SAVEALL...{}", args[0]);
            } else {
              /** FIXME: implement create criteria query */
              log.debug("METHOD:{} / {}", snakeCase(mtdName), pcls);
              /**
               * find_one / find_
               * find_by_[]_and_[]_and[]
               * find_ read_ get_ query_ search_ stream_ exists_
               * count_ delete_ remove_
               * _first _top
               * _is _not _is_not
               * _null _is_null _not_null _is_not_null
               * _true _is_true _false _is_false
               * _and _or
               * _by _containing _contains _is_containing
               * _starts_with _ends_with _not
               * `
               **/
              CriteriaBuilder cb = em.getCriteriaBuilder();
              CriteriaQuery<Object> cq = cb.createQuery();
              Root<?> r = cq.from(pcls);
              cq = cq.select(r);
              /** 오토마타 구성을 위한 token 탐색 */
              String[] tokens = snakeCase(mtdName).toLowerCase().split("_");
              String ctoken = "", ptoken = "";
              LP: for (int inx = 0; inx < tokens.length; inx++) {
                ptoken = ctoken;
                ctoken = tokens[inx];
                log.debug("TOKEN:{}", ctoken, ptoken);
                SW: switch (ctoken) {
                case "": {
                } break SW;
                case "find": case "read": case "get": 
                case "query": case "search": case "stream": {
                } break SW;
                case "exists": case "count": {
                } break SW;
                case "delete": case "remove": {
                } break SW;
                ////////////////////////////////////////////////////////////////////////////////
                case "first": case "top": {
                } break SW;
                case "all": {
                } break SW;
                case "one": {
                } break SW;
                ////////////////////////////////////////////////////////////////////////////////
                case "by": {
                } break SW;
                ////////////////////////////////////////////////////////////////////////////////
                case "is": {
                } break SW;
                case "true": {
                } break SW;
                case "false": {
                } break SW;
                case "equal": {
                } break SW;
                case "greater": {
                } break SW;
                case "less": {
                } break SW;
                case "than": {
                } break SW;
                case "between": {
                } break SW;
                case "not": {
                } break SW;
                case "null": {
                } break SW;
                case "starting": case "starts": {
                } break SW;
                case "ending": case "ends": {
                } break SW;
                case "containing": case "contains": case "like": {
                } break SW;
                ////////////////////////////////////////////////////////////////////////////////
                case "and": {
                } break SW;
                case "or": {
                } break SW;
                default: {
                  /** 복합명사칼럼, 숫자 등 처리 */
                } break SW;
                } 
                continue LP;
              }
              /**
               * TODO: 생성된 Query 는 매번 다시 parsing 할 필요 없이 emf 에 저장한다.
               **/
              cq = cq.where(cb.equal(r.get("oid"), "12345678"));
              ret = em.createQuery(cq).getResultList();
            }
          }
          return ret;
        }
      }), repo = null);
    return repo;
  }
}