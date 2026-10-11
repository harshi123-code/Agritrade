package com.agritrade.config;

import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MongoLazyConfiguration {
    @Bean
    static BeanFactoryPostProcessor lazyMongoInfrastructure() {
        return beanFactory -> {
            for (String beanName : beanFactory.getBeanDefinitionNames()) {
                if (beanName.equals("mongo") || beanName.startsWith("mongo")
                        || beanName.startsWith("mappingMongo") || beanName.startsWith("gridFs")) {
                    beanFactory.getBeanDefinition(beanName).setLazyInit(true);
                }
            }
        };
    }
}
