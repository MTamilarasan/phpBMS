CREATE TABLE `addresses` (`id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT, `title` VARCHAR(128), `shiptoname` VARCHAR(128), `address1` VARCHAR(128), `address2` VARCHAR(128), `city` VARCHAR(64), `state` VARCHAR(20), `postalcode` VARCHAR(15), `country` VARCHAR(64), `phone` VARCHAR(25), `email` VARCHAR(128), `notes` TEXT, `createdby` INTEGER UNSIGNED NOT NULL, `creationdate` DATETIME NOT NULL, `modifiedby` INTEGER UNSIGNED, `modifieddate` TIMESTAMP, PRIMARY KEY(`id`));
CREATE TABLE `addresstorecord` (`id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT, `tabledefid` INTEGER UNSIGNED NOT NULL, `recordid` INTEGER UNSIGNED NOT NULL, `addressid` INTEGER UNSIGNED NOT NULL, `defaultshipto` TINYINT UNSIGNED NOT NULL DEFAULT 0, `primary` TINYINT UNSIGNED NOT NULL DEFAULT 0, `createdby` INTEGER UNSIGNED NOT NULL, `creationdate` DATETIME NOT NULL, `modifiedby` INTEGER UNSIGNED, `modifieddate` TIMESTAMP, PRIMARY KEY(`id`));
ALTER TABLE `invoices` DROP COLUMN `status`, ADD COLUMN `shiptoname` VARCHAR(128), ADD COLUMN `shiptoaddress1` VARCHAR(128), ADD COLUMN `shiptoaddress2` VARCHAR(128),ADD COLUMN `shiptocity` VARCHAR(64), ADD COLUMN `shiptostate` VARCHAR(20), ADD COLUMN `shiptopostalcode` VARCHAR(15), ADD COLUMN `shiptocountry` VARCHAR(64), ADD COLUMN `billingaddressid` INTEGER, ADD COLUMN `shiptoaddressid` INTEGER, ADD COLUMN `shiptosameasbilling` TINYINT UNSIGNED NOT NULL DEFAULT 0;
INSERT INTO `settings` (`name`, `value`) VALUES ('clear_payment_on_invoice','1');
INSERT INTO `smartsearches` (`id`, `name`, `fromclause`, `valuefield`, `displayfield`, `secondaryfield`, `classfield`, `searchfields`, `filterclause`, `rolefield`, `tabledefid`, `moduleid`, `createdby`, `creationdate`, `modifiedby`, `modifieddate`) VALUES ('1', 'Pick Exisiting Client Address', '(clients INNER JOIN addresstorecord ON clients.id = addresstorecord.recordid AND addresstorecord.tabledefid = 2) INNER JOIN addresses ON addresstorecord.addressid = addresses.id', 'addresses.id', 'concat(if(clients.lastname!=\"\",concat(clients.lastname,\", \",clients.firstname,if(clients.company!=\"\",concat(\" (\",clients.company,\")\"),\"\")),clients.company), if(addresses.title != \"\",concat(\" [\", addresses.title, \"]\"),\"\"))', 'CONCAT(addresses.address1,if(addresses.address2 != \'\',concat(\'[br]\', addresses.address2),\'\'),if(addresses.city != \'\',concat(\'[br]\',addresses.city,\', \',if(addresses.state != \'\',addresses.state, \'\'),\' \',if(addresses.postalcode != \'\', addresses.postalcode, \'\')),\'\'),if(addresses.country != \'\',concat(\'[br]\',addresses.country),\'\'))', 'if(addresstorecord.primary,\'primary\',\'\')', 'clients.firstname, clients.lastname, clients.company, addresses.title, addresses.address1', 'clients.inactive=0', NULL, '306', '2', 1, NOW(), 1, NOW());
INSERT INTO `smartsearches` (`id`, `name`, `fromclause`, `valuefield`, `displayfield`, `secondaryfield`, `classfield`, `searchfields`, `filterclause`, `rolefield`, `tabledefid`, `moduleid`, `createdby`, `creationdate`, `modifiedby`, `modifieddate`) VALUES ('3', 'Pick Sales Order Client', '((clients INNER JOIN addresstorecord on clients.id = addresstorecord.recordid AND addresstorecord.tabledefid=2 AND addresstorecord.primary=1) INNER JOIN addresses ON  addresstorecord.addressid = addresses.id)', 'clients.id', 'IF(clients.company != \'\', CONCAT(clients.company,IF(clients.lastname != \'\' OR clients.firstname != \'\', CONCAT(\' (\',if(clients.lastname != \'\', clients.lastname, \'{blank}\'),\', \',if(clients.firstname != \'\', clients.firstname, \'{blank}\'),\')\'), \'\')), IF(clients.lastname != \'\' OR clients.firstname != \'\', CONCAT(if(clients.lastname != \'\', clients.lastname, \'{blank}\'),\', \',if(clients.firstname != \'\', clients.firstname, \'{blank}\')), \'\'))', 'IF(addresses.city != \'\' OR addresses.state !=\'\' OR addresses.postalcode != \'\', CONCAT(IF(addresses.city != \'\',addresses.city,\'\'),\', \',IF(addresses.state != \'\', addresses.state, \'\'),\' \',IF(addresses.postalcode != \'\', addresses.postalcode, \'\')),\'unspecified location\')', 'clients.type', 'clients.company, clients.firstname, clients.lastname', 'clients.inactive=0', NULL, '2', '2', 1, NOW(), 1, NOW());
INSERT INTO `smartsearches` (`id`, `name`, `fromclause`, `valuefield`, `displayfield`, `secondaryfield`, `classfield`, `searchfields`, `filterclause`, `rolefield`, `tabledefid`, `moduleid`, `createdby`, `creationdate`, `modifiedby`, `modifieddate`) VALUES ('4', 'Pick Product', 'products', 'products.id', 'CONCAT(products.partnumber,IF(products.partname != \'\',CONCAT(\' :: \',products.partname),\'\'))', 'products.type', '\'\'', 'products.partnumber, products.partname', 'products.inactive = 0 AND products.status = \'In Stock\'', NULL, '4', '2', 1, NOW(), 1, NOW());
INSERT INTO `smartsearches` (`id`, `name`, `fromclause`, `valuefield`, `displayfield`, `secondaryfield`, `classfield`, `searchfields`, `filterclause`, `rolefield`, `tabledefid`, `moduleid`, `createdby`, `creationdate`, `modifiedby`, `modifieddate`) VALUES ('6', 'Pick Client With Credit', '((clients INNER JOIN addresstorecord on clients.id = addresstorecord.recordid AND addresstorecord.tabledefid=2 AND addresstorecord.primary=1) INNER JOIN addresses ON  addresstorecord.addressid = addresses.id)', 'clients.id', 'IF(clients.company != \'\', CONCAT(clients.company,IF(clients.lastname != \'\' OR clients.firstname != \'\', CONCAT(\' (\',if(clients.lastname != \'\', clients.lastname, \'{blank}\'),\', \',if(clients.firstname != \'\', clients.firstname, \'{blank}\'),\')\'), \'\')), IF(clients.lastname != \'\' OR clients.firstname != \'\', CONCAT(if(clients.lastname != \'\', clients.lastname, \'{blank}\'),\', \',if(clients.firstname != \'\', clients.firstname, \'{blank}\')), \'\'))', 'IF(addresses.city != \'\' OR addresses.state !=\'\' OR addresses.postalcode != \'\', CONCAT(IF(addresses.city != \'\',addresses.city,\'\'),\', \',IF(addresses.state != \'\', addresses.state, \'\'),\' \',IF(addresses.postalcode != \'\', addresses.postalcode, \'\')),\'unspecified location\')', '\'\'', 'clients.company, clients.firstname, clients.lastname', 'clients.inactive = 0 AND clients.type=\'client\' AND clients.hascredit=1', NULL, '2', '2', 1, NOW(), 1, NOW());
INSERT INTO `smartsearches` (`id`, `name`, `fromclause`, `valuefield`, `displayfield`, `secondaryfield`, `classfield`, `searchfields`, `filterclause`, `rolefield`, `tabledefid`, `moduleid`, `createdby`, `creationdate`, `modifiedby`, `modifieddate`) VALUES ('7', 'Pick Client By Email', 'clients', 'clients.id', 'IF(clients.company != \'\', CONCAT(clients.company,IF(clients.lastname != \'\' OR clients.firstname != \'\', CONCAT(\' (\',if(clients.lastname != \'\', clients.lastname, \'{blank}\'),\', \',if(clients.firstname != \'\', clients.firstname, \'{blank}\'),\')\'), \'\')), IF(clients.lastname != \'\' OR clients.firstname != \'\', CONCAT(if(clients.lastname != \'\', clients.lastname, \'{blank}\'),\', \',if(clients.firstname != \'\', clients.firstname, \'{blank}\')), \'\'))', 'clients.email', 'clients.type', 'clients.email', 'clients.inactive = 0', NULL, '2', '2', 1, NOW(), 1, NOW());
INSERT INTO `smartsearches` (`id`, `name`, `fromclause`, `valuefield`, `displayfield`, `secondaryfield`, `classfield`, `searchfields`, `filterclause`, `rolefield`, `tabledefid`, `moduleid`, `createdby`, `creationdate`, `modifiedby`, `modifieddate`) VALUES ('8', 'Pick Client By Phone', 'clients', 'clients.id', 'IF(clients.company != \'\', CONCAT(clients.company,IF(clients.lastname != \'\' OR clients.firstname != \'\', CONCAT(\' (\',if(clients.lastname != \'\', clients.lastname, \'{blank}\'),\', \',if(clients.firstname != \'\', clients.firstname, \'{blank}\'),\')\'), \'\')), IF(clients.lastname != \'\' OR clients.firstname != \'\', CONCAT(if(clients.lastname != \'\', clients.lastname, \'{blank}\'),\', \',if(clients.firstname != \'\', clients.firstname, \'{blank}\')), \'\'))', 'CONCAT(IF(clients.workphone != \'\',CONCAT(clients.workphone,\' (w)[br]\'),\'\'),IF(clients.homephone != \'\',CONCAT(clients.homephone,\' (h)[br]\'),\'\'),IF(clients.mobilephone != \'\',CONCAT(clients.mobilephone,\' (m)[br]\'),\'\'),IF(clients.otherphone != \'\',CONCAT(clients.otherphone,\' (o)[br]\'),\'\'),IF(clients.fax != \'\',CONCAT(clients.fax,\' (fax)\'),\'\'))', 'clients.type', 'clients.workphone, clients.homephone, clients.mobilephone, clients.otherphone, clients.fax', 'clients.inactive = 0', NULL, '2', '2', 1, NOW(), 1, NOW());
INSERT INTO `tabs` (`id`, `name`, `tabgroup`, `location`, `displayorder`, `enableonnew`, `roleid`, `tooltip`, `notificationsql`, `createdby`, `creationdate`, `modifiedby`, `modifieddate`) VALUES ('303', 'addresses', 'clients entry', 'modules/bms/clients_addresses.php', '12', '0', '0', NULL, NULL, 1, NOW(), 1, NOW());