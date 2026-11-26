#pragma once

#include "crow.h"

namespace Routes{
    inline void setup_http_routes(crow::SimpleApp& app, MQTTClient& mqtt_client){
        
        //GET: /api/temperatures - GET ALL TEMPERATURES 
        CROW_ROUTE(app, "/api/temperatures")([](){
            try{
              pqxx::connection conn(Config::get_db_url());
              pqxx::work txn(conn);

              pqxx::result results = txn.exec("SELECT * FROM sensor_data ORDER BY time DESC LIMIT 10");

              nlohmann::json j = nlohmann::json::array();

              for(auto row :  results){
                  j.push_back({
                      {"time", row["time"].as<std::string>()},
                      {"topic", row["topic"].as<std::string>()},
                      {"temperature", row["temperature"].as<double>()},
                      {"humidity", row["humidity"].as<double>()}
                  });
              }

              auto res = crow::response(j.dump());
              res.add_header("Content-Type", "application/json");
              return res;
            }catch(const std::exception& e){
                return crow::response(500, std::string("ERROR | Database error when fetching records"));
            }
        });

    

        //POST: /api/temperature/measure - FORCE MEASURE WHEN ENTERING DASHBOARD
        CROW_ROUTE(app, "/api/temperatures/measure").methods(crow::HTTPMethod::POST)([&mqtt_client](crow::request req) {
            try{
                mqtt_client.publish("sensor/temperature/measure", "MEASURE");
                return crow::response(202, "measurement triggered");
            }catch(const std::exception& e){
                return crow::response(500, std::string("ERROR | Measurement failed."));
            }
        });


        //GET: /api/light/state - GET LIGHT STRIP STATE ON/OFF
        CROW_ROUTE(app, "/api/light/state")([&mqtt_client](){
            try{
                mqtt_client.publish("light/state", "STATE");
                return crow::response(200, std::string("Light switched."));
            }catch(const std::exception& e){
                return crow::response(500, std::string("ERROR | Failed to get light status."));
            }
        });

        //GET /api/light - GET LIGHT STATUSES FOR LOG
        CROW_ROUTE(app, "/api/light")([](){
            try{
                pqxx::connection conn(Config::get_db_url());
                pqxx::work txn(conn);
                    
                pqxx::result results = txn.exec("SELECT * from light_log ORDER BY time DESC");
                nlohmann::json j = nlohmann::json::array();

                for(const auto& row : results){
                    j.push_back({
                        {"time", row["time"].as<std::string>()},
                        {"state", row["state"].as<std::string>()}
                    });
                }

                auto res = crow::response(j.dump());
                res.add_header("Content-type", "application/json");

                return res;
            }catch(const std::exception& e){
                return crow::response(500, std::string("ERROR | Failed to fetch light logs."));
            }
        });

        //POST: /api/light - SWITCH LIGHT STATE OFF/ON AND SAVE LOG
        CROW_ROUTE(app, "/api/light").methods(crow::HTTPMethod::POST)([&mqtt_client](crow::request req){
            try{
                pqxx::connection conn(Config::get_db_url());
                pqxx::work txn(conn);

                conn.prepare("insert_light_log", "INSERT INTO light_log (time, state) VALUES (NOW(), $1)");

                nlohmann::json body = nlohmann::json::parse(req.body);

                std::string result_state = body["state"].get<std::string>() == "set_off" ? "OFF" : "ON";
                std::string light_type = body["type"].get<std::string>();
                std::string r_color = body["R"].get<std::string>();
                std::string g_color = body["G"].get<std::string>();
                std::string b_color = body["B"].get<std::string>();

                std::cout << "LIGHT SWITCH | State: " << result_state << "\tType: " << light_type << std::endl;
                std::cout << "R: " << r_color << " G: " << g_color << " B: " <<  b_color << std::endl;


                
                //Send pure string
                //mqtt_client.publish("/light/switch", "MSG: " + result_state + " TYPE: " + light_type);
                
                //Send json
                mqtt_client.publish_json("/light/switch", body);


                txn.exec_prepared("insert_light_log", result_state);
                txn.commit();

                crow::response res = crow::response(200,"light switched");
                return res;
            }catch (const nlohmann::json::parse_error& e) {
                std::cerr << "[DB JSON PARSE ERROR] " << e.what() << std::endl;
            }catch (const pqxx::sql_error& e) {
                std::cerr << "[DB SQL ERROR] " << e.what() << std::endl;
                std::cerr << "Query was: " << e.query() << std::endl;
            } catch (const std::exception& e) {
                std::cerr << "[ERROR] " << e.what() << std::endl;
            }
            return crow::response(500, std::string("ERROR | Failed to switch light on."));
        });
    }
}