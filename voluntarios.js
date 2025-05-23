// voluntarios.js
document.addEventListener("DOMContentLoaded", () => {
  // Verifica login
  if(!localStorage.getItem('usuarioLogado')) {
      window.location.href = 'login.html';
      return;
  }

  const voluntariosContainer = document.getElementById("voluntariosContainer");
  const filtroNome = document.getElementById("filtroNome");
  const btnLimparTudo = document.getElementById("btnLimparTudo");

  function carregarVoluntarios() {
      return JSON.parse(localStorage.getItem("voluntarios")) || [];
  }

  function exibirVoluntarios(voluntarios) {
      if(voluntariosContainer) {
          voluntariosContainer.innerHTML = "";
          
          if(voluntarios.length === 0) {
              voluntariosContainer.innerHTML = '<p class="no-data">Nenhum voluntário cadastrado.</p>';
              return;
          }
          
          voluntarios.forEach((voluntario, index) => {
              const card = document.createElement("div");
              card.className = "card";
              
              card.innerHTML = `
                  <img src="${voluntario.foto || 'https://via.placeholder.com/300'}" 
                       alt="Foto de ${voluntario.nome}" 
                       class="card-img"
                       onerror="this.src='https://via.placeholder.com/300'">
                  <div class="card-body">
                      <h3>${voluntario.nome}</h3>
                      <p><strong>Email:</strong> ${voluntario.email}</p>
                      <p><strong>Endereço:</strong> ${voluntario.endereco}</p>
                      <button class="btn-excluir" data-index="${index}">Excluir</button>
                  </div>
              `;
              
              voluntariosContainer.appendChild(card);
          });

          document.querySelectorAll(".btn-excluir").forEach(btn => {
              btn.addEventListener("click", (e) => {
                  excluirVoluntario(e.target.dataset.index);
              });
          });
      }
  }

  function filtrarVoluntarios() {
      const termo = filtroNome.value.toLowerCase();
      const voluntarios = carregarVoluntarios();
      
      if (termo) {
          const filtrados = voluntarios.filter(v => 
              v.nome.toLowerCase().includes(termo)
          );
          exibirVoluntarios(filtrados);
      } else {
          exibirVoluntarios(voluntarios);
      }
  }

  function excluirVoluntario(index) {
      if (confirm("Tem certeza que deseja excluir este voluntário?")) {
          const voluntarios = carregarVoluntarios();
          voluntarios.splice(index, 1);
          localStorage.setItem("voluntarios", JSON.stringify(voluntarios));
          exibirVoluntarios(voluntarios);
      }
  }

  function limparTodosVoluntarios() {
      if (confirm("Tem certeza que deseja excluir TODOS os voluntários? Esta ação não pode ser desfeita.")) {
          localStorage.removeItem("voluntarios");
          exibirVoluntarios([]);
      }
  }

  if(filtroNome) filtroNome.addEventListener("input", filtrarVoluntarios);
  if(btnLimparTudo) btnLimparTudo.addEventListener("click", limparTodosVoluntarios);

  exibirVoluntarios(carregarVoluntarios());
});