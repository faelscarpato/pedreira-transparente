CREATE TABLE `complaints` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` longtext NOT NULL,
	`severity` enum('baixa','media','alta','critica') NOT NULL DEFAULT 'media',
	`status` enum('aberta','em_analise','respondida','resolvida','arquivada') NOT NULL DEFAULT 'aberta',
	`reportedActId` int,
	`reporterName` varchar(255),
	`reporterEmail` varchar(320),
	`reporterPhone` varchar(20),
	`evidenceUrl` varchar(500),
	`evidenceKey` varchar(500),
	`adminNotes` longtext,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `complaints_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `emailSubscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(255),
	`subscribeToNewReports` boolean NOT NULL DEFAULT true,
	`subscribeToCriticalIssues` boolean NOT NULL DEFAULT true,
	`verificationToken` varchar(255),
	`isVerified` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `emailSubscriptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `emailSubscriptions_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` longtext,
	`type` enum('diario_oficial','plo','emenda','decreto','outro') NOT NULL,
	`publishedDate` timestamp NOT NULL,
	`fileUrl` varchar(500),
	`fileKey` varchar(500),
	`summary` longtext,
	`complianceIndicators` longtext,
	`keywords` text,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sentNotifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`subject` varchar(255) NOT NULL,
	`type` enum('new_report','critical_issue','complaint_update') NOT NULL,
	`relatedReportId` int,
	`relatedComplaintId` int,
	`sentAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sentNotifications_id` PRIMARY KEY(`id`)
);
