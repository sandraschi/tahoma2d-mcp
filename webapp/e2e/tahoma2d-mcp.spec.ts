import { test, expect } from '@playwright/test';

const AUTH = { Authorization: 'Basic ' + Buffer.from('user:pass').toString('base64') };

test.describe('Frontend', () => {
    test('Dashboard loads with KPIs', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('text=Tahoma2D Dashboard')).toBeVisible();
        await expect(page.locator('text=Server Status')).toBeVisible();
    });

    test('Canvas page loads', async ({ page }) => {
        await page.goto('/canvas');
        await expect(page.locator('text=Canvas Manager')).toBeVisible();
    });

    test('Draw page loads', async ({ page }) => {
        await page.goto('/draw');
        await expect(page.locator('text=Draw & Paint')).toBeVisible();
    });

    test('Animation page loads', async ({ page }) => {
        await page.goto('/animation');
        await expect(page.locator('text=Animation Timeline')).toBeVisible();
    });

    test('Navigation sidebar works', async ({ page }) => {
        await page.goto('/');
        await page.click('text=Canvas');
        await expect(page.locator('text=Canvas Manager')).toBeVisible();
        await page.click('text=Dashboard');
        await expect(page.locator('text=Tahoma2D Dashboard')).toBeVisible();
    });

    test('All main pages load without errors', async ({ page }) => {
        const pages = ['/', '/canvas', '/layers', '/draw', '/animation', '/effects', '/compositor', '/render', '/export', '/settings', '/help'];
        for (const p of pages) {
            await page.goto(p);
            await expect(page.locator('h1')).toBeVisible();
        }
    });
});

test.describe('REST API', () => {
    test('GET /api/status returns 200', async ({ request }) => {
        const resp = await request.get('/api/status', { headers: AUTH });
        expect(resp.status()).toBe(200);
    });
});
