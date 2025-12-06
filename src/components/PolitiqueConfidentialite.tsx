import { X, Shield, Lock, Eye, Database, UserCheck } from 'lucide-react';

interface PolitiqueConfidentialiteProps {
  onClose: () => void;
}

export function PolitiqueConfidentialite({ onClose }: PolitiqueConfidentialiteProps) {
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
            <Shield className="w-8 h-8" />
            <div>
              <h2 className="text-2xl">Politique de Confidentialité</h2>
              <p className="text-white/90 text-sm mt-1">Protection de vos données personnelles</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 max-h-[70vh] overflow-y-auto space-y-6">
          {/* Introduction */}
          <section>
            <div className="bg-blue-50 border-l-4 border-[#4DA6FF] p-4 rounded">
              <p className="text-gray-700">
                OMEGA24 CONSULTING s'engage à protéger la vie privée de ses utilisateurs 
                et à traiter leurs données personnelles de manière transparente et sécurisée, 
                conformément aux lois en vigueur sur la protection des données.
              </p>
            </div>
          </section>

          {/* Données collectées */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Database className="w-6 h-6 text-[#4DA6FF]" />
              <h3 className="text-xl text-[#002F6C]">1. Données Collectées</h3>
            </div>
            
            <h4 className="font-semibold text-[#002F6C] mt-4 mb-2">1.1. Données d'identité</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              <li>Nom et prénom</li>
              <li>Adresse email</li>
              <li>Numéro de téléphone</li>
              <li>Pays de résidence</li>
            </ul>

            <h4 className="font-semibold text-[#002F6C] mt-4 mb-2">1.2. Données académiques</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              <li>Niveau d'études</li>
              <li>Diplômes obtenus</li>
              <li>Domaine d'études souhaité</li>
              <li>Destination d'études</li>
            </ul>

            <h4 className="font-semibold text-[#002F6C] mt-4 mb-2">1.3. Données de navigation</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              <li>Adresse IP</li>
              <li>Type de navigateur</li>
              <li>Pages visitées</li>
              <li>Durée de visite</li>
            </ul>
          </section>

          {/* Finalités */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <UserCheck className="w-6 h-6 text-[#4DA6FF]" />
              <h3 className="text-xl text-[#002F6C]">2. Finalités du Traitement</h3>
            </div>
            
            <p className="text-gray-700 mb-3">
              Les données personnelles collectées sont utilisées pour :
            </p>
            
            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-semibold text-[#002F6C]">✓ Accompagnement personnalisé</p>
                <p className="text-sm text-gray-600">Traiter vos demandes d'information et vous accompagner dans votre projet d'études</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-semibold text-[#002F6C]">✓ Communication</p>
                <p className="text-sm text-gray-600">Vous envoyer des informations sur nos services et opportunités</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-semibold text-[#002F6C]">✓ Amélioration des services</p>
                <p className="text-sm text-gray-600">Analyser l'utilisation du site pour améliorer nos services</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-semibold text-[#002F6C]">✓ Gestion administrative</p>
                <p className="text-sm text-gray-600">Gérer les contrats, factures et obligations légales</p>
              </div>
            </div>
          </section>

          {/* Sécurité */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Lock className="w-6 h-6 text-[#4DA6FF]" />
              <h3 className="text-xl text-[#002F6C]">3. Sécurité des Données</h3>
            </div>
            
            <p className="text-gray-700 mb-3">
              OMEGA24 CONSULTING met en œuvre des mesures de sécurité techniques et 
              organisationnelles pour protéger vos données :
            </p>
            
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <p className="font-semibold text-green-700">🔒 Chiffrement SSL/TLS</p>
                <p className="text-sm text-gray-600">Transmission sécurisée des données</p>
              </div>
              
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <p className="font-semibold text-green-700">🔐 Accès restreint</p>
                <p className="text-sm text-gray-600">Personnel autorisé uniquement</p>
              </div>
              
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <p className="font-semibold text-green-700">💾 Sauvegardes régulières</p>
                <p className="text-sm text-gray-600">Protection contre la perte de données</p>
              </div>
              
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <p className="font-semibold text-green-700">🛡️ Pare-feu et antivirus</p>
                <p className="text-sm text-gray-600">Protection contre les menaces</p>
              </div>
            </div>
          </section>

          {/* Vos droits */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Eye className="w-6 h-6 text-[#4DA6FF]" />
              <h3 className="text-xl text-[#002F6C]">4. Vos Droits</h3>
            </div>
            
            <p className="text-gray-700 mb-3">
              Conformément à la réglementation, vous disposez des droits suivants :
            </p>
            
            <div className="space-y-2">
              <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-[#4DA6FF]">
                <p className="font-semibold text-[#002F6C]">✓ Droit d'accès</p>
                <p className="text-sm text-gray-600">Obtenir une copie de vos données personnelles</p>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-[#4DA6FF]">
                <p className="font-semibold text-[#002F6C]">✓ Droit de rectification</p>
                <p className="text-sm text-gray-600">Corriger vos données inexactes ou incomplètes</p>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-[#4DA6FF]">
                <p className="font-semibold text-[#002F6C]">✓ Droit à l'effacement</p>
                <p className="text-sm text-gray-600">Supprimer vos données dans certaines conditions</p>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-[#4DA6FF]">
                <p className="font-semibold text-[#002F6C]">✓ Droit d'opposition</p>
                <p className="text-sm text-gray-600">Vous opposer au traitement de vos données</p>
              </div>
            </div>

            <div className="mt-4 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Pour exercer vos droits :</strong> Contactez-nous à 
                <span className="text-[#4DA6FF]"> omega24consulting@gmail.com</span>. 
                Nous vous répondrons sous 30 jours.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h3 className="text-xl text-[#002F6C] mb-3">5. Contact</h3>
            <div className="bg-[#002F6C] text-white p-4 rounded-lg">
              <p className="mb-2">
                <strong>Pour toute question concernant vos données personnelles :</strong>
              </p>
              <p className="mb-1">📧 Email : omega24consulting@gmail.com</p>
              <p className="mb-1">📞 Téléphone : +229 01 41 31 22 22</p>
              <p>📞 Téléphone : +229 01 90 57 42 42</p>
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
