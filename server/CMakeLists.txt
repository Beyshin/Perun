cmake_minimum_required(VERSION 3.15)

project(PerunSever)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_C_STANDARD_REQUIRED ON)

find_package(Threads REQUIRED)

add_executable(server main.cpp)


target_link_libraries( server PRIVATE 
    Threads::Threads
    paho-mqttpp3
    paho-mqtt3as
)