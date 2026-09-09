CREATE TABLE `social_demo_seeds` (
	`id` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `social_kit` (
	`user_id` text NOT NULL,
	`kind` text NOT NULL,
	`ref` text NOT NULL,
	`created_at` text NOT NULL,
	PRIMARY KEY(`user_id`, `kind`, `ref`),
	FOREIGN KEY (`user_id`) REFERENCES `social_profiles`(`id`) ON UPDATE no action ON DELETE cascade
);
