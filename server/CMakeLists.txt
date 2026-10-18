cmake_minimum_required(VERSION 3.15)

project(PerunSever)
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED True)


find_package(PostgreSQL REQUIRED)
find_package(libpqxx REQUIRED)

add_executable(server main.cpp)


target_link_libraries(server PRIVATE 
    pqxx
    ${PostgreSQL_LIBRARIES}
    paho-mqttpp3
    paho-mqtt3as
)