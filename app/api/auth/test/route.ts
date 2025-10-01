import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Test endpoint pour vérifier la configuration de l'authentification
export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Vérifier les variables d'environnement
    const envCheck = {
      supabaseUrl: !!supabaseUrl,
      supabaseAnonKey: !!supabaseAnonKey,
      supabaseServiceKey: !!supabaseServiceKey,
      urlValue: supabaseUrl?.substring(0, 30) + '...',
    };

    // Créer un client admin pour tester
    const supabaseAdmin = createClient(
      supabaseUrl!,
      supabaseServiceKey!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Vérifier la connexion à la base de données
    const { data: profiles, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('email, role')
      .in('email', ['ceo@li-lo.com', 'worker@li-lo.com', 'client@li-lo.com']);

    // Vérifier les utilisateurs dans Auth
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();

    const testUsers = ['ceo@li-lo.com', 'worker@li-lo.com', 'client@li-lo.com'];
    const existingAuthUsers = authUsers?.users?.filter(u =>
      testUsers.includes(u.email || '')
    ).map(u => ({
      email: u.email,
      created_at: u.created_at,
      last_sign_in: u.last_sign_in_at
    }));

    return NextResponse.json({
      status: 'ok',
      environment: envCheck,
      database: {
        connected: !profileError,
        profiles: profiles || [],
        error: profileError?.message
      },
      auth: {
        connected: !authError,
        testUsersFound: existingAuthUsers?.length || 0,
        testUsers: existingAuthUsers || [],
        totalUsers: authUsers?.users?.length || 0,
        error: authError?.message
      },
      recommendations: {
        needToCreateUsers: !existingAuthUsers || existingAuthUsers.length === 0,
        message: existingAuthUsers?.length === 0
          ? 'Les utilisateurs de test doivent être créés via Supabase Dashboard > Authentication > Users'
          : 'Les utilisateurs de test existent'
      }
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
      details: error.toString()
    }, { status: 500 });
  }
}

// Endpoint POST pour créer un utilisateur de test
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({
        error: 'Email et mot de passe requis'
      }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Créer l'utilisateur
    const { data: user, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (createError) {
      return NextResponse.json({
        error: createError.message
      }, { status: 400 });
    }

    // Déterminer le rôle basé sur l'email
    let role = 'client';
    if (email === 'ceo@li-lo.com') role = 'ceo';
    else if (email === 'worker@li-lo.com') role = 'seller';

    // Créer ou mettre à jour le profil
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: user.user.id,
        email: email,
        role: role,
        first_name: role === 'ceo' ? 'CEO' : role === 'seller' ? 'Worker' : 'Client',
        last_name: 'Li-Lo',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (profileError) {
      console.error('Erreur création profil:', profileError);
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.user.id,
        email: user.user.email,
        role: role
      }
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({
      error: error.message
    }, { status: 500 });
  }
}