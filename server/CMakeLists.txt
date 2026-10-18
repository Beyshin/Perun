cmake_minimum_required(VERSION 3.15)

project(PerunSever)
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED True)

include(FetchContent)

FetchContent_Declare(
    nlohmann_json
    GIT_REPOSITORY https://github.com/nlohmann/json.git
    GIT_TAG v3.10.5
)

FetchContent_MakeAvailable(nlohmann_json)

find_package(PostgreSQL REQUIRED)
find_package(libpqxx REQUIRED)

add_executable(server main.cpp)


target_link_libraries(server PRIVATE 
    pqxx
    ${PostgreSQL_LIBRARIES}
    paho-mqttpp3
    paho-mqtt3as
    nlohmann_json::nlohmann_json
)