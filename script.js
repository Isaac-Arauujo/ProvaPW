// script.js
let inactivityTimer;
const TEMPO_INATIVIDADE = 60000; // 1 minuto para testes

// Funções de inatividade
function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(logoutDueToInactivity, TEMPO_INATIVIDADE);
}

function logoutDueToInactivity() {
    alert("Você foi desconectado por inatividade.");
    logout();
}

function setupInactivityTimer() {
    window.addEventListener('mousemove', resetInactivityTimer);
    window.addEventListener('keydown', resetInactivityTimer);
    window.addEventListener('click', resetInactivityTimer);
    window.addEventListener('scroll', resetInactivityTimer);
    resetInactivityTimer();
}

// Funções de clima
async function fetchWeatherByCEP(cep) {
    try {
        const viaCepResponse = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const endereco = await viaCepResponse.json();
        
        if (endereco.erro) throw new Error("CEP não encontrado");
        
        const weatherResponse = await fetch(`https://goweather.herokuapp.com/weather/${encodeURIComponent(endereco.localidade)}`);
        const data = await weatherResponse.json();
        
        if (data && data.temperature) {
            return {
                cidade: endereco.localidade,
                uf: endereco.uf,
                temperatura: data.temperature,
                vento: data.wind,
                descricao: data.description
            };
        }
        throw new Error(`Não foi possível encontrar a previsão para ${endereco.localidade}`);
    } catch (error) {
        console.error("Erro ao buscar clima:", error);
        return null;
    }
}

function showWeatherInfo(cep) {
    const weatherInfo = document.getElementById('weatherInfo');
    const weatherDisplay = document.getElementById('weatherDisplay');
    
    weatherInfo.style.display = 'block';
    weatherDisplay.innerHTML = "Carregando clima...";
    
    fetchWeatherByCEP(cep).then(clima => {
        if (clima) {
            weatherDisplay.innerHTML = `
                <p><strong>Cidade:</strong> ${clima.cidade} - ${clima.uf}</p>
                <p><strong>Temperatura:</strong> ${clima.temperatura}</p>
                <p><strong>Vento:</strong> ${clima.vento}</p>
                <p><strong>Condição:</strong> ${clima.descricao}</p>
            `;
        } else {
            weatherDisplay.innerHTML = "Informações climáticas não disponíveis";
        }
    });
}

// Sistema principal
function login(){
    const Usuario = document.getElementById('txtUsuario').value;
    const Senha = document.getElementById('txtSenha').value;
    
    if(Usuario == "adm123@gmail.com" && Senha == "adm123"){
        localStorage.setItem('usuarioLogado', 'true');
        window.location.href='index.html';
        alert("Parabéns, login feito!");
    } else if(Usuario == "" || Senha == ""){
        alert("Preencha todos os campos necessários!")
    } else {
        alert("Login errado!")
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if(window.location.pathname.includes("index.html") || 
       window.location.pathname.includes("cadastratVoluntario.html") || 
       window.location.pathname.includes("listaVoluntarios.html")) {
        if(!localStorage.getItem('usuarioLogado')) {
            window.location.href = 'login.html';
        } else {
            setupInactivityTimer();
        }
    }

    const form = document.getElementById("formCliente");
    if(form) {
        const tabela = document.getElementById("tabelaClientes");
        const cepInput = document.getElementById("cep");
        const enderecoInput = document.getElementById("endereco");
        const fotoPreview = document.getElementById("fotoVoluntario");
        const fotoUrlInput = document.getElementById("fotoUrl");
        const btnGerarFoto = document.getElementById("btnGerarFoto");

        function gerarFotoAleatoria() {
            const randomId = Math.floor(Math.random() * 100);
            const fotoUrl = `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${randomId}.jpg`;
            
            const img = new Image();
            img.onload = function() {
                fotoPreview.src = fotoUrl;
                fotoUrlInput.value = fotoUrl;
            };
            img.onerror = function() {
                fotoPreview.src = 'https://via.placeholder.com/150';
                fotoUrlInput.value = 'https://via.placeholder.com/150';
            };
            img.src = fotoUrl;
        }

        if(btnGerarFoto) btnGerarFoto.addEventListener("click", gerarFotoAleatoria);
        if(fotoPreview) gerarFotoAleatoria();

        cepInput?.addEventListener("blur", async () => {
            const cep = cepInput.value.replace(/\D/g, "");
            if (cep.length === 8) {
                try {
                    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                    const data = await response.json();
                    if (data.erro) {
                        alert("CEP não encontrado.");
                        enderecoInput.value = "";
                        document.getElementById('weatherInfo').style.display = 'none';
                    } else {
                        enderecoInput.value = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
                        showWeatherInfo(cep); // MOSTRA O CLIMA AQUI
                    }
                } catch (error) {
                    alert("Erro ao buscar o CEP.");
                }
            }
        });

        function salvarVoluntario(voluntario) {
            const voluntarios = JSON.parse(localStorage.getItem("voluntarios")) || [];
            voluntarios.push(voluntario);
            localStorage.setItem("voluntarios", JSON.stringify(voluntarios));
        }

        function listarClientes() {
            const voluntarios = JSON.parse(localStorage.getItem("voluntarios")) || [];
            if(tabela) {
                tabela.innerHTML = "";
                voluntarios.forEach((v, index) => {
                    tabela.innerHTML += `
                        <tr>
                            <td>${index + 1}</td>
                            <td><img src="${v.foto}" alt="Foto" style="width:50px;height:50px;object-fit:cover;"></td>
                            <td>${v.nome}</td>
                            <td>${v.email}</td>
                            <td>${v.cep}</td>
                            <td>${v.endereco}</td>
                        </tr>`;
                });
            }
        }

        if(form) {
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                const nome = document.getElementById("nome").value.trim();
                const email = document.getElementById("email").value.trim().toLowerCase();
                const cep = cepInput.value.trim();
                const endereco = enderecoInput.value.trim();
                const foto = fotoUrlInput.value;

                if (nome && email && cep && endereco) {
                    const voluntarios = JSON.parse(localStorage.getItem("voluntarios")) || [];
                    const emailExistente = voluntarios.some(v => v.email.toLowerCase() === email);
                    
                    if(emailExistente) {
                        alert("Já existe um voluntário cadastrado com este e-mail!");
                        document.getElementById("email").focus();
                        document.getElementById("email").select();
                        return;
                    }
                    
                    salvarVoluntario({ nome, email, cep, endereco, foto });
                    form.reset();
                    enderecoInput.value = "";
                    document.getElementById('weatherInfo').style.display = 'none';
                    gerarFotoAleatoria();
                    listarClientes();
                    alert("Voluntário cadastrado com sucesso!");
                } else {
                    alert("Preencha todos os campos corretamente.");
                }
            });
        }

        listarClientes();
    }
});

function logout(){
    clearTimeout(inactivityTimer);
    localStorage.removeItem('usuarioLogado');
    window.location.href = 'login.html';
}