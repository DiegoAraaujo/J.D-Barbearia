# J.D Barbearia

Site da J.D Barbearia para apresentar os serviços, mostrar fotos dos atendimentos, receber pedidos de agendamento e publicar avaliações de clientes. Interface em português, com layout responsivo, tema escuro e animações.

## Funcionalidades

- Página inicial com vídeo de fundo, serviços e apresentação da barbearia.
- Galeria de fotos com carrossel arrastável.
- Localização com mapa integrado e atalhos para o WhatsApp.
- Formulário de agendamento em etapas, com validação de telefone, data e horário e envio por e-mail.
- Página `/reviews` para consultar e enviar avaliações de 1 a 5 estrelas.
- Comentário e foto opcionais, com captura pela câmera ou envio de arquivo.
- Moderação: novos envios ficam pendentes e apenas avaliações aprovadas aparecem no site.

O agendamento é uma **solicitação**, com confirmação posterior pelo WhatsApp. A aplicação não mantém uma agenda de reservas nem bloqueia horários já solicitados.

## Tecnologias

| Tecnologia | Uso |
| --- | --- |
| Next.js 16 e React 19 | App Router, páginas e rotas de API |
| TypeScript | Tipagem do código |
| Tailwind CSS 4 | Estilos e tema visual |
| Motion | Animações e transições |
| Supabase | Banco de avaliações e armazenamento das fotos |
| Nodemailer | Envio de e-mails de agendamento |
| Radix UI, Lucide e React Icons | Componentes de interface e ícones |
| Sora e Manrope | Fontes carregadas por `next/font/google` |

## Executar localmente

### Pré-requisitos

- Node.js **22 ou superior**, conforme a exigência da dependência Supabase instalada.
- npm.
- Projeto Supabase configurado conforme a seção abaixo.
- Servidor SMTP para enviar pedidos de agendamento.

### Instalação

Na pasta do projeto, instale as dependências:

```bash
npm ci
```

Crie um arquivo `.env.local` na raiz, ou complete o existente, com os valores do seu ambiente:

```dotenv
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_PUBLISHABLE_KEY=sua-chave-publicavel
SUPABASE_SECRET_KEY=sua-chave-secreta

SMTP_HOST=smtp.seu-provedor.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=seu-usuario-smtp
SMTP_PASS=sua-senha-smtp
MAIL_FROM="J.D Barbearia <site@seudominio.com>"
MAIL_TO=contato@seudominio.com
```

Os valores acima são exemplos. `MAIL_FROM` define o remetente e `MAIL_TO` define quem recebe os pedidos. Ajuste a porta e `SMTP_SECURE` conforme seu provedor; a conexão segura desde o início só é ativada quando essa variável vale exatamente `true`.

As três variáveis do Supabase são exigidas pelo código, inclusive para carregar as páginas que exibem avaliações. Sem SMTP, o envio de agendamentos retorna erro.

Mantenha a chave secreta do Supabase e a senha SMTP apenas no servidor, sem prefixo `NEXT_PUBLIC_`. O arquivo `.env.local` já é ignorado pelo Git.

Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000). Reinicie o servidor após alterar as variáveis de ambiente.

## Configuração do Supabase

O repositório não contém migrações. Para um projeto Supabase novo, este esquema mínimo atende aos campos utilizados pela aplicação. Execute-o no SQL Editor:

```sql
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  rating integer not null check (rating between 1 and 5),
  comment text check (char_length(comment) <= 300),
  photo_path text,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

grant select on public.reviews to anon;
grant all on public.reviews to service_role;

create policy "Leitura publica de avaliacoes aprovadas"
  on public.reviews
  for select
  to anon
  using (status = 'approved');
```

Se a tabela já existir, confira sua estrutura e políticas antes de aplicar alterações. A leitura usa a chave publicável; os envios passam pela API do Next.js e usam a chave secreta no servidor.

Em **Storage**, crie um bucket público chamado `review-avatars`. Configure o limite de arquivo para **2 MB** e os tipos permitidos como `image/jpeg`, `image/png` e `image/webp`, em acordo com a validação da API. Os uploads são feitos pelo servidor; não é necessário liberar escrita anônima no bucket.

As imagens desse bucket são acessíveis por URL pública, inclusive enquanto a avaliação estiver pendente. A moderação controla a exibição da avaliação no site.

### Publicar uma avaliação

1. Envie uma avaliação pela página `/reviews`.
2. No Table Editor do Supabase, abra a tabela `reviews`.
3. Revise o conteúdo e altere `status` de `pending` para `approved` para publicá-lo, ou para `rejected` para mantê-lo fora do site.
4. Recarregue a página para conferir o resultado.

A página inicial mostra as seis avaliações aprovadas mais recentes. A página `/reviews` consulta todas as aprovadas. Não há painel administrativo na aplicação.

## Comandos

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o ambiente de desenvolvimento |
| `npm run build` | Gera a versão de produção |
| `npm start` | Inicia o servidor após o build |
| `npm run lint` | Executa o ESLint |

Não há script de testes automatizados configurado no `package.json`.

## Estrutura do projeto

```text
public/
  images/                   # Fotos da galeria
  videoteste.mp4             # Vídeo utilizado na abertura
src/
  app/
    api/appointment/route.ts # Recebimento e envio de pedidos por e-mail
    api/reviews/route.ts     # Validação, upload e cadastro de avaliações
    reviews/page.tsx         # Página de avaliações
    globals.css             # Estilos globais e tema
    layout.tsx              # Fontes, idioma e metadados
    page.tsx                # Composição da página inicial
  components/               # Seções, formulários e componentes visuais
    ui/                     # Componentes reutilizáveis de interface
  data/reviews.ts            # Dados de exemplo; não alimentam as páginas atuais
  lib/
    supabase.ts             # Clientes Supabase exclusivos do servidor
    reviews.ts              # Consulta das avaliações aprovadas
  utils/
    appointment.ts          # Validação de telefone, datas e horários
    class-name.ts           # Utilitário de classes CSS
```

## Rotas

| Método | Rota | Função |
| --- | --- | --- |
| GET | `/` | Página inicial |
| GET | `/reviews` | Consulta e formulário de avaliações |
| POST | `/api/appointment` | Recebe JSON com `name`, `phone`, `service`, `date` (`YYYY-MM-DD`) e `time` (`HH:mm`) e envia o pedido por e-mail |
| POST | `/api/reviews` | Recebe `multipart/form-data` com `name`, `rating`, `comment` opcional e `photo` opcional; salva a avaliação como pendente |

## Personalização

| Conteúdo | Arquivos |
| --- | --- |
| Nome, descrição e fontes | `src/app/layout.tsx` |
| Cores e estilos globais | `src/app/globals.css` |
| Abertura e vídeo | `src/components/hero.tsx` e `public/videoteste.mp4` |
| Serviços e opções do formulário | `src/components/services.tsx` e `src/components/contact.tsx` |
| Apresentação da barbearia | `src/components/about.tsx` |
| Fotos e carrossel | `public/images/` e `src/components/ui/gallery-carousel.tsx` |
| Mapa e endereço | `src/components/location.tsx` |
| Contatos e links sociais | `src/components/contact.tsx`, `src/components/services.tsx`, `src/components/whatsapp-float.tsx` e `src/components/footer.tsx` |
| Horários exibidos e regras de agendamento | `src/components/contact.tsx` e `src/utils/appointment.ts` |

Ao alterar os horários, atualize tanto a exibição quanto as regras de validação. As datas e os horários são avaliados no fuso `America/Sao_Paulo`.

## Produção

Configure as mesmas variáveis de ambiente na hospedagem e execute:

```bash
npm run build
npm start
```

A hospedagem precisa executar o servidor Next.js e suas rotas de API, com acesso ao Supabase e ao servidor SMTP. A aplicação depende de processamento no servidor e não funciona apenas como exportação estática. O build também precisa acessar o Google Fonts para carregar as fontes usadas no layout.

Para capturar fotos pela câmera fora de `localhost`, sirva o site por HTTPS e permita o acesso à câmera no navegador.
