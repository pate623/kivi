-- phpMyAdmin SQL Dump
-- version 4.9.4
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 10, 2021 at 03:56 PM
-- Server version: 5.6.51-cll-lve
-- PHP Version: 7.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `draftPickResults`
--

-- --------------------------------------------------------

--
-- Table structure for table `kivi`
--

CREATE TABLE `kivi` (
  `gameID` int(10) UNSIGNED NOT NULL,
  `playTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `gameTurn` int(10) UNSIGNED DEFAULT NULL,
  `gameState` tinyint(4) DEFAULT NULL,
  `playerCount` tinyint(4) DEFAULT NULL,
  `warningMessages` tinytext,
  `p1Name` tinytext,
  `p1Password` tinytext,
  `p2Name` tinytext,
  `p2Password` tinytext,
  `p3Name` tinytext,
  `p3Password` tinytext,
  `p4Name` tinytext,
  `p4Password` tinytext,
  `boardState` text,
  `boardUsedPositions` text,
  `firstTurnAll` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `kiviErrorFinished`
--

CREATE TABLE `kiviErrorFinished` (
  `ID` int(10) UNSIGNED NOT NULL,
  `gameID` int(10) UNSIGNED DEFAULT NULL,
  `endTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `gameTurn` int(10) UNSIGNED DEFAULT NULL,
  `gameState` tinyint(4) DEFAULT NULL,
  `playerCount` tinyint(4) DEFAULT NULL,
  `p1Name` tinytext,
  `p2Name` tinytext,
  `p3Name` tinytext,
  `p4Name` tinytext,
  `boardUsedPositions` text,
  `firstTurnAll` text,
  `startTime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `kiviFinishedCorrectly`
--

CREATE TABLE `kiviFinishedCorrectly` (
  `ID` int(10) UNSIGNED NOT NULL,
  `gameID` int(10) UNSIGNED NOT NULL,
  `startTime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `endTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `gameTurn` int(10) UNSIGNED NOT NULL,
  `playerCount` tinyint(4) DEFAULT NULL,
  `boardUsedPositions` text,
  `firstTurnAll` text,
  `p1Name` tinytext,
  `p2Name` tinytext,
  `p3Name` tinytext,
  `p4Name` tinytext,
  `p1Score` tinyint(4) DEFAULT NULL,
  `p1ConScore` tinyint(4) DEFAULT NULL,
  `p2Score` tinyint(4) DEFAULT NULL,
  `p2ConScore` tinyint(4) DEFAULT NULL,
  `p3Score` tinyint(4) DEFAULT NULL,
  `p3ConScore` tinyint(4) DEFAULT NULL,
  `p4Score` tinyint(4) DEFAULT NULL,
  `p4ConScore` tinyint(4) DEFAULT NULL,
  `winner` tinyint(4) DEFAULT NULL,
  `highScore` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `kiviQueue`
--

CREATE TABLE `kiviQueue` (
  `ID` int(11) NOT NULL,
  `active` tinyint(4) NOT NULL,
  `activeTimer` tinyint(4) NOT NULL,
  `userName` tinytext NOT NULL,
  `password` tinytext NOT NULL,
  `playerCount` tinyint(4) NOT NULL,
  `transferredGameID` int(11) DEFAULT NULL,
  `playerNumber` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `kiviRunningGames`
--

CREATE TABLE `kiviRunningGames` (
  `ID` int(10) UNSIGNED NOT NULL,
  `gameID` int(10) UNSIGNED DEFAULT NULL,
  `gameTurn` int(10) UNSIGNED DEFAULT NULL,
  `p1Active` tinyint(4) DEFAULT NULL,
  `p2Active` tinyint(4) DEFAULT NULL,
  `p3Active` tinyint(4) DEFAULT NULL,
  `p4Active` tinyint(4) DEFAULT NULL,
  `playerCount` tinyint(4) DEFAULT NULL,
  `finished` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `kiviTotalGames`
--

CREATE TABLE `kiviTotalGames` (
  `ID` int(11) NOT NULL,
  `PlayerAmountAll` int(11) NOT NULL,
  `PlayerAmount2p` int(11) NOT NULL,
  `PlayerAmount3p` int(11) NOT NULL,
  `PlayerAmount4p` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `kiviTotalGames`
--

INSERT INTO `kiviTotalGames` (`ID`, `PlayerAmountAll`, `PlayerAmount2p`, `PlayerAmount3p`, `PlayerAmount4p`) VALUES
(1, 0, 0, 0, 0);

-- --------------------------------------------------------


--
-- Indexes for dumped tables
--


--
-- Indexes for table `kivi`
--
ALTER TABLE `kivi`
  ADD PRIMARY KEY (`gameID`);

--
-- Indexes for table `kiviErrorFinished`
--
ALTER TABLE `kiviErrorFinished`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `kiviFinishedCorrectly`
--
ALTER TABLE `kiviFinishedCorrectly`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `kiviQueue`
--
ALTER TABLE `kiviQueue`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `kiviRunningGames`
--
ALTER TABLE `kiviRunningGames`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `kiviTotalGames`
--
ALTER TABLE `kiviTotalGames`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ID` (`ID`);


--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `kivi`
--
ALTER TABLE `kivi`
  MODIFY `gameID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kiviErrorFinished`
--
ALTER TABLE `kiviErrorFinished`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kiviFinishedCorrectly`
--
ALTER TABLE `kiviFinishedCorrectly`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kiviQueue`
--
ALTER TABLE `kiviQueue`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kiviRunningGames`
--
ALTER TABLE `kiviRunningGames`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kiviTotalGames`
--
ALTER TABLE `kiviTotalGames`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
