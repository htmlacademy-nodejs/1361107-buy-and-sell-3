-- Cписок всех категорий
SELECT * from categories

-- Cписок категорий для которых создано минимум одно объявление
SELECT 
	offers_categories.category_id,
	categories.name
FROM offers_categories
INNER JOIN categories 
	ON offers_categories.category_id = categories.id
GROUP BY 
	offers_categories.category_id,
	categories.name

-- Cписок категорий с количеством объявлений
SELECT 
	offers_categories.category_id,
	categories.name,
	count(offers_categories.category_id)
FROM offers_categories
INNER JOIN categories 
	ON offers_categories.category_id = categories.id
GROUP BY 
	offers_categories.category_id,
	categories.name

-- Cписок объявлений 
SELECT 
	offers.id,
	offers.title,
	offers.picture,
	offers.cost,
	offer_types.name as "type",
	offers.description,
	offers.created_date,
	users.firstname,
	users.lastname,
	users.email,
	(
		SELECT
			count(comments.id)
		FROM comments
		WHERE comments.offer_id = offers.id
	) as "comment_amount",
	(
		SELECT
			string_agg(categories.name, ', ')
		FROM offers_categories
		INNER JOIN categories
			ON offers_categories.category_id = categories.id
		WHERE offers_categories.offer_id = offers.id
	) as "category"
FROM offers
INNER JOIN offer_types
	ON offers.type = offer_types.id
INNER JOIN users
	ON offers.owner = users.id
ORDER BY offers.created_date DESC

-- Полная информация определённого объявления
SELECT 
	offers.id,
	offers.title,
	offers.picture,
	offers.cost,
	offer_types.name as "type",
	offers.description,
	offers.created_date,
	users.firstname,
	users.lastname,
	users.email,
	(
		SELECT
			count(comments.id)
		FROM comments
		WHERE comments.offer_id = offers.id
	) as "comment_amount",
	(
		SELECT
			string_agg(categories.name, ', ')
		FROM offers_categories
		INNER JOIN categories
			ON offers_categories.category_id = categories.id
		WHERE offers_categories.offer_id = offers.id
	) as "category"
FROM offers
INNER JOIN offer_types
	ON offers.type = offer_types.id
INNER JOIN users
	ON offers.owner = users.id
WHERE offers.id = 1

-- Список из 5 свежих комментариев
SELECT
	comments.id as "comment_id",
	comments.offer_id,
	users.firstname,
	users.lastname,
	comments.text
FROM comments
INNER JOIN users
	ON comments.user_id = users.id
ORDER BY comments.id DESC
LIMIT 5

-- Список комментариев для определённого объявления
SELECT
	comments.id as "comment_id",
	comments.offer_id,
	users.firstname,
	users.lastname,
	comments.text
FROM comments
INNER JOIN users
	ON comments.user_id = users.id
WHERE comments.offer_id = 3

-- 2 объявления, соответствующих типу куплю
SELECT 
	offers.id,
	offers.title,
	offers.picture,
	offers.cost,
	offer_types.name as "type",
	offers.description,
	offers.created_date,
	users.firstname,
	users.lastname,
	users.email,
	(
		SELECT
			count(comments.id)
		FROM comments
		WHERE comments.offer_id = offers.id
	) as "comment_amount",
	(
		SELECT
			string_agg(categories.name, ', ')
		FROM offers_categories
		INNER JOIN categories
			ON offers_categories.category_id = categories.id
		WHERE offers_categories.offer_id = offers.id
	) as "category"
FROM offers
INNER JOIN offer_types
	ON offers.type = offer_types.id
INNER JOIN users
	ON offers.owner = users.id
WHERE offer_types.name LIKE 'sale'
ORDER BY offers.created_date DESC
LIMIT 2

-- Обновление заголовка определённого объявления
UPDATE offers
SET offers.title = 'Уникальное предложение!'
WHERE offers.id = 1
