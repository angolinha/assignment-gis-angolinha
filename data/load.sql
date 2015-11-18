CREATE TYPE p_placement AS ENUM ('INDOOR', 'OUTDOOR');

CREATE TABLE IF NOT EXISTS workout_places (
    p_id INTEGER PRIMARY KEY,
    p_name VARCHAR(255),
    p_placement p_placement,
    p_equipment varchar[]);


SELECT AddGeometryColumn('workout_places', 'p_position', '4326', 'POINT', 2);

INSERT INTO workout_places (p_id, p_name, p_placement, p_position, p_equipment)
VALUES (1, 'Liscie udolie', 'OUTDOOR', ST_GeomFromText('POINT(17.0546544 48.1622014)', 4326), '{ "vysoka_hrazda", "nizka_hrazda", "rebriny", "bradla" }');

INSERT INTO workout_places (p_id, p_name, p_placement, p_position, p_equipment)
VALUES (2, 'FTVS UK - Lafranconi', 'OUTDOOR', ST_GeomFromText('POINT(17.077091 48.1447422)', 4326), '{ "vysoka_hrazda", "nizka_hrazda", "bradla", "rebriny", "kruhy" }');

INSERT INTO workout_places (p_id, p_name, p_placement, p_position, p_equipment)
VALUES (3, 'Kuchajda 1', 'OUTDOOR', ST_GeomFromText('POINT(17.1448624 48.1703027)', 4326), '{ "vysoka_hrazda", "rebriny", "bradla", "nizka_hrazda", "kruhy" }');

INSERT INTO workout_places (p_id, p_name, p_placement, p_position, p_equipment)
VALUES (4, 'Kuchajda 2', 'OUTDOOR', ST_GeomFromText('POINT(17.1418503 48.171545)', 4326), '{ "rebriny", "bradla", "nizka_hrazda" }');

INSERT INTO workout_places (p_id, p_name, p_placement, p_position, p_equipment)
VALUES (5, 'Mlada Garda', 'OUTDOOR', ST_GeomFromText('POINT(17.1260494 48.1775532)', 4326), '{ "vysoka_hrazda", "rebriny", "bradla", "nizke_bradla" }');

INSERT INTO workout_places (p_id, p_name, p_placement, p_position, p_equipment)
VALUES (6, 'Liscie udolie - osamela hrazda', 'OUTDOOR', ST_GeomFromText('POINT(17.0575511 48.161026)', 4326), '{ "vysoka_hrazda" }');

INSERT INTO workout_places (p_id, p_name, p_placement, p_position, p_equipment)
VALUES (7, 'Mladost - basketbalove kose', 'OUTDOOR', ST_GeomFromText('POINT(17.065587 48.1586142)', 4326), '{ "vysoka_hrazda" }');

INSERT INTO workout_places (p_id, p_name, p_placement, p_position, p_equipment)
VALUES (8, 'Drazdiak - Locomotiva Street Workout park', 'OUTDOOR', ST_GeomFromText('POINT(17.1121716 48.1064425)', 4326), '{ "vysoka_hrazda", "nizka_hrazda", "bradla", "nizke_bradla", "rebriny", "kruhy" }');

INSERT INTO workout_places (p_id, p_name, p_placement, p_position, p_equipment)
VALUES (9, 'ZS Tbiliska - Raca', 'OUTDOOR', ST_GeomFromText('POINT(17.1614814 48.2150295)', 4326), '{ "vysoka_hrazda", "nizka_hrazda", "bradla", "rebriny" }');

INSERT INTO workout_places (p_id, p_name, p_placement, p_position, p_equipment)
VALUES (10, 'Ludovita Fullu - Karlova Ves', 'OUTDOOR', ST_GeomFromText('POINT(17.0512909 48.1547314)', 4326), '{ "vysoka_hrazda", "bradla", "kruhy" }');

INSERT INTO workout_places (p_id, p_name, p_placement, p_position, p_equipment)
VALUES (11, 'No Will No Skill Academy', 'INDOOR', ST_GeomFromText('POINT(17.1301317 48.1415708)', 4326), '{ "vysoka_hrazda", "kruhy", "rebriny", "bradla" }');

INSERT INTO workout_places (p_id, p_name, p_placement, p_position, p_equipment)
VALUES (12, 'Skill Lab', 'INDOOR', ST_GeomFromText('POINT(17.1198454 48.1149851)', 4326), '{ "rebriny", "bradla", "vysoka_hrazda", "kruhy" }');

INSERT INTO workout_places (p_id, p_name, p_placement, p_position, p_equipment)
VALUES (13, 'Crossfit Proton', 'INDOOR', ST_GeomFromText('POINT(17.1547651 48.1738418)', 4326), '{ "vysoka_hrazda", "kruhy", "bradla" }');