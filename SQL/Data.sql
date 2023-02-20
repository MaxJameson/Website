# profiles table
INSERT INTO `tblProfiles`(`UserID`,`UserName`,`Password`,`ProfilePicture`,`Bio`,`DateJoined`) VALUES
(1,'John_Smith','P4ssword1976?',NULL,'Hi my name is john and I love photography', '2020-01-15'),
(2,'Kate_Hope','5ecur31989',NULL,'Hi my name is kate and I am a travel photographer', '2020-01-17');

# photo table
INSERT INTO `tblPhotos`(`PhotoID`,`UserID`,`PhotoName`,`StoragePath`,`Date`,`lat`,`long`) VALUES
(1,1,'lake','uploads/Test1.jpg','2020-01-15',48.85,2.35),
(2,2,'path','uploads/Test2.jpg','2020-01-17',48.95,5.45),
(3,1,'snow','uploads/Test3.jpg','2022-05-03',49.05,-2.55),
(4,2,'forest','uploads/Test4.jpg','2021-11-17',53.2295,0.5427),
(5,1,'field','uploads/Test5.jpg','2022-08-28',40.4637,3.7492),
(6,2,'branch','uploads/Test6.jpg','2023-02-15',41.8719,12.5674),
(7,1,'autumnLake','uploads/Test7.jpg','2023-01-01',51.1657,10.4515);
