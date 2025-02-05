
const base_url = "https://site-back-end-orpin.vercel.app";



async function verifyCookie(){
    try {
        console.log("NÃO TA MOSTRANDO A PORRA")
        const resposta = await fetch("https://site-back-end-orpin.vercel.app/get-usuario", {
            method: "GET",
            credentials: "include"
        });

        if (resposta.status === 401) {
            return -1; 
        }

        if (!resposta.ok) {
            throw new Error('Resposta da rede não foi ok'); 
        }

        // Retorna a resposta convertida para JSON
        return await resposta.json(); 

    } catch (err) {
        console.log(err)
        return -1; // Retorna null em caso de erro
    }
    
}

async function logBar(){
    console.log("Hello world")
    const resposta = await verifyCookie()
    if(resposta === -1) return 
    const nav = document.querySelector("header #userSapce")
    console.log(resposta)
    const { nome, foto_de_perfil } = resposta[0]

    const userLogBar = document.createElement("div");
    userLogBar.style.display = "flex";
    userLogBar.style.alignContent = "center";

    const userName = document.createElement("p");
    userName.classList.add("nav-link");
    userName.style.margin="0";
    userName.style.marginRight="2vw"
    userName.innerText = `${nome}`;

    const userPhoto = document.createElement("img");
    userPhoto.classList.add("user-photo");

    if(foto_de_perfil == null){
        userPhoto.src = "/img/princiapal.jpeg";
    } else{
        userPhoto.src = foto_de_perfil;
    }

    userLogBar.appendChild(userName);
    userLogBar.appendChild(userPhoto);

    nav.addEventListener('click', () => {
        window.location.replace(base_url+"/conta");
    });

    nav.style.cursor = "pointer";
  
    nav.replaceChildren(userLogBar);
}

logBar()



