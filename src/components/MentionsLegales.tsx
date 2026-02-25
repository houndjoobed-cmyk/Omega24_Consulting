import { X } from 'lucide-react';

interface MentionsLegalesProps {
  onClose: () => void;
}

export function MentionsLegales({ onClose }: MentionsLegalesProps) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#002F6C] to-[#4DA6FF] text-white p-6 rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl">Mentions Légales</h2>
          <p className="text-white/90 text-sm mt-2">Oméga24 Consulting</p>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 max-h-[70vh] overflow-y-auto space-y-6">
          {/* Éditeur du site */}
          <section>
            <h3 className="text-xl text-[#002F6C] mb-3">1. Éditeur du Site</h3>
            <div className="bg-[rgb(30,69,106)] p-4 rounded-lg space-y-2">
              <p><strong>Raison sociale :</strong> Oméga24 Consulting</p>
              <p><strong>Forme juridique :</strong> Société de services</p>
              <p><strong>Siège social :</strong> Cotonou, Bénin</p>
              <p><strong>Email :</strong> infos@omega24consulting.com</p>
              <p><strong>Téléphone :</strong> +229 01 41 31 22 22 / +229 01 90 57 42 42</p>
            </div>
          </section>

          {/* Directeur de publication */}
          <section>
            <h3 className="text-xl text-[#002F6C] mb-3">2. Directeur de Publication</h3>
            <p className="text-gray-700">
              Le directeur de la publication du site est le représentant légal de Oméga24 Consulting.
            </p>
          </section>

          {/* Hébergement */}
          <section>
            <h3 className="text-xl text-[#002F6C] mb-3">3. Hébergement</h3>
            <div className="bg-[rgb(8,48,90)] p-4 rounded-lg space-y-2">
              <p><strong>Hébergeur :</strong>Netlify</p>
              <p><strong>Adresse :</strong>Cotonou, Bénin - Gbèdjromédé, 2ème von à droite en quittant le carrefour 16 ampoules vers le carrefour "Vodafone"</p>
              <p><strong>Site web :</strong> omega24consulting.com</p>
            </div>
          </section>

          {/* Propriété intellectuelle */}
          <section>
            <h3 className="text-xl text-[#002F6C] mb-3">4. Propriété Intellectuelle</h3>
            <p className="text-gray-700 mb-3">
              L'ensemble des contenus présents sur le site internet de Oméga24 Consulting
              (textes, images, logos, graphismes, vidéos, icônes, etc.) est la propriété
              exclusive de Oméga24 Consulting, sauf mention contraire.
            </p>
            <p className="text-gray-700">
              Toute reproduction, représentation, modification, publication, adaptation de
              tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé,
              est interdite, sauf autorisation écrite préalable de Oméga24 Consulting.
            </p>
          </section>

          {/* Données personnelles */}
          <section>
            <h3 className="text-xl text-[#002F6C] mb-3">5. Données Personnelles</h3>
            <p className="text-gray-700 mb-3">
              Oméga24 Consulting s'engage à respecter la confidentialité des données
              personnelles de ses utilisateurs conformément à la réglementation en vigueur.
            </p>
            <p className="text-gray-700">
              Pour plus d'informations, veuillez consulter notre
              <span className="text-[#4DA6FF]"> Politique de Confidentialité</span>.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h3 className="text-xl text-[#002F6C] mb-3">6. Cookies</h3>
            <p className="text-gray-700 mb-3">
              Le site Oméga24 Consulting peut utiliser des cookies pour améliorer l'expérience
              utilisateur et réaliser des statistiques de visites.
            </p>
            <p className="text-gray-700">
              L'utilisateur peut paramétrer son navigateur pour refuser les cookies ou être
              informé de leur utilisation.
            </p>
          </section>

          {/* Responsabilité */}
          <section>
            <h3 className="text-xl text-[#002F6C] mb-3">7. Limitation de Responsabilité</h3>
            <p className="text-gray-700 mb-3">
              Oméga24 Consulting met tout en œuvre pour offrir aux utilisateurs des
              informations fiables et vérifiées.
            </p>
            <p className="text-gray-700 mb-3">
              Toutefois, Oméga24 Consulting ne pourra être tenu responsable des omissions,
              inexactitudes et carences dans la mise à jour, qu'elles soient de son fait
              ou du fait des tiers partenaires qui lui fournissent ces informations.
            </p>
            <p className="text-gray-700">
              Oméga24 Consulting ne pourra être tenu responsable des dommages directs ou
              indirects résultant de l'accès au site ou de l'utilisation du site.
            </p>
          </section>

          {/* Droit applicable */}
          <section>
            <h3 className="text-xl text-[#002F6C] mb-3">8. Droit Applicable et Juridiction</h3>
            <p className="text-gray-700">
              Les présentes mentions légales sont régies par le droit béninois.
              En cas de litige, et à défaut d'accord amiable, le litige sera porté
              devant les tribunaux compétents de Cotonou, Bénin.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h3 className="text-xl text-[#002F6C] mb-3">9. Contact</h3>
            <p className="text-gray-700 mb-3">
              Pour toute question concernant les mentions légales, vous pouvez nous contacter :
            </p>
            <div className="bg-[rgb(8,45,83)] p-4 rounded-lg space-y-2">
              <p><strong>Email :</strong> infos@omega24consulting.com</p>
              <p><strong>Téléphone :</strong> +229 01 41 31 22 22</p>
              <p><strong>Téléphone :</strong> +229 01 90 57 42 42</p>
            </div>
          </section>

          {/* Date de mise à jour */}
          <section className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 rounded-b-2xl flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#002F6C] hover:bg-[#4DA6FF] text-white rounded-lg transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
