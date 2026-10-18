FROM debian:bookworm AS builder

RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    git \
    python3 \
    libpq-dev \
    libssl-dev \
    libasio-dev \
    && rm -rf /var/lib/apt/lists/*

RUN git clone --branch v1.3.14 https://github.com/eclipse/paho.mqtt.c.git /tmp/paho.mqtt.c && \
    cd /tmp/paho.mqtt.c && \
    cmake -Bbuild -H. -DPAHO_WITH_SSL=ON -DPAHO_BUILD_DOCUMENTATION=OFF -DPAHO_BUILD_EXAMPLES=OFF && \
    cmake --build build/ --target install

RUN git clone --branch v1.6.0 https://github.com/eclipse/paho.mqtt.cpp /tmp/paho.mqtt.cpp && \
    cd /tmp/paho.mqtt.cpp && \
    cmake -Bbuild -H. -DPAHO_BUILD_EXAMPLES=OFF -DPAHO_BUILD_DOCUMENTATION=OFF \
    -DCMAKE_CXX_STANDARD=20 -DCMAKE_POSITION_INDEPENDENT_CODE=ON && \
    cmake --build build/ --target install

RUN git clone --branch 7.9.2 https://github.com/jtv/libpqxx.git /tmp/libpqxx && \
    cd /tmp/libpqxx && mkdir build && cd build && \
    cmake -D CMAKE_BUILD_TYPE=Release -D SKIP_BUILD_TEST=ON .. && \
    make -j$(nproc) && make install


RUN git clone https://github.com/CrowCpp/Crow.git /tmp/crow && \
    cd /tmp/crow && mkdir build && cd build && \
    cmake -D CROW_BUILD_EXAMPLES=OFF -D CROW_BUILD_TESTS=OFF .. && \
    make install


WORKDIR /app
COPY . .


RUN rm -rf build && mkdir build && cd build && \
    cmake -D CMAKE_CXX_STANDARD=20 .. && \
    make -j$(nproc)

FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y \
    libpq5 \
    libpaho-mqtt1.3 \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/build/server /usr/local/bin/server

COPY --from=builder /usr/local/lib/libpqxx.* /usr/local/lib/
COPY --from=builder /usr/local/lib/libpaho-mqttpp3.* /usr/local/lib/

RUN ldconfig

EXPOSE 18080
CMD ["server"]