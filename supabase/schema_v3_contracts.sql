-- ============================================================
-- CONGO SOLES - Schema v3 (Contracts Module)
-- ============================================================

-- 18. Contract templates
CREATE TABLE IF NOT EXISTS public.contract_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT 'general' CHECK (category IN ('general', 'partnership', 'advertising', 'services', 'brand_license', 'consignment', 'terms')),
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 19. Contracts
CREATE TABLE IF NOT EXISTS public.contracts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID REFERENCES public.contract_templates(id) ON DELETE SET NULL,
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  variables JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'signed', 'expired', 'cancelled')),
  signed_at TIMESTAMPTZ,
  signed_by TEXT DEFAULT '',
  expires_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default contract templates
INSERT INTO public.contract_templates (title, slug, description, category, content) VALUES
(
  'Convention de Partenariat',
  'convention-partenariat',
  'Contrat de partenariat entre Congo Soldes et une boutique partenaire',
  'partnership',
  '<h1>CONVENTION DE PARTENARIAT</h1><p>Entre <strong>Congo Soldes</strong>, SAS au capital de 1 000 000 XAF, immatriculée sous le numéro RC-2024-BZV-001234, dont le siège social est à Brazzaville, République du Congo, représentée par son Directeur Général, ci-après dénommée <strong>"La Plateforme"</strong>,</p><p>Et <strong>{{store_name}}</strong>, représentée par {{representative_name}}, située {{store_address}}, ci-après dénommée <strong>"Le Partenaire"</strong>,</p><h2>Article 1 – Objet</h2><p>La présente convention a pour objet de définir les conditions de partenariat entre La Plateforme et Le Partenaire pour la promotion des produits et services de ce dernier sur la plateforme Congo Soldes.</p><h2>Article 2 – Durée</h2><p>La présente convention est conclue pour une durée de {{duration}} à compter de sa signature.</p><h2>Article 3 – Obligations du Partenaire</h2><p>Le Partenaire s''engage à :</p><ul><li>Fournir des informations exactes sur ses produits et services</li><li>Respecter les conditions générales d''utilisation de la plateforme</li><li>Mettre à jour régulièrement ses offres promotionnelles</li></ul><h2>Article 4 – Obligations de la Plateforme</h2><p>La Plateforme s''engage à :</p><ul><li>Assurer la visibilité des offres du Partenaire</li><li>Fournir un tableau de bord de suivi des performances</li><li>Garantir la sécurité des données échangées</li></ul><h2>Article 5 – Résiliation</h2><p>Chaque partie peut résilier le présent contrat moyennant un préavis de 30 jours par notification écrite.</p><p>Fait à Brazzaville, le {{date}}</p><p><strong>Pour Congo Soldes</strong><br>Le Directeur Général</p><p><strong>Pour Le Partenaire</strong><br>{{representative_name}}</p>'
),
(
  'Contrat de Publicité',
  'contrat-publicite',
  'Contrat pour les campagnes publicitaires sponsorisées',
  'advertising',
  '<h1>CONTRAT DE PUBLICITÉ</h1><p>Entre <strong>Congo Soldes</strong>, ci-après dénommée <strong>"La Plateforme"</strong>,</p><p>Et <strong>{{store_name}}</strong>, représentée par {{representative_name}}, ci-après dénommée <strong>"L''Annonceur"</strong>,</p><h2>Article 1 – Objet</h2><p>Le présent contrat a pour objet la mise en place d''une campagne publicitaire sur la plateforme Congo Soldes.</p><h2>Article 2 – Description de la campagne</h2><p>Type de campagne : {{campaign_type}}<br>Budget : {{budget}} XAF<br>Durée : {{duration}} jours</p><h2>Article 3 – Investissement publicitaire</h2><p>L''Annonceur s''engage à verser à La Plateforme un montant total de {{budget}} XAF, payable selon les modalités suivantes : {{payment_terms}}.</p><h2>Article 4 – Obligations de La Plateforme</h2><p>La Plateforme s''engage à diffuser la campagne conformément aux spécifications convenues et à fournir un rapport de performance détaillé.</p><h2>Article 5 – Propriété intellectuelle</h2><p>Les supports publicitaires fournis par l''Annonceur restent sa propriété exclusive. La Plateforme est autorisée à les utiliser uniquement dans le cadre de la campagne.</p><p>Fait à Brazzaville, le {{date}}</p><p><strong>Pour Congo Soldes</strong><br>Le Directeur Général</p><p><strong>Pour L''Annonceur</strong><br>{{representative_name}}</p>'
),
(
  'Conditions Générales d''Utilisation',
  'conditions-generales-utilisation',
  'Conditions générales d''utilisation de la plateforme pour les commerçants',
  'terms',
  '<h1>CONDITIONS GÉNÉRALES D''UTILISATION</h1><p>Les présentes conditions générales d''utilisation (CGU) régissent l''accès et l''utilisation de la plateforme Congo Soldes par les commerçants.</p><h2>Article 1 – Acceptation</h2><p>En signant le présent document, le commerçant <strong>{{store_name}}</strong> représenté par {{representative_name}} accepte sans réserve les présentes CGU.</p><h2>Article 2 – Accès aux services</h2><p>La Plateforme fournit au Commerçant un accès à son tableau de bord lui permettant de :</p><ul><li>Gérer ses informations commerciales</li><li>Publier et gérer ses promotions</li><li>Consulter les statistiques de performance</li><li>Communiquer avec les clients</li></ul><h2>Article 3 – Responsabilités</h2><p>Le Commerçant est seul responsable des contenus qu''il publie sur la plateforme. Il garantit que ces contenus sont conformes à la législation en vigueur en République du Congo.</p><h2>Article 4 – Données personnelles</h2><p>Les données collectées sont traitées conformément à la réglementation en vigueur sur la protection des données à caractère personnel.</p><p>Fait à Brazzaville, le {{date}}</p><p><strong>Le Commerçant</strong><br>{{representative_name}}</p><p><strong>Pour Congo Soldes</strong><br>Le Directeur Général</p>'
),
(
  'Contrat de Licence de Marque',
  'contrat-licence-marque',
  'Licence d''exploitation de la marque Congo Soldes',
  'brand_license',
  '<h1>CONTRAT DE LICENCE DE MARQUE</h1><p>Entre <strong>Congo Soldes</strong>, ci-après dénommée <strong>"Le Licenceur"</strong>,</p><p>Et <strong>{{store_name}}</strong>, ci-après dénommée <strong>"Le Licencié"</strong>,</p><h2>Article 1 – Objet</h2><p>Le Licenceur accorde au Licencié une licence non exclusive d''utilisation de la marque "Congo Soldes" et de son logo dans le cadre de la promotion de ses activités sur la plateforme.</p><h2>Article 2 – Étendue de la licence</h2><p>La licence est accordée pour une durée de {{duration}} à compter de la signature. Elle est limitée à l''utilisation sur les supports suivants : supports numériques, réseaux sociaux, et supports physiques approuvés.</p><h2>Article 3 – Droits et obligations</h2><p>Le Licencié s''engage à utiliser la marque conformément aux chartes graphiques fournies et à ne pas porter atteinte à la réputation de la marque.</p><h2>Article 4 – Redevances</h2><p>La présente licence est accordée à titre {{fee_type}}.</p><p>Fait à Brazzaville, le {{date}}</p><p><strong>Pour Congo Soldes</strong><br>Le Directeur Général</p><p><strong>Pour Le Licencié</strong><br>{{representative_name}}</p>'
),
(
  'Contrat de Dépôt-Vente',
  'contrat-depot-vente',
  'Contrat de dépôt-vente pour les produits mis en avant',
  'consignment',
  '<h1>CONTRAT DE DÉPÔT-VENTE</h1><p>Entre <strong>Congo Soldes</strong>, ci-après dénommée <strong>"Le Dépositaire"</strong>,</p><p>Et <strong>{{store_name}}</strong>, ci-après dénommée <strong>"Le Déposant"</strong>,</p><h2>Article 1 – Objet</h2><p>Le Déposant confie au Dépositaire des produits aux fins de promotion et de vente via la plateforme Congo Soldes.</p><h2>Article 2 – Durée du dépôt</h2><p>La durée du dépôt est fixée à {{duration}} jours à compter de la signature.</p><h2>Article 3 – Prix et commission</h2><p>Le prix de vente est fixé à {{price}} XAF. La commission du Dépositaire est de {{commission}}% du prix de vente.</p><h2>Article 4 – Risques</h2><p>Le Déposant conserve la propriété des produits jusqu''à leur vente effective. Le Dépositaire n''est pas responsable des dommages ou pertes.</p><p>Fait à Brazzaville, le {{date}}</p><p><strong>Pour Congo Soldes</strong><br>Le Directeur Général</p><p><strong>Pour Le Déposant</strong><br>{{representative_name}}</p>'
),
(
  'Contrat de Prestation de Services',
  'contrat-prestation-services',
  'Contrat pour les prestations de services annexes',
  'services',
  '<h1>CONTRAT DE PRESTATION DE SERVICES</h1><p>Entre <strong>Congo Soldes</strong>, ci-après dénommée <strong>"Le Client"</strong>,</p><p>Et <strong>{{store_name}}</strong>, ci-après dénommée <strong>"Le Prestataire"</strong>,</p><h2>Article 1 – Objet</h2><p>Le Prestataire s''engage à fournir au Client les services décrits ci-dessous dans le cadre de leur partenariat sur la plateforme Congo Soldes.</p><h2>Article 2 – Description des services</h2><p>{{service_description}}</p><h2>Article 3 – Durée et conditions</h2><p>Le contrat est conclu pour une durée de {{duration}} à compter de la signature. Le montant convenu est de {{amount}} XAF.</p><h2>Article 4 – Confidentialité</h2><p>Chaque partie s''engage à garder confidentielles les informations échangées dans le cadre de l''exécution du présent contrat.</p><p>Fait à Brazzaville, le {{date}}</p><p><strong>Pour Congo Soldes</strong><br>Le Directeur Général</p><p><strong>Pour Le Prestataire</strong><br>{{representative_name}}</p>'
)
ON CONFLICT (slug) DO NOTHING;

-- RLS for contracts tables
ALTER TABLE public.contract_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage contract templates" ON public.contract_templates
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Public can read active contract templates" ON public.contract_templates
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can manage contracts" ON public.contracts
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Users can view own contracts" ON public.contracts
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = created_by);
CREATE POLICY "Users can create contracts" ON public.contracts
  FOR INSERT WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- Indexes
CREATE INDEX IF NOT EXISTS idx_contracts_store ON public.contracts(store_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON public.contracts(status);
CREATE INDEX IF NOT EXISTS idx_contracts_user ON public.contracts(user_id);
