// Managed by site-template (kit). Change it there and run kit-sync.
// Site-specific form definitions live in forms.json at the repo root.
//
// Run: BASE_URL=<staging url> npx playwright test tests/forms.spec.ts
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

type FieldValue = string | { check: boolean } | { select: string };

interface FormCheck {
  name: string;
  path: string;
  fields: Record<string, FieldValue>;
  submit: string;
  successText: string;
  endpoint?: string;
}

interface FormsConfig {
  productionHosts: string[];
  forms: FormCheck[];
}

const config: FormsConfig = JSON.parse(
  readFileSync(join(process.cwd(), 'forms.json'), 'utf8'),
);

const baseURL = process.env.BASE_URL;
if (!baseURL) {
  throw new Error('Set BASE_URL to the staging URL before running form tests.');
}

const host = new URL(baseURL).hostname;
if (
  config.productionHosts.includes(host) &&
  process.env.ALLOW_PRODUCTION_FORM_TESTS !== '1'
) {
  throw new Error(
    `Refusing to submit test forms to production host ${host}. ` +
      'Point BASE_URL at staging, or set ALLOW_PRODUCTION_FORM_TESTS=1 if Dustin asked for it.',
  );
}

for (const form of config.forms) {
  test(`form submits: ${form.name}`, async ({ page }) => {
    await page.goto(form.path);

    for (const [selector, value] of Object.entries(form.fields)) {
      const field = page.locator(selector);
      if (typeof value === 'string') {
        await field.fill(value);
      } else if ('check' in value) {
        await field.setChecked(value.check);
      } else {
        await field.selectOption(value.select);
      }
    }

    const submit = page.locator(form.submit);

    if (form.endpoint) {
      const endpoint = form.endpoint;
      const [response] = await Promise.all([
        page.waitForResponse(
          (r) => r.url().includes(endpoint) && r.request().method() === 'POST',
        ),
        submit.click(),
      ]);
      expect(
        response.ok(),
        `${form.name}: POST ${endpoint} returned ${response.status()}`,
      ).toBeTruthy();
    } else {
      await submit.click();
    }

    await expect(page.getByText(form.successText)).toBeVisible({ timeout: 15_000 });
  });
}
