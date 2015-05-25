

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
    file_name varchar(100)  NOT NULL,
    user_id varchar(50)  REFERENCES resident_user,
    caption text  NOT NULL,
	 img bytea
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



-- Table: interest types
CREATE TABLE interests (
    interest_type varchar(50) PRIMARY KEY
);


-- Table: picture files related to interests
CREATE TABLE interest_pictures (
    file_name varchar(100) NOT NULL,
    interest_type varchar(50) REFERENCES interests(interest_type),
    PRIMARY KEY (file_name, interest_type)
); 


-- Table: user's interests
CREATE TABLE user_interests(
    user_id varchar(50) REFERENCES resident_user(user_id),
    interest_type varchar(100) REFERENCES interests(interest_type),
    PRIMARY KEY (user_id, interest_type)
);


-- Table: music genres
CREATE TABLE genres (
    genre_type varchar(50) PRIMARY KEY
);


-- Table: user's music genres
CREATE TABLE user_genres(
    user_id varchar(50) REFERENCES resident_user(user_id),
    genre_type varchar(100) REFERENCES genres(genre_type),
    PRIMARY KEY (user_id, genre_type)
);


-- Insert Data into tables
-- admin user
INSERT INTO admin_user VALUES('admin', 'admin');

-- resident user
INSERT INTO resident_user VALUES('jappleseed', 'test', 'Johnny Appleseed', 'admin', 2);

INSERT INTO song values('fake_song_id_1', 'jappleseed');
INSERT INTO song values('fake_song_id_2', 'jappleseed');


--image
INSERT INTO image VALUES('', '', '', NULL);
INSERT INTO image VALUES('family1.jpg', 'jappleseed', 'family1 caption', NULL);
INSERT INTO image VALUES('family2.jpg', 'jappleseed', 'family2 caption', NULL);
INSERT INTO image VALUES('family3.jpg', 'jappleseed', 'family3 caption', NULL);
INSERT INTO image VALUES('family4.jpg', 'jappleseed', 'family4 caption', NULL);
INSERT INTO image VALUES('family5.jpg', 'jappleseed', 'family5 caption', NULL);
INSERT INTO image VALUES('farm1.jpg', 'jappleseed', 'farm1 caption', NULL);
INSERT INTO image VALUES('farm2.jpg', 'jappleseed', 'farm2 caption', NULL);
INSERT INTO image VALUES('farm3.jpg', 'jappleseed', 'farm3 caption', NULL);
