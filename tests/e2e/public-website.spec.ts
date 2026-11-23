import { expect, test } from "@playwright/test";

test("homepage apresenta as duas áreas de atuação", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: /Explorar soluções B2B/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Explorar Creator Economy/i })).toBeVisible();
});

test("gateway de serviços encaminha para B2B e Creator Economy", async ({ page }) => {
  await page.goto("/servicos");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: /Explorar serviços B2B/i })).toHaveAttribute("href", "/servicos/b2b");
  await expect(page.getByRole("link", { name: /Explorar serviços para creators/i })).toHaveAttribute("href", "/servicos/creators");
});

test("página de serviços B2B apresenta os serviços", async ({ page }) => {
  await page.goto("/servicos/b2b");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Websites institucionais e profissionais" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "SEO e crescimento digital" })).toBeVisible();
});

test("página Creator Economy apresenta os serviços", async ({ page }) => {
  await page.goto("/servicos/creators");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Website pessoal e identidade digital" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Plataformas de monetização" })).toBeVisible();
});

test("contactos apresenta formulário com campos essenciais", async ({ page }) => {
  await page.goto("/contactos");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByLabel("Nome")).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Mensagem")).toBeVisible();
  await expect(page.getByRole("button", { name: /Enviar mensagem/i })).toBeVisible();
});
