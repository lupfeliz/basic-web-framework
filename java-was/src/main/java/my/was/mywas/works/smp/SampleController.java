/**
 * @File        : SampleController.java
 * @Author      : 정재백
 * @Since       : 2024-09-12
 * @Description : 샘플 컨트롤러
 * @Site        : https://devlog.ntiple.com
 **/
package my.was.mywas.works.smp;

import static my.was.mywas.commons.RestResponse.response;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;

@Slf4j @RestController
@RequestMapping("/api/smp")
public class SampleController {
  static final String CONTROLLER_TAG = "샘플 API"; 
  
  @Autowired SampleService service;

  @PostConstruct public void init() {
    log.trace("INIT:{}", SampleController.class);
  }

  @Operation(summary = "샘플1 (smp01001a01)", tags = { CONTROLLER_TAG })
  @GetMapping("/smp01001")
  public ResponseEntity<Object> smp01001a01() {
    return response(() -> service.smp01001a01());
  }

  @Operation(summary = "샘플2 (smp01001a02)", tags = { CONTROLLER_TAG })
  @PostMapping("/smp01001")
  public ResponseEntity<Object> smp01001a02(@RequestBody Map<String, Object> body) {
    return response(() -> service.smp01001a02(body));
  }
}
