
DROP TABLE IF EXISTS city;

CREATE TABLE city (
    id SERIAL PRIMARY KEY,
    search_query VARCHAR(255),
    formatted_query VARCHAR(255),
    latitude float,
    longitude float
);

INSERT INTO city (search_query,formatted_query,latitude,longitude) VALUES ('muna','indusiua',50.66,40.115);
