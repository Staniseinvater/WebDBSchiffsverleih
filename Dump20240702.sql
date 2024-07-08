-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: schiff_verleih
-- ------------------------------------------------------
-- Server version	8.0.37

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
-- Table structure for table `ausleihen`
--

DROP TABLE IF EXISTS `ausleihen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ausleihen` (
  `id` int NOT NULL AUTO_INCREMENT,
  `schiffId` int DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `startDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  `zielHafen` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `schiffId` (`schiffId`),
  KEY `zielHafen` (`zielHafen`),
  CONSTRAINT `ausleihen_ibfk_1` FOREIGN KEY (`schiffId`) REFERENCES `schiff` (`id`),
  CONSTRAINT `ausleihen_ibfk_2` FOREIGN KEY (`zielHafen`) REFERENCES `hafen` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ausleihen`
--

LOCK TABLES `ausleihen` WRITE;
/*!40000 ALTER TABLE `ausleihen` DISABLE KEYS */;
INSERT INTO `ausleihen` VALUES (1,11,'Ahmet Cayli','cay@gmail.com','2024-07-01','2024-07-02',1),(2,3,'Nour Alhamwi','Nour@gmail.com','2024-05-06','2024-05-16',1),(3,16,'Elmas Bayram','brooo2002y@gmail.com','2024-05-20','2024-05-31',2),(4,16,'23','23@gmail.com','2024-07-17','2024-07-18',5),(5,6,'56','56@gmail.com','2024-07-03','2024-07-06',9),(6,6,'23','23@gmail.com','2024-07-01','2024-07-15',1),(7,1,'eyüphan Bayram','brooo2002y@gmail.com','2024-07-01','2024-07-02',2),(8,3,'asd','asd@gmail.com','2024-07-17','2024-07-20',3);
/*!40000 ALTER TABLE `ausleihen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `benutzer`
--

DROP TABLE IF EXISTS `benutzer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `benutzer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `benutzername` varchar(30) DEFAULT NULL,
  `vorname` varchar(30) DEFAULT NULL,
  `nachname` varchar(30) DEFAULT NULL,
  `passwort` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `benutzer`
--

LOCK TABLES `benutzer` WRITE;
/*!40000 ALTER TABLE `benutzer` DISABLE KEYS */;
INSERT INTO `benutzer` VALUES (1,'Nour','Alhamwi','nour','123'),(2,'Eyuephan','Bayram','eyup','123'),(3,'Stanislav','Skulinec','stani','123'),(4,'Mariella','String','mariella','123'),(5,'23','23','23','$2b$10$noBTqXUKbm5C2IQqTGzkBOcEUWGY3FtIG77ieLGbtwbhgsTfZUyAa'),(6,'Shadow','Eyüphan','Bayram','$2b$10$V8phi07oduRIrUrwTaJK4OdVvSWdkUZMIoCUzppCkwBEWXTcOW8Om');
/*!40000 ALTER TABLE `benutzer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `text` text NOT NULL,
  `author` varchar(50) NOT NULL,
  `location` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,'Ich hatte eine großartige Erfahrung mit Ihrem Unternehmen. Das Boot war sauber und gut gewartet, und die Abholung und Rückgabe waren mühelos.','Stanislav','Usbekistan','2024-06-29 06:54:10'),(2,'Hervorragender Service und eine große Auswahl an Booten. Absolut empfehlenswert!','Nour','Kongo','2024-06-29 06:54:10'),(3,'Eine tolle Erfahrung von Anfang bis Ende. Sehr zu empfehlen!','Eyüphan','Guatemala','2024-06-29 06:54:10');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hafen`
--

DROP TABLE IF EXISTS `hafen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hafen` (
  `id` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `lat` decimal(9,6) DEFAULT NULL,
  `lon` decimal(9,6) DEFAULT NULL,
  `imageUrl` varchar(255) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `capacity` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hafen`
--

LOCK TABLES `hafen` WRITE;
/*!40000 ALTER TABLE `hafen` DISABLE KEYS */;
INSERT INTO `hafen` VALUES (1,'Hamburg',53.551100,9.993700,'https://www.maritime-elbe.de/wp-content/uploads/2019/04/Hamburger-Yachthafen-Wedel.jpg','Kaltehofe-Hinterdeich 9, 20539 Hamburg',2000),(2,'Rotterdam',51.922500,4.479170,'https://media-cdn.tripadvisor.com/media/photo-s/16/b8/b2/72/do-you-know-the-entrepot.jpg','Rijksboom 90, 3071 AX Rotterdam, Niederlande',600),(3,'Port Hercule',43.733300,7.420000,NULL,NULL,NULL),(4,'Marina di Portofino',44.303800,9.210100,'https://apiv2.marina-guide.de/image.php?name=55a50887fcb8005067585af322ae0764c55a12f32ec928e99a9d178e70487492.jpg','Via Roma 35, 16034 Portofino, Italien',16),(5,'Puerto Banús',36.487400,-4.952600,'https://www.marbella-ev.com/wp-content/uploads/2020/07/puerto-banuspanorama-scaled.jpg','Muelle de Honor – Torre de Control Marbella Málaga ES 29660, 29660 Marbella, Málaga, Spanien',900),(6,'Port Vauban',43.580400,7.128200,'https://www.pco-yachting.com/d9/sites/default/files/styles/crop_extra_panorama/public/2022-11/Antibes-12.jpg?itok=Aq1DErmf','Av. de Verdun, 06600 Antibes, Frankreich',1700),(7,'Marina del Rey',33.977700,-118.435100,'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Marina_del_Rey_P4070297.jpg/1200px-Marina_del_Rey_P4070297.jpg','Kalifornien 90292, USA',1100),(8,'Auckland Viaduct Harbour',-36.843500,174.763300,'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Viaduct_Basin_Auckland_01.jpg/1200px-Viaduct_Basin_Auckland_01.jpg','Viaduct HarbourAuckland CBD, Auckland 1010, Neuseeland',1200),(9,'Marina Bay',1.283400,103.860700,'https://www.bayharbor.com/wp-content/uploads/2022/06/DJI_0580-1024x683.jpg','323 W 6th St, Clear Lake Shores, TX 77565, USA',1300),(10,'Sydney Superyacht Marina',-33.868800,151.209300,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7vPHQdGxxnmj1CWmClig3l2QZgeEhXeho1g&s','2 Maritime Court, Rozelle NSW 2039, Australien',1400);
/*!40000 ALTER TABLE `hafen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schiff`
--

DROP TABLE IF EXISTS `schiff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schiff` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `capacity` int DEFAULT NULL,
  `preisProNacht` decimal(10,2) DEFAULT NULL,
  `inhalt` text,
  `hafenId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `hafenId` (`hafenId`),
  CONSTRAINT `schiff_ibfk_1` FOREIGN KEY (`hafenId`) REFERENCES `hafen` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schiff`
--

LOCK TABLES `schiff` WRITE;
/*!40000 ALTER TABLE `schiff` DISABLE KEYS */;
INSERT INTO `schiff` VALUES (1,'Poseidon','Yacht',12,210.00,'Luxus-Kabinen, Pool, Bar, Jacuzzi',2),(2,'Odyssee','Segelboot',9,160.00,'Kabinen, Küche, Deck, Grill',3),(3,'Atlantis','Segelboot',7,140.00,'Kabinen, Küche, Deck, Sonnenliegen',3),(4,'Aquila','Segelboot',8,155.00,'Kabinen, Küche, Deck, Heimkino',1),(5,'Nautilus','Segelboot',10,175.00,'Kabinen, Küche, Deck, Sauna',10),(6,'Neptun','Kreuzfahrtschiff',320,410.00,'Restaurants, Kino, Fitnessstudio, Spa',1),(7,'Triton','Kreuzfahrtschiff',315,405.00,'Restaurants, Kino, Fitnessstudio, Shopping Mall',10),(8,'Orion','Kreuzfahrtschiff',305,390.00,'Restaurants, Kino, Fitnessstudio, Casino',10),(9,'Aphrodite','Luxusyacht',22,1020.00,'Luxus-Kabinen, Pool, Bar, Kino, Spa',5),(10,'Zeus','Luxusyacht',21,1010.00,'Luxus-Kabinen, Pool, Bar, Kino, Hubschrauberlandeplatz',9),(11,'Hera','Luxusyacht',19,980.00,'Luxus-Kabinen, Pool, Bar, Kino, Weinkeller',1),(12,'Apollo','Luxusyacht',23,1030.00,'Luxus-Kabinen, Pool, Bar, Kino, Golfplatz',10),(13,'Artemis','Luxusyacht',18,950.00,'Luxus-Kabinen, Pool, Bar, Kino, Tauchzentrum',4),(14,'Hermes','Luxusyacht',20,1000.00,'Luxus-Kabinen, Pool, Bar, Kino, Fitnessstudio',4),(15,'Athena','Luxusyacht',17,970.00,'Luxus-Kabinen, Pool, Bar, Kino, Bibliothek',4),(16,'Demeter','Luxusyacht',19,990.00,'Luxus-Kabinen, Pool, Bar, Kino, Wintergarten',5),(17,'Hades','Luxusyacht',16,940.00,'Luxus-Kabinen, Pool, Bar, Kino, Grillplatz',7),(18,'Hestia','Luxusyacht',15,930.00,'Luxus-Kabinen, Pool, Bar, Kino, Garten',4),(19,'Persephone','Luxusyacht',21,1015.00,'Luxus-Kabinen, Pool, Bar, Kino, Yachtclub',9),(20,'Dionysus','Luxusyacht',20,1000.00,'Luxus-Kabinen, Pool, Bar, Kino',10);
/*!40000 ALTER TABLE `schiff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schiffbild`
--

DROP TABLE IF EXISTS `schiffbild`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schiffbild` (
  `id` int NOT NULL AUTO_INCREMENT,
  `schiffId` int DEFAULT NULL,
  `bildUrl` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `schiffId` (`schiffId`),
  CONSTRAINT `schiffbild_ibfk_1` FOREIGN KEY (`schiffId`) REFERENCES `schiff` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=149 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schiffbild`
--

LOCK TABLES `schiffbild` WRITE;
/*!40000 ALTER TABLE `schiffbild` DISABLE KEYS */;
INSERT INTO `schiffbild` VALUES (1,1,'assets/Boot 1 (2).png'),(2,1,'assets/Boot 1 (1).png'),(3,1,'assets/Boot 1 (3).png'),(4,1,'assets/Boot 1 (4).png'),(5,1,'assets/Boot 1 (5).png'),(6,2,'assets/Boot 3 (2).png'),(7,2,'assets/Boot 3 (1).png'),(8,2,'assets/Boot 3 (3).png'),(9,2,'assets/Boot 3 (4).png'),(10,3,'assets/Boot 2 (2).png'),(11,3,'assets/Boot 2 (1).png'),(12,3,'assets/Boot 2 (3).png'),(13,3,'assets/Boot 2 (4).png'),(14,3,'assets/Boot 2 (5).png'),(15,4,'assets/Boot 4 (2).png'),(16,4,'assets/Boot 4 (1).png'),(17,4,'assets/Boot 4 (3).png'),(18,4,'assets/Boot 4 (4).png'),(19,4,'assets/Boot 4 (5).png'),(20,5,'assets/Boot 5 (1).png'),(21,5,'assets/Boot 4 (2).png'),(22,5,'assets/Boot 5 (3).png'),(23,5,'assets/Boot 5 (4).png'),(24,5,'assets/Boot 5 (5).png'),(25,6,'assets/Boot 6 (1).png'),(26,6,'assets/Boot 6 (2).png'),(27,6,'assets/Boot 6 (3).png'),(28,6,'assets/Boot 6 (4).png'),(29,6,'assets/Boot 6 (5).png'),(30,7,'assets/Boot 7 (2).png'),(31,7,'assets/Boot 7 (1).png'),(32,7,'assets/Boot 7 (3).png'),(33,7,'assets/Boot 7 (4).png'),(34,7,'assets/Boot 7 (5).png'),(35,7,'assets/Boot 7 (6).png'),(62,8,'assets/Boot 8 (1).png'),(63,8,'assets/Boot 8 (2).png'),(64,8,'assets/Boot 8 (3).png'),(65,8,'assets/Boot 8 (4).png'),(66,8,'assets/Boot 8 (5).png'),(67,8,'assets/Boot 8 (6).png'),(68,9,'assets/Boot 9 (1).png'),(69,9,'assets/Boot 9 (2).png'),(70,9,'assets/Boot 9 (3).png'),(71,9,'assets/Boot 9 (4).png'),(72,10,'assets/Boot 10 (1).png'),(73,10,'assets/Boot 10 (2).png'),(74,10,'assets/Boot 10 (3).png'),(75,10,'assets/Boot 10 (4).png'),(76,10,'assets/Boot 10 (5).png'),(77,10,'assets/Boot 10 (6).png'),(78,11,'assets/Boot 11 (1).png'),(79,11,'assets/Boot 11 (2).png'),(80,11,'assets/Boot 11 (3).png'),(81,11,'assets/Boot 11 (4).png'),(82,12,'assets/Boot 12 (1).png'),(83,12,'assets/Boot 12 (2).png'),(84,12,'assets/Boot 12 (3).png'),(85,12,'assets/Boot 12 (4).png'),(86,12,'assets/Boot 12 (5).png'),(87,12,'assets/Boot 12 (6).png'),(98,15,'assets/Boot 15 (1).png'),(99,15,'assets/Boot 15 (2).png'),(100,15,'assets/Boot 15 (3).png'),(101,15,'assets/Boot 15 (4).png'),(102,15,'assets/Boot 15 (5).png'),(103,15,'assets/Boot 15 (6).png'),(104,16,'assets/Boot 16 (1).png'),(105,16,'assets/Boot 16 (2).png'),(106,16,'assets/Boot 16 (3).png'),(107,16,'assets/Boot 16 (4).png'),(108,16,'assets/Boot 16 (5).png'),(109,16,'assets/Boot 16 (6).png'),(110,16,'assets/Boot 16 (7).png'),(121,13,'assets/Boot 13  (1).png'),(122,13,'assets/Boot 13  (2).png'),(123,13,'assets/Boot 13  (3).png'),(124,13,'assets/Boot 13  (4).png'),(125,13,'assets/Boot 13  (5).png'),(126,14,'assets/Boot 14  (1).png'),(127,14,'assets/Boot 14  (2).png'),(128,14,'assets/Boot 14  (3).png'),(129,14,'assets/Boot 14  (4).png'),(130,14,'assets/Boot 14  (5).png'),(131,17,'assets/Boot 1 (2).png'),(132,17,'assets/Boot 1 (1).png'),(133,17,'assets/Boot 1 (3).png'),(134,17,'assets/Boot 1 (4).png'),(135,17,'assets/Boot 1 (5).png'),(136,18,'assets/Boot 3 (2).png'),(137,18,'assets/Boot 3 (1).png'),(138,18,'assets/Boot 3 (3).png'),(139,18,'assets/Boot 3 (4).png'),(140,18,'assets/Boot 2 (2).png'),(141,19,'assets/Boot 2 (1).png'),(142,19,'assets/Boot 2 (3).png'),(143,19,'assets/Boot 2 (4).png'),(144,19,'assets/Boot 2 (5).png'),(145,20,'assets/Boot 4 (2).png'),(146,20,'assets/Boot 4 (1).png'),(147,20,'assets/Boot 4 (3).png'),(148,20,'assets/Boot 4 (4).png');
/*!40000 ALTER TABLE `schiffbild` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-07-02 14:26:41
