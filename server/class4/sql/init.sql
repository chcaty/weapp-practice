-- 分类表初始化
use practice;
SET @arr := JSON_ARRAY("生活方式","文创好物","创意玩具","微瑕特卖","宫廷服饰","甄选珠宝","宫廷美玉");

DROP PROCEDURE IF EXISTS procInitCategory;
--设置$作为分隔符
DELIMITER $ 
CREATE PROCEDURE procInitCategory()
BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE len int default JSON_LENGTH(@arr);
    declare category nvarchar(50);
    
    WHILE i<len DO
        set category = JSON_EXTRACT(@arr, CONCAT('$[', i, ']'));
        set category = replace(category, '"','');
        INSERT INTO goods_category(category_name,createdAt,updatedAt) VALUES(category ,now(),now() );
        SET i = i+1;
    END WHILE;
END $
CALL procInitCategory();


-- 初始化品牌表
use practice;

SET @arr := JSON_ARRAY("故宫文化","朝阳国贸CBD","西单购物广场");

DROP PROCEDURE IF EXISTS procInitBrand;
--设置$作为分隔符
DELIMITER $ 
CREATE PROCEDURE procInitBrand()
BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE len int default JSON_LENGTH(@arr);
    
    WHILE i<len DO
        INSERT INTO brand(brand_name, createdAt, updatedAt) VALUES( JSON_EXTRACT(@arr, CONCAT('$[', i, ']')),now(),now() );
        SET i = i+1;
    END WHILE;
END $
delimiter ;
CALL procInitBrand();


-- 初始化基本商品表
use practice;

SET @arr := JSON_ARRAY("夏凉被","冬暖被","秋躺椅");

DROP PROCEDURE IF EXISTS procInitGoods;
--设置$作为分隔符
DELIMITER $ 
CREATE PROCEDURE procInitGoods()
BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE len int default 10;
    WHILE i<len DO	
		select @brand_name := brand_name, @brand_id := id from brand order by rand() limit 1;
		select @spu_no := concat( '', @brand_id, year(now()), uuid());
        
        select @goods_name := concat( JSON_EXTRACT(@arr, CONCAT('$[', FLOOR(rand()*3), ']')), floor(rand()*1000) );
        select @start_price := 1000 * rand();
        select @category_id := id from goods_category order by rand() limit 1;
        insert into goods(spu_no,goods_name,start_price,category_id,brand_id,createdAt,updatedAt) values(@spu_no,@goods_name,@start_price,@category_id,@brand_id,now(),now());
        
        SET i = i+1;
    END WHILE;
END $
CALL procInitGoods();

SELECT * FROM goods;


-- 初始化商品描述表
use practice;

set @links := JSON_ARRAY("https://gitee.com/rixingyike/my-images/raw/master/yishulun/20200814230735.png",
"https://gitee.com/rixingyike/my-images/raw/master/yishulun/20200814230726.png",
"https://gitee.com/rixingyike/my-images/raw/master/yishulun/20200814230740.png");
set @links_count := json_length(@links);

drop procedure if exists procInitGoodsInfo; 
delimiter $
create procedure procInitGoodsInfo()
begin
	declare j int default 0;
    declare goods_id int;
    declare str_goods_name nvarchar(50);
    declare flag int default 0;
    declare cover_image_kind int default 0;
    declare content_describe_kind int default 1;
    declare content text;
    
    declare list_cursor cursor for select id, goods_name from goods; 
    declare continue handler for not found set flag=1;
    
    open list_cursor;  # 打开游标
        fetch list_cursor into goods_id,str_goods_name;
        select goods_id,str_goods_name;
        while (flag <> 1) do
			select goods_id;
            set j=0;
			while (j<@links_count) do
				select j;
                set content = JSON_EXTRACT(@links, '$[1]');
                set content = replace(content,'"','');
                select content;
                insert into goods_info(goods_id,kind,content,createdAt,updatedAt) values(goods_id,cover_image_kind,content,now(),now());
                set j = j+1;
            end while;
            set content = concat(replace(str_goods_name,'"',''),"商品描述文本");
            -- select content;
            insert into goods_info(goods_id,kind,content,createdAt,updatedAt) values(goods_id,content_describe_kind,content,now(),now());
            
            fetch list_cursor into goods_id,str_goods_name;
        end while;
    close list_cursor;
end $
delimiter ;
call procInitGoodsInfo();

-- 初始化规格表
use practice;

set @arr := Json_object("颜色",json_array("蓝色","粉色"),"尺码",json_array("120x150*240","120x180*300","120x200*360"));

select * from goods_attr_key;
select * from goods_attr_value;
select * from goods_sku;

drop procedure if exists procInitAttrKeyValues;
delimiter $
create procedure procInitAttrKeyValues()
begin
	-- 局部变量与会话变量 
	declare i int default 0;
    declare j int default 0;
    
    declare len int default 0;
    declare flag int default 0;
    declare goods_id int;
    
    
    declare goods_list_cursor cursor for select id from goods;
    declare continue handler for not found set flag = 1;
    
    start transaction;
    
    select @attr_keys :=  JSON_KEYS(@arr);
    set @attr_keys_len = json_length(@attr_keys);
    
    open goods_list_cursor;
    fetch goods_list_cursor into goods_id;
    while (flag<>1) do
		set i = 0;
        
		while i < @attr_keys_len do
			-- 循环拿出两个规格名称
			select @attr_key := json_extract(@attr_keys, concat('$[',i,']'));
			insert into goods_attr_key(goods_id,attr_name,createdAt,updatedAt) 	
				values(goods_id,@attr_key,now(),now());
			select @goods_attr_key_id := @@IDENTITY;
            
            select @goods_attr_values := json_extract(@arr,concat('$.',@attr_key,''));
            set @goods_attr_values_len := json_length(@goods_attr_values);
            
            set j = 0;
            
            while (j<@goods_attr_values_len) do
				set @goods_attr_value := json_extract(@goods_attr_values,concat('$[',j,']'));
				insert into goods_attr_value(goods_id,attr_key_id,attr_value,createdAt,updatedAt) 
					values(goods_id,@goods_attr_key_id,@goods_attr_value,now(),now());

				set j = j+1;
            end while;
            
			set i = i+1;
		end while;

        fetch goods_list_cursor into goods_id;
    end while;
    close goods_list_cursor;
    
    call procInitGoodsSku();
    
    -- rollback;
	
    commit;
end $

call procInitAttrKeyValues();


-- 初始化sku表
use practice;

drop procedure if exists procInitGoodsSku;
delimiter $
create procedure procInitGoodsSku()
begin
	declare goods_attr_value1 int;
    declare goods_attr_value2 int;
    declare flag int default 0;
    declare goods_id int;
	declare goods_attr_values_cursor cursor for select a.goods_id, a.id,b.id FROM goods_attr_value as a 
		left join goods_attr_value as b on a.attr_key_id != b.attr_key_id 
        and a.goods_id = b.goods_id 
        and a.attr_key_id < b.attr_key_id;
    declare continue handler for not found set flag = 1;
    
    open goods_attr_values_cursor;
    fetch goods_attr_values_cursor into goods_id, goods_attr_value1, goods_attr_value2;
    while (flag<>1) do
		select @goods_attr_path := json_array(goods_attr_value1, goods_attr_value2);
        set @price := floor(rand()*10000 + 100);
        set @stock := floor(rand()*100 + 1);
		insert into goods_sku(goods_id,goods_attr_path,price,stock,createdAt,updatedAt) 
			values(goods_id,@goods_attr_path,@price,@stock,now(),now());
		fetch goods_attr_values_cursor into goods_id, goods_attr_value1, goods_attr_value2;
    end while;
    close goods_attr_values_cursor;
end $

-- 初始化商品表，修改分类id随机方式
CREATE DEFINER=`root`@`localhost` PROCEDURE `procInitGoods`()
BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE len int default 50;
    declare goods_category_id int;
    SET @arr := JSON_ARRAY("夏凉被","冬暖被","秋躺椅");
    
    WHILE i<len DO	
		select @brand_name := brand_name, @brand_id := id from brand order by rand() limit 1;
		select @spu_no := concat( @brand_id, year(now()), uuid() );
        
        select @goods_name := concat( JSON_EXTRACT(@arr, CONCAT('$[', FLOOR(rand()*3), ']')), floor(rand()*1000) );
        select @start_price := 1000 * rand();
        set goods_category_id = (select id from goods_category order by rand() limit 1);
        insert into goods(spu_no,goods_name,start_price,category_id,brand_id,createdAt,updatedAt) 
			    values(@spu_no,@goods_name,@start_price,goods_category_id,@brand_id,now(),now());
        
        SET i = i+1;
    END WHILE;
END