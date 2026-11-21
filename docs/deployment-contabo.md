# Deploy AureA na VPS Contabo (acesso temporário por IP)

## Isolamento

- Diretório de instalação: `/opt/aurea`.
- Aplicação Next.js: porta TCP 3000.
- PostgreSQL: serviço Docker privado, sem porta publicada no host.
- Volume persistente exclusivo: `aurea_production_postgres`.
- O Mercur mantém a sua instalação e a porta 9000; não é alterado por este deployment.

## Requisitos

- VPS Linux com Docker Engine e Docker Compose plugin.
- Acesso SSH como utilizador com permissões sudo.
- Porta TCP 3000 permitida na firewall e no painel Contabo.
- Repositório GitHub `rtmarcomt-tech/Aurea`.

## Preparação de ambiente

Criar `.env.production` em `/opt/aurea`, nunca o adicionar ao Git:

```dotenv
POSTGRES_PASSWORD=GERAR_UMA_PASSWORD_LONGA_E_ALEATORIA
APP_SECRET=GERAR_OUTRO_SEGREDO_LONGO_E_ALEATORIO
APP_URL=http://185.217.125.200:3000
```

Não reutilizar palavras-passe, segredos ou credenciais do Mercur.

## Arranque

A partir de `/opt/aurea`:

```bash
docker compose --env-file .env.production -f docker-compose.production.yml up -d --build
```

O container da aplicação espera pela disponibilidade do PostgreSQL, aplica as migrações Prisma e inicia o Next.js. O PostgreSQL não fica exposto à Internet.

## Endereço temporário

`http://185.217.125.200:3000`

Este acesso é HTTP sem TLS. Deve ser usado apenas para validar as páginas públicas. Não iniciar sessão administrativa nem enviar credenciais por este endereço. A criação do administrador e o acesso ao backoffice ficam pendentes até existir HTTPS.

## Verificação

```bash
docker compose --env-file .env.production -f docker-compose.production.yml ps
docker compose --env-file .env.production -f docker-compose.production.yml logs --tail=100 web
```

## Domínio e HTTPS posteriores

Quando existir domínio, configurar DNS para o IP da VPS, instalar/configurar um reverse proxy TLS (Caddy ou Nginx), encaminhar o tráfego para a porta 3000, atualizar `APP_URL` para HTTPS e só então definir `ADMIN_BOOTSTRAP_SECRET` para criar a conta administrativa. Não expor a porta 3000 publicamente depois de o reverse proxy estar ativo; restringi-la a localhost.

## Persistência e manutenção

Os dados PostgreSQL ficam no volume Docker `aurea_production_postgres`. Antes de atualizações, criar backup consistente da base de dados. Não executar `docker compose down -v`, pois remove o volume persistente.
