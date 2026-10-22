#pragma once

#include "crow.h"

namespace Routes{
    inline void setup_http_routes(crow::SimpleApp& app){
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
    }
}