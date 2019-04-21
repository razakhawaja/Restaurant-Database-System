CREATE TABLE `customer` (
  `customer_id` int(20) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `contact1` double NOT NULL,
  `contact2` double DEFAULT 0,
  `membership` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`customer_id`),
  KEY `membership` (`membership`)
);



CREATE TABLE `employee` (
  `employee_id` int(20) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `contact` double NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `job` varchar(20) NOT NULL,
  PRIMARY KEY (`employee_id`)
);



CREATE TABLE `inventory` (
  `item_id` int(20) NOT NULL,
  `item_name` varchar(255) DEFAULT NULL,
  `stock` int(20) NOT NULL,
  PRIMARY KEY (`item_id`),
  KEY `inventory_ibfk_2_idx` (`item_name`)
);



CREATE TABLE `memberships` (
  `packages` varchar(20) NOT NULL,
  `discount` int(2) NOT NULL,
  PRIMARY KEY (`packages`)
);





CREATE TABLE `menu` (
  `item_id` int(20) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `price` double NOT NULL,
  PRIMARY KEY (`item_id`),
  UNIQUE KEY `item_name_UNIQUE` (`item_name`)
); 




CREATE TABLE `order_details` (
  `order_id` int(20) NOT NULL,
  `item_id` int(20) NOT NULL,
  `quantity` int(20) NOT NULL,
  PRIMARY KEY (`order_id`,`item_id`),
  KEY `item_id` (`item_id`)
); 



CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `total_bill` double DEFAULT 0,
  PRIMARY KEY (`order_id`),
  KEY `employee_id` (`employee_id`),
  KEY `customer_id` (`customer_id`)
);

ALTER TABLE `orders`
ADD CONSTRAINT `orders_ibfk_1`
FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE `orders`
ADD CONSTRAINT `orders_ibfk_2`
FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE `order_details`
ADD CONSTRAINT `order_details_ibfk_1`
FOREIGN KEY (`item_id`) REFERENCES `menu` (`item_id`)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE `order_details`
ADD CONSTRAINT `order_details_ibfk_2`
FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`)
ON DELETE CASCADE
ON UPDATE CASCADE;


ALTER TABLE `inventory`
ADD CONSTRAINT `inventory_ibfk_1`
FOREIGN KEY (`item_id`) REFERENCES `menu` (`item_id`)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE `customer`
ADD CONSTRAINT `customer_ibfk_1`
FOREIGN KEY (`membership`) REFERENCES `memberships` (`packages`)
ON DELETE CASCADE
ON UPDATE CASCADE;
