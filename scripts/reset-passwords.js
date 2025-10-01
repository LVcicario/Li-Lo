// Script pour réinitialiser les mots de passe des utilisateurs de test
// Exécuter avec : node scripts/reset-passwords.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const testUsers = [
  { email: 'ceo@li-lo.com', password: 'Test123456!', role: 'ceo' },
  { email: 'worker@li-lo.com', password: 'Test123456!', role: 'seller' },
  { email: 'client@li-lo.com', password: 'Test123456!', role: 'client' }
];

async function resetPasswords() {
  console.log('🔄 Réinitialisation des mots de passe...\n');

  for (const user of testUsers) {
    try {
      // Récupérer l'utilisateur
      const { data: users, error: searchError } = await supabase.auth.admin.listUsers();

      if (searchError) {
        console.error(`❌ Erreur recherche ${user.email}:`, searchError.message);
        continue;
      }

      const existingUser = users.users.find(u => u.email === user.email);

      if (existingUser) {
        // Mettre à jour le mot de passe
        const { error: updateError } = await supabase.auth.admin.updateUserById(
          existingUser.id,
          { password: user.password }
        );

        if (updateError) {
          console.error(`❌ Erreur mise à jour ${user.email}:`, updateError.message);
        } else {
          console.log(`✅ Mot de passe mis à jour pour ${user.email}`);
        }
      } else {
        console.log(`⚠️  Utilisateur ${user.email} n'existe pas, création...`);

        // Créer l'utilisateur
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true
        });

        if (createError) {
          console.error(`❌ Erreur création ${user.email}:`, createError.message);
        } else {
          console.log(`✅ Utilisateur créé: ${user.email}`);

          // Créer le profil
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: newUser.user.id,
              email: user.email,
              role: user.role,
              first_name: user.role === 'ceo' ? 'CEO' : user.role === 'seller' ? 'Worker' : 'Client',
              last_name: 'Li-Lo',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (profileError) {
            console.error(`⚠️  Erreur création profil ${user.email}:`, profileError.message);
          } else {
            console.log(`✅ Profil créé pour ${user.email}`);
          }
        }
      }
    } catch (error) {
      console.error(`❌ Erreur pour ${user.email}:`, error);
    }
  }

  console.log('\n✅ Terminé!\n');
  console.log('Comptes de test:');
  testUsers.forEach(u => {
    console.log(`  ${u.email} / ${u.password} (${u.role})`);
  });
}

resetPasswords().catch(console.error);