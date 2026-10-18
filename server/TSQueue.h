#pragma once
#include <queue>
#include <mutex>
#include <condition_variable>
#include <optional>

template <typename T>
class TSQueue {
    public:
        void push(const T& val){
            std::lock_guard<std::mutex> lock(m_mtx);
            m_queue.push(val);
            
            m_cv.notify_one();
        }

        std::optional<T> pop(){
            std::unique_lock<std::mutex> lock(m_mtx);
            
            m_cv.wait(lock, [this](){ return !m_queue.empty() || m_shutdown; });
            
            if(m_shutdown && m_queue.empty()) {
                return std::nullopt;
            }
            
            T val = m_queue.front();
            m_queue.pop();
            return val;
        }

        int size() {
            std::lock_guard<std::mutex> lock(m_mtx);
            return m_queue.size();
        }

        void shutdown() {
            std::lock_guard<std::mutex> lock(m_mtx);
            m_shutdown = true;
            m_cv.notify_all();
        }

    private:
        std::mutex m_mtx;
        std::queue<T> m_queue;
        std::condition_variable m_cv;
        bool m_shutdown = false;
};