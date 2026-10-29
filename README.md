# Cardap Garçom

Projeto independente, criado a partir da versão atual do app Cardap Entregadores. O app do entregador não foi alterado. Expo SDK 58, NativeWind 4, React Navigation, bottom sheets Gorhom, Spinner e toast seguem a mesma base e identidade visual.

## Executar

Use Node 22.13+, rode `npm ci` e `npm start`. A porta padrão deste projeto é **8083**, separada do app do entregador. `npm run start:clear` inicia com cache limpo. Abra o QR code no Expo Go SDK 58. `npm run web` abre a versão de navegador; computador e celular devem estar na mesma rede para o acesso local.

## Acesso real

As configurações públicas do Firebase usam o mesmo projeto da plataforma, `cardap-e0bf0`, no `.env` local ignorado pelo Git. Nunca inclua credenciais privadas no aplicativo.

O proprietário cadastra o funcionário com cargo Garçom no painel e usa Liberar acesso ao app para compartilhar o link de senha. O app valida cargo, vínculo e loja pela função `waiterGetSession`. Contas de entregadores não são aceitas neste app. A instância Firebase tem nome próprio (`cardap-garcom`) para separar a persistência do app do entregador. A sessão usa persistência do Firebase Auth/AsyncStorage e revalidação em segundo plano, preservando a navegação ao desbloquear o celular.

Backend no projeto `cardap-clear`, codebase `employee-access`: `employeeCreateWaiter`, `employeeEnableWaiterAccess`, `waiterGetSession`. Verifique o status de publicação nesse projeto.

## Demonstração de atendimento

Mesas, cardápio, comandas e pedidos usam dados locais de exemplo. A operação **ainda não envia pedidos para a central real**, não consulta o cardápio real e não altera pagamentos no Firebase.

- Início com restaurante autenticado, mesas em atendimento e pedidos prontos de exemplo.
- Mesas com busca e filtros; abertura de mesa com quantidade de pessoas.
- Comanda com várias rodadas de pedidos e total dos itens.
- Novo pedido com categorias, busca, quantidades e observações; revisão em bottom sheet e envio simulado para a cozinha.
- Pedidos em preparo, prontos e servidos; detalhes e confirmações em bottom sheets separados.
- Meu atendimento, conta, perfil e ajuda.

Pedidos enviados na demonstração entram em preparo. O garçom marca pedidos prontos como servidos. Isso **não fecha a comanda**. A solicitação da conta ao caixa é liberada após servir todos os pedidos da mesa. Pagamento e encerramento são responsabilidade do caixa. O estado de demonstração permanece entre telas e é reiniciado ao trocar de usuário/loja ou reiniciar o app.

## Validação

`npm run typecheck` verifica tipos. Os bundles Expo e testes de navegação não substituem uma conferência no aparelho físico. Nenhuma publicação nas lojas ou repositório remoto é feita automaticamente.

## Identidade visual

Ícone próprio salvo em `assets/branding/cardap-garcom-icon.png`, gerado com a ferramenta de imagens. O prompt está em `assets/branding/logo-prompt.txt`. A identidade mantém o amarelo, preto e tipografia da plataforma.
