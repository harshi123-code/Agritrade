package com.agritrade;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
		"spring.datasource.url=jdbc:h2:mem:agritrade-test",
		"spring.datasource.driver-class-name=org.h2.Driver",
		"spring.datasource.username=root",
		"spring.datasource.password=test-password",
		"spring.jpa.hibernate.ddl-auto=create-drop",
})
class AgriTradeApplicationTests {

	@Test
	void contextLoads() {
	}

}
