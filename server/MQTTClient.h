#pragma once
#include <mqtt/async_client.h>
#include "TSQueue.h"

struct MQTTMessage {
    std::string topic;
    std::string payload;
};

class DisconnectListener : public virtual mqtt::iaction_listener{
    void on_success(const mqtt::token& tok) override {
        std::cout << "[MQTT] Successfully disconnected from the MQTT broker." << std::endl;
    }
    void on_failure(const mqtt::token& tok) override {
        std::cout << "[MQTT] Failed to disconnect from the MQTT broker." << std::endl;
    }
};

class MQTTCallback : public virtual mqtt::callback
{
    private:
        TSQueue<MQTTMessage>& m_messageQueue;
    public:
        MQTTCallback(TSQueue<MQTTMessage>& messageQueue) : m_messageQueue(messageQueue) {
        }

        void message_arrived(mqtt::const_message_ptr msg) override {
            std::cout << "[MQTT] Message arrived on topic: " << msg->get_topic() << std::endl;
            std::cout << "[MQTT] Message payload: " << msg->to_string() << std::endl;
            MQTTMessage message {msg->get_topic(), msg->to_string()};
            m_messageQueue.push(message);

            std::cout << "[MQTT] Messages in queue: " << m_messageQueue.size() << std::endl;
        }

        void connection_lost(const std::string& cause) override {
            std::cout << "[MQTT] Connection lost: " << cause << std::endl;
        }

        void delivery_complete(mqtt::delivery_token_ptr token) override {
            std::cout << "[MQTT] Delivery complete for token: " << (token ? token->get_message_id() : -1) << std::endl;
        }

        void connected(const std::string& cause) override {
            std::cout << "[MQTT] Connected to the MQTT broker." << std::endl;
        }
};



class MQTTClient {
public:
    MQTTClient(const std::string& brokerAddress, const std::string& clientId, TSQueue<MQTTMessage>& messageQueue)
        : m_client(brokerAddress, clientId), m_callback(MQTTCallback(messageQueue)) {
            
    }

    void connect() {
        m_client.set_callback(m_callback);
        
        mqtt::connect_options connOpts;
        connOpts.set_keep_alive_interval(20);
        connOpts.set_clean_session(true);
        connOpts.set_automatic_reconnect(1, 5);

        m_client.connect(connOpts)->wait();
    }

    void subscribe(const std::string& topic, int qos) {
        m_client.subscribe(topic, qos)->wait();
    }

    void disconnect() {
        mqtt::token_ptr disc_token = m_client.disconnect();
        disc_token->set_action_callback(m_disconnectListener);
        disc_token->wait();
    }

private:
    mqtt::async_client m_client;
    MQTTCallback m_callback;
    DisconnectListener m_disconnectListener;
};  