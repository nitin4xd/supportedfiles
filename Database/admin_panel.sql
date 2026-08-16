-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 16, 2026 at 07:18 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `admin_panel`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL,
  `username` varchar(100) DEFAULT NULL,
  `activity` text DEFAULT NULL,
  `activity_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `username`, `activity`, `activity_time`) VALUES
(96, 'logtest', 'logtest logged out', '2026-08-12 00:22:33'),
(97, 'logtest', 'logtest logged in', '2026-08-12 00:23:23'),
(98, 'admin', 'Deleted user : a', '2026-08-12 00:25:16'),
(99, 'admin', 'User deactivated : logtest', '2026-08-12 00:27:37'),
(100, 'admin', 'User activated : logtest', '2026-08-12 00:27:47'),
(101, 'logtest', 'logtest logged in', '2026-08-13 00:13:49'),
(102, 'admin', 'Database backup downloaded', '2026-08-13 00:27:02'),
(103, 'admin', 'Database backup downloaded', '2026-08-13 00:31:03'),
(104, 'admin', 'Database backup downloaded', '2026-08-13 00:31:30'),
(105, 'admin', 'User deactivated : logtest', '2026-08-13 00:31:41'),
(106, 'admin', 'User activated : logtest', '2026-08-13 00:31:49'),
(107, 'admin', 'Database backup downloaded', '2026-08-13 00:44:25'),
(108, 'admin', 'Database backup downloaded', '2026-08-13 00:44:25'),
(109, 'admin', 'Database backup downloaded', '2026-08-13 00:44:51'),
(110, 'admin', 'Database backup downloaded', '2026-08-13 00:44:55'),
(111, 'admin', 'Database backup downloaded', '2026-08-13 00:45:09'),
(112, 'admin', 'User deactivated : user', '2026-08-13 01:01:58'),
(113, 'admin', 'User activated : user', '2026-08-13 01:02:02'),
(114, 'admin', 'Database backup downloaded', '2026-08-13 01:02:10'),
(115, 'admin', 'User deactivated : logtest', '2026-08-13 23:14:19'),
(116, 'admin', 'User deactivated : testuser', '2026-08-13 23:14:22'),
(117, 'admin', 'User activated : logtest', '2026-08-13 23:14:27'),
(118, 'admin', 'User deactivated : user', '2026-08-13 23:14:30'),
(119, 'admin', 'User activated : testuser', '2026-08-13 23:14:34'),
(120, 'admin', 'User activated : user', '2026-08-13 23:14:36'),
(121, 'admin', 'User deactivated : logtest', '2026-08-14 14:04:37'),
(122, 'admin', 'User activated : logtest', '2026-08-14 14:04:42');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(20) NOT NULL DEFAULT 'user',
  `created` datetime NOT NULL,
  `last_login` datetime DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `created`, `last_login`, `active`) VALUES
(1, 'admin', '$2y$10$dhp5UgHfhr5NBYk9OLJ06OzU3.F6Afm3OIoDrCSeTbjY1HjUHCnFC', 'admin', '2026-08-08 22:52:35', '2026-08-11 23:42:52', 1),
(2, 'testuser', '$2y$10$hhZUAWthQSrycKcZiSCbbOBaZbMvvJuH2/Frjj1JpWtzlBJTCNghm', 'user', '2026-08-08 23:47:54', '2026-08-09 19:18:44', 1),
(3, 'user', '$2y$10$yIijLBgVwebBY6CLIGZZcehteIsvxekQCj/s/36.EmhFNqTjwQL/.', 'user', '2026-08-09 00:00:11', '2026-08-10 13:25:47', 1),
(9, 'logtest', '$2y$10$rRpc0x16Q0yhLWLFfuUmy.f4iECztQTQ8BzFvJVngYxZYqyGMLHSu', 'user', '2026-08-09 18:41:21', '2026-08-13 00:13:49', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=123;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
