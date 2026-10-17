#include <iostream>
#include "crow.h"
#include "MqttClient.h"


int main(int argc, char** argv){
   MqttClient mqttClient("tcp://127.0.0.1:1883", "perun_server");
    mqttClient.connect();

    std::cout << "Press enter to disconnect from mqtt broker..." << std::endl;

    std::cin.get();
    mqttClient.disconnect();


    crow::SimpleApp app;

    CROW_ROUTE(app, "/")([](){
        crow::json::wvalue data;
        data["temperature"] = "21.5";
        data["humidity"] = "60%";
        data["status"] = "OK";
        data["timestamp"] = "2024-06-01T12:00:00Z";
    
        return data;
    });



    app.port(18080).multithreaded().run();

    return 0;
}