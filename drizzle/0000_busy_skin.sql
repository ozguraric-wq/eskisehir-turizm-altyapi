CREATE TABLE `ai_usage` (
	`key` text NOT NULL,
	`bucket` integer NOT NULL,
	`count` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`key`, `bucket`)
);
