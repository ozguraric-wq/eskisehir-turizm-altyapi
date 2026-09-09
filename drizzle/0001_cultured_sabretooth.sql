CREATE TABLE `social_accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`provider` text NOT NULL,
	`subject` text NOT NULL,
	`password_hash` text,
	`salt` text,
	FOREIGN KEY (`user_id`) REFERENCES `social_profiles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `social_accounts_subject_unique` ON `social_accounts` (`subject`);--> statement-breakpoint
CREATE INDEX `social_accounts_lookup` ON `social_accounts` (`user_id`);--> statement-breakpoint
CREATE TABLE `social_comments` (
	`id` text PRIMARY KEY NOT NULL,
	`post_id` text NOT NULL,
	`user_id` text NOT NULL,
	`body` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`post_id`) REFERENCES `social_posts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `social_profiles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `social_comments_lookup` ON `social_comments` (`post_id`,`status`);--> statement-breakpoint
CREATE TABLE `social_handoffs` (
	`hash` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`challenge` text NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `social_profiles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `social_media` (
	`id` text PRIMARY KEY NOT NULL,
	`post_id` text NOT NULL,
	`user_id` text NOT NULL,
	`object_key` text NOT NULL,
	`kind` text NOT NULL,
	`mime` text NOT NULL,
	`bytes` integer NOT NULL,
	`caption` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`post_id`) REFERENCES `social_posts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `social_profiles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `social_media_object_key_unique` ON `social_media` (`object_key`);--> statement-breakpoint
CREATE INDEX `social_media_lookup` ON `social_media` (`post_id`,`status`);--> statement-breakpoint
CREATE TABLE `social_oauth_states` (
	`hash` text PRIMARY KEY NOT NULL,
	`provider` text NOT NULL,
	`nonce` text NOT NULL,
	`verifier` text NOT NULL,
	`app_challenge` text NOT NULL,
	`return_kind` text NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `social_posts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`preferences` text NOT NULL,
	`place_ids` text NOT NULL,
	`districts` text NOT NULL,
	`mode` text NOT NULL,
	`days` integer NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	`ai_state` text DEFAULT 'unavailable' NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `social_profiles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `social_posts_lookup` ON `social_posts` (`status`,`created_at`);--> statement-breakpoint
CREATE TABLE `social_profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`handle` text NOT NULL,
	`name` text NOT NULL,
	`bio` text DEFAULT '' NOT NULL,
	`public_name` text DEFAULT 'Gezgin' NOT NULL,
	`public_bio` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `social_profiles_handle_unique` ON `social_profiles` (`handle`);--> statement-breakpoint
CREATE INDEX `social_profiles_lookup` ON `social_profiles` (`status`,`created_at`);--> statement-breakpoint
CREATE TABLE `social_reports` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`target_type` text NOT NULL,
	`target_id` text NOT NULL,
	`reason` text NOT NULL,
	`detail` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'open' NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `social_profiles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `social_reports_lookup` ON `social_reports` (`status`,`created_at`);--> statement-breakpoint
CREATE TABLE `social_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`kind` text NOT NULL,
	`district` text NOT NULL,
	`listing_id` text,
	`date` text NOT NULL,
	`time` text NOT NULL,
	`people` integer NOT NULL,
	`language` text NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'demo' NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `social_profiles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `social_requests_lookup` ON `social_requests` (`user_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `social_review_log` (
	`id` text PRIMARY KEY NOT NULL,
	`reviewer_id` text NOT NULL,
	`target_type` text NOT NULL,
	`target_id` text NOT NULL,
	`decision` text NOT NULL,
	`revision` integer NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `social_sessions` (
	`hash` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `social_profiles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `social_sessions_lookup` ON `social_sessions` (`user_id`,`expires`);--> statement-breakpoint
CREATE TABLE `social_visits` (
	`user_id` text NOT NULL,
	`place_id` text NOT NULL,
	`date` text NOT NULL,
	PRIMARY KEY(`user_id`, `place_id`),
	FOREIGN KEY (`user_id`) REFERENCES `social_profiles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `social_votes` (
	`post_id` text NOT NULL,
	`user_id` text NOT NULL,
	`liked` integer DEFAULT 0 NOT NULL,
	`rating` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`post_id`, `user_id`),
	FOREIGN KEY (`post_id`) REFERENCES `social_posts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `social_profiles`(`id`) ON UPDATE no action ON DELETE cascade
);
