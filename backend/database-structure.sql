

CREATE TABLE `advances` (
  `id` int NOT NULL,
  `date` date NOT NULL,
  `stake_id` int NOT NULL,
  `available` decimal(18,2) NOT NULL,
  `total` decimal(18,2) NOT NULL,
  `trans_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `advance_complete_view` (
`address1` varchar(60)
,`address2` varchar(60)
,`address3` varchar(60)
,`available` decimal(18,2)
,`bank` decimal(18,2)
,`bankid` varchar(60)
,`cash` decimal(18,2)
,`cheque` decimal(18,2)
,`chequeid` varchar(60)
,`date` date
,`email` varchar(60)
,`id` int
,`stake_id` int
,`stake_name` varchar(60)
,`telephone` varchar(60)
,`total` decimal(18,2)
,`trans_id` int
,`type` varchar(20)
);

CREATE TABLE `advance_trans` (
  `transid` int NOT NULL,
  `advanceid` int NOT NULL,
  `usedamount` decimal(18,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `bin_card` (
  `incid` int NOT NULL,
  `date` date NOT NULL,
  `item` int NOT NULL,
  `in_quantity` decimal(18,3) NOT NULL DEFAULT '0.000',
  `in_up` decimal(18,2) NOT NULL DEFAULT '0.00',
  `in_total` decimal(18,2) NOT NULL DEFAULT '0.00',
  `out_quantity` decimal(18,3) NOT NULL DEFAULT '0.000',
  `out_up` decimal(18,2) NOT NULL DEFAULT '0.00',
  `out_total` decimal(18,2) NOT NULL DEFAULT '0.00',
  `type` varchar(10) NOT NULL,
  `GRN` int DEFAULT NULL,
  `GREN` int DEFAULT NULL,
  `INV` int DEFAULT NULL,
  `IRET` int DEFAULT NULL,
  `STC` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `categories` (
  `id` int NOT NULL,
  `name` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `grn` (
  `id` int NOT NULL,
  `rec_date` date NOT NULL,
  `ent_date` date NOT NULL,
  `orders` int DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `stakeholder` int DEFAULT NULL,
  `invoice` varchar(50) NOT NULL,
  `reference` varchar(200) NOT NULL,
  `payment_term` varchar(200) NOT NULL,
  `total` decimal(18,2) NOT NULL,
  `additional` decimal(18,2) NOT NULL DEFAULT '0.00',
  `final` decimal(18,2) NOT NULL DEFAULT '0.00',
  `remarks` text,
  `paid` decimal(18,2) DEFAULT '0.00',
  `user` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `grn_advance` (
  `grn_id` int NOT NULL,
  `advance_id` int NOT NULL,
  `amount` decimal(18,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `grn_items` (
  `item` int NOT NULL,
  `document` int NOT NULL,
  `quantity` decimal(18,3) NOT NULL,
  `unit_price` decimal(18,2) NOT NULL,
  `discount` varchar(100) NOT NULL,
  `total` decimal(18,2) NOT NULL,
  `final` decimal(18,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `grn_returned_items` (
  `item` int NOT NULL,
  `quantity` decimal(18,3) NOT NULL,
  `unit_price` decimal(18,2) NOT NULL,
  `total` decimal(18,2) NOT NULL,
  `discount` varchar(20) NOT NULL,
  `final` decimal(18,2) NOT NULL,
  `document` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `grn_return_note` (
  `id` int NOT NULL,
  `code` varchar(30) NOT NULL,
  `date` date NOT NULL,
  `returned_date` date NOT NULL,
  `grn` int NOT NULL,
  `total` decimal(18,2) NOT NULL,
  `change_total` decimal(18,2) NOT NULL DEFAULT '0.00',
  `final` decimal(18,2) NOT NULL DEFAULT '0.00',
  `completed` decimal(18,2) NOT NULL DEFAULT '0.00',
  `remarks` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `grn_trans` (
  `grn` int NOT NULL,
  `transaction` int NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `invoice` (
  `id` int NOT NULL,
  `type` varchar(20) NOT NULL,
  `date` date NOT NULL,
  `customer` int DEFAULT NULL,
  `creditamount` decimal(18,2) DEFAULT NULL,
  `prevdoc` int DEFAULT NULL,
  `total` decimal(18,2) NOT NULL,
  `discount` varchar(20) DEFAULT NULL,
  `final` decimal(18,2) NOT NULL,
  `remarks` text,
  `user` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `invoice_items` (
  `item` int NOT NULL,
  `document` int NOT NULL,
  `quantity` decimal(18,3) NOT NULL,
  `unit_price` decimal(18,2) NOT NULL,
  `discount` varchar(20) DEFAULT NULL,
  `total` decimal(18,2) NOT NULL,
  `final` decimal(18,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `invoice_vat` (
  `invoice` int NOT NULL,
  `vat` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `inv_trans` (
  `transaction` int NOT NULL,
  `invoice` int NOT NULL,
  `amount` decimal(18,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `items` (
  `id` int NOT NULL,
  `code` varchar(30) NOT NULL,
  `name` varchar(60) NOT NULL,
  `description` text NOT NULL,
  `unit` varchar(20) NOT NULL,
  `type` int NOT NULL,
  `quantity` decimal(18,3) NOT NULL DEFAULT '0.000',
  `price` decimal(18,2) NOT NULL,
  `discount` varchar(20) NOT NULL,
  `orders` decimal(18,3) NOT NULL,
  `sttatus` varchar(10) NOT NULL DEFAULT 'ACTIVE',
  `rep_block` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `item_by_group` (
`catrgory` varchar(60)
,`code` varchar(30)
,`description` text
,`discount` varchar(20)
,`id` int
,`name` varchar(60)
,`orders` decimal(18,3)
,`price` decimal(18,2)
,`quantity` decimal(18,3)
,`rep_block` int
,`status` varchar(10)
,`type` varchar(60)
,`unit` varchar(20)
);

CREATE TABLE `item_requests` (
  `id` int NOT NULL,
  `reqdate` date NOT NULL,
  `customer` int NOT NULL,
  `reference` varchar(50) DEFAULT NULL,
  `cusref` varchar(50) DEFAULT NULL,
  `total` decimal(18,2) NOT NULL,
  `discount` varchar(50) NOT NULL,
  `final` decimal(18,2) NOT NULL,
  `remarks` text,
  `cby` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `item_request_items` (
  `id` int NOT NULL,
  `item` int NOT NULL,
  `document` int NOT NULL,
  `unitprice` decimal(18,2) NOT NULL,
  `quantity` decimal(18,3) NOT NULL,
  `total` decimal(18,2) NOT NULL,
  `discount` varchar(20) DEFAULT NULL,
  `final` decimal(18,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `item_return_items` (
  `item_id` int NOT NULL,
  `quantity` decimal(18,3) NOT NULL,
  `unit_price` decimal(18,2) NOT NULL,
  `total` decimal(18,2) NOT NULL,
  `discount` varchar(10) NOT NULL,
  `final` decimal(18,2) NOT NULL,
  `document` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `item_return_note` (
  `id` int NOT NULL,
  `return_date` date NOT NULL,
  `reference` varchar(200) NOT NULL,
  `invoice` int NOT NULL,
  `returned_amount` decimal(18,2) NOT NULL,
  `reason` text NOT NULL,
  `date` date NOT NULL,
  `user` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `permissions` (
  `id` int NOT NULL,
  `name` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `purchase_order` (
  `id` int NOT NULL,
  `stake` int NOT NULL,
  `required` date NOT NULL,
  `requested` date NOT NULL,
  `reference` text,
  `delivery` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `payment_term` text,
  `total` decimal(18,2) NOT NULL,
  `discount` varchar(20) DEFAULT NULL,
  `final` decimal(18,2) NOT NULL,
  `remarks` text,
  `uid` int NOT NULL,
  `type` varchar(8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `purchase_order_items` (
  `id` int NOT NULL,
  `item` int NOT NULL,
  `document` int NOT NULL,
  `unitprice` decimal(18,2) NOT NULL,
  `quantitiy` decimal(18,3) NOT NULL,
  `discount` varchar(20) DEFAULT NULL,
  `total` decimal(18,2) NOT NULL,
  `final` decimal(18,2) NOT NULL,
  `success` decimal(18,3) NOT NULL DEFAULT '0.000'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `returned_grn_items_view` (
`discount` varchar(20)
,`document` int
,`final` decimal(18,2)
,`grn` int
,`item` int
,`quantity` decimal(18,3)
,`total` decimal(18,2)
,`unit_price` decimal(18,2)
);
CREATE TABLE `returned_invoice_item_view` (
`discount` varchar(10)
,`document` int
,`final` decimal(18,2)
,`invoice` int
,`item_id` int
,`quantity` decimal(18,3)
,`total` decimal(18,2)
,`unit_price` decimal(18,2)
);

CREATE TABLE `settings` (
  `id` int NOT NULL,
  `name` varchar(60) NOT NULL,
  `status` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `stakeholders` (
  `id` int NOT NULL,
  `name` varchar(60) NOT NULL,
  `address1` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `address2` varchar(60) NOT NULL,
  `address3` varchar(60) NOT NULL,
  `email` varchar(60) NOT NULL,
  `telephone` varchar(60) NOT NULL,
  `type` varchar(20) NOT NULL,
  `status` varchar(10) NOT NULL DEFAULT 'ACTIVE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `stc_doc` (
  `id` int NOT NULL,
  `ref` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `cat` int DEFAULT NULL,
  `sub_cat` int DEFAULT NULL,
  `date_begin` date NOT NULL,
  `date_end` date DEFAULT NULL,
  `status` int NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `stc_doc_items` (
  `item` int NOT NULL,
  `document` int NOT NULL,
  `unit_price` decimal(18,2) NOT NULL,
  `avg_price` decimal(18,2) NOT NULL,
  `last_system` decimal(18,3) NOT NULL,
  `last_physical` decimal(18,3) NOT NULL DEFAULT '0.000',
  `variance_qty` decimal(18,3) DEFAULT NULL,
  `variance_total` decimal(18,2) DEFAULT NULL,
  `status` varchar(15) NOT NULL DEFAULT 'NOT_UPDATED',
  `item_status` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `transactions` (
  `id` int NOT NULL,
  `amount` decimal(18,2) NOT NULL,
  `cash` decimal(18,2) NOT NULL,
  `bank` decimal(18,2) NOT NULL,
  `cheque` decimal(18,2) NOT NULL,
  `bankid` varchar(60) NOT NULL,
  `chequeid` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `types` (
  `id` int NOT NULL,
  `name` varchar(60) NOT NULL,
  `category_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(60) NOT NULL,
  `password` varchar(60) NOT NULL,
  `occupation` varchar(60) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `user_permission` (
  `user_id` int NOT NULL,
  `permission_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `vats` (
  `id` int NOT NULL,
  `name` varchar(50) NOT NULL,
  `percentage` varchar(20) NOT NULL,
  `invoice` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `action` varchar(20) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
DROP TABLE IF EXISTS `advance_complete_view`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `advance_complete_view`  AS  select `advances`.`id` AS `id`,`advances`.`date` AS `date`,`advances`.`available` AS `available`,`advances`.`total` AS `total`,`transactions`.`cash` AS `cash`,`transactions`.`bank` AS `bank`,`transactions`.`cheque` AS `cheque`,`transactions`.`bankid` AS `bankid`,`transactions`.`chequeid` AS `chequeid`,`stakeholders`.`name` AS `stake_name`,`stakeholders`.`address1` AS `address1`,`stakeholders`.`address2` AS `address2`,`stakeholders`.`address3` AS `address3`,`stakeholders`.`email` AS `email`,`stakeholders`.`telephone` AS `telephone`,`stakeholders`.`type` AS `type`,`transactions`.`id` AS `trans_id`,`stakeholders`.`id` AS `stake_id` from ((`advances` join `stakeholders`) join `transactions`) where ((`advances`.`stake_id` = `stakeholders`.`id`) and (`advances`.`trans_id` = `transactions`.`id`)) ;
DROP TABLE IF EXISTS `item_by_group`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `item_by_group`  AS  select `items`.`id` AS `id`,`items`.`sttatus` AS `status`,`items`.`rep_block` AS `rep_block`,`items`.`code` AS `code`,`items`.`name` AS `name`,`items`.`quantity` AS `quantity`,`items`.`description` AS `description`,`items`.`unit` AS `unit`,`items`.`price` AS `price`,`items`.`discount` AS `discount`,`items`.`orders` AS `orders`,`types`.`name` AS `type`,`categories`.`name` AS `catrgory` from ((`items` join `categories`) join `types`) where ((`items`.`type` = `types`.`id`) and (`types`.`category_id` = `categories`.`id`)) ;
DROP TABLE IF EXISTS `returned_grn_items_view`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `returned_grn_items_view`  AS  select `grn_returned_items`.`item` AS `item`,`grn_returned_items`.`quantity` AS `quantity`,`grn_returned_items`.`unit_price` AS `unit_price`,`grn_returned_items`.`total` AS `total`,`grn_returned_items`.`discount` AS `discount`,`grn_returned_items`.`final` AS `final`,`grn_returned_items`.`document` AS `document`,`grn_return_note`.`grn` AS `grn` from (`grn_returned_items` join `grn_return_note`) where (`grn_returned_items`.`document` = `grn_return_note`.`id`) ;
DROP TABLE IF EXISTS `returned_invoice_item_view`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `returned_invoice_item_view`  AS  select `item_return_items`.`item_id` AS `item_id`,`item_return_items`.`quantity` AS `quantity`,`item_return_items`.`unit_price` AS `unit_price`,`item_return_items`.`total` AS `total`,`item_return_items`.`discount` AS `discount`,`item_return_items`.`final` AS `final`,`item_return_items`.`document` AS `document`,`item_return_note`.`invoice` AS `invoice` from (`item_return_items` join `item_return_note`) where (`item_return_note`.`id` = `item_return_items`.`document`) ;


ALTER TABLE `advances`
  ADD PRIMARY KEY (`id`),
  ADD KEY `stake_id` (`stake_id`),
  ADD KEY `trans_id` (`trans_id`);

ALTER TABLE `advance_trans`
  ADD KEY `transid` (`transid`),
  ADD KEY `advanceid` (`advanceid`);

ALTER TABLE `bin_card`
  ADD PRIMARY KEY (`incid`),
  ADD KEY `bin_card_ibfk_1` (`item`),
  ADD KEY `GRN` (`GRN`),
  ADD KEY `GREN` (`GREN`),
  ADD KEY `INV` (`INV`),
  ADD KEY `IRET` (`IRET`),
  ADD KEY `STC` (`STC`);

ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `grn`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orders` (`orders`),
  ADD KEY `stakeholder` (`stakeholder`),
  ADD KEY `user` (`user`);

ALTER TABLE `grn_advance`
  ADD KEY `grn_advance_ibfk_1` (`grn_id`),
  ADD KEY `grn_advance_ibfk_2` (`advance_id`);

ALTER TABLE `grn_items`
  ADD KEY `grn_items_ibfk_1` (`item`),
  ADD KEY `grn_items_ibfk_2` (`document`);

ALTER TABLE `grn_returned_items`
  ADD KEY `grn_returned_items_ibfk_1` (`item`),
  ADD KEY `grn_returned_items_ibfk_2` (`document`);

ALTER TABLE `grn_return_note`
  ADD PRIMARY KEY (`id`),
  ADD KEY `grn` (`grn`);

ALTER TABLE `grn_trans`
  ADD KEY `grn_trans_ibfk_1` (`grn`),
  ADD KEY `grn_trans_ibfk_2` (`transaction`);

ALTER TABLE `invoice`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer` (`customer`),
  ADD KEY `prevdoc` (`prevdoc`),
  ADD KEY `user` (`user`);

ALTER TABLE `invoice_items`
  ADD KEY `item` (`item`),
  ADD KEY `document` (`document`);

ALTER TABLE `invoice_vat`
  ADD KEY `invoice_vat_ibfk_1` (`invoice`),
  ADD KEY `invoice_vat_ibfk_2` (`vat`);

ALTER TABLE `inv_trans`
  ADD KEY `invoice` (`invoice`),
  ADD KEY `transaction` (`transaction`);

ALTER TABLE `items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `good` (`code`),
  ADD KEY `type` (`type`);

ALTER TABLE `item_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `connect` (`cby`),
  ADD KEY `stake_connectr` (`customer`);

ALTER TABLE `item_request_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `item_conn` (`item`),
  ADD KEY `request_conn` (`document`);

ALTER TABLE `item_return_items`
  ADD KEY `item_id` (`item_id`),
  ADD KEY `document` (`document`);

ALTER TABLE `item_return_note`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invoice` (`invoice`),
  ADD KEY `user` (`user`);

ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `purchase_order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sth` (`stake`),
  ADD KEY `uid` (`uid`);

ALTER TABLE `purchase_order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `purchase_order_items_ibfk_1` (`document`),
  ADD KEY `purchase_order_items_ibfk_2` (`item`);

ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `stakeholders`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `stc_doc`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `stc_doc_items`
  ADD KEY `item` (`item`),
  ADD KEY `document` (`document`);

ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `types`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `user_permission`
  ADD KEY `user_id` (`user_id`),
  ADD KEY `permission_id` (`permission_id`);

ALTER TABLE `vats`
  ADD PRIMARY KEY (`id`);


ALTER TABLE `advances`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `bin_card`
  MODIFY `incid` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `grn`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `grn_return_note`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `invoice`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `item_requests`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `item_request_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `item_return_note`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `permissions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `purchase_order`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `purchase_order_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `settings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `stakeholders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `stc_doc`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `transactions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `types`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `vats`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;


ALTER TABLE `advances`
  ADD CONSTRAINT `advances_ibfk_1` FOREIGN KEY (`stake_id`) REFERENCES `stakeholders` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `advances_ibfk_2` FOREIGN KEY (`trans_id`) REFERENCES `transactions` (`id`) ON DELETE RESTRICT;

ALTER TABLE `advance_trans`
  ADD CONSTRAINT `advance_trans_ibfk_1` FOREIGN KEY (`transid`) REFERENCES `transactions` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `advance_trans_ibfk_2` FOREIGN KEY (`advanceid`) REFERENCES `advances` (`id`) ON DELETE RESTRICT;

ALTER TABLE `bin_card`
  ADD CONSTRAINT `bin_card_ibfk_1` FOREIGN KEY (`item`) REFERENCES `items` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `bin_card_ibfk_2` FOREIGN KEY (`GRN`) REFERENCES `grn` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `bin_card_ibfk_3` FOREIGN KEY (`GREN`) REFERENCES `grn_return_note` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `bin_card_ibfk_4` FOREIGN KEY (`INV`) REFERENCES `invoice` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `bin_card_ibfk_5` FOREIGN KEY (`IRET`) REFERENCES `item_return_note` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `bin_card_ibfk_6` FOREIGN KEY (`STC`) REFERENCES `stc_doc` (`id`) ON DELETE RESTRICT;

ALTER TABLE `grn`
  ADD CONSTRAINT `grn_ibfk_1` FOREIGN KEY (`orders`) REFERENCES `purchase_order` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `grn_ibfk_4` FOREIGN KEY (`user`) REFERENCES `users` (`id`) ON DELETE RESTRICT;

ALTER TABLE `grn_advance`
  ADD CONSTRAINT `grn_advance_ibfk_1` FOREIGN KEY (`grn_id`) REFERENCES `grn` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `grn_advance_ibfk_2` FOREIGN KEY (`advance_id`) REFERENCES `advances` (`id`) ON DELETE RESTRICT;

ALTER TABLE `grn_items`
  ADD CONSTRAINT `grn_items_ibfk_1` FOREIGN KEY (`item`) REFERENCES `items` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `grn_items_ibfk_2` FOREIGN KEY (`document`) REFERENCES `grn` (`id`) ON DELETE RESTRICT;

ALTER TABLE `grn_returned_items`
  ADD CONSTRAINT `grn_returned_items_ibfk_1` FOREIGN KEY (`item`) REFERENCES `items` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `grn_returned_items_ibfk_2` FOREIGN KEY (`document`) REFERENCES `grn_return_note` (`id`) ON DELETE RESTRICT;

ALTER TABLE `grn_return_note`
  ADD CONSTRAINT `grn_return_note_ibfk_1` FOREIGN KEY (`grn`) REFERENCES `grn` (`id`) ON DELETE RESTRICT;

ALTER TABLE `grn_trans`
  ADD CONSTRAINT `grn_trans_ibfk_1` FOREIGN KEY (`grn`) REFERENCES `grn` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `grn_trans_ibfk_2` FOREIGN KEY (`transaction`) REFERENCES `transactions` (`id`) ON DELETE RESTRICT;

ALTER TABLE `invoice`
  ADD CONSTRAINT `invoice_ibfk_1` FOREIGN KEY (`customer`) REFERENCES `stakeholders` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `invoice_ibfk_2` FOREIGN KEY (`prevdoc`) REFERENCES `item_requests` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `invoice_ibfk_4` FOREIGN KEY (`user`) REFERENCES `users` (`id`) ON DELETE RESTRICT;

ALTER TABLE `invoice_items`
  ADD CONSTRAINT `invoice_items_ibfk_1` FOREIGN KEY (`item`) REFERENCES `items` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `invoice_items_ibfk_2` FOREIGN KEY (`document`) REFERENCES `invoice` (`id`) ON DELETE RESTRICT;

ALTER TABLE `invoice_vat`
  ADD CONSTRAINT `invoice_vat_ibfk_1` FOREIGN KEY (`invoice`) REFERENCES `invoice` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `invoice_vat_ibfk_2` FOREIGN KEY (`vat`) REFERENCES `vats` (`id`) ON DELETE RESTRICT;

ALTER TABLE `inv_trans`
  ADD CONSTRAINT `inv_trans_ibfk_1` FOREIGN KEY (`invoice`) REFERENCES `invoice` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `inv_trans_ibfk_2` FOREIGN KEY (`transaction`) REFERENCES `transactions` (`id`) ON DELETE RESTRICT;

ALTER TABLE `items`
  ADD CONSTRAINT `items_ibfk_1` FOREIGN KEY (`type`) REFERENCES `types` (`id`) ON DELETE RESTRICT;

ALTER TABLE `item_requests`
  ADD CONSTRAINT `connect` FOREIGN KEY (`cby`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `stake_connectr` FOREIGN KEY (`customer`) REFERENCES `stakeholders` (`id`) ON DELETE RESTRICT;

ALTER TABLE `item_request_items`
  ADD CONSTRAINT `item_conn` FOREIGN KEY (`item`) REFERENCES `items` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `request_conn` FOREIGN KEY (`document`) REFERENCES `item_requests` (`id`) ON DELETE RESTRICT;

ALTER TABLE `item_return_items`
  ADD CONSTRAINT `item_return_items_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `item_return_items_ibfk_2` FOREIGN KEY (`document`) REFERENCES `item_return_note` (`id`) ON DELETE RESTRICT;

ALTER TABLE `item_return_note`
  ADD CONSTRAINT `item_return_note_ibfk_1` FOREIGN KEY (`invoice`) REFERENCES `invoice` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `item_return_note_ibfk_2` FOREIGN KEY (`user`) REFERENCES `users` (`id`) ON DELETE RESTRICT;

ALTER TABLE `purchase_order`
  ADD CONSTRAINT `purchase_order_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `sth` FOREIGN KEY (`stake`) REFERENCES `stakeholders` (`id`) ON DELETE RESTRICT;

ALTER TABLE `purchase_order_items`
  ADD CONSTRAINT `purchase_order_items_ibfk_1` FOREIGN KEY (`document`) REFERENCES `purchase_order` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `purchase_order_items_ibfk_2` FOREIGN KEY (`item`) REFERENCES `items` (`id`) ON DELETE RESTRICT;

ALTER TABLE `stc_doc_items`
  ADD CONSTRAINT `stc_doc_items_ibfk_1` FOREIGN KEY (`item`) REFERENCES `items` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `stc_doc_items_ibfk_2` FOREIGN KEY (`document`) REFERENCES `stc_doc` (`id`) ON DELETE RESTRICT;

ALTER TABLE `types`
  ADD CONSTRAINT `types_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT;

ALTER TABLE `user_permission`
  ADD CONSTRAINT `user_permission_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `user_permission_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE RESTRICT;
COMMIT;

