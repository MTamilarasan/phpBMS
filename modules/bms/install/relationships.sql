INSERT INTO relationships VALUES (1,'id','sales managers','salesmanagerid',2,9,2,'2004-04-09 15:11:47',2,20040413103005,0);
INSERT INTO relationships VALUES (4,'clientid','invoices','id',2,3,2,'2004-04-09 15:30:34',2,20040413103005,1);
INSERT INTO relationships VALUES (5,'id','clients','clientid',3,2,2,'2004-04-10 13:20:37',2,20040413103005,0);
INSERT INTO relationships VALUES (6,'id','tax areas','taxareaid',3,6,2,'2004-04-10 13:33:27',2,20040413103005,0);
INSERT INTO relationships VALUES (7,'id','invoices','invoiceid',5,3,2,'2004-04-10 13:34:11',2,20040413103005,0);
INSERT INTO relationships VALUES (8,'id','products','productid',5,4,2,'2004-04-10 13:34:53',2,20040413103005,0);
INSERT INTO relationships VALUES (9,'id','parent products','parentid',8,4,2,'2004-04-10 13:36:24',2,20040413103005,0);
INSERT INTO relationships VALUES (10,'id','child products','childid',8,4,2,'2004-04-10 13:36:50',2,20040413103005,0);
INSERT INTO relationships VALUES (11,'categoryid','products','id',7,4,2,'2004-04-10 13:37:27',2,20040413103005,1);
INSERT INTO relationships VALUES (12,'productid','invoice line items','id',4,5,2,'2004-04-10 13:37:58',2,20040413103005,1);
INSERT INTO relationships VALUES (13,'parentid','prerequisites','id',4,8,2,'2004-04-10 13:39:16',2,20040413103005,1);
INSERT INTO relationships VALUES (14,'taxareaid','invoices','id',6,3,2,'2004-04-10 13:39:43',2,20040413103005,0);
INSERT INTO relationships VALUES (15,'salesmanagerid','sales manager for clients','id',9,2,2,'2004-04-10 13:40:31',2,20040413103005,0);
INSERT INTO relationships VALUES (16,'createdby','created clients','id',9,2,2,'2004-04-10 13:41:06',2,20040413103005,0);
INSERT INTO relationships VALUES (17,'modifiedby','modified clients','id',9,2,2,'2004-04-10 13:41:21',2,20040413103005,0);
INSERT INTO relationships VALUES (18,'createdby','created invoices','id',9,3,2,'2004-04-10 13:41:34',2,20040413103005,0);
INSERT INTO relationships VALUES (19,'modifiedby','modified invoices','id',9,3,2,'2004-04-10 13:41:52',2,20040413103005,0);
INSERT INTO relationships VALUES (20,'invoiceid','line items','id',3,5,2,'2004-04-10 13:45:08',2,20050330111955,1);
INSERT INTO relationships VALUES (21,'discountid','Invoices','id',25,3,2,'2005-10-21 19:22:00',2,20051021192200,0);
INSERT INTO relationships VALUES (22,'id','Discounts','discountid',3,25,2,'2005-10-21 19:22:33',2,20051021192233,0);