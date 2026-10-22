#include <iostream>
#include <cstdlib>
#include <string>
#include <thread>
#include <pqxx/pqxx>
#include <nlohmann/json.hpp>

#include "crow.h"
#include "MQTTClient.h"
#include "Config.hpp"
#include "Routes.hpp"

using json = nlohmann::json;

void db_worker(TSQueue<MQTTMessage>& messageQueue) {
    bool running = true;
    while(running){
            try{
                std::string conn_str = Config::get_db_url();
                pqxx::connection conn(conn_str);

                conn.prepare("insert_sensor_data", "INSERT INTO sensor_data (time, topic, temperature, humidity) VALUES (NOW(), $1, $2, $3)");

                while (true) {
                    try {
                    std::optional<MQTTMessage> message = messageQueue.pop();
                    
                    if (!message) {
                        std::cout << "[DB THREAD] Queue is shutting down, exiting db_worker." << std::endl;
                        running = false;
                        break;
                    }

                    std::cout << "[DB THREAD] Processing message from queue: " << message->topic << " - ";
                    
                    pqxx::work txn(conn);
            
                    json payload_json = json::parse(message->payload);
                    double temp = payload_json["temperature"].get<double>();
                    double hum  = payload_json["humidity"].get<double>();
                    
                    txn.exec_prepared("insert_sensor_data", message->topic, temp, hum);
                    txn.commit(); 
                        std::cout << "Inserted into database: " << message->topic << " - " << payload_json.dump() << std::endl;
                    }catch (const json::parse_error& e) {
                        std::cerr << "[DB JSON PARSE ERROR] " << e.what() << std::endl;
                    }catch (const pqxx::sql_error& e) {
                        std::cerr << "[DB SQL ERROR] " << e.what() << std::endl;
                        std::cerr << "Query was: " << e.query() << std::endl;
                    } catch (const std::exception& e) {
                        std::cerr << "[DB ERROR] " << e.what() << std::endl;
                    }
            } 
        }catch (const std::exception& e) {
            std::cerr << "[DB CONNECTION ERROR] " << e.what() << std::endl;
            std::cerr << "Retrying in 5 seconds..." << std::endl;
            std::this_thread::sleep_for(std::chrono::seconds(5));
        }
    }
}

int main(int argc, char** argv){

    TSQueue<MQTTMessage> messageQueue;
    std::thread dbThread(db_worker, std::ref(messageQueue));

    //MQTT Client
    std::string mqtt_url = Config::get_mqtt_url();
    MQTTClient mqttClient(mqtt_url, "perun_server", messageQueue);
    while(true){
        try{
            mqttClient.connect();
            break;
        }catch(const mqtt::exception& e){
            std::cerr << "[MQTT CONNECTION ERROR] " << e.what() << std::endl;
            std::cerr << "Retrying in 5 seconds..." << std::endl;
            std::this_thread::sleep_for(std::chrono::seconds(5));
        }
    }
    mqttClient.subscribe("sensor/temperature", 1);

    //HTTP
    crow::SimpleApp app;
    Routes::setup_http_routes(app);
    app.port(18080).multithreaded().run();


    //SHUTDOWN
    std::cout << "[SERVER] Shutting down..." << std::endl;
    messageQueue.shutdown();
    if(dbThread.joinable()) {
        dbThread.join();
    }


    mqttClient.disconnect();

    return 0;
}