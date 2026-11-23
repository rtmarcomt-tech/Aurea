# AureA — procedimento de instalação e operação em produção

Este documento descreve os requisitos e a sequência operacional para instalar uma instância AureA numa VPS. Não pressupõe um domínio, fornecedor, sistema operativo ou proxy específico. Esses elementos têm de ser definidos para a instalação concreta.

## 1. Requisitos antes da instalação

Confirmar e registar:

- VPS com Node.js 22 LTS e recursos suficientes para Next.js, Prisma e processamento de imagem com Sharp.
- PostgreSQL acessível apenas pela aplicação e por operações administrativas autorizadas.
- Domínio apontado para a VPS.
- Proxy reverso (Caddy ou Nginx) configurado para terminar TLS e encaminhar pedidos para a porta interna da aplicação.
- Certificado HTTPS válido antes de ativar o acesso administrativo.
- Diretório persistente, fora da área efémera de deployment, para os ficheiros multimédia.
- Destino de backups fora da VPS.
- Acesso SSH administrativo e mecanismo de gestão de serviços (systemd ou equivalente).

Não expor diretamente a porta interna da aplicação à Internet. O proxy deve encaminhar os cabeçalhos de proxy de forma controlada e substituir os valores recebidos do cliente; a aplicação usa atualmente `x-forwarded-for` para identificar a origem de pedidos sujeitos a rate limit.

## 2. Variáveis de ambiente

Configurar no ambiente do serviço, nunca no repositório:

| Variável | Finalidade |
|---|---|
| `NODE_ENV` | Definir como `production`. |
| `APP_URL` | URL canónico público completo, incluindo `https://`. |
| `APP_SECRET` | Segredo aleatório forte, exclusivo desta instalação. |
| `DATABASE_URL` | Ligação PostgreSQL da instância. |
| `ADMIN_BOOTSTRAP_SECRET` | Segredo temporário e independente para criar o primeiro administrador. |
| `MEDIA_STORAGE_DRIVER` | Atualmente usar `local`; o adaptador S3 ainda não está implementado. |
| `MEDIA_LOCAL_DIR` | Caminho absoluto para o volume persistente de imagens. |

As variáveis SMTP são opcionais. O formulário de contacto guarda as mensagens na base de dados; não depende do envio de email para as receber.

Gerar `APP_SECRET` e `ADMIN_BOOTSTRAP_SECRET` separadamente. O segredo de bootstrap deve ter pelo menos 24 caracteres. Não reutilizar palavras-passe, não colocar segredos em argumentos de comandos que fiquem no histórico e não os enviar por chat.

## 3. Preparar a aplicação

1. Obter o código da branch/release aprovada.
2. Instalar dependências com a versão de Node.js definida para o ambiente. Enquanto não existir um lockfile npm revisto no repositório, a instalação CI utiliza `npm install --legacy-peer-deps --no-audit --no-fund`; não assumir que `npm ci` é aplicável.
3. Configurar as variáveis de ambiente.
4. Criar a base de dados e um utilizador PostgreSQL com permissões apenas sobre essa base de dados.
5. Criar o diretório definido em `MEDIA_LOCAL_DIR`, atribuindo propriedade e permissões ao utilizador do serviço.
6. Executar:
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   npm run lint
   npm run typecheck
   npm test
   npm run build
   ```
7. Configurar o serviço de aplicação para arrancar com `npm start`, sob um utilizador sem privilégios de root, e reiniciar automaticamente após falha/reboot.
8. Configurar o proxy reverso e validar HTTPS antes de expor a aplicação.

Não executar migrações de desenvolvimento em produção. Usar `prisma migrate deploy` com as migrações versionadas.

## 4. Criar o primeiro administrador

O endpoint de bootstrap só funciona quando `APP_URL` começa por `https://`, quando `ADMIN_BOOTSTRAP_SECRET` está configurado e quando ainda não existe qualquer administrador.

1. Confirmar que a aplicação está acessível por HTTPS.
2. Enviar um pedido POST para `/api/v1/admin/bootstrap` com `email`, `password` e `bootstrapSecret`.
3. Usar uma palavra-passe única com pelo menos 14 caracteres.
4. Confirmar a resposta HTTP 201 e testar o acesso a `/admin/login`.
5. Remover imediatamente `ADMIN_BOOTSTRAP_SECRET` do ambiente do serviço e reiniciar a aplicação.

O endpoint não permite criar um segundo administrador depois de existir a primeira conta. Não manter o segredo de bootstrap ativo após a configuração inicial.

## 5. Armazenamento multimédia

A implementação atual guarda ficheiros WebP no sistema de ficheiros local. A base de dados guarda os metadados e a chave do ficheiro; não contém os bytes da imagem.

- Montar `MEDIA_LOCAL_DIR` num volume persistente.
- Não colocar esse diretório numa pasta temporária nem numa área que seja apagada ao substituir a versão da aplicação.
- Incluir o diretório completo nos backups.
- Preservar a correspondência entre registos `MediaAsset` e ficheiros com o mesmo `storageKey`.
- Testar a leitura das imagens depois de uma restauração.

O adaptador S3-compatível não está implementado nesta versão. Não configurar `MEDIA_STORAGE_DRIVER=s3` à espera de que o armazenamento remoto funcione.

## 6. Backups e recuperação

A política mínima recomendada para cada instalação:

- Backup diário da base de dados PostgreSQL.
- Backup diário do diretório multimédia.
- Cópias cifradas e transferidas para um destino fora da VPS.
- Retenção definida pelo responsável da instalação.
- Monitorização de falhas dos jobs de backup.
- Teste periódico de restauro num ambiente isolado.

Um backup só deve ser considerado válido depois de restaurado e verificado. Num teste de recuperação, confirmar:

1. A aplicação consegue ligar-se à base de dados restaurada.
2. O administrador consegue autenticar-se.
3. As páginas publicadas e os respetivos conteúdos estão presentes.
4. As imagens referenciadas no CMS são servidas corretamente.
5. As mensagens de contacto e o histórico editorial estão presentes.

A base de dados e os ficheiros multimédia devem ser capturados em janelas coordenadas ou com um procedimento que permita consistência entre os registos e os ficheiros.

## 7. Atualizações e rollback

1. Confirmar que a branch/release passou o CI no commit exato a instalar.
2. Criar backup da base de dados e dos ficheiros multimédia antes da atualização.
3. Descarregar o código aprovado e instalar dependências.
4. Executar `npx prisma generate` e `npx prisma migrate deploy`.
5. Executar `npm run build`.
6. Reiniciar o serviço e verificar logs, homepage, páginas de serviços, formulário de contacto, login administrativo e leitura de imagens.
7. Se a versão falhar, reverter o código para a versão anterior. Se uma migração tiver alterado o esquema ou os dados de forma incompatível, seguir o procedimento de recuperação a partir do backup; não presumir que reverter apenas o código desfaz uma migração.

## 8. Verificações de segurança e operação

Antes de declarar a instalação pronta:

- HTTPS válido e redirecionamento HTTP para HTTPS.
- Porta interna da aplicação não exposta publicamente.
- PostgreSQL não exposto publicamente.
- Segredos fora do Git e com permissões restritas.
- Serviço executado sem root.
- Diretório multimédia persistente e com permissões mínimas.
- Backups externos automáticos e restauro testado.
- Logs e alertas operacionais disponíveis, sem registar palavras-passe, cookies, tokens ou segredos.
- Rate limiting verificado atrás do proxy real. O proxy tem de sanitizar os cabeçalhos de IP encaminhados; não confiar em `x-forwarded-for` fornecido diretamente pelo cliente.
- CI verde no commit a instalar.
- Testes de ponta a ponta executados no ambiente de staging.

## 9. Limitações conhecidas nesta versão

- O armazenamento multimédia implementado é local; S3-compatível é trabalho futuro.
- O envio de imagens está implementado; upload de vídeo não está incluído.
- O CI atual executa lint, TypeScript, testes unitários e build. A suite Playwright ainda não está integrada no pipeline.
- O conteúdo fixo de várias secções das páginas de serviços continua no código; o editor CMS ainda não cobre integralmente todos esses blocos.
- A instalação, o bootstrap administrativo, os backups externos e o restauro têm de ser executados e verificados no servidor concreto.

A AureA não deve ser declarada pronta para produção antes de estas limitações serem resolvidas ou formalmente aceites e dos testes operacionais serem concluídos.
