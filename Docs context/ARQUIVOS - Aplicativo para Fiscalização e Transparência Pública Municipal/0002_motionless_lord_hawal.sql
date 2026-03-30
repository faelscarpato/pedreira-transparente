ALTER TABLE `complaints` ADD `protocolNumber` varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE `complaints` ADD CONSTRAINT `complaints_protocolNumber_unique` UNIQUE(`protocolNumber`);