CREATE TABLE IF NOT EXISTS sensor_data (
    time TIMESTAMPTZ NOT NULL,
    topic TEXT NOT NULL,
    temperature DOUBLE PRECISION,
    humidity DOUBLE PRECISION
);

CREATE TABLE IF NOT EXISTS light_log (
    time TIMESTAMPTZ NOT NULL,
    state TEXT NOT NULL
);

SELECT create_hypertable('sensor_data', 'time', if_not_exists => TRUE);
SELECT create_hypertable('light_log', 'time', if_not_exists => TRUE);