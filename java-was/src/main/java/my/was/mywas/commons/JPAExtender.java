/**
 * @File        : OrderRepository.java
 * @Version     : $Rev$
 * @Author      : 정재백
 * @History     : 2024-01-14 최초 작성
 * @Description : JPA 에서 임의 질의를 사용할 수있도록 해주는 클래스
 **/
package my.was.mywas.commons;

import static com.ntiple.commons.ConvertUtil.cat;
import static com.ntiple.commons.ConvertUtil.parseStr;

import java.io.File;
import java.io.FileFilter;
import java.util.LinkedHashMap;
import java.util.Map;

import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;

import org.springframework.stereotype.Repository;
import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import lombok.extern.slf4j.Slf4j;

@Slf4j @Repository
public class JPAExtender {
  private static JPAExtender instance;
  private Map<String, String> quries;
  @PersistenceContext private EntityManager em;
  @PostConstruct public void init() {
    instance = this;
    try {
      SAXParserFactory spf = SAXParserFactory.newInstance();
      spf.setNamespaceAware(true);
      instance.quries = new LinkedHashMap<>();
      final SAXParser parser = spf.newSAXParser();
      final OrmXmlHandler handler = new OrmXmlHandler(instance.quries);
      File ormDir = new File(JPAExtender.class.getClassLoader()
        .getResource("mappings").getFile());
      if (ormDir.exists()) {
        ormDir.listFiles(new FileFilter() {
          @Override public boolean accept(File file) {
            try {
              log.debug("PARSING:{}", file.getAbsolutePath());
              parser.parse(file, handler);
            } catch (Exception e) {
              log.error("ERROR:{}", e.getMessage());
            }
            return false;
          }
        });
        log.debug("CHECK:{}", instance.quries.keySet());
      }
    } catch (Exception e) {
      log.debug("ERROR:{}", e.getMessage());
    }
  }
  public static JPAExtender getInstance(EntityManager em) {
    JPAExtender ret = instance;
    if (ret == null) {
      ret = new JPAExtender();
      ret.em = em;
      ret.init();
      instance = ret;
    }
    return ret;
  }
  public static JPAExtender getInstance() { return instance; }
  public Query sql(String sql) throws Exception {
    return em.createNativeQuery(sql);
  }
  public Query query(String jpql) throws Exception {
    return em.createQuery(jpql);
  }
  public Query namedQuery(String name) throws Exception {
    return em.createQuery(quries.get(name));
  }

  public static class OrmXmlHandler extends DefaultHandler {
    Map<String, Object> ctx;
    Map<String, String> queries;
    public OrmXmlHandler(Map<String, String> queries) {
      ctx = new LinkedHashMap<>();
      this.queries = queries;
    }
    @Override public void startElement (String uri, String localName,
      String qName, Attributes attributes) throws SAXException {
      switch (localName) {
      case "named-query": case "named-native-query": {
        for (int inx = 0; inx < attributes.getLength(); inx++) {
          if ("name".equals(attributes.getLocalName(inx))) {
            // log.debug("CHECK:{} / {} / {}", localName, attributes.getValue(inx));
            ctx.put("name", attributes.getValue(inx));
          }
        }
      } break;
      case "query": {
        ctx.put("tag", localName);
        ctx.put("text", "");
      }
      }
    }
    @Override public void endElement (String uri, String localName,
      String qName) throws SAXException {
      switch (localName) {
      case "named-query": case "named-native-query": {
        // log.debug("END-ELEM:{}", localName);
        // log.debug("END-ELEM:{} / {}", ctx.get("name"), ctx.get("text"));
        queries.put(parseStr(ctx.get("name"), ""), parseStr(ctx.get("text"), ""));
        ctx.put("name", "");
        ctx.put("text", "");
      } break;
      case "query": {
        // log.debug("END-ELEM:{} / {}", localName, ctx.get("text"));
      } break;
      }
    }

    @Override public void characters (char ch[], int start, int length) throws SAXException {
      // log.debug("CHARS:{}{} / {}", "", ctx.get("tag"), String.valueOf(ch, start, length));
      switch (parseStr(ctx.get("tag"), "")) {
      case "query": {
        ctx.put("text", cat(ctx.get("text"), String.valueOf(ch, start, length)));
      } break;
      }
    }
  }
}