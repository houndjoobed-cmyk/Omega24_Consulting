import { Hono, type Context } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';
import { sendContactEmail } from './email.tsx';

const app = new Hono();

// Middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));
app.use('*', logger(console.log));

// Initialize Supabase client
// @ts-ignore: Deno is available in Supabase Edge Functions
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Health check
app.get('/make-server-27d76fd3/health', (c: Context) => {
  return c.json({ status: 'ok', message: 'Server is running' });
});

// Signup route - Create new admin user
app.post('/make-server-27d76fd3/signup', async (c: Context) => {
  try {
    const body = await c.req.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return c.json({ error: 'Email et mot de passe requis' }, 400);
    }

    // Create user with Supabase Auth
    // @ts-ignore: Admin functions are available on the service role client
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name: name || 'Admin' },
      email_confirm: true, // Auto-confirm email since we don't have email server configured
    });

    if (error) {
      console.log('Signup error:', error.message);
      return c.json({ error: error.message }, 400);
    }

    return c.json({
      success: true,
      user: { id: data.user.id, email: data.user.email }
    });
  } catch (error: any) {
    console.log('Signup error:', error.message);
    return c.json({ error: error.message || 'Erreur lors de la création du compte' }, 500);
  }
});

// Get all flyers
app.get('/make-server-27d76fd3/flyers', async (c: Context) => {
  try {
    const flyers = await kv.getByPrefix('flyer:');
    return c.json({ flyers: flyers || [] });
  } catch (error: any) {
    console.log('Error fetching flyers:', error.message);
    return c.json({ error: error.message }, 500);
  }
});

// Add/Update flyer (protected route)
app.post('/make-server-27d76fd3/flyers', async (c: Context) => {
  try {
    // Verify user is authenticated
    // @ts-ignore: Deno is available
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken || accessToken === Deno.env.get('SUPABASE_ANON_KEY')) {
      return c.json({ error: 'Authentification requise' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user?.id) {
      return c.json({ error: 'Session invalide' }, 401);
    }

    const body = await c.req.json();
    const { id, title, description, images, image, details } = body;

    if (!id || !title || !description) {
      return c.json({ error: 'Données invalides' }, 400);
    }

    // Support legacy "image" property or new "images" array
    const finalImages = Array.isArray(images) && images.length > 0
      ? images
      : (image ? [image] : []);

    const flyer = { id, title, description, images: finalImages, details };
    await kv.set(`flyer:${id}`, flyer);

    return c.json({ success: true, flyer });
  } catch (error: any) {
    console.log('Error saving flyer:', error.message);
    return c.json({ error: error.message }, 500);
  }
});

// Delete flyer (protected route)
app.delete('/make-server-27d76fd3/flyers/:id', async (c: Context) => {
  try {
    // Verify user is authenticated
    // @ts-ignore: Deno is available
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken || accessToken === Deno.env.get('SUPABASE_ANON_KEY')) {
      return c.json({ error: 'Authentification requise' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user?.id) {
      return c.json({ error: 'Session invalide' }, 401);
    }

    const id = c.req.param('id');
    await kv.del(`flyer:${id}`);

    return c.json({ success: true });
  } catch (error: any) {
    console.log('Error deleting flyer:', error.message);
    return c.json({ error: error.message }, 500);
  }
});

// Verify admin session
app.get('/make-server-27d76fd3/verify-admin', async (c: Context) => {
  try {
    // @ts-ignore: Deno is available
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken || accessToken === Deno.env.get('SUPABASE_ANON_KEY')) {
      return c.json({ authenticated: false }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user?.id) {
      return c.json({ authenticated: false }, 401);
    }

    return c.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name
      }
    });
  } catch (error: any) {
    console.log('Verify admin error:', error.message);
    return c.json({ authenticated: false }, 401);
  }
});

// Get all testimonials
app.get('/make-server-27d76fd3/testimonials', async (c: Context) => {
  try {
    const testimonials = await kv.getByPrefix('testimonial:');
    return c.json({ testimonials: testimonials || [] });
  } catch (error: any) {
    console.log('Error fetching testimonials:', error.message);
    return c.json({ error: error.message }, 500);
  }
});

// Add testimonial (protected route)
app.post('/make-server-27d76fd3/testimonials', async (c: Context) => {
  try {
    // Verify user is authenticated
    // @ts-ignore: Deno is available
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken || accessToken === Deno.env.get('SUPABASE_ANON_KEY')) {
      return c.json({ error: 'Authentification requise' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user?.id) {
      return c.json({ error: 'Session invalide' }, 401);
    }

    const body = await c.req.json();
    const { id, name, role, country, rating, comment, photo, date } = body;

    if (!id || !name || !role || !country || !comment) {
      return c.json({ error: 'Données invalides' }, 400);
    }

    const testimonial = { id, name, role, country, rating: rating || 5, comment, photo, date };
    await kv.set(`testimonial:${id}`, testimonial);

    return c.json({ success: true, testimonial });
  } catch (error: any) {
    console.log('Error saving testimonial:', error.message);
    return c.json({ error: error.message }, 500);
  }
});

// Update testimonial (protected route)
app.put('/make-server-27d76fd3/testimonials', async (c: Context) => {
  try {
    // Verify user is authenticated
    // @ts-ignore: Deno is available
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken || accessToken === Deno.env.get('SUPABASE_ANON_KEY')) {
      return c.json({ error: 'Authentification requise' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user?.id) {
      return c.json({ error: 'Session invalide' }, 401);
    }

    const body = await c.req.json();
    const { id, name, role, country, rating, comment, photo, date } = body;

    if (!id || !name || !role || !country || !comment) {
      return c.json({ error: 'Données invalides' }, 400);
    }

    const testimonial = { id, name, role, country, rating: rating || 5, comment, photo, date };
    await kv.set(`testimonial:${id}`, testimonial);

    return c.json({ success: true, testimonial });
  } catch (error: any) {
    console.log('Error updating testimonial:', error.message);
    return c.json({ error: error.message }, 500);
  }
});

// Delete testimonial (protected route)
app.delete('/make-server-27d76fd3/testimonials/:id', async (c: Context) => {
  try {
    // Verify user is authenticated
    // @ts-ignore: Deno is available
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken || accessToken === Deno.env.get('SUPABASE_ANON_KEY')) {
      return c.json({ error: 'Authentification requise' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user?.id) {
      return c.json({ error: 'Session invalide' }, 401);
    }

    const id = c.req.param('id');
    await kv.del(`testimonial:${id}`);

    return c.json({ success: true });
  } catch (error: any) {
    console.log('Error deleting testimonial:', error.message);
    return c.json({ error: error.message }, 500);
  }
});

// Send contact email
app.post('/make-server-27d76fd3/contact', async (c: Context) => {
  try {
    const body = await c.req.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return c.json({ error: 'Tous les champs obligatoires doivent être remplis' }, 400);
    }

    // Send email
    const result = await sendContactEmail({ name, email, phone, subject, message });

    if (!result.success) {
      console.error('Email sending error during contact form submission:', result.error);
      return c.json({ error: 'Erreur lors de l\'envoi de l\'email' }, 500);
    }

    // Also save to database for admin review
    const contactId = `contact-${Date.now()}`;
    await kv.set(`contact:${contactId}`, {
      id: contactId,
      name,
      email,
      phone,
      subject,
      message,
      date: new Date().toISOString(),
      read: false
    });

    return c.json({ success: true });
  } catch (error: any) {
    console.log('Error processing contact form during submission:', error.message);
    return c.json({ error: error.message }, 500);
  }
});

// @ts-ignore: Deno is available
Deno.serve(app.fetch);