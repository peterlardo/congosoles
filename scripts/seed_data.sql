-- =============================================================
-- SEED DATA: 19 boutiques + ~180 promotions pour Congo Soldes
-- À exécuter dans le SQL Editor de Supabase
-- =============================================================

-- Supprimer la contrainte UNIQUE pour ce seed
ALTER TABLE public.stores DROP CONSTRAINT IF EXISTS stores_user_id_key;

DO $$
DECLARE
  admin_id UUID;
  store_ids UUID[];
  store_ref RECORD;
  item JSONB;
  items_json JSONB;
  store_index INT;
BEGIN
  -- Récupérer l'admin
  SELECT id INTO admin_id FROM auth.users WHERE email = 'admin@congosoldes.cg' LIMIT 1;
  IF admin_id IS NULL THEN
    RAISE EXCEPTION 'Admin introuvable. Connectez-vous avec admin@congosoldes.cg avant d''exécuter ce seed.';
  END IF;

  -- Vider les anciennes données
  DELETE FROM public.promotions WHERE store_id IN (SELECT id FROM public.stores);
  DELETE FROM public.stores;

  -- Insérer les 19 boutiques
  WITH s AS (
    INSERT INTO public.stores (user_id, name, slug, description, image, category, district, address, phone, status, verified, featured, rating, review_count)
    VALUES
      (admin_id,'Nzinga Store','nzinga-store','Mode africaine et contemporaine — robes wax, prêt-à-porter et accessoires.','https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80','mode','Moungali','Avenue des Arts, Moungali','+242055000001','active',true,true,4.5,128),
      (admin_id,'Fashion Hub','fashion-hub','Les tendances à portée de main — vêtements, chaussures et accessoires.','https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80','mode','Bacongo','Rue de la Mode, Bacongo','+242055000002','active',true,true,4.3,95),
      (admin_id,'MaxiElec','maxielec','L''électroménager au meilleur prix — TV, climatiseurs, machines à laver.','https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80','electromenager','Makélékélé','Boulevard du Commerce','+242055000003','active',true,true,4.6,210),
      (admin_id,'ElecShop Congo','elecshop-congo','Appareils électroniques et électroménagers de grandes marques.','https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80','electromenager','Ouenzé','Marché Total, Ouenzé','+242055000004','active',true,false,4.2,67),
      (admin_id,'Chez Mama','chez-mama','La cuisine congolaise authentique — poulet braisé, attiéké, ndolé.','https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80','restaurants','Poto-Poto','Rue des Saveurs, Poto-Poto','+242055000005','active',true,true,4.8,312),
      (admin_id,'Le Délice','le-delice','Restaurant gastronomique — cuisine internationale et locale raffinée.','https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80','restaurants','Bacongo','Place de la Liberté, Bacongo','+242055000006','active',true,false,4.4,156),
      (admin_id,'TechCongo','techcongo','Smartphones, tablettes et accessoires des plus grandes marques.','https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&q=80','telephones','Moungali','Centre Commercial, Moungali','+242055000007','active',true,true,4.4,189),
      (admin_id,'Phone Market','phone-market','Téléphones et accessoires à prix discount.','https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&q=80','telephones','Talangaï','Marché Central, Talangaï','+242055000008','active',true,false,4.1,78),
      (admin_id,'Casino Brazza','casino-brazza','Le leader de la grande distribution — produits frais, alimentation.','https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80','supermarches','Makélékélé','Avenue de la Liberté','+242055000009','active',true,true,4.7,445),
      (admin_id,'Super U Congo','super-u-congo','Supermarché — tout pour la maison au meilleur prix.','https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&q=80','supermarches','Bacongo','Rue Principale, Bacongo','+242055000010','active',true,true,4.5,267),
      (admin_id,'Glow Cosmetics','glow-cosmetics','Maquillage, soins et produits de beauté — marques premium.','https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80','beaute','Poto-Poto','Marché de Poto-Poto','+242055000011','active',true,true,4.3,134),
      (admin_id,'Beauty Palace','beauty-palace','Produits de beauté, parfumerie et cosmétiques de luxe.','https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80','beaute','Ouenzé','Galerie Commerciale, Ouenzé','+242055000012','active',true,false,4.0,56),
      (admin_id,'SportZone','sportzone','Équipements, chaussures et accessoires sportifs pour toutes disciplines.','https://images.unsplash.com/photo-1471295253337-3ceaaedca402?w=600&q=80','sport','Bacongo','Stade Municipal, Bacongo','+242055000013','active',true,true,4.6,198),
      (admin_id,'Fit & Move','fit-and-move','Articles de sport, fitness et bien-être.','https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80','sport','Moungali','Avenue du Stade, Moungali','+242055000014','active',true,false,4.2,89),
      (admin_id,'Shoe House','shoe-house','Chaussures homme, femme et enfant — des baskets aux talons.','https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&q=80','chaussures','Makélékélé','Rue du Commerce','+242055000015','active',true,false,4.1,112),
      (admin_id,'MaisonPlus','maisonplus','Mobilier, décoration et articles de maison.','https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80','mobilier','Poto-Poto','Avenue du Marché, Poto-Poto','+242055000016','active',true,true,4.4,167),
      (admin_id,'Info Pro Congo','info-pro-congo','Ordinateurs, périphériques et services informatiques.','https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80','informatique','Ouenzé','Zone Industrielle, Ouenzé','+242055000017','active',true,false,4.3,145),
      (admin_id,'Pharma Congo','pharma-congo','Pharmacie complète — parapharmacie et bien-être.','https://images.unsplash.com/photo-1585435557343-3b092031a831?w=600&q=80','pharmacies','Makélékélé','Centre-Ville','+242055000018','active',true,true,4.8,389),
      (admin_id,'Auto Express','auto-express','Pièces détachées, accessoires auto et services mécaniques.','https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80','automobile','Talangaï','Route Nationale, Talangaï','+242055000019','active',true,false,4.0,73)
    RETURNING id
  )
  SELECT array_agg(id) INTO store_ids FROM s;

  -- Promotions JSON : 19 tableaux d'articles
  items_json := '[
    [
      {"t":"Robe Wax Élégante","p":25000,"s":15000,"d":40,"img":"https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80"},
      {"t":"Chemise Homme Premium","p":18000,"s":12000,"d":33,"img":"https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80"},
      {"t":"Pagne Tissu Africain","p":12000,"s":8000,"d":33,"img":"https://images.unsplash.com/photo-1602293589938-45db2e0c8b3d?w=600&q=80"},
      {"t":"Ensemble Tenue Cérémonie","p":45000,"s":28000,"d":38,"img":"https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600&q=80"},
      {"t":"Sac à Main Cuir","p":22000,"s":14000,"d":36,"img":"https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80"},
      {"t":"Bijoux Traditionnels Set","p":15000,"s":7500,"d":50,"img":"https://images.unsplash.com/photo-1515562141589-67b5b76ebc92?w=600&q=80"},
      {"t":"Écharpe Tissée Main","p":8000,"s":5000,"d":37,"img":"https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&q=80"},
      {"t":"Costume Homme 3 Pièces","p":65000,"s":42000,"d":35,"img":"https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80"},
      {"t":"Jupe Pagne Fendue","p":20000,"s":12000,"d":40,"img":"https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&q=80"}
    ],[
      {"t":"Robe Soirée","p":35000,"s":22000,"d":37,"img":"https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80"},
      {"t":"Blazer Homme","p":45000,"s":29000,"d":36,"img":"https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80"},
      {"t":"T-Shirt Coton Bio","p":8000,"s":4500,"d":44,"img":"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80"},
      {"t":"Jean Slim","p":25000,"s":15000,"d":40,"img":"https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=600&q=80"},
      {"t":"Pull Cachemire","p":32000,"s":19000,"d":41,"img":"https://images.unsplash.com/photo-1434389677669-e08b4cda3a19?w=600&q=80"},
      {"t":"Veste en Cuir","p":85000,"s":55000,"d":35,"img":"https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80"},
      {"t":"Chemise en Lin","p":22000,"s":13000,"d":41,"img":"https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80"},
      {"t":"Chino Pantalon","p":20000,"s":11000,"d":45,"img":"https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80"}
    ],[
      {"t":"TV LED 50\" 4K","p":350000,"s":249000,"d":29,"img":"https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&q=80"},
      {"t":"Climatiseur 12000 BTU","p":280000,"s":195000,"d":30,"img":"https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80"},
      {"t":"Machine à Laver 8kg","p":320000,"s":229000,"d":28,"img":"https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&q=80"},
      {"t":"Réfrigérateur 300L","p":450000,"s":329000,"d":27,"img":"https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600&q=80"},
      {"t":"Four Micro-Ondes","p":85000,"s":55000,"d":35,"img":"https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&q=80"},
      {"t":"Aspirateur Balai","p":95000,"s":62000,"d":35,"img":"https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&q=80"},
      {"t":"Ventilateur Colonne","p":35000,"s":18000,"d":49,"img":"https://images.unsplash.com/photo-1602339548949-b3cf61d7bcc0?w=600&q=80"},
      {"t":"Fer à Repasser Vapeur","p":28000,"s":15000,"d":46,"img":"https://images.unsplash.com/photo-1586171481125-28e3e0e9e5ef?w=600&q=80"},
      {"t":"Mixeur Plongeant","p":22000,"s":11000,"d":50,"img":"https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600&q=80"}
    ],[
      {"t":"Casque Audio Bluetooth","p":45000,"s":28000,"d":38,"img":"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80"},
      {"t":"Enceinte Portable","p":35000,"s":18000,"d":49,"img":"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80"},
      {"t":"Montre Connectée","p":55000,"s":32000,"d":42,"img":"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80"},
      {"t":"Écouteurs Sans Fil","p":25000,"s":12000,"d":52,"img":"https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=600&q=80"},
      {"t":"Caméra de Surveillance","p":38000,"s":22000,"d":42,"img":"https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?w=600&q=80"},
      {"t":"Disque Dur Externe 2To","p":42000,"s":25000,"d":40,"img":"https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80"},
      {"t":"Souris Gamer RGB","p":15000,"s":7500,"d":50,"img":"https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80"}
    ],[
      {"t":"Poulet Braisé + Attiéké","p":5000,"s":3500,"d":30,"img":"https://images.unsplash.com/photo-1598103442097-8b74f6e8c8b1?w=600&q=80"},
      {"t":"Mafé au Bœuf","p":6000,"s":4000,"d":33,"img":"https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&q=80"},
      {"t":"Poisson Braisé Banane","p":5500,"s":3800,"d":31,"img":"https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80"},
      {"t":"Saka Saka","p":3500,"s":2200,"d":37,"img":"https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&q=80"},
      {"t":"Brochettes Assorties (10)","p":7000,"s":4500,"d":36,"img":"https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80"},
      {"t":"Foufou Sauce Gombo","p":3000,"s":1800,"d":40,"img":"https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&q=80"},
      {"t":"Riz au Gras","p":4000,"s":2500,"d":37,"img":"https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80"},
      {"t":"Menu Familial (4 pers.)","p":25000,"s":15000,"d":40,"img":"https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80"},
      {"t":"Jus Bissap Maison 1L","p":2500,"s":1500,"d":40,"img":"https://images.unsplash.com/photo-1544252876-f18cff1be5f1?w=600&q=80"}
    ],[
      {"t":"Menu Entrée Plat Dessert","p":15000,"s":9500,"d":37,"img":"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80"},
      {"t":"Bourguignon de Bœuf","p":8500,"s":5500,"d":35,"img":"https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&q=80"},
      {"t":"Tartare de Thon","p":9500,"s":6000,"d":37,"img":"https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=600&q=80"},
      {"t":"Formule Déjeuner","p":12000,"s":7500,"d":37,"img":"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80"},
      {"t":"Plateau de Fromages","p":8000,"s":5000,"d":37,"img":"https://images.unsplash.com/photo-1452195100486-9cc805987862?w=600&q=80"},
      {"t":"Pavé de Saumon","p":11000,"s":7000,"d":36,"img":"https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80"},
      {"t":"Moelleux au Chocolat","p":5500,"s":3500,"d":36,"img":"https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80"}
    ],[
      {"t":"iPhone 15 Pro Max 256Go","p":1200000,"s":999000,"d":17,"img":"https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80"},
      {"t":"Samsung Galaxy S24 Ultra","p":1100000,"s":890000,"d":19,"img":"https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80"},
      {"t":"Redmi Note 13 Pro","p":350000,"s":249000,"d":29,"img":"https://images.unsplash.com/photo-1616348436168-de43ad0a1790?w=600&q=80"},
      {"t":"Chargeur Rapide 65W","p":15000,"s":8000,"d":47,"img":"https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80"},
      {"t":"Écouteurs Bluetooth","p":12000,"s":5500,"d":54,"img":"https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=600&q=80"},
      {"t":"Power Bank 20000mAh","p":18000,"s":9500,"d":47,"img":"https://images.unsplash.com/photo-1609592424599-36e5fbee02e0?w=600&q=80"},
      {"t":"Support Voiture Téléphone","p":6000,"s":2800,"d":53,"img":"https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&q=80"},
      {"t":"Câble USB-C Tressé","p":5000,"s":2000,"d":60,"img":"https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80"}
    ],[
      {"t":"Tecno Camon 20 Pro","p":280000,"s":195000,"d":30,"img":"https://images.unsplash.com/photo-1616348436168-de43ad0a1790?w=600&q=80"},
      {"t":"Oppo A78 5G","p":220000,"s":149000,"d":32,"img":"https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80"},
      {"t":"Batterie Externe 10000mAh","p":10000,"s":5000,"d":50,"img":"https://images.unsplash.com/photo-1609592424599-36e5fbee02e0?w=600&q=80"},
      {"t":"Kit Oreillette Bluetooth","p":15000,"s":7500,"d":50,"img":"https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=600&q=80"},
      {"t":"Adaptateur Secteur","p":6000,"s":2800,"d":53,"img":"https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80"},
      {"t":"Film Protecteur Écran","p":2000,"s":1000,"d":50,"img":"https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&q=80"},
      {"t":"Câble Lightning","p":5000,"s":2500,"d":50,"img":"https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80"}
    ],[
      {"t":"Pack Riz 25kg","p":35000,"s":25000,"d":29,"img":"https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80"},
      {"t":"Huile de Palme 5L","p":12000,"s":8000,"d":33,"img":"https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80"},
      {"t":"Farine de Blé 10kg","p":8500,"s":5500,"d":35,"img":"https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80"},
      {"t":"Sardines Boîte 20pcs","p":15000,"s":9500,"d":37,"img":"https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80"},
      {"t":"Lait Concentré Sucré 24x","p":25000,"s":15000,"d":40,"img":"https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&q=80"},
      {"t":"Sucre en Poudre 10kg","p":12000,"s":7500,"d":37,"img":"https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80"},
      {"t":"Boîte Tomate Concentré 24","p":12000,"s":7000,"d":42,"img":"https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80"},
      {"t":"Savon Lessive 5kg","p":8000,"s":4500,"d":44,"img":"https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80"},
      {"t":"Haricot Rouge 5kg","p":6000,"s":3500,"d":42,"img":"https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80"},
      {"t":"Poulet Congelé 1.5kg","p":5500,"s":3500,"d":36,"img":"https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80"}
    ],[
      {"t":"Pack Eau Minérale 12x1.5L","p":5000,"s":3200,"d":36,"img":"https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600&q=80"},
      {"t":"Boisson Sucrée 24 canettes","p":12000,"s":7500,"d":37,"img":"https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&q=80"},
      {"t":"Biscuits Assortis 2kg","p":6000,"s":3500,"d":42,"img":"https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80"},
      {"t":"Pâtes Alimentaires 5kg","p":5000,"s":2800,"d":44,"img":"https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80"},
      {"t":"Nescafé 500g","p":4500,"s":2500,"d":44,"img":"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80"},
      {"t":"Huile de Soja 2L","p":6000,"s":3500,"d":42,"img":"https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80"},
      {"t":"Mayonnaise 500g","p":3500,"s":1800,"d":49,"img":"https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&q=80"},
      {"t":"Jus d''Orange 1L","p":2500,"s":1200,"d":52,"img":"https://images.unsplash.com/photo-1544252876-f18cff1be5f1?w=600&q=80"},
      {"t":"Lait en Poudre 500g","p":5500,"s":3200,"d":42,"img":"https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&q=80"}
    ],[
      {"t":"Fond de Teint Pro","p":25000,"s":15000,"d":40,"img":"https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80"},
      {"t":"Palette Ombres 48C","p":18000,"s":9500,"d":47,"img":"https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80"},
      {"t":"Sérum Visage Anti-Âge","p":22000,"s":12000,"d":45,"img":"https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80"},
      {"t":"Parfum de Luxe 100ml","p":85000,"s":55000,"d":35,"img":"https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80"},
      {"t":"Crème Hydratante 50ml","p":12000,"s":6500,"d":46,"img":"https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80"},
      {"t":"Rouge à Lèvres Mat","p":8000,"s":4000,"d":50,"img":"https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80"},
      {"t":"Mascara Volume","p":9500,"s":5000,"d":47,"img":"https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80"},
      {"t":"Shampooing Pro 1L","p":10000,"s":5500,"d":45,"img":"https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80"}
    ],[
      {"t":"Crème Éclaircissante","p":8000,"s":4500,"d":44,"img":"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80"},
      {"t":"Démaquillant Biface","p":6500,"s":3500,"d":46,"img":"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80"},
      {"t":"Gel Douche Exfoliant","p":5000,"s":2500,"d":50,"img":"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80"},
      {"t":"Coffret Cadeau Beauté","p":25000,"s":15000,"d":40,"img":"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80"},
      {"t":"Huile Corporelle Bio","p":8000,"s":4200,"d":48,"img":"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80"},
      {"t":"Déodorant Spray","p":3500,"s":1800,"d":49,"img":"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80"},
      {"t":"Masque Capillaire 250g","p":6000,"s":3200,"d":47,"img":"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80"}
    ],[
      {"t":"Chaussures Running Pro","p":55000,"s":35000,"d":36,"img":"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"},
      {"t":"Ballon de Foot Match","p":25000,"s":15000,"d":40,"img":"https://images.unsplash.com/photo-1471295253337-3ceaaedca402?w=600&q=80"},
      {"t":"Haltères 2x10kg","p":35000,"s":22000,"d":37,"img":"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80"},
      {"t":"Maillot de Foot","p":22000,"s":12000,"d":45,"img":"https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80"},
      {"t":"Sac de Sport","p":18000,"s":9500,"d":47,"img":"https://images.unsplash.com/photo-1471295253337-3ceaaedca402?w=600&q=80"},
      {"t":"Tapis de Yoga","p":15000,"s":8000,"d":47,"img":"https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=600&q=80"},
      {"t":"Raquette Tennis + Balles","p":28000,"s":18000,"d":36,"img":"https://images.unsplash.com/photo-1471295253337-3ceaaedca402?w=600&q=80"},
      {"t":"Serviette Microfibre","p":6000,"s":2800,"d":53,"img":"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80"}
    ],[
      {"t":"Tapis Roulant Électrique","p":450000,"s":299000,"d":34,"img":"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80"},
      {"t":"Vélo d''Appartement","p":280000,"s":189000,"d":32,"img":"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80"},
      {"t":"Kit Élastiques Fitness","p":8000,"s":4000,"d":50,"img":"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80"},
      {"t":"Gants de Musculation","p":10000,"s":5500,"d":45,"img":"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80"},
      {"t":"Brassard Sport","p":6000,"s":2800,"d":53,"img":"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80"},
      {"t":"Casquette Sport","p":5000,"s":2500,"d":50,"img":"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80"}
    ],[
      {"t":"Baskets Nike Air Max","p":85000,"s":55000,"d":35,"img":"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"},
      {"t":"Sandales Cuir Homme","p":32000,"s":18000,"d":44,"img":"https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&q=80"},
      {"t":"Escarpins Femme","p":28000,"s":15000,"d":46,"img":"https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80"},
      {"t":"Mocassins Loup","p":35000,"s":22000,"d":37,"img":"https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&q=80"},
      {"t":"Bottines Hiver","p":42000,"s":25000,"d":40,"img":"https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80"},
      {"t":"Tongs Tissu Africain","p":8000,"s":4000,"d":50,"img":"https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&q=80"},
      {"t":"Chaussures Bébé","p":12000,"s":6500,"d":46,"img":"https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&q=80"},
      {"t":"Chaussures de Ville","p":45000,"s":28000,"d":38,"img":"https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&q=80"}
    ],[
      {"t":"Canapé 3 Places Cuir","p":550000,"s":399000,"d":27,"img":"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80"},
      {"t":"Table Basse Verre","p":120000,"s":85000,"d":29,"img":"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80"},
      {"t":"Lit Queen + Matelas","p":350000,"s":249000,"d":29,"img":"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80"},
      {"t":"Armoire 4 Portes","p":280000,"s":195000,"d":30,"img":"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80"},
      {"t":"Chaise Bureau Ergonomique","p":85000,"s":55000,"d":35,"img":"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80"},
      {"t":"Étagère Murale","p":35000,"s":18000,"d":49,"img":"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80"},
      {"t":"Lampadaire Design","p":45000,"s":28000,"d":38,"img":"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80"},
      {"t":"Tapis Salon 2x3m","p":55000,"s":32000,"d":42,"img":"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80"},
      {"t":"Miroir Murale Grand","p":45000,"s":28000,"d":38,"img":"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80"}
    ],[
      {"t":"PC Portable HP 15.6\" i5","p":450000,"s":329000,"d":27,"img":"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80"},
      {"t":"Écran 27\" QHD","p":220000,"s":149000,"d":32,"img":"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80"},
      {"t":"Clavier Mécanique Gamer","p":35000,"s":18000,"d":49,"img":"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80"},
      {"t":"Imprimante Multifonction","p":85000,"s":55000,"d":35,"img":"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80"},
      {"t":"Routeur WiFi 6","p":55000,"s":35000,"d":36,"img":"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80"},
      {"t":"Webcam HD 1080p","p":22000,"s":12000,"d":45,"img":"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80"},
      {"t":"Onduleur 1000VA","p":65000,"s":42000,"d":35,"img":"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80"}
    ],[
      {"t":"Vitamine C 1000mg 60 gél.","p":8000,"s":4500,"d":44,"img":"https://images.unsplash.com/photo-1585435557343-3b092031a831?w=600&q=80"},
      {"t":"Omega 3 1000mg 60 caps","p":12000,"s":6500,"d":46,"img":"https://images.unsplash.com/photo-1585435557343-3b092031a831?w=600&q=80"},
      {"t":"Sirop Toux Adulte 200ml","p":4500,"s":2500,"d":44,"img":"https://images.unsplash.com/photo-1585435557343-3b092031a831?w=600&q=80"},
      {"t":"Gel Antibactérien 500ml","p":3500,"s":1800,"d":49,"img":"https://images.unsplash.com/photo-1585435557343-3b092031a831?w=600&q=80"},
      {"t":"Bande de Contention","p":5000,"s":2800,"d":44,"img":"https://images.unsplash.com/photo-1585435557343-3b092031a831?w=600&q=80"},
      {"t":"Thermomètre Infrarouge","p":15000,"s":8000,"d":47,"img":"https://images.unsplash.com/photo-1585435557343-3b092031a831?w=600&q=80"},
      {"t":"Paracétamol 500mg x24","p":2500,"s":1200,"d":52,"img":"https://images.unsplash.com/photo-1585435557343-3b092031a831?w=600&q=80"},
      {"t":"Collagène Marin 120 gél.","p":15000,"s":8500,"d":43,"img":"https://images.unsplash.com/photo-1585435557343-3b092031a831?w=600&q=80"}
    ],[
      {"t":"Pneu Voiture 205/55 R16","p":85000,"s":55000,"d":35,"img":"https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80"},
      {"t":"Batterie Auto 60Ah","p":95000,"s":62000,"d":35,"img":"https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80"},
      {"t":"Huile Moteur 5W40 5L","p":25000,"s":15000,"d":40,"img":"https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80"},
      {"t":"Liquide de Frein DOT4","p":6000,"s":3200,"d":47,"img":"https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80"},
      {"t":"Antigel Concentré 5L","p":8000,"s":4500,"d":44,"img":"https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80"},
      {"t":"Balais Essuie-Glace","p":5000,"s":2500,"d":50,"img":"https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80"},
      {"t":"Ampoule LED Auto H7","p":3500,"s":1800,"d":49,"img":"https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80"},
      {"t":"Garnitures Frein Avant","p":12000,"s":6500,"d":46,"img":"https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80"}
    ]
  ]';

  -- Insérer les promotions pour chaque boutique
  FOR store_index IN 0..array_length(store_ids, 1)-1 LOOP
    FOR item IN SELECT * FROM jsonb_array_elements(items_json->store_index)
    LOOP
      INSERT INTO public.promotions (
        user_id, store_id, title, description, discount, original_price, sale_price, image,
        category, status, is_flash, expires_at, views, clicks, payment_methods, district, featured
      ) VALUES (
        admin_id,
        store_ids[store_index+1],
        item->>'t',
        'Profitez de cette offre exceptionnelle chez ' || (SELECT name FROM public.stores WHERE id = store_ids[store_index+1]),
        (item->>'d')::int,
        (item->>'p')::numeric,
        (item->>'s')::numeric,
        item->>'img',
        (SELECT category FROM public.stores WHERE id = store_ids[store_index+1]),
        CASE WHEN random() < 0.2 THEN 'draft' ELSE 'active' END,
        random() < 0.15,
        CASE WHEN random() < 0.3 THEN NOW() + (random() * 30 || ' days')::interval ELSE NULL END,
        floor(random() * 500)::int,
        floor(random() * 50)::int,
        CASE floor(random() * 3)::int
          WHEN 0 THEN '["mtn","airtel"]'::jsonb
          WHEN 1 THEN '["mtn","airtel","visa"]'::jsonb
          ELSE '["mtn"]'::jsonb
        END,
        (SELECT district FROM public.stores WHERE id = store_ids[store_index+1]),
        random() < 0.1
      );
    END LOOP;

    UPDATE public.stores SET promo_count = (SELECT COUNT(*) FROM public.promotions WHERE store_id = store_ids[store_index+1])
    WHERE id = store_ids[store_index+1];
  END LOOP;

  RAISE NOTICE 'Seed terminé : % boutiques créées avec leurs promotions.', array_length(store_ids, 1);
END $$;
