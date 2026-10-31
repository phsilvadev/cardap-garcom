# Cardap Garçom

Projeto independente, criado a partir da versão atual do app Cardap Entregadores. O app do entregador não foi alterado. Expo SDK 58, NativeWind 4, React Navigation, bottom sheets Gorhom, Spinner e toast seguem a mesma base e identidade visual.

## Executar

Use Node 22.13+, rode `npm ci` e `npm start`. A porta padrão deste projeto é **8083**, separada do app do entregador. `npm run start:clear` inicia com cache limpo. Abra o QR code no Expo Go SDK 58. `npm run web` abre a versão de navegador; computador e celular devem estar na mesma rede para o acesso local.

## Acesso real

As configurações públicas do Firebase usam o mesmo projeto da plataforma, `cardap-e0bf0`, no `.env` local ignorado pelo Git. Nunca inclua credenciais privadas no aplicativo.

O proprietário cadastra o funcionário com cargo Garçom no painel e usa Liberar acesso ao app para compartilhar o link de senha. O app valida cargo, vínculo e loja pela função `waiterGetSession`. Contas de entregadores não são aceitas neste app. A instância Firebase tem nome próprio (`cardap-garcom`) para separar a persistência do app do entregador. A sessão usa persistência do Firebase Auth/AsyncStorage e revalidação em segundo plano, preservando a navegação ao desbloquear o celular.

Backend no projeto `cardap-clear`, codebase `employee-access`: `employeeCreateWaiter`, `employeeEnableWaiterAccess`, `waiterGetSession`. Verifique o status de publicação nesse projeto.

## Atendimento integrado ao salão

Mesas, comandas, cardápio e pedidos usam a mesma função `salonOperations` e o mesmo projeto Firebase do painel do restaurante. O aplicativo não cria mesas nem pedidos de exemplo. Configure as variáveis de `.env.example` em `.env` com os valores públicos do aplicativo Firebase do projeto `cardap-e0bf0`.

O backend fica em `cardcap-clear/firebase/employee-access`. É necessário que `salonOperations` e `waiterGetSession` estejam publicadas na região `southamerica-east1`. A loja deve estar configurada ou ativa, ter a operação Salão habilitada e o funcionário deve ter cargo Garçom, vínculo ativo e acesso liberado. O servidor determina a loja pelo vínculo do usuário e rejeita acesso cruzado.

- Mesas e cardápio são consultados na entrada, a cada 5 segundos enquanto o app estiver ativo e ao voltar do segundo plano.
- Abertura de mesa, envio à cozinha, confirmação de serviço, solicitação de conta e confirmação de limpeza são gravados no backend.
- Categorias, preços e disponibilidade vêm do cardápio da loja. O servidor calcula o preço final e verifica os produtos novamente no envio. Produtos com personalização obrigatória aparecem identificados e bloqueados, pois o contrato atual do salão ainda não aceita essas opções.
- A solicitação de conta aparece no painel do caixa depois que os pedidos forem servidos ou cancelados. Pagamentos, descontos e encerramento continuam sob responsabilidade do caixa.
- Após o caixa encerrar a conta, a mesa fica aguardando limpeza. O garçom confirma a limpeza para liberar outro atendimento.
- A tela Atendimento do salão mostra as comandas atuais do restaurante, não um histórico individual de produtividade.

### Conexão e envios pendentes

Não há gravações offline otimistas. Se uma leitura falhar, o aplicativo informa o erro e bloqueia novas operações até conseguir atualizar. Se um envio ficar sem resposta, ele é preservado no AsyncStorage antes da chamada, separado por usuário e loja, sem credenciais. Use **Confirmar envio pendente**: o app repete exatamente o mesmo identificador e os mesmos dados, aproveitando a idempotência do backend para evitar duplicação. A pendência também é recuperada após reiniciar o aplicativo. Dados de uma sessão descartada não são reutilizados por outra conta.

Nenhuma Function ou regra é publicada por iniciar o aplicativo. A publicação do backend exige autenticação e permissão no projeto Firebase.

## Validação

`npm test` verifica adaptação dos dados reais, isolamento entre contas, persistência de envios, falhas de rede e reenvio idempotente. `npm run typecheck` verifica tipos. `npx expo export --platform web` e `npx expo export --platform android` validam os bundles. Os testes automatizados não substituem uma conferência no aparelho físico. Nenhuma publicação nas lojas ou repositório remoto é feita automaticamente.

## Identidade visual

Ícone próprio salvo em `assets/branding/cardap-garcom-icon.png`, gerado com a ferramenta de imagens. O prompt está em `assets/branding/logo-prompt.txt`. A identidade mantém o amarelo, preto e tipografia da plataforma.
