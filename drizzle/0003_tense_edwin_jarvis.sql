CREATE TABLE `city_event_feeds` (
	`id` text PRIMARY KEY NOT NULL,
	`payload` text DEFAULT '[]' NOT NULL,
	`checked_at` text,
	`attempted_at` text,
	`state` text DEFAULT 'snapshot' NOT NULL,
	`lease_until` integer DEFAULT 0 NOT NULL
);
