#pragma once
#include <cstdlib>
#include <string>
#include <iostream>

namespace Config{
     inline std::string get_db_url(){
        if(getenv("DB_URL")) {
            std::cout << "Using database URL from environment variable: " << getenv("DB_URL") << std::endl;
            return getenv("DB_URL");
        } else {
            std::cout << "Environment variable DB_URL not set. Using default database URL." << std::endl;
            return "postgresql://user:password@localhost:5432/iot_db";
        }
    }

    inline std::string get_mqtt_url(){
        if(getenv("MQTT_URL")) {
            std::cout << "Using MQTT URL from environment variable: " << getenv("MQTT_URL") << std::endl;
            return getenv("MQTT_URL");
        } else {
            std::cout << "Environment variable MQTT_URL not set. Using default MQTT URL." << std::endl;
            return "tcp://localhost:1883";
        }
    }

}
