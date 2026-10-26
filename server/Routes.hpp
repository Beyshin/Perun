#pragma once

#include "crow.h"

namespace Routes{
    inline void setup_http_routes(crow::SimpleApp& app){
        //GET: /api/temperatures
        CROW_ROUTE(app, "/api/temperatures")([](){
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
        });

        CROW_ROUTE(app, "/api/light")([](){
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
        });

        //POST: /api/light
        CROW_ROUTE(app, "/api/light").methods(crow::HTTPMethod::POST)([](crow::request req){
            try{
                pqxx::connection conn(Config::get_db_url());
                pqxx::work txn(conn);

                conn.prepare("insert_light_log", "INSERT INTO light_log (time, state) VALUES (NOW(), $1)");

                nlohmann::json body = nlohmann::json::parse(req.body);

                std::string result_state = body["state"].get<std::string>();
                std::cout << result_state << std::endl;
                
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
                std::cerr << "[DB ERROR] " << e.what() << std::endl;
            }
        });
    }
}