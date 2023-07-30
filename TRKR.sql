CREATE TABLE `User` (
	`id`	INT	 AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`user_id`	VARCHAR(255)	NULL,
	`password`	VARCHAR(255)	NULL,
	`nickname`	VARCHAR(255)	NULL,
	`age`	INT	NULL,
	`phone_number`	VARCHAR(255)	NULL,
	`email`	VARCHAR(255)	NULL,
	`created_at`	TIMESTAMP	NULL,
	`update_at`	TIMESTAMP	NULL,
	`discord_auth`	VARCHAR(255)	NULL,
	`riot_auth`	VARCHAR(255)	NULL,
	`school_auth`	VARCHAR(255)	NULL
);

CREATE TABLE `Competition` (
	`id`	INT	 AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`host_id`	VARCHAR(255)	NULL,
	`competition_title`	VARCHAR(50)	NULL,
	`competition_content`	TEXT	NULL,
	`event`	VARCHAR(50)	NULL,
	`post_date`	TIMESTAMP	NULL,
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

CREATE TABLE `User_Record` (
	`id`	INT	 AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`user_id`	INT	NOT NULL,
	`match_id`	INT	NOT NULL,
	`competition_id`	INT	NOT NULL,
	`id2`	INT	NOT NULL
);

ALTER TABLE `User` ADD CONSTRAINT `PK_USER` PRIMARY KEY (
	`id`
);

ALTER TABLE `Competition` ADD CONSTRAINT `PK_COMPETITION` PRIMARY KEY (
	`id`
);

ALTER TABLE `Team` ADD CONSTRAINT `PK_TEAM` PRIMARY KEY (
	`id`
);

ALTER TABLE `Player` ADD CONSTRAINT `PK_PLAYER` PRIMARY KEY (
	`id`,
	`user_id`,
	`team_id`
);

ALTER TABLE `Tournament_Node` ADD CONSTRAINT `PK_TOURNAMENT_NODE` PRIMARY KEY (
	`id`,
	`competition_id`
);

ALTER TABLE `User_Record` ADD CONSTRAINT `PK_USER_RECORD` PRIMARY KEY (
	`id`,
	`user_id`,
	`match_id`,
	`competition_id`,
	`id2`
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

ALTER TABLE `User_Record` ADD CONSTRAINT `FK_User_TO_User_Record_1` FOREIGN KEY (
	`user_id`
)
REFERENCES `User` (
	`id`
);

ALTER TABLE `User_Record` ADD CONSTRAINT `FK_Tournament_Node_TO_User_Record_1` FOREIGN KEY (
	`match_id`
)
REFERENCES `Tournament_Node` (
	`id`
);

ALTER TABLE `User_Record` ADD CONSTRAINT `FK_Tournament_Node_TO_User_Record_2` FOREIGN KEY (
	`competition_id`
)
REFERENCES `Tournament_Node` (
	`competition_id`
);

ALTER TABLE `User_Record` ADD CONSTRAINT `FK_Team_TO_User_Record_1` FOREIGN KEY (
	`id2`
)
REFERENCES `Team` (
	`id`
);

