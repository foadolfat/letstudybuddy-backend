CREATE DATABASE IF NOT EXISTS `study`;

USE `study`

CREATE TABLE IF NOT EXISTS `USERS` (
    USER_ID INTEGER UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    USERNAME VARCHAR(32) NOT NULL UNIQUE,
    EMAIL VARCHAR(64) NOT NULL UNIQUE,
    PASS BINARY(60) NOT NULL,
    FNAME VARCHAR(32),
    LNAME VARCHAR(32),
    MAJOR VARCHAR(30),
    DEGREE VARCHAR(10),
    IMG VARCHAR(256),
    GPA DECIMAL(4,2),
    EXPECTED_GRAD DATE,
    DATE_JOINED DATETIME DEFAULT CURRENT_TIMESTAMP,
    DATE_UPDATED DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `CLASSES` (
    USER_ID INTEGER UNSIGNED NOT NULL,
    CLASS_NAME VARCHAR(10) NOT NULL,
    SCHOOL VARCHAR(256) NOT NULL,
    UNIQUE KEY `CLASS_ID` (`USER_ID`,`CLASS_NAME`,`SCHOOL`),
    FOREIGN KEY (USER_ID) REFERENCES USERS(USER_ID) ON DELETE CASCADE,
    EXPECTED_END DATE,
    PROF VARCHAR(50),
    DATE_ADDED DATETIME DEFAULT CURRENT_TIMESTAMP,
    DATE_UPDATED DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `ROOMS` (
    ROOM_ID INTEGER UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    DATE_CREATED DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `ROOM_MEMBERS` (
    ROOM_ID INTEGER UNSIGNED NOT NULL,
    USER_ID INTEGER UNSIGNED NOT NULL,
    UNIQUE KEY `MEMBERS_ID` (`ROOM_ID`,`USER_ID`),
    FOREIGN KEY (ROOM_ID) REFERENCES ROOMS(ROOM_ID) ON DELETE CASCADE,
    FOREIGN KEY (USER_ID) REFERENCES USERS(USER_ID) ON DELETE CASCADE,
    DATE_JOINED DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `PEERS` (
    USER_ID INTEGER UNSIGNED NOT NULL,
    PEER_ID INTEGER UNSIGNED NOT NULL,
    LIKED BOOLEAN,
    UNIQUE KEY `USER_PEER_ID` (`USER_ID`,`PEER_ID`),
    FOREIGN KEY (USER_ID) REFERENCES USERS(USER_ID) ON DELETE CASCADE,
    FOREIGN KEY (PEER_ID) REFERENCES USERS(USER_ID) ON DELETE CASCADE,
    DATE_RATED DATETIME DEFAULT CURRENT_TIMESTAMP,
    DATE_UPDATED DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `MESSAGES` (
    ROOM_ID INTEGER UNSIGNED NOT NULL,
    USER_ID INTEGER UNSIGNED NOT NULL,
    CONTENT VARCHAR(1024),
    FOREIGN KEY (ROOM_ID) REFERENCES ROOMS(ROOM_ID) ON DELETE CASCADE,
    FOREIGN KEY (USER_ID) REFERENCES USERS(USER_ID) ON DELETE CASCADE,
    DATE_SENT DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `SOCKETS` (
    SOCKET_ID VARCHAR(50) NOT NULL UNIQUE,
    USER_ID INTEGER UNSIGNED NOT NULL PRIMARY KEY,
    FOREIGN KEY (USER_ID) REFERENCES USERS(USER_ID) ON DELETE CASCADE,
    DATE_CREATED DATETIME DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE IF NOT EXISTS `NOTIFICATIONS` (
    ROOM_ID INTEGER UNSIGNED NOT NULL,
    USER_ID INTEGER UNSIGNED NOT NULL,
    EVENT_KEY VARCHAR(64) NOT NULL,
    NUM INTEGER UNSIGNED NOT NULL,
    UNIQUE KEY `NOTIFICATION_ID` (`USER_ID`,`ROOM_ID`, `EVENT_KEY`),
    FOREIGN KEY (ROOM_ID) REFERENCES ROOMS(ROOM_ID) ON DELETE CASCADE,
    FOREIGN KEY (USER_ID) REFERENCES USERS(USER_ID) ON DELETE CASCADE,
    DATE_CREATED DATETIME DEFAULT CURRENT_TIMESTAMP
)