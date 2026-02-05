// Script de test pour vérifier l'envoi d'emails
// Usage: node test-email.js

const SUPABASE_URL = 'https://vcblcaufhcgcggnzifln.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjYmxjYXVmaGNnY2dnbnppZmxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NDY3MTgsImV4cCI6MjA3OTIyMjcxOH0.-0YH190kfxPm9ktCUeb44WoujjKPK3tJX1IFU__nsyg';

async function testEmail() {
    console.log('🧪 Test d\'envoi d\'email via Supabase Edge Function...\n');

    const testData = {
        name: 'Test Utilisateur',
        email: 'test@example.com',
        subject: 'Test de Configuration Email',
        message: 'Ceci est un email de test pour vérifier que la configuration Resend fonctionne correctement avec OMEGA24 Consulting.'
    };

    console.log('📧 Données du test:');
    console.log(JSON.stringify(testData, null, 2));
    console.log('\n🚀 Envoi en cours...\n');

    try {
        const response = await fetch(`${SUPABASE_URL}/functions/v1/make-server-27d76fd3/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify(testData)
        });

        const result = await response.json();

        if (response.ok) {
            console.log('✅ SUCCESS! Email envoyé avec succès!');
            console.log('📬 Vérifiez votre boîte email: info@omega24consulting.com');
            console.log('\nRéponse:', JSON.stringify(result, null, 2));
        } else {
            console.log('❌ ERREUR lors de l\'envoi:');
            console.log('Status:', response.status);
            console.log('Réponse:', JSON.stringify(result, null, 2));
        }
    } catch (error) {
        console.log('❌ ERREUR de connexion:');
        console.log(error.message);
    }
}

testEmail();
