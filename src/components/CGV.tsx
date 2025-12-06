import { X, FileText, CheckCircle, AlertCircle, CreditCard, RefreshCw } from 'lucide-react';

interface CGVProps {
  onClose: () => void;
}

export function CGV({ onClose }: CGVProps) {
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
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8" />
            <div>
              <h2 className="text-2xl">Conditions Générales de Vente</h2>
              <p className="text-white/90 text-sm mt-1">OMEGA24 CONSULTING - Services de Consulting Éducatif</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 max-h-[70vh] overflow-y-auto space-y-6">
          {/* Préambule */}
          <section>
            <div className="bg-blue-50 border-l-4 border-[#4DA6FF] p-4 rounded">
              <p className="text-gray-700">
                Les présentes Conditions Générales de Vente (CGV) régissent les relations 
                contractuelles entre OMEGA24 CONSULTING et ses clients dans le cadre de 
                la fourniture de services de consulting éducatif, d'accompagnement aux études 
                à l'étranger et de services connexes.
              </p>
            </div>
          </section>

          {/* Article 1 */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-6 h-6 text-[#4DA6FF]" />
              <h3 className="text-xl text-[#002F6C]">1. Objet et Champ d'Application</h3>
            </div>
            
            <p className="text-gray-700 mb-3">
              Les présentes CGV s'appliquent à tous les services proposés par OMEGA24 CONSULTING :
            </p>
            
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Accompagnement aux études à l'étranger</li>
              <li>Recherche et placement en contrat de travail</li>
              <li>Billeterie aérienne</li>
              <li>Services d'assurance</li>
              <li>Gestion locative</li>
              <li>Services de comptabilité</li>
            </ul>

            <p className="text-gray-700 mt-3">
              Toute commande ou souscription implique l'acceptation sans réserve des présentes CGV.
            </p>
          </section>

          {/* Article 2 */}
          <section>
            <h3 className="text-xl text-[#002F6C] mb-3">2. Prestations de Services</h3>
            
            <h4 className="font-semibold text-[#002F6C] mt-4 mb-2">2.1. Accompagnement aux Études</h4>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p className="text-gray-700">Nos services incluent :</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                <li>Orientation et conseil personnalisé</li>
                <li>Aide à la constitution des dossiers d'admission</li>
                <li>Accompagnement pour l'obtention des visas</li>
                <li>Préparation au départ</li>
                <li>Suivi post-arrivée</li>
              </ul>
            </div>
          </section>

          {/* Article 3 */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-6 h-6 text-[#4DA6FF]" />
              <h3 className="text-xl text-[#002F6C]">3. Tarifs et Modalités de Paiement</h3>
            </div>
            
            <h4 className="font-semibold text-[#002F6C] mt-4 mb-2">3.1. Tarification</h4>
            <p className="text-gray-700 mb-3">
              Les tarifs de nos services sont indiqués en Francs CFA (XOF) et peuvent varier 
              selon la complexité du dossier, la destination et les services demandés.
            </p>

            <h4 className="font-semibold text-[#002F6C] mt-4 mb-2">3.2. Modalités de Paiement</h4>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p className="text-gray-700"><strong>Modes de paiement acceptés :</strong></p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                <li>Virement bancaire</li>
                <li>Mobile Money (MTN, Moov)</li>
                <li>Espèces (au bureau)</li>
                <li>Chèque bancaire</li>
              </ul>
            </div>

            <h4 className="font-semibold text-[#002F6C] mt-4 mb-2">3.3. Échéancier</h4>
            <div className="space-y-2">
              <p className="text-gray-700">
                <strong>Acompte :</strong> 30% à la signature du contrat
              </p>
              <p className="text-gray-700">
                <strong>Paiement intermédiaire :</strong> 40% à la validation du dossier
              </p>
              <p className="text-gray-700">
                <strong>Solde :</strong> 30% avant le départ ou à la livraison finale du service
              </p>
            </div>
          </section>

          {/* Article 4 */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <RefreshCw className="w-6 h-6 text-[#4DA6FF]" />
              <h3 className="text-xl text-[#002F6C]">4. Annulation et Remboursement</h3>
            </div>
            
            <h4 className="font-semibold text-[#002F6C] mt-4 mb-2">4.1. Annulation par le Client</h4>
            <div className="space-y-2">
              <p className="text-gray-700">
                <strong>Plus de 30 jours avant le début :</strong> Remboursement de 70% des sommes versées
              </p>
              <p className="text-gray-700">
                <strong>Entre 15 et 30 jours :</strong> Remboursement de 50% des sommes versées
              </p>
              <p className="text-gray-700">
                <strong>Moins de 15 jours :</strong> Aucun remboursement
              </p>
            </div>

            <h4 className="font-semibold text-[#002F6C] mt-4 mb-2">4.2. Refus de Visa ou d'Admission</h4>
            <p className="text-gray-700 mb-2">
              En cas de refus de visa ou d'admission :
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
              <li>Les frais de dossier restent acquis (30% du montant)</li>
              <li>Le solde peut être utilisé pour une nouvelle candidature dans les 12 mois</li>
            </ul>
          </section>

          {/* Article 5 */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-6 h-6 text-[#4DA6FF]" />
              <h3 className="text-xl text-[#002F6C]">5. Responsabilité et Garanties</h3>
            </div>
            
            <p className="text-gray-700 mb-3">
              OMEGA24 CONSULTING ne peut être tenu responsable :
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
              <li>Des refus d'admission par les établissements</li>
              <li>Des refus de visa par les consulats</li>
              <li>Des changements de réglementation</li>
              <li>Des retards dus à des tiers (consulats, universités)</li>
            </ul>

            <div className="bg-red-50 border border-red-200 p-4 rounded-lg mt-4">
              <p className="text-sm text-gray-700">
                <strong>⚠️ Obligation de moyens :</strong> OMEGA24 CONSULTING s'engage 
                à mettre en œuvre tous les moyens nécessaires pour la réussite du projet, 
                mais ne peut garantir un résultat qui dépend de décisions tierces.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-[#002F6C] text-white p-6 rounded-lg">
            <h3 className="text-xl mb-3">Contact</h3>
            <p className="mb-3">Pour toute question concernant nos CGV :</p>
            <p className="mb-1">📧 Email : omega24consulting@gmail.com</p>
            <p className="mb-1">📞 Téléphone : +229 01 41 31 22 22</p>
            <p>📞 Téléphone : +229 01 90 57 42 42</p>
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
