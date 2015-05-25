-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2015-05-05 00:13:46.332


PRAGMA foreign_keys=ON;

-- tables
-- Table: admin_user
CREATE TABLE admin_user (
    id varchar(50)  PRIMARY KEY,
    password varchar(50)  NOT NULL
);


-- Table: resident_user
CREATE TABLE resident_user (
    user_id varchar(50)  PRIMARY KEY,
    password varchar(50)  NOT NULL,
    full_name varchar(200)  NOT NULL,
    admin_id varchar(50)  REFERENCES admin_user,
    puzzle_level int  NOT NULL
);

-- Table: image
CREATE TABLE image (
    id int  PRIMARY KEY,
    file_name varchar(100)  NOT NULL,
    user_id varchar(50)  REFERENCES resident_user,
    caption text  NOT NULL,
    play_count int  NOT NULL
);


-- Table: profile_picture
CREATE TABLE profile_picture (
    id int  PRIMARY KEY,
    user_id varchar(50)  REFERENCES resident_user,
    file_name varchar(100)  NOT NULL,
    photo bytea  NOT NULL
);


-- Table: song
CREATE TABLE song (
    id varchar(150)  PRIMARY KEY,
    user_id varchar(50)  REFERENCES resident_user
);


-- Table: interest pictures
CREATE TABLE interest_pictures (
    file_name varchar(100) NOT NULL,
    interest_type varchar(50) PRIMARY KEY
); 

-- Table: users & interests
CREATE TABLE user_interests(
    user_id varchar(50) REFERENCES resident_user(user_id),
    interest_type varchar(100) REFERENCES interest_pictures(interest_type),
    PRIMARY KEY (user_id, interest_type)
);

-- Insert Data into tables
-- admin user
INSERT INTO admin_user VALUES('admin', 'admin');

-- resident user
INSERT INTO resident_user VALUES('jappleseed', 'test', 'Grace Johson', 'admin', 2);
INSERT INTO resident_user VALUES('amartin', 'test', 'Alfredo Martin', 'admin', 2);
INSERT INTO resident_user VALUES('eshah', 'test', 'Esther Shah', 'admin', 2);
INSERT INTO resident_user VALUES('fparker', 'test', 'Frank Parker', 'admin', 2);
INSERT INTO resident_user VALUES('glewis', 'test', 'Gerard Lewis', 'admin', 2);
INSERT INTO resident_user VALUES('wanderson', 'test', 'Winston Anderson', 'admin', 2);
INSERT INTO resident_user VALUES('estone', 'test', 'Eileen Stone', 'admin', 2);
INSERT INTO resident_user VALUES('hwilson', 'test', 'Heather Wilson', 'admin', 2);

