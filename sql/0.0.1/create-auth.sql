-- ----------------------------------------------------------------------------
-- Table application.SessionManagers
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `application`.`SessionManagers` (
  `id` INT NOT NULL,
  `refreshToken` LONGTEXT,
  `deviceId` VARCHAR(255) NULL DEFAULT '',
  `name` VARCHAR(255) NULL DEFAULT '',
  `extraInfo` VARCHAR(255) NULL,
  `isActive` TINYINT NULL DEFAULT 1,
  `_status` VARCHAR(255) NULL,
  `deletedAt` DATETIME NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  `createdBy` INT NULL,
  `updatedBy` INT NULL,
  `userId` INT NULL,
  `deletedBy` INT NULL,
  PRIMARY KEY (`id`)
  );
