/**
 * @File        : SampleService.java
 * @Author      : 정재백
 * @Since       : 2024-09-12
 * @Description : 샘플 서비스
 * @Site        : https://devlog.ntiple.com
 **/
package my.was.mywas.works.smp;
import static com.ntiple.commons.CryptoUtil.RSA.encrypt;
import static com.ntiple.commons.CryptoUtil.RSA.decrypt;

import java.util.Map;

import org.json.JSONObject;
import org.springframework.stereotype.Service;


import lombok.extern.slf4j.Slf4j;

@Slf4j @Service
public class SampleService {
  public Object smp01001a01() {
    JSONObject ret = new JSONObject();
    return ret.toMap();
  }

  public Object smp01001a02(Map<String, Object> body) throws Exception {
    JSONObject prm = new JSONObject(body);
    JSONObject ret = new JSONObject();
    String prvk = "MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBAIklL0trECmxNh3gBScQAGa5hqILaLXyxFg4VAh6MktDTdZbbvpHeMq4owGF0i1RWgTsudOjcT1Su6Jp+2+bQGEGdjow37qOHPuErQXtDXWxAJmnn8RBTpO/w96DZatzg9fU2Ib0fSGDlXTHaRbvSInCpbEwM5h7efnuKjA11VBXAgMBAAECgYAXeaf4zuC7YjwTLQ90ukZ3TvZ+sllAG8gEGdA4i0Iko+ak9I2whZ9lg+lTD2cEntI72ZGNaoKtroWzrVR+rCJ+uLbSVB8n0JAkrtd1eg/dbxIQNFkaFGpwkC0AtQSpgsLly7HjVQ5MrIAlP63ZiK9JdTBdXyajsLJX+R7Dyll6MQJBAKmPt/ZY0rKj21KirA8T4afW2qMVpMyIRTvbvaW7BU69pxyBwJEY3okwNCE4SK94GebVaXR2B7vANCI64NizBw0CQQDPDw9IgT9nLlZk+PRfYcm729qHotm6Uc8GrY0Iz8nkxrmszIz+/XBTsjV4na1gJ6dNMJHdg7gbR9ZsEm7I9FvzAkBsk7krKGmTNtXErqIa7ZI8FZrff4aN6lzbHbTtITse1tbhrDyRLSmjE5juBMqWggOkCtiCWOpO0Z8QpD9CxDEpAkABYXNTo3D9yiRPVg2jGS7ULtodL2vOPz9nJv8awO/ys5SHX3HNPXljRXvvyvVd/8Ww0RMX7AntPKRkYhcVBfQbAkAfups6liYVJLHON6vcVQTh0G9EaSZWDyFdxn+QVNA1BTgyqyA76VUywkiDviDbjWK1gv3UtiF19aQBlDFsvzcq";
    String pubk = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCJJS9LaxApsTYd4AUnEABmuYaiC2i18sRYOFQIejJLQ03WW276R3jKuKMBhdItUVoE7LnTo3E9Uruiaftvm0BhBnY6MN+6jhz7hK0F7Q11sQCZp5/EQU6Tv8Peg2Wrc4PX1NiG9H0hg5V0x2kW70iJwqWxMDOYe3n57iowNdVQVwIDAQAB";
    String type = prm.optString("typ", "");
    String msg = prm.optString("msg", "");
    String key = prm.optString("key", "");
    String res = "";
    switch (type) {
    case "encprv": {
      if ("".equals(key)) { key = prvk; }
      res = encrypt(0, key, msg);
    } break;
    case "decprv": {
      if ("".equals(key)) { key = prvk; }
      res = decrypt(0, key, msg);
    } break;
    case "encpub": {
      if ("".equals(key)) { key = pubk; }
      res = encrypt(1, key, msg);
    } break;
    case "decpub": {
      if ("".equals(key)) { key = pubk; }
      res = decrypt(1, key, msg);
    } break;
    }
    ret.put("result", res);
    return ret.toMap();
  }
}
