CREATE TABLE `User` (
	`id`	INT	 AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`account`	VARCHAR(255)	NULL,
	`password`	VARCHAR(255)	NULL,
	`nickname`	VARCHAR(255)	NULL,
	`age`	INT	NULL,
	`phone_number`	VARCHAR(255)	NULL,
	`email`	VARCHAR(255)	NULL,
	`created_at`	TIMESTAMP	NULL,
	`updated_at`	TIMESTAMP	NULL,
	`discord_auth`	VARCHAR(255)	NULL,
	`riot_auth`	VARCHAR(255)	NULL,
	`school_auth`	VARCHAR(255)	NULL,
	`played_competition`	INT	NULL,
	`played_match`	INT	NULL,
	`win`	INT	NULL,
	`lose`	INT	NULL
);

CREATE TABLE `Competition` (
	`id`	INT	 AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`host_id`	VARCHAR(255)	NULL,
	`competition_title`	VARCHAR(50)	NULL,
	`competition_content`	TEXT	NULL,
	`event`	VARCHAR(50)	NULL,
	`created_at`	TIMESTAMP	NULL,
	`updated_at`	TIMESTAMP	NULL,
	`dead_date`	TIMESTAMP	NULL,
	`qualification`	TEXT	NULL,
	`prize`	TEXT	NULL,
	`pre_date`	TEXT	NULL,
	`final_date`	TEXT	NULL,
	`poster_path`	TEXT	NULL
);

CREATE TABLE `Team` (
	`id`	INT	 AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`name`	INT	NULL,
	`created_at`	TIMESTAMP	NULL,
	`updated_at`	TIMESTAMP	NULL,
	`intoduction`	VARCHAR(255)	NULL
);

CREATE TABLE `Player` (
	`id`	INT	 AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`user_id`	INT	NOT NULL,
	`team_id`	INT	NOT NULL,
	`name`	VARCHAR(255)	NULL,
	`role`	VARCHAR(255)	NULL,
	`created_at`	TIMESTAMP	NULL,
	`updaed_at`	TIMESTAMP	NULL
);

CREATE TABLE `Tournament_Node` (
	`id`	INT	 AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`competition_id`	INT	NOT NULL,
	`round`	INT	NULL,
	`match_number`	INT	NULL,
	`team1_id`	INT	NULL,
	`team2_id`	INT	NULL,
	`winner_id`	INT	NULL,
	`is_finished`	Bool	NULL,
	`created_at`	TIMESTAMP	NULL,
	`updated_at`	TIMESTAMP	NULL
);

CREATE TABLE `Team_Match_History` (
	`id`	INT	 AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`match_id`	INT	NOT NULL,
	`competition_id`	INT	NOT NULL,
	`team_id`	INT	NOT NULL,
	`is_won`	Bool	NULL
);

CREATE TABLE `Team_Competition_History` (
	`id`	INT	 AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`competition_id`	INT	NOT NULL,
	`team_id`	INT	NOT NULL,
	`rank`	INT	NULL
);

ALTER TABLE `Player` ADD CONSTRAINT `FK_User_TO_Player_1` FOREIGN KEY (
	`user_id`
)
REFERENCES `User` (
	`id`
);

ALTER TABLE `Player` ADD CONSTRAINT `FK_Team_TO_Player_1` FOREIGN KEY (
	`team_id`
)
REFERENCES `Team` (
	`id`
);

ALTER TABLE `Tournament_Node` ADD CONSTRAINT `FK_Competition_TO_Tournament_Node_1` FOREIGN KEY (
	`competition_id`
)
REFERENCES `Competition` (
	`id`
);

ALTER TABLE `Team_Match_History` ADD CONSTRAINT `FK_Tournament_Node_TO_Team_Match_History_1` FOREIGN KEY (
	`match_id`
)
REFERENCES `Tournament_Node` (
	`id`
);

ALTER TABLE `Team_Match_History` ADD CONSTRAINT `FK_Tournament_Node_TO_Team_Match_History_2` FOREIGN KEY (
	`competition_id`
)
REFERENCES `Tournament_Node` (
	`competition_id`
);

ALTER TABLE `Team_Match_History` ADD CONSTRAINT `FK_Team_TO_Team_Match_History_1` FOREIGN KEY (
	`team_id`
)
REFERENCES `Team` (
	`id`
);

ALTER TABLE `Team_Competition_History` ADD CONSTRAINT `FK_Competition_TO_Team_Competition_History_1` FOREIGN KEY (
	`competition_id`
)
REFERENCES `Competition` (
	`id`
);

ALTER TABLE `Team_Competition_History` ADD CONSTRAINT `FK_Team_TO_Team_Competition_History_1` FOREIGN KEY (
	`team_id`
)
REFERENCES `Team` (
	`id`
);


INSERT INTO User (account, password, nickname, age, phone_number, email, created_at, updated_at, discord_auth, riot_auth, school_auth, played_competition, played_match, win, lose)
VALUES ('ryuwldnjs', 'password', 'nickname', 24, '010-2870-8502', 'ryu_eclipse@naver.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '류지원#6691', '라이엇ID', 'ryuwldnjs@cau.ac.kr', 2, 10, 9, 1),
('user1', 'password1', 'User One', 25, '123-456-7890', 'user1@example.com', NOW(), NOW(), 'discord1', 'riot1', 'school1', 5, 10, 3, 7),
('user2', 'password2', 'User Two', 30, '987-654-3210', 'user2@example.com', NOW(), NOW(), 'discord2', 'riot2', 'school2', 8, 15, 6, 9),
('user3', 'password3', 'User Three', 22, '555-555-5555', 'user3@example.com', NOW(), NOW(), 'discord3', 'riot3', 'school3', 12, 20, 10, 10),
('user4', 'password4', 'User Four', 28, '111-222-3333', 'user4@example.com', NOW(), NOW(), 'discord4', 'riot4', 'school4', 15, 25, 13, 12),
('user5', 'password5', 'User Five', 35, '444-555-6666', 'user5@example.com', NOW(), NOW(), 'discord5', 'riot5', 'school5', 20, 30, 18, 12),
('user6', 'password6', 'User Six', 29, '777-888-9999', 'user6@example.com', NOW(), NOW(), 'discord6', 'riot6', 'school6', 6, 12, 2, 10),
('user7', 'password7', 'User Seven', 32, '000-111-2222', 'user7@example.com', NOW(), NOW(), 'discord7', 'riot7', 'school7', 10, 18, 7, 11),
('user8', 'password8', 'User Eight', 27, '999-888-7777', 'user8@example.com', NOW(), NOW(), 'discord8', 'riot8', 'school8', 3, 8, 1, 7),
('user9', 'password9', 'User Nine', 23, '555-444-3333', 'user9@example.com', NOW(), NOW(), 'discord9', 'riot9', 'school9', 9, 15, 4, 11),
('user10', 'password10', 'User Ten', 26, '111-222-3333', 'user10@example.com', NOW(), NOW(), 'discord10', 'riot10', 'school10', 7, 14, 5, 9);