import { json } from '@tanstack/react-start';
import { createAPIFileRoute } from '@tanstack/react-start/server';

export const Route = createAPIFileRoute('/api/countdown')({
  POST: async ({ request, context }) => {
    try {
      const env = context.cloudflare?.env || globalThis.env;
      if (!env?.DB) {
        return json(
          { error: 'Database not configured' },
          { status: 500 }
        );
      }

      const body = await request.json();
      const { enabled, endsAt, redirectUrl } = body;

      if (typeof enabled !== 'boolean' || typeof endsAt !== 'string' || typeof redirectUrl !== 'string') {
        return json(
          { error: 'Invalid request body' },
          { status: 400 }
        );
      }

      const result = await env.DB.prepare(
        'UPDATE countdown SET enabled = ?, ends_at = ?, redirect_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1'
      )
        .bind(enabled ? 1 : 0, endsAt, redirectUrl)
        .run();

      return json({
        success: true,
        enabled,
        endsAt,
        redirectUrl,
      });
    } catch (error) {
      console.error('Countdown POST error:', error);
      return json(
        { error: error instanceof Error ? error.message : 'Unknown error' },
        { status: 500 }
      );
    }
  },

  GET: async ({ context }) => {
    try {
      const env = context.cloudflare?.env || globalThis.env;
      if (!env?.DB) {
        return json(
          { error: 'Database not configured' },
          { status: 500 }
        );
      }

      const row = await env.DB.prepare(
        'SELECT enabled, ends_at as endsAt, redirect_url as redirectUrl FROM countdown WHERE id = 1'
      ).first();

      if (!row) {
        // Insert default row if missing
        await env.DB.prepare(
          'INSERT INTO countdown (id, enabled, ends_at, redirect_url) VALUES (1, 0, "", "")'
        ).run();

        return json({
          enabled: false,
          endsAt: '',
          redirectUrl: '',
        });
      }

      return json({
        enabled: Boolean(row.enabled),
        endsAt: row.endsAt || '',
        redirectUrl: row.redirectUrl || '',
      });
    } catch (error) {
      console.error('Countdown GET error:', error);
      return json(
        { error: error instanceof Error ? error.message : 'Unknown error' },
        { status: 500 }
      );
    }
  },
});
