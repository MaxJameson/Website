# profiles table
INSERT INTO `tblProfiles`(`UserID`,`UserName`,`Password`,`ProfilePicture`,`Bio`,`DateJoined`) VALUES
(1,'John_Smith','P4ssword1976?',NULL,'Hi my name is john and I love photography', '2020-01-15'),
(2,'Kate_Hope','5ecur31989',NULL,'Hi my name is kate and I am a travel photographer', '2020-01-17');

# photo table
INSERT INTO `tblPhotos`(`PhotoID`,`UserID`,`PhotoName`,`StoragePath`,`Date`,`lat`,`long`) VALUES
(1,9,'lake','uploads/Test1.jpg','2020-01-15',48.85,2.35),
(2,9,'path','uploads/Test2.jpg','2020-01-17',48.95,5.45),
(3,9,'snow','uploads/Test3.jpg','2022-05-03',49.05,-2.55);
