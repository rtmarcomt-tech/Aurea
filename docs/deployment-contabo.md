# Deploy AureA na VPS Contabo (acesso temporário por IP)

## Isolamento

- Diretório de instalação: `/opt/aurea`.
- Aplicação Next.js: porta TCP 3001 no host (porta 3000 dentro do container).
- PostgreSQL: serviço Docker privado, sem porta publicada no host.
- Volume persistente exclusivo: `aurea_production_postgres`.
- O Mercur mantém a sua instalação e a porta 9000; não é alterado por este deployment.
- A instalação não altera serviços existentes; se a porta 3001 estiver ocupada, o instalador termina sem modificar esse serviço.

## Requisitos

- VPS Linux com Docker Engine e Docker Compose plugin.
- Acesso SSH como utilizador com permissões sudo.
- Porta TCP 3001 permitida na firewall e no painel Contabo.
- Repositório GitHub `rtmarcomt-tech/Aurea`.

## Preparação de ambiente

O instalador cria `.env.production` em `/opt/aurea`, se ainda não existir, com segredos aleatórios e estas definições:

```dotenv
AUREA_PORT=3001
APP_URL=http://185.217.125.200:3001
```

Os segredos nunca devem ser adicionados ao Git. Não reutilizar palavras-passe, segredos ou credenciais do Mercur.

## Arranque

Executar o instalador como root:

```bash
curl -fsSL https://raw.githubusercontent.com/rtmarcomt-tech/Aurea/main/scripts/deploy-contabo.sh -o /tmp/deploy-aurea.sh && bash /tmp/deploy-aurea.sh
```

O container da aplicação espera pela disponibilidade do PostgreSQL, aplica as migrações Prisma e inicia o Next.js. O PostgreSQL não fica exposto à Internet.

## Endereço temporário

`http://185.217.125.200:3001`

Este acesso é HTTP sem TLS. Deve ser usado apenas para validar as páginas públicas. Não iniciar sessão administrativa nem enviar credenciais por este endereço. A criação do administrador e o acesso ao backoffice ficam pendentes até existir HTTPS.

## Domínio e HTTPS posteriores

Quando existir domínio, configurar DNS para o IP da VPS, instalar/configurar um reverse proxy TLS (Caddy ou Nginx), encaminhar o tráfego para a porta interna da aplicação, atualizar `APP_URL` para HTTPS e só então definir `ADMIN_BOOTSTRAP_SECRET` para criar a conta administrativa. Não expor a porta 3001 publicamente depois de o reverse proxy estar ativo; restringi-la a localhost.

## Persistência e manutenção

Os dados PostgreSQL ficam no volume Docker `aurea_production_postgres`. Antes de atualizações, criar backup consistente da base de dados. Não executar `docker compose down -v`, pois remove o volume persistente.
