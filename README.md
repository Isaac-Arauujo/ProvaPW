DOCUMENTO DA README DA PROVA DE PW

Sobre esse projeto:
Foi um projeto desenvolvido para gerenciar e criar cadastro de voluntarios, podendo buscar um voluntario e excluir ele da lista caso deseje.
Nele foi usado LocalStorage;
API ViaCEP;
API Random User para usar fotos aleatórias.

Funcionalidades:

1.Integração com ViaCEP
   Quando o usuário digita um CEP e sai do campo, o sistema faz uma chamada à API do ViaCEP. Se o CEP for válido, ele preenche automaticamente os campos de endereço. Se der erro, mostra um aviso.

2.Geração de imagens aleatórias
   Usei a API Random User para pegar fotos reais de pessoas. Se por algum motivo a foto não carregar, o sistema mostra uma imagem padrão de placeholder.

3.Uso do LocalStorage  
   Todos os voluntários cadastrados são salvos no LocalStorage em formato JSON. Isso permite que os dados não se percam mesmo se o usuário fechar o navegador.

4.Organização dos cards  
   Os voluntários aparecem em cards organizados em colunas que se ajustam automaticamente ao tamanho da tela. Em celulares, vira uma única coluna pra ficar fácil de ler.

5.Sistema de login  
   O login é simples - verifica se o usuário e senha batem com os valores definidos. Quando logado, salva um flag no LocalStorage. Todas as páginas verificam isso antes de permitir o acesso.

6.Controle de e-mail duplicado
   Antes de cadastrar, o sistema verifica se o e-mail já existe na lista de voluntários. Se existir, exibe alerta e foca no campo de e-mail para correção.

7.Redirecionamento por inatividade
   Após 5 minutos sem interação (movimento de mouse, digitação, etc.), o sistema exibe alerta e redireciona para a tela de login automaticamente.

8.O que faria diferente em projeto real    
   - Usaria um backend em vez de LocalStorage  
   - Criaria um painel administrativo  
   - Adicionaria busca avançada  



**para fazer o login use: adm123@gmail.com e a senha: adm123**


**computador desligando sozinho enquanto estava fazendo a prova prejudicou um pouco, mas consegui fazer**
