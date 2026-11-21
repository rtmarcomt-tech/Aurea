# Configuração do primeiro administrador

A criação da conta administrativa é feita uma única vez, através do endpoint de bootstrap. Não existe registo público nem palavra-passe predefinida.

## 1. Preparar variáveis no servidor

Definir:
- `DATABASE_URL`: ligação PostgreSQL da instalação.
- `APP_SECRET`: segredo aleatório forte para a aplicação.
- `ADMIN_BOOTSTRAP_SECRET`: segredo aleatório independente, com pelo menos 24 caracteres.

Não colocar estes valores no Git, em mensagens públicas ou no código do website.

## 2. Aplicar migrações

Depois de configurar a base de dados e instalar as dependências:

```bash
npx prisma migrate deploy
npx prisma generate
```

## 3. Criar o administrador

Enviar um pedido HTTPS para `/api/v1/admin/bootstrap` com:
- `email`: email administrativo escolhido.
- `password`: palavra-passe única com pelo menos 14 caracteres.
- `bootstrapSecret`: valor exato de `ADMIN_BOOTSTRAP_SECRET`.

O endpoint só cria a primeira conta, exige o segredo de bootstrap e limita tentativas por endereço IP. Depois de criada a conta, o endpoint deixa de permitir novas contas.

Exemplo de pedido (substituir os valores localmente; nunca guardar segredos reais no repositório):

```bash
curl -X POST https://SEU-DOMINIO/api/v1/admin/bootstrap \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@SEU-DOMINIO","password":"SUBSTITUIR-POR-UMA-PASSWORD-FORTE","bootstrapSecret":"SUBSTITUIR-PELO-SEGREDO-DE-BOOTSTRAP"}'
```

## 4. Aceder ao backoffice

Abrir `/admin/login`. As sessões usam cookies HttpOnly, SameSite=Lax e Secure em produção. O token da sessão é armazenado apenas sob a forma de hash na base de dados.

## 5. Encerrar a configuração inicial

Após criar o administrador, remover `ADMIN_BOOTSTRAP_SECRET` das variáveis de ambiente e reiniciar a aplicação. O endpoint também verifica se já existe um administrador, pelo que não aceita um segundo registo.
