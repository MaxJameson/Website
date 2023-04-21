CREATE TABLE IF NOT EXISTS `tblProfiles` (
    `UserID` int(11) NOT NULL AUTO_INCREMENT,
    `UserName` varchar(20) DEFAULT NULL,
    `Password` varchar(120) DEFAULT NULL,
    `ProfilePicture` varchar(45) DEFAULT NULL,
    `Bio` longtext DEFAULT NULL,
    `DateJoined` date DEFAULT NULL,
    PRIMARY KEY (`UserID`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `tblPhotos` (
    `PhotoID` int(11) NOT NULL AUTO_INCREMENT,
    `UserID` int(11) DEFAULT NULL,
    `PhotoName` varchar(30) DEFAULT NULL,
    `StoragePath` varchar(45) DEFAULT NULL,
    `Date` date DEFAULT NULL,
    `Lat` decimal(9,6) DEFAULT NULL,
    `Long` decimal(9,6) DEFAULT NULL,
    PRIMARY KEY (`PhotoID`),
    FOREIGN KEY (`UserID`) REFERENCES `tblProfiles`(`UserID`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;