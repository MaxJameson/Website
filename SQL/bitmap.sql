-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 05, 2023 at 03:31 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bitmap`
--

-- --------------------------------------------------------

--
-- Table structure for table `tblphotos`
--

CREATE TABLE `tblphotos` (
  `PhotoID` int(11) NOT NULL,
  `UserID` int(11) DEFAULT NULL,
  `PhotoName` varchar(30) DEFAULT NULL,
  `StoragePath` varchar(30) DEFAULT NULL,
  `Date` date DEFAULT NULL,
  `Lat` decimal(9,6) DEFAULT NULL,
  `Long` decimal(9,6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tblphotos`
--

INSERT INTO `tblphotos` (`PhotoID`, `UserID`, `PhotoName`, `StoragePath`, `Date`, `Lat`, `Long`) VALUES
(1, 1, 'lake', 'uploads/Test1.jpg', '2020-01-15', '48.850000', '2.350000'),
(2, 2, 'path', 'uploads/Test2.jpg', '2020-01-17', '48.950000', '5.450000'),
(3, 1, 'snow', 'uploads/Test3.jpg', '2022-05-03', '49.050000', '-2.550000'),
(4, 2, 'forest', 'uploads/Test4.jpg', '2021-11-17', '53.229500', '0.542700'),
(5, 1, 'field', 'uploads/Test5.jpg', '2022-08-28', '40.463700', '3.749200'),
(6, 2, 'branch', 'uploads/Test6.jpg', '2023-02-15', '41.871900', '12.567400'),
(7, 1, 'autumnLake', 'uploads/Test7.jpg', '2023-01-01', '51.165700', '10.451500');

-- --------------------------------------------------------

--
-- Table structure for table `tblprofiles`
--

CREATE TABLE `tblprofiles` (
  `UserID` int(11) NOT NULL,
  `UserName` varchar(20) DEFAULT NULL,
  `Password` varchar(120) DEFAULT NULL,
  `ProfilePicture` varchar(100) DEFAULT NULL,
  `Bio` longtext DEFAULT NULL,
  `DateJoined` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tblprofiles`
--

INSERT INTO `tblprofiles` (`UserID`, `UserName`, `Password`, `ProfilePicture`, `Bio`, `DateJoined`) VALUES
(1, 'John_Smith', 'P4ssword1976?', 'john_smith.jpg', 'Hi my name is john and I love photography', '2020-01-15'),
(2, 'Kate_Hope', '5ecur31989', 'kate_hope.jpg', 'Hi my name is kate and I am a travel photographer', '2020-01-17');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tblphotos`
--
ALTER TABLE `tblphotos`
  ADD PRIMARY KEY (`PhotoID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `tblprofiles`
--
ALTER TABLE `tblprofiles`
  ADD PRIMARY KEY (`UserID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tblphotos`
--
ALTER TABLE `tblphotos`
  MODIFY `PhotoID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `tblprofiles`
--
ALTER TABLE `tblprofiles`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tblphotos`
--
ALTER TABLE `tblphotos`
  ADD CONSTRAINT `tblphotos_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `tblprofiles` (`UserID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
