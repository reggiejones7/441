

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
INSERT INTO resident_user VALUES('interest', 'interest', 'interest', 'admin', 2);

-- update resident user
INSERT INTO resident_user VALUES('amartin', 'test', 'Alfredo Martin', 'admin', 2);
INSERT INTO resident_user VALUES('eshah', 'test', 'Esther Shah', 'admin', 2);
INSERT INTO resident_user VALUES('fparker', 'test', 'Frank Parker', 'admin', 2);
INSERT INTO resident_user VALUES('glewis', 'test', 'Gerard Lewis', 'admin', 2);
INSERT INTO resident_user VALUES('wanderson', 'test', 'Winston Anderson', 'admin', 2);
INSERT INTO resident_user VALUES('estone', 'test', 'Eileen Stone', 'admin', 2);
INSERT INTO resident_user VALUES('hwilson', 'test', 'Heather Wilson', 'admin', 2);


--image
INSERT INTO image VALUES('family1.jpg', 'jappleseed', 'Sammy is excited for the holidays!', NULL);
INSERT INTO image VALUES('family2.jpg', 'jappleseed', 'All the siblings on the farm, 1965', NULL);
INSERT INTO image VALUES('family3.jpg', 'jappleseed', '4 beautiful grandchildren', NULL);
INSERT INTO image VALUES('family4.jpg', 'jappleseed', 'Milking ol'' Betsy', NULL);
INSERT INTO image VALUES('family5.jpg', 'jappleseed', 'Grace and John before Delilah''s wedding', NULL);

INSERT INTO image VALUES('family6.jpg', 'amartin', 'Micah loves his breakfast!', NULL);
INSERT INTO image VALUES('family7.jpg', 'amartin', 'Father and daughter dance at the military ball!', NULL);
INSERT INTO image VALUES('family8.jpg', 'amartin', 'Steve, Roxanne, Emily, and Jordan at the beach', NULL);
INSERT INTO image VALUES('family9.jpg', 'amartin', 'The kids love the beach!', NULL);
INSERT INTO image VALUES('family10.jpg', 'amartin', 'Hiking Machu Picchu, 1995', NULL);

INSERT INTO image VALUES('family11.jpg', 'eshah', 'Jonah loves his breakfast!', NULL);
INSERT INTO image VALUES('family12.jpg', 'eshah', 'You were a beautiful dancer, mom!', NULL);
INSERT INTO image VALUES('family13.jpg', 'eshah', 'You were a beautiful dancer, mom!', NULL);
INSERT INTO image VALUES('family14.jpg', 'eshah', 'Look at these cute little toddlers!', NULL);
INSERT INTO image VALUES('family15.jpg', 'eshah', 'Back at our Korean home.', NULL);

INSERT INTO image VALUES('farm1.jpg', 'jappleseed', 'Pigs on the farm!', NULL);
INSERT INTO image VALUES('farm2.jpg', 'jappleseed', 'Pigs on the farm!', NULL);
INSERT INTO image VALUES('farm3.jpg', 'jappleseed', 'The countryside', NULL);

INSERT INTO image VALUES('football1.jpg', 'jappleseed', 'Football is the best sport!', NULL);
INSERT INTO image VALUES('football2.jpg', 'jappleseed', 'Football is the best sport!', NULL);
INSERT INTO image VALUES('football3.jpg', 'jappleseed', 'Football is the best sport!', NULL);

INSERT INTO image VALUES('garden1.jpg', 'jappleseed', 'Gardening some tomatoes', NULL);
INSERT INTO image VALUES('garden2.jpg', 'jappleseed', 'Growing some cucumbers', NULL);
INSERT INTO image VALUES('garden3.jpg', 'jappleseed', 'Growing some carrots!', NULL);

INSERT INTO image VALUES('golf1.jpg', 'jappleseed', 'Being on the green is so relaxing', NULL);
INSERT INTO image VALUES('golf2.jpg', 'jappleseed', 'Being on the green is so relaxing', NULL);
INSERT INTO image VALUES('golf3.jpg', 'jappleseed', 'Being on the green is so relaxing', NULL);

INSERT INTO image VALUES('horse1.jpg', 'jappleseed', 'Beautiful horses', NULL);
INSERT INTO image VALUES('horse2.jpg', 'jappleseed', 'Beautiful horses', NULL);
INSERT INTO image VALUES('horse3.jpg', 'jappleseed', 'Beautiful horses', NULL);

INSERT INTO image VALUES('piano1.jpg', 'jappleseed', 'Practice makes perfect!', NULL);
INSERT INTO image VALUES('piano2.jpg', 'jappleseed', 'Piano protigy', NULL);
INSERT INTO image VALUES('piano3.jpg', 'jappleseed', 'Practice makes perfect!', NULL);

INSERT INTO image VALUES('tennis1.jpg', 'jappleseed', 'Being on the court is so relaxing', NULL);
INSERT INTO image VALUES('tennis2.jpg', 'jappleseed', 'Being on the court is so relaxing', NULL);
INSERT INTO image VALUES('tennis3.jpg', 'jappleseed', 'Being on the court is so relaxing', NULL);

INSERT INTO image VALUES('dog1.jpg', 'jappleseed', 'Happy little dog says hi!', NULL);
INSERT INTO image VALUES('dog2.jpg', 'jappleseed', 'Silly little dog says hi!', NULL);
INSERT INTO image VALUES('dog3.jpg', 'jappleseed', 'Silly little dog says hi!', NULL);

INSERT INTO image VALUES('s_beach.jpg', 'interest', 's_beach caption', NULL);
INSERT INTO image VALUES('s_dog.jpg', 'interest', 's_dog caption', NULL);
INSERT INTO image VALUES('s_farms.jpg', 'interest', 's_farms caption', NULL);
INSERT INTO image VALUES('s_flowers.jpg', 'interest', 's_flowers caption', NULL);
INSERT INTO image VALUES('s_football.jpg', 'interest', 's_football caption', NULL);
INSERT INTO image VALUES('s_garden.jpg', 'interest', 's_garden caption', NULL);
INSERT INTO image VALUES('s_golf.jpg', 'interest', 's_golf caption', NULL);
INSERT INTO image VALUES('s_horse.jpg', 'interest', 's_horse caption', NULL);
INSERT INTO image VALUES('s_piano.jpg', 'interest', 's_piano caption', NULL);
INSERT INTO image VALUES('s_tennis.jpg', 'interest', 's_tennis caption', NULL);

INSERT INTO image VALUES('beach1.jpg', 'amartin', 'Can you hear the waves?', NULL);
INSERT INTO image VALUES('beach2.jpg', 'amartin', 'Can you hear the waves?', NULL);
INSERT INTO image VALUES('beach3.jpg', 'amartin', 'Can you hear the waves?', NULL);

INSERT INTO image VALUES('flowers1.jpg', 'amartin', 'Flowers brighten every day!', NULL);
INSERT INTO image VALUES('flowers2.jpg', 'amartin', 'Flowers brighten every day!', NULL);
INSERT INTO image VALUES('flowers3.jpg', 'amartin', 'Flowers brighten every day!', NULL);

INSERT INTO image VALUES('dog1.jpg', 'amartin', 'Happy little dog says hi!', NULL);
INSERT INTO image VALUES('dog2.jpg', 'amartin', 'Silly little dog says hi!', NULL);
INSERT INTO image VALUES('dog3.jpg', 'amartin', 'Silly little dog says hi!', NULL);

INSERT INTO image VALUES('piano1.jpg', 'eshah', 'Practice makes perfect!', NULL);
INSERT INTO image VALUES('piano2.jpg', 'eshah', 'Practice makes perfect!', NULL);
INSERT INTO image VALUES('piano3.jpg', 'eshah', 'Practice makes perfect!', NULL);

INSERT INTO image VALUES('flowers1.jpg', 'eshah', 'Flowers brighten every day!', NULL);
INSERT INTO image VALUES('flowers2.jpg', 'eshah', 'Flowers brighten every day!', NULL);
INSERT INTO image VALUES('flowers3.jpg', 'eshah', 'Flowers brighten every day!', NULL);

--interests
INSERT INTO interests VALUES('beach');
INSERT INTO interests VALUES('dog');
INSERT INTO interests VALUES('farm');
INSERT INTO interests VALUES('flowers');
INSERT INTO interests VALUES('football');
INSERT INTO interests VALUES('football');
INSERT INTO interests VALUES('garden');
INSERT INTO interests VALUES('golf');
INSERT INTO interests VALUES('horse');
INSERT INTO interests VALUES('piano');
INSERT INTO interests VALUES('tennis');

INSERT INTO interest_pictures VALUES ('beach1.jpg', 'beach');
INSERT INTO interest_pictures VALUES ('beach2.jpg', 'beach');
INSERT INTO interest_pictures VALUES ('beach3.jpg', 'beach');
INSERT INTO interest_pictures VALUES ('dog1.jpg', 'dog');
INSERT INTO interest_pictures VALUES ('dog2.jpg', 'dog');
INSERT INTO interest_pictures VALUES ('dog3.jpg', 'dog');
INSERT INTO interest_pictures VALUES ('farm1.jpg', 'farm');
INSERT INTO interest_pictures VALUES ('farm2.jpg', 'farm');
INSERT INTO interest_pictures VALUES ('farm3.jpg', 'farm');
INSERT INTO interest_pictures VALUES ('flowers1.jpg', 'flowers');
INSERT INTO interest_pictures VALUES ('flowers2.jpg', 'flowers');
INSERT INTO interest_pictures VALUES ('flowers3.jpg', 'flowers');
INSERT INTO interest_pictures VALUES ('football1.jpg', 'football');
INSERT INTO interest_pictures VALUES ('football2.jpg', 'football');
INSERT INTO interest_pictures VALUES ('football3.jpg', 'football');
INSERT INTO interest_pictures VALUES ('garden1.jpg', 'garden');
INSERT INTO interest_pictures VALUES ('garden2.jpg', 'garden');
INSERT INTO interest_pictures VALUES ('garden3.jpg', 'garden');
INSERT INTO interest_pictures VALUES ('golf1.jpg', 'golf');
INSERT INTO interest_pictures VALUES ('golf2.jpg', 'golf');
INSERT INTO interest_pictures VALUES ('golf3.jpg', 'golf');
INSERT INTO interest_pictures VALUES ('horse1.jpg', 'horse');
INSERT INTO interest_pictures VALUES ('horse2.jpg', 'horse');
INSERT INTO interest_pictures VALUES ('horse3.jpg', 'horse');
INSERT INTO interest_pictures VALUES ('piano1.jpg', 'piano');
INSERT INTO interest_pictures VALUES ('piano2.jpg', 'piano');
INSERT INTO interest_pictures VALUES ('piano3.jpg', 'piano');
INSERT INTO interest_pictures VALUES ('tennis1.jpg', 'tennis');
INSERT INTO interest_pictures VALUES ('tennis2.jpg', 'tennis');
INSERT INTO interest_pictures VALUES ('tennis3.jpg', 'tennis');

INSERT INTO user_interests VALUES ('jappleseed', 'farm');
INSERT INTO user_interests VALUES ('jappleseed', 'football');
INSERT INTO user_interests VALUES ('jappleseed', 'garden');
INSERT INTO user_interests VALUES ('jappleseed', 'golf');
INSERT INTO user_interests VALUES ('jappleseed', 'horse');
INSERT INTO user_interests VALUES ('jappleseed', 'piano');
INSERT INTO user_interests VALUES ('jappleseed', 'tennis');

INSERT INTO user_interests VALUES ('amartin', 'beach');
INSERT INTO user_interests VALUES ('amartin', 'dog');
INSERT INTO user_interests VALUES ('amartin', 'flowers');

INSERT INTO user_interests VALUES ('eshah', 'piano');
INSERT INTO user_interests VALUES ('eshah', 'flowers');


-- genres
INSERT INTO genres VALUES('soul');
INSERT INTO genres VALUES('opera');
INSERT INTO genres VALUES('rock');
INSERT INTO genres VALUES('jazz');
INSERT INTO genres VALUES('hip hop');
INSERT INTO genres VALUES('blue grass');
INSERT INTO genres VALUES('classic rock');
INSERT INTO genres VALUES('piano');
INSERT INTO genres VALUES('guitar');
INSERT INTO genres VALUES('blues');

INSERT INTO user_genres VALUES ('jappleseed', 'soul');
INSERT INTO user_genres VALUES ('jappleseed', 'jazz');
INSERT INTO user_genres VALUES ('jappleseed', 'piano');
INSERT INTO user_genres VALUES ('jappleseed', 'blue grass');
INSERT INTO user_genres VALUES ('jappleseed', 'hip hop');

INSERT INTO user_genres VALUES ('amartin', 'hip hop');
INSERT INTO user_genres VALUES ('amartin', 'soul');
INSERT INTO user_genres VALUES ('amartin', 'guitar');
INSERT INTO user_genres VALUES ('amartin', 'rock');

INSERT INTO user_genres VALUES ('eshah', 'opera');
INSERT INTO user_genres VALUES ('eshah', 'guitar');
INSERT INTO user_genres VALUES ('eshah', 'piano');
INSERT INTO user_genres VALUES ('eshah', 'jazz');
INSERT INTO user_genres VALUES ('eshah', 'blue grass');

