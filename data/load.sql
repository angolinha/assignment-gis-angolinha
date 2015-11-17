CREATE TYPE p_placement AS ENUM ('INDOOR', 'OUTDOOR');

CREATE TABLE IF NOT EXISTS workout_places (
    p_id INTEGER PRIMARY KEY,
    p_name VARCHAR(255),
    p_placement p_placement,
    p_equipment JSON);


SELECT AddGeometryColumn('workout_places', 'p_position', '4326', 'POINT', 2);

INSERT INTO workout_places (p_id, p_name, p_placement, p_position, p_equipment)
VALUES (1, 'Liscie udolie', 'OUTDOOR', ST_GeomFromText('POINT(17.0546544 48.1622014)', 4326), '{ "vysoka_hrazda": 5, "nizka_hrazda": 3, "rebriny": 1, "bradla": 1 }');

INSERT INTO workout_places (p_id, p_name, p_placement, p_position, p_equipment)
VALUES (2, 'FTVS UK - Lafranconi', 'OUTDOOR', ST_GeomFromText('POINT(17.077091 48.1447422)', 4326), '{ "vysoka_hrazda": 2, "nizka_hrazda": 3, "bradla": 2, "rebriny": 1, "kruhy": 1 }');

INSERT INTO workout_places (p_id, p_name, p_placement, p_position, p_equipment)
VALUES (3, 'Kuchajda 1', 'OUTDOOR', ST_GeomFromText('POINT(17.1448624 48.1703027)', 4326), '{ "vysoka_hrazda": 6, "rebriny": 2, "bradla": 1, "nizka_hrazda": 2, "kruhy": 1 }');

INSERT INTO workout_places (p_id, p_name, p_placement, p_position, p_equipment)
VALUES (4, 'Kuchajda 2', 'OUTDOOR', ST_GeomFromText('POINT(17.1418503 48.171545)', 4326), '{ "rebriny": 1, "bradla": 1, "nizka_hrazda": 2 }');

INSERT INTO workout_places (p_id, p_name, p_placement, p_position, p_equipment)
VALUES (5, 'Mlada Garda', 'OUTDOOR', ST_GeomFromText('POINT(17.1260494 48.1775532)', 4326), '{ "vysoka_hrazda": 6, "rebriny": 1, "bradla": 1, "nizke_bradla": 1 }');

INSERT INTO workout_places (p_id, p_name, p_placement, p_position, p_equipment)
VALUES (6, 'Liscie udolie - osamela hrazda', 'OUTDOOR', ST_GeomFromText('POINT(17.0575511 48.161026)', 4326), '{ "hrazda": 1 }');

INSERT INTO workout_places (p_id, p_name, p_placement, p_position, p_equipment)
VALUES (7, 'Mladost - basketbalove kose', 'OUTDOOR', ST_GeomFromText('POINT(17.065587 48.1586142)', 4326), '{ "hrazda": 2 }');

INSERT INTO workout_places (p_id, p_name, p_placement, p_position, p_equipment)
VALUES (8, 'Drazdiak - Locomotiva Street Workout park', 'OUTDOOR', ST_GeomFromText('POINT(17.1121716 48.1064425)', 4326), '{ "vysoka_hrazda": 8, "nizka_hrazda": 2, "bradla": 2, "nizke_bradla": 1, "rebriny": 1, "kruhy": 1 }');

INSERT INTO workout_places (p_id, p_name, p_placement, p_position, p_equipment)
VALUES (9, 'ZS Tbiliska - Raca', 'OUTDOOR', ST_GeomFromText('POINT(17.1614814 48.2150295)', 4326), '{ "hrazda": 6, "nizka_hrazda": 2, "bradla": 2, "rebriny": 2 }');

INSERT INTO workout_places (p_id, p_name, p_placement, p_position, p_equipment)
VALUES (10, 'Ludovita Fullu - Karlova Ves', 'OUTDOOR', ST_GeomFromText('POINT(17.0512909 48.1547314)', 4326), '{ "hrazda": 2, "bradla": 1, "kruhy": 1 }');

INSERT INTO workout_places (p_id, p_name, p_placement, p_position, p_equipment)
VALUES (11, 'No Will No Skill Academy', 'INDOOR', ST_GeomFromText('POINT(17.1301317 48.1415708)', 4326), '{ "hrazda": 8, "kruhy": 6, "rebriny": 2, "bradla": 1 }');

INSERT INTO workout_places (p_id, p_name, p_placement, p_position, p_equipment)
VALUES (12, 'Skill Lab', 'INDOOR', ST_GeomFromText('POINT(17.1198454 48.1149851)', 4326), '{ "rebriny": 4, "bradla": 1, "hrazda": 4, "kruhy": 3 }');

INSERT INTO workout_places (p_id, p_name, p_placement, p_position, p_equipment)
VALUES (13, 'Crossfit Proton', 'INDOOR', ST_GeomFromText('POINT(17.1547651 48.1738418)', 4326), '{ "hrazda": 15, "kruhy": 10, "bradla": 2 }');