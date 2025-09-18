-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: cars_api_db
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` varchar(36) NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `orderId` varchar(36) DEFAULT NULL,
  `productId` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_f1d359a55923bb45b057fbdab0d` (`orderId`),
  KEY `FK_cdb99c05982d5191ac8465ac010` (`productId`),
  CONSTRAINT `FK_cdb99c05982d5191ac8465ac010` FOREIGN KEY (`productId`) REFERENCES `products` (`id`),
  CONSTRAINT `FK_f1d359a55923bb45b057fbdab0d` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES ('0751f88e-b99f-484d-82bf-80ad33b163b9',2,30.99,'4105c42c-f719-49af-8927-894219120a6c','1f1a39b6-1e13-43ed-a476-439db1cadb5e'),('0f582469-c647-4ff5-b3b1-bc4739819acf',5,120.00,'32cd6959-9107-4f14-a28a-63e9313a3a36','0dec5c38-99a9-460b-969b-813da41ff813'),('1ca20abe-c14e-4aa4-bcc2-8d70a14e361b',4,120.00,'a3119f00-3143-4c0e-a595-ad602015a716','0dec5c38-99a9-460b-969b-813da41ff813'),('1f1d290a-5494-4647-832e-80f8988016bc',6,30.99,'0763ca58-cb9e-4d2d-a513-6ba739a8501f','1f1a39b6-1e13-43ed-a476-439db1cadb5e'),('285839f3-194f-4b4c-88e9-a59393c02348',8,950.00,'0763ca58-cb9e-4d2d-a513-6ba739a8501f','7b974d0b-8f85-4a4b-9851-7dc18e7d70c3'),('440e4640-8f99-42da-b388-1f28b7114ba8',7,120.00,'0dbf34f2-b85b-4a86-a8ca-066ea0e16d07','0dec5c38-99a9-460b-969b-813da41ff813'),('5df25e2c-fff8-42ba-8cfb-45cae0611ca7',2,120.00,'0763ca58-cb9e-4d2d-a513-6ba739a8501f','0dec5c38-99a9-460b-969b-813da41ff813'),('6262b6e6-d3de-4794-bf9f-4495bbd9bf44',1,950.00,'4105c42c-f719-49af-8927-894219120a6c','7b974d0b-8f85-4a4b-9851-7dc18e7d70c3'),('a280d1e1-cfc9-4568-920f-1be3b0f6b6d1',1,950.00,'0dbf34f2-b85b-4a86-a8ca-066ea0e16d07','7b974d0b-8f85-4a4b-9851-7dc18e7d70c3'),('a9ea7660-d4c1-4265-b05f-e49b9c109d2a',2,30.99,'0dbf34f2-b85b-4a86-a8ca-066ea0e16d07','1f1a39b6-1e13-43ed-a476-439db1cadb5e'),('b149cf6d-117c-4894-beb0-0c61bb3fcf32',1,30.99,'32cd6959-9107-4f14-a28a-63e9313a3a36','1f1a39b6-1e13-43ed-a476-439db1cadb5e'),('b8b6281d-b3f4-4fc2-b9c6-72187e236569',2,120.00,'4105c42c-f719-49af-8927-894219120a6c','0dec5c38-99a9-460b-969b-813da41ff813'),('cc8d4d06-7152-4f88-a097-8281beacfabe',1,950.00,'32cd6959-9107-4f14-a28a-63e9313a3a36','7b974d0b-8f85-4a4b-9851-7dc18e7d70c3'),('e9ffff06-1ea1-4c12-a696-d85e6dd57df6',2,30.99,'a3119f00-3143-4c0e-a595-ad602015a716','1f1a39b6-1e13-43ed-a476-439db1cadb5e'),('f7995475-f855-4492-b2da-c1a35fbffac9',1,950.00,'a3119f00-3143-4c0e-a595-ad602015a716','7b974d0b-8f85-4a4b-9851-7dc18e7d70c3');
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` varchar(36) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `status` enum('pending','completed','cancelled') NOT NULL DEFAULT 'pending',
  `userId` varchar(36) DEFAULT NULL,
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `paypalOrderId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_151b79a83ba240b0cb31b2302d1` (`userId`),
  CONSTRAINT `FK_151b79a83ba240b0cb31b2302d1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES ('0763ca58-cb9e-4d2d-a513-6ba739a8501f',8025.94,'pending','15825ec0-8e21-4e2d-a16f-d5b3b671499d','2025-09-18 03:35:58.000000','2025-09-18 03:35:57.295877','9X1429741P406321L'),('0dbf34f2-b85b-4a86-a8ca-066ea0e16d07',1851.98,'completed','15825ec0-8e21-4e2d-a16f-d5b3b671499d','2025-09-18 03:10:54.000000','2025-09-18 03:09:58.194285','3GE869052S9430212'),('32cd6959-9107-4f14-a28a-63e9313a3a36',1580.99,'completed','15825ec0-8e21-4e2d-a16f-d5b3b671499d','2025-09-18 03:09:13.515043','2025-09-18 02:46:38.934330','3TH023947B3222031'),('4105c42c-f719-49af-8927-894219120a6c',1251.98,'pending','15825ec0-8e21-4e2d-a16f-d5b3b671499d','2025-09-18 01:39:48.000000','2025-09-18 01:39:47.970380',NULL),('a3119f00-3143-4c0e-a595-ad602015a716',1491.98,'pending','15825ec0-8e21-4e2d-a16f-d5b3b671499d','2025-09-18 01:36:09.796705','2025-09-18 01:36:10.025835',NULL);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `isActive` tinyint NOT NULL DEFAULT '1',
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `stock` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_4c9fb58de893725258746385e1` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES ('0dec5c38-99a9-460b-969b-813da41ff813','Llanta Michelin 205/55 R16','Llanta de alto rendimiento, diseño para mayor agarre en carretera mojada.',120.00,1,'2025-09-18 00:43:47.882586','2025-09-18 03:35:57.000000',180),('1f1a39b6-1e13-43ed-a476-439db1cadb5e','Aceite de motor Castrol 5W-30','Aceite sintético premium para motores a gasolina y diésel.',30.99,1,'2025-09-18 00:43:47.882586','2025-09-18 03:35:57.000000',137),('3f4ddc12-3b97-494f-a535-aa53ebb1b2c2','Filtro de Aire Toyota Corolla','Filtro de aire original para Toyota Corolla modelo 2015-2020.',45.50,1,'2025-09-18 00:43:47.882586','2025-09-18 00:45:57.512346',300),('7b974d0b-8f85-4a4b-9851-7dc18e7d70c3','Gato hidráulico 2 toneladas','Gato hidráulico portátil para levantar vehículos de hasta 2 toneladas.',950.00,1,'2025-09-18 00:43:47.882586','2025-09-18 03:35:57.000000',8);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','client') NOT NULL DEFAULT 'client',
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `isActive` tinyint NOT NULL DEFAULT '1',
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('15825ec0-8e21-4e2d-a16f-d5b3b671499d','maria.gomez@example.com','$2b$10$AWe7oMNBr.AabQYXFJCq5.uG7izlpIZ8ggyz4cTUXEQlH5rWcYhdS','client','María','Gómez','3011234567','Carrera 28 #17-21','Medellín','Colombia',1,'2025-09-17 03:36:16.169268','2025-09-17 04:18:17.000000'),('1d832f0b-8b2f-45b8-864b-002c83885e7c','jhan.borrado@example.com','$2b$10$Qngu2qwVfzCkszG/Ix2RT.m9ecXzNxT2HHtxGueQ8vzUf8akCMywm','client','Jhan','Negrete','3009876543','Calle 45 #67-89','Barranquilla','Colombia',1,'2025-09-17 12:43:33.874442','2025-09-17 12:43:33.874442'),('227d2265-6861-49b2-91b0-5d5a1846b364','jhan.dev@example.com','$2b$10$TcG9uRnpQSB/.P1h.NKpX.WKJpyHKGi1GzoKhf2ZBB2j4QO3Khavm','admin','Jhan','Negrete','3009876543','Calle 45 #67-89','Barranquilla','Colombia',1,'2025-09-17 03:36:16.169268','2025-09-17 10:38:36.726273'),('2bb20b7c-5b75-4166-b152-1606f18a5b0e','admin@auto.com','$2b$10$.RimtACVBi2NfwGeAABQzek.9Y8KEaYAzvTQDDanSt1Yo3d3LDa2i','admin','Admin','User','3000000000','Main Street 1','Bogota','Colombia',1,'2025-09-18 04:43:45.394600','2025-09-18 04:43:45.394600'),('e4b9310d-ae7d-41d8-b888-61ace9fbf5c1','jhan.borrado2@example.com','$2b$10$Aih54brjg51TkJSKJVbc3udSIMx6h9PXbE.JXDogMFToINIZZkZTS','client','Jhan','Negrete','3009876543','Calle 45 #67-89','Barranquilla','Colombia',1,'2025-09-17 17:52:18.005620','2025-09-17 17:52:18.005620');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-17 23:43:54
