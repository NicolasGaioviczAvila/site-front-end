const btnPostsMenu = document.querySelector("#btnPostsMenu");
const btnRespostasMenu = document.querySelector("#btnRespostasMenu");
const btnConquista = document.querySelector("#btnConquista");
const content = document.querySelector("#content");


btnPostsMenu.addEventListener("click", selecionarPosts);
btnRespostasMenu.addEventListener("click", selecionarRespostas);
btnConquista.addEventListener("click", selecionarConquista)


const base_url = "https://site-back-end-orpin.vercel.app";
const front_url = "http://localhost:3000";

let selecionado = "respostas";
selecionarPosts();

async function selecionarPosts(){
    if(selecionado != "posts"){
        btnPostsMenu.style.backgroundColor  = "#001027";
        btnRespostasMenu.style.backgroundColor  = "#0d1f3a";
        btnConquista.style.backgroundColor = "#0d1f3a";
        selecionado = "posts";
        content.innerHTML = "";
        

        const [posts, commentss, commentArea, divExcluir] = await getViewPost();
        const {resultados} = await getposts();
        if(posts == -1 || commentss == -1 || commentArea == -1 || divExcluir == -1){
            return;
        }
        
        if(resultados == undefined){
            const semResposta = document.createElement("div");
            semResposta.style.backgroundColor = "#001027";
            semResposta.style.display = "flex";
            semResposta.style.justifyContent = "center";
            semResposta.style.alignItems = "center";
            semResposta.style.height = "70vh";
            semResposta.style.width = "100%";
            semResposta.innerHTML = "<h2 style='color: white;'>Não há posts...</h2>";
            content.appendChild(semResposta);
            return;
        }

        for(i = resultados.length - 1; i >= 0; i--){
            //postsarea
            const {post_comments} = resultados[i];
            const {post} = post_comments;
            const {comments} = post_comments;

            const donoNome = await verifyCookie();
            const donoPost = post.p_nome == donoNome[0].nome? true : false;

            const postsClone = posts.cloneNode(true);
            const btnComentar = postsClone.querySelector(".btnComentarios");
            const btnPostComentar = postsClone.querySelector(".btnComentar");
            const btnExcluir = postsClone.querySelector(".btnExcluirPost")
            

            const userTag = postsClone.childNodes[3]
            userTag.childNodes[3].textContent = post.p_nome;

            if(post.p_foto_de_perfil == null){
                userTag.childNodes[1].src = "/img/princiapal.jpeg";
            } else{
                userTag.childNodes[1].src = post.p_foto_de_perfil;
            }

            const postContent = postsClone.childNodes[5];
            postContent.childNodes[1].textContent = post.p_mensagem;

            console.log(postContent.childNodes)
            if(post.p_imagem == "null" || post.p_imagem == null){
                postContent.childNodes[3].style.display = "none";
            }else{
                postContent.childNodes[3].src = post.p_imagem;
            }

            const divlike = postContent.childNodes[5];
            

            divlike.childNodes[7].textContent = comments.length

            divlike.childNodes[1].addEventListener("click", async (e)=>{

                if(e.src = "public/img/empty-heart.png"){
                    try{
                        const ressul = await likePost(post.p_id_post);
    
                        if(ressul == -1) window.location.replace(front_url+"/login")
    
                        const {resultado} = ressul;
                        divlike.childNodes[1].src = "/img/filled-heart.png";
                        divlike.childNodes[3].textContent = resultado.p_curtidas;
                        if(resultado == -1){
                            divlike.childNodes[1].src = "/img/empty-heart.png";
                            const {resultado} = await dislikePost(post.p_id_post);
                            divlike.childNodes[3].textContent = resultado.p_curtidas;
                            console.log("dislike ", resultado);
                    }
                    }catch{
                        await fetch(front_url+"/login");
                    }
                    
                }
            });
    
            divlike.childNodes[3].textContent = post.p_curtidas
    
            if(post.p_liked == "TRUE"){
                divlike.childNodes[1].src = "/img/filled-heart.png"
            }
        

            //END postsarea

            //pcomentsarea  
            if(comments.length >= 1){
                for(p = comments.length - 1; p >= 0; p--){
                    
                    const commentsClone = commentss.cloneNode(true);
    
                    const userTagComments = commentsClone.childNodes[1];
                    const contentComments = commentsClone.childNodes[3];
                    const comment = comments[p];

                    const donoComntario = comment.p_nome == donoNome[0].nome? true : false;

                    userTagComments.childNodes[3].textContent = comments.p_nome;
                    
                    if(comment.p_foto_de_perfil == null){
                        userTagComments.childNodes[1].src = "/img/princiapal.jpeg";
                    } else{
                        userTagComments.childNodes[1].src = comment.p_foto_de_perfil;
                    }
                    
                    contentComments.childNodes[1].textContent = comment.p_mensagem;
                    
                    const divlikeComments = contentComments.childNodes[3];
                    const btnExcluirComentario = divlikeComments.querySelector(".btnExcluirComentario");
                   
                        if(comments[p].p_liked == "TRUE"){
                            divlikeComments.childNodes[1].src = "/img/filled-heart.png"
                        }
    
                        divlikeComments.childNodes[1].addEventListener("click", async (e)=>{
                            
                            if(e.src = "public/img/empty-heart.png"){
                                try{
    
                                    const ressul = await likeComment(comment.p_id_comentario);
                                    
                                    if(ressul == -1) window.location.replace(" /login")
                
                                    const {resultado} = ressul;
                                    divlikeComments.childNodes[1].src = "/img/filled-heart.png";
                                    divlikeComments.childNodes[3].textContent = resultado.p_curtidas;
                                    if(resultado == -1){
                                        divlikeComments.childNodes[1].src = "/img/empty-heart.png";
                                        const {resultado} = await dislikeComment(comment.p_id_comentario);
                                        divlikeComments.childNodes[3].textContent = resultado.p_curtidas;
                                        console.log("dislike ", resultado);
                                }
                                }catch{
                                    window.location.replace(" /login")
                                }
                                
                            }
                        });
    
                    divlikeComments.childNodes[3].textContent = comment.p_curtidas;
                    
                    contentComments.style.display = "flex";
                    
                    if(donoComntario){
                        btnExcluirComentario.addEventListener("click", () => {
                            const divExcluirComentario = divExcluir.cloneNode(true);

                            const negarExclusao = divExcluirComentario.querySelector("#negarExclusao");
                            negarExclusao.addEventListener("click", () =>{
                                document.querySelector("#placeAbove").removeChild(document.querySelector("#placeAbove").childNodes[0])
                                document.querySelector("main").style.filter = "blur(0px)";
                            });

                            divExcluirComentario.querySelector(".comfirmar").childNodes[1].textContent = "Deseja deletar este Comntario?";

                            const confirmarExclusao = divExcluirComentario.querySelector("#confirmarExclusao");
                            confirmarExclusao.addEventListener("click", async () => {
                                const deletou = deletarComentario(comment.p_id_comentario);
                                if(deletou == -1){
                                    console.log("erro ao deletar o post");
                                }else{
                                    window.location.reload();
                                }
                            });
            
                            document.querySelector("#placeAbove").append(divExcluirComentario);
                            document.querySelector("main").style.filter = "blur(4px)";
                        });
                    }else{
                        btnExcluirComentario.remove();
                    }
                    
                    
                    postContent.childNodes[9].appendChild(commentsClone);
                }
                btnComentar.addEventListener("click", ()=>{
                    if(postContent.childNodes[9].style.height == "35vh"){
                        postContent.childNodes[9].style.height = "0px";
                    }else{
                        const consultarCommentArea = document.querySelector(".comment-area");
                        if(consultarCommentArea != undefined){
                             consultarCommentArea.parentElement.style.height = "0px";
                            consultarCommentArea.parentElement.removeChild(consultarCommentArea);
                        }
                        postContent.childNodes[9].style.height = "35vh";
                    }
                });
            }else{
                btnComentar.disabled = true;
                btnComentar.style.opacity = ".5";
                divlike.childNodes[5].style.opacity = ".5";
                divlike.childNodes[7].style.opacity = ".5";
            }

            btnPostComentar.addEventListener('click', async ()=>{
                if(postContent.childNodes[7].style.height == "35vh"){
                    postContent.childNodes[7].style.height = "0px";
                    postContent.childNodes[7].removeChild(commentArea);
                }else{
                    const consultarCommentArea = document.querySelector(".comment-area");
                    if(consultarCommentArea != undefined){
                        consultarCommentArea.parentElement.style.height = "0px";
                        consultarCommentArea.parentElement.removeChild(consultarCommentArea);
                    }
                    postContent.childNodes[9].style.height = "0px";
                    postContent.childNodes[7].style.height = "35vh";

                    postContent.childNodes[7].appendChild(commentArea);
                    await createCommnteryComander(post.p_id_post);
                }
            });
            if(donoPost){
                btnExcluir.addEventListener("click", () => {

                    const confirmarExclusao = divExcluir.querySelector("#confirmarExclusao");
                    confirmarExclusao.addEventListener("click", async () => {
                        const deletou = deletarPost(post.p_id_post);
                        if(deletou == -1){
                            console.log("erro ao deletar o post");
                        }else{
                            window.location.reload();
                        }
                    });
    
                    document.querySelector("#placeAbove").append(divExcluir);
                    document.querySelector("main").style.filter = "blur(4px)";
                });
                
            } else{
                btnExcluir.remove();
            }

           
            //END commentsarea
            content.appendChild(postsClone);
        }
    
    }
    
}

async function getViewPost(){
    try{
        const resposta = await fetch(base_url+" /viewPostsUsuario");
        const responseHTML = await resposta.text();

        const parseToHTML = document.createElement('div');
        parseToHTML.innerHTML = responseHTML;

        const posts = parseToHTML.querySelector(".post");
        const comments = parseToHTML.querySelector(".comments");
        const commentArea = parseToHTML.querySelector(".comment-area");

        const responseExcluir = await fetch(front_url+"/viewExcluir");
        const responseHTMLExcluir = await responseExcluir.text();

        const parseToHTMLExcluir = document.createElement('div');
        parseToHTMLExcluir.innerHTML = responseHTMLExcluir;

        const divExcluir = parseToHTMLExcluir.querySelector(".comfirmarContent");
        divExcluir.querySelector(".comfirmar").childNodes[1].textContent = "Deseja deletar este post?";

        const negarExclusao = divExcluir.querySelector("#negarExclusao");
            negarExclusao.addEventListener("click", () =>{
                document.querySelector("#placeAbove").removeChild(document.querySelector("#placeAbove").childNodes[0])
                document.querySelector("main").style.filter = "blur(0px)";
            });

        return [posts, comments, commentArea, divExcluir];
    }catch(err){
        return [-1, -1, -1, -1];
    }
    
}

async function getposts(){
    try{
        const resultado = await fetch(base_url+"/get-posts-with-comments-user",{
            method: "GET",
            credentials: "include"
        });

        return await resultado.json();

    }catch(err){
        console.log("erro: ", err); 
        return -1
    }
}

async function getrespostas(){
    try{
        const resultado = await fetch(base_url+"/get-posts-with-comments-user-respostas",{
            method: "GET",
            credentials: "include"
        });

        return await resultado.json();

    }catch(err){
        console.log("erro: ", err); 
        return -1
    }
}


async function verifyCookie(){
    try {
        const resposta = await fetch(base_url+"/get-usuario", {
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
        
        return -1; // Retorna null em caso de erro
    }
    
}

async function likePost(id_post){
    const data ={
        id_post : id_post
    }
    try{
        const resultado = await fetch(base_url+"/like-post",{
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "Application/json"
            },
            body: JSON.stringify(data)
        });

        return await resultado.json();

    }catch(err){
        console.log("erro: ", err); 
        return -1
    }
}

async function dislikePost(id_post){
    const data ={
        id_post : id_post
    }
    try{
        const resultado = await fetch(base_url+"/dislike-post",{
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "Application/json"
            },
            body: JSON.stringify(data)
        });

        return await resultado.json();

    }catch(err){
        console.log("erro: ", err); 
        return -1
    }
}

async function likeComment(id_post){
    const data ={
        id_post : id_post
    }
    try{
        const resultado = await fetch(base_url+"/like-comment",{
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "Application/json"
            },
            body: JSON.stringify(data)
        });

        return await resultado.json();

    }catch(err){
        console.log("erro: ", err); 
        return -1
    }
}

async function dislikeComment(id_post){
    const data ={
        id_post : id_post
    }
    try{
        const resultado = await fetch(base_url+"/dislike-comment",{
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "Application/json"
            },
            body: JSON.stringify(data)
        });

        return await resultado.json();

    }catch(err){
        console.log("erro: ", err); 
        return -1
    }
}

async function deletarPost(id_post) {
    const data = {
        id_post : id_post
    };

    try{
        await fetch(base_url+"/deletar-post", {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "Application/json"
            },
            body: JSON.stringify(data)
        });
        return 1;

    }catch(err){
        return -1;
    }
}

async function deletarComentario(id_comentario) {
    const data = {
        id_comentario : id_comentario
    };
    
    try{
        await fetch(base_url+"/deletar-comentario", {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "Application/json"
            },
            body: JSON.stringify(data)
        });
        return 1;

    }catch(err){
        return -1;
    }
}

async function selecionarRespostas(){
    if(selecionado != "respostas"){
        btnRespostasMenu.style.backgroundColor  = "#001027";
        btnPostsMenu.style.backgroundColor  = "#0d1f3a";
        btnConquista.style.backgroundColor = "#0d1f3a";
        selecionado = "respostas";
        content.innerHTML = "";

        const [posts, commentss, commentArea, divExcluir] = await getViewPost();
        const {resultados} = await getrespostas();
        if(posts == -1 || commentss == -1 || commentArea == -1 || divExcluir == -1){
            return;
        }
        
        if(resultados == undefined){
            const semResposta = document.createElement("div");
            semResposta.style.backgroundColor = "#001027";
            semResposta.style.display = "flex";
            semResposta.style.justifyContent = "center";
            semResposta.style.alignItems = "center";
            semResposta.style.height = "70vh";
            semResposta.style.width = "100%";
            semResposta.innerHTML = "<h2 style='color: white;'>Não há comentarios...</h2>";
            content.appendChild(semResposta);
            return;
        }

        for(i = resultados.length - 1; i >= 0; i--){
            //postsarea
            const {post_comments} = resultados[i];
            const {post} = post_comments;
            const {comments} = post_comments;

            const donoNome = await verifyCookie();
            const donoPost = post.p_nome == donoNome[0].nome? true : false;

            const postsClone = posts.cloneNode(true);
            const btnComentar = postsClone.querySelector(".btnComentarios");
            const btnPostComentar = postsClone.querySelector(".btnComentar");
            const btnExcluir = postsClone.querySelector(".btnExcluirPost")
            

            const userTag = postsClone.childNodes[3];
            userTag.childNodes[3].textContent = post.p_nome;
            
            if(post.p_foto_de_perfil == null){
                userTag.childNodes[1].src = "/img/princiapal.jpeg";
            } else{
                userTag.childNodes[1].src = post.p_foto_de_perfil;
            }

            const postContent = postsClone.childNodes[5];
            postContent.childNodes[1].textContent = post.p_mensagem;

            console.log(postContent.childNodes)
            if(post.p_imagem == "null" || post.p_imagem == null){
                postContent.childNodes[3].style.display = "none";
            }else{
                postContent.childNodes[3].src = post.p_imagem;
            }

            const divlike = postContent.childNodes[5];
            

            divlike.childNodes[7].textContent = comments.length

            divlike.childNodes[1].addEventListener("click", async (e)=>{

                if(e.src = "public/img/empty-heart.png"){
                    try{
                        const ressul = await likePost(post.p_id_post);
    
                        if(ressul == -1) window.location.replace(front_url+"/login")
    
                        const {resultado} = ressul;
                        divlike.childNodes[1].src = "/img/filled-heart.png";
                        divlike.childNodes[3].textContent = resultado.p_curtidas;
                        if(resultado == -1){
                            divlike.childNodes[1].src = "/img/empty-heart.png";
                            const {resultado} = await dislikePost(post.p_id_post);
                            divlike.childNodes[3].textContent = resultado.p_curtidas;
                            console.log("dislike ", resultado);
                    }
                    }catch{
                        await fetch(front_url+"/login");
                    }
                    
                }
            });
    
            divlike.childNodes[3].textContent = post.p_curtidas
    
            if(post.p_liked == "TRUE"){
                divlike.childNodes[1].src = "/img/filled-heart.png"
            }
        

            //END postsarea

            //pcomentsarea  
            if(comments.length >= 1){
                for(p = comments.length - 1; p >= 0; p--){
                    
                    const commentsClone = commentss.cloneNode(true);
    
                    const userTagComments = commentsClone.childNodes[1];
                    const contentComments = commentsClone.childNodes[3];
                    const comment = comments[p];

                    const donoComntario = comment.p_nome == donoNome[0].nome? true : false;

                    userTagComments.childNodes[3].textContent = comment.p_nome;
                    console.log(comment.p_nome, userTagComments.childNodes[3]);

                    if(comment.p_foto_de_perfil == null){
                        userTagComments.childNodes[1].src = "/img/princiapal.jpeg";
                    } else{
                        userTagComments.childNodes[1].src = comment.p_foto_de_perfil;
                    }
                    
                    contentComments.childNodes[1].textContent = comment.p_mensagem;
                    
                    const divlikeComments = contentComments.childNodes[3];
                    const btnExcluirComentario = divlikeComments.querySelector(".btnExcluirComentario");
                   
                        if(comments[p].p_liked == "TRUE"){
                            divlikeComments.childNodes[1].src = "/img/filled-heart.png"
                        }
    
                        divlikeComments.childNodes[1].addEventListener("click", async (e)=>{
                            
                            if(e.src = "public/img/empty-heart.png"){
                                try{
    
                                    const ressul = await likeComment(comment.p_id_comentario);
                                    
                                    if(ressul == -1) window.location.replace(front_url+"/login")
                
                                    const {resultado} = ressul;
                                    divlikeComments.childNodes[1].src = "/img/filled-heart.png";
                                    divlikeComments.childNodes[3].textContent = resultado.p_curtidas;
                                    if(resultado == -1){
                                        divlikeComments.childNodes[1].src = "/img/empty-heart.png";
                                        const {resultado} = await dislikeComment(comment.p_id_comentario);
                                        divlikeComments.childNodes[3].textContent = resultado.p_curtidas;
                                        console.log("dislike ", resultado);
                                }
                                }catch{
                                    window.location.replace(front_url+"/login")
                                }
                                
                            }
                        });
    
                    divlikeComments.childNodes[3].textContent = comment.p_curtidas;
                    
                    contentComments.style.display = "flex";
                    
                    if(donoComntario){
                        btnExcluirComentario.addEventListener("click", () => {
                            const divExcluirComentario = divExcluir.cloneNode(true);

                            const negarExclusao = divExcluirComentario.querySelector("#negarExclusao");
                            negarExclusao.addEventListener("click", () =>{
                                document.querySelector("#placeAbove").removeChild(document.querySelector("#placeAbove").childNodes[0])
                                document.querySelector("main").style.filter = "blur(0px)";
                            });

                            divExcluirComentario.querySelector(".comfirmar").childNodes[1].textContent = "Deseja deletar este Comntario?";

                            const confirmarExclusao = divExcluirComentario.querySelector("#confirmarExclusao");
                            confirmarExclusao.addEventListener("click", async () => {
                                const deletou = deletarComentario(comment.p_id_comentario);
                                if(deletou == -1){
                                    console.log("erro ao deletar o post");
                                }else{
                                    window.location.reload();
                                }
                            });
            
                            document.querySelector("#placeAbove").append(divExcluirComentario);
                            document.querySelector("main").style.filter = "blur(4px)";
                        });
                    }else{
                        btnExcluirComentario.remove();
                    }
                    
                    
                    postContent.childNodes[9].appendChild(commentsClone);
                }
                btnComentar.addEventListener("click", ()=>{
                    if(postContent.childNodes[9].style.height == "35vh"){
                        postContent.childNodes[9].style.height = "0px";
                    }else{
                        const consultarCommentArea = document.querySelector(".comment-area");
                        if(consultarCommentArea != undefined){
                             consultarCommentArea.parentElement.style.height = "0px";
                            consultarCommentArea.parentElement.removeChild(consultarCommentArea);
                        }
                        postContent.childNodes[9].style.height = "35vh";
                    }
                });
            }else{
                btnComentar.disabled = true;
                btnComentar.style.opacity = ".5";
                divlike.childNodes[5].style.opacity = ".5";
                divlike.childNodes[7].style.opacity = ".5";
            }

            btnPostComentar.addEventListener('click', async ()=>{
                if(postContent.childNodes[7].style.height == "35vh"){
                    postContent.childNodes[7].style.height = "0px";
                    postContent.childNodes[7].removeChild(commentArea);
                }else{
                    const consultarCommentArea = document.querySelector(".comment-area");
                    if(consultarCommentArea != undefined){
                        consultarCommentArea.parentElement.style.height = "0px";
                        consultarCommentArea.parentElement.removeChild(consultarCommentArea);
                    }
                    postContent.childNodes[9].style.height = "0px";
                    postContent.childNodes[7].style.height = "35vh";

                    postContent.childNodes[7].appendChild(commentArea);
                    await createCommnteryComander(post.p_id_post);
                }
            });
            if(donoPost){
                btnExcluir.addEventListener("click", () => {

                    const confirmarExclusao = divExcluir.querySelector("#confirmarExclusao");
                    confirmarExclusao.addEventListener("click", async () => {
                        const deletou = deletarPost(post.p_id_post);
                        if(deletou == -1){
                            console.log("erro ao deletar o post");
                        }else{
                            window.location.reload();
                        }
                    });
    
                    document.querySelector("#placeAbove").append(divExcluir);
                    document.querySelector("main").style.filter = "blur(4px)";
                });
                
            } else{
                btnExcluir.remove();
            }

           
            //END commentsarea
            content.appendChild(postsClone);
        }
    
    }
}

async function createCommnteryComander(p_id_post){
    const consultarCommentArea = document.querySelector(".comment-area");
    const btn = consultarCommentArea.childNodes[3];
    const textArea = consultarCommentArea.childNodes[1];
    
    document.addEventListener('scroll', function registerScroll ()  {
        const {y} = consultarCommentArea.getBoundingClientRect();
        if(y <= -100 || y >= 700){
            consultarCommentArea.parentElement.style.height = "0px";
            consultarCommentArea.remove();
            document.removeEventListener('scroll', registerScroll);
        }
        console.log(y);
    });

    btn.addEventListener("click", async ()=>{
        const data = 
        {
                id_post : p_id_post,
                mensagem : textArea.value
        };

        const treatReturn = postComment(data);

        if(treatReturn == -1){
                    console.log("o comentario não foi postado");
                }else{

                    window.alert("MENSAGEM POSTADA");
                    window.location.reload();
                }
    });
}

async function postComment(data){
    try {
        fetch(base_url+"/post-comment",{
            method: "POST",
            credentials: "include",
            headers:{
                "Content-Type": "Application/json"
            },
            body: JSON.stringify(data)
        })

    }catch(err){
        return -1
    }
}

async function getViewConquista(){
    try{
        const resposta = await fetch(front_url+"/viewConquista");
        const responseHTML = await resposta.text();
        
        const parseToHTML = document.createElement('div');
        parseToHTML.innerHTML = responseHTML;

        const divConquista = parseToHTML.querySelector(".conquista");
        console.log(divConquista)
        return divConquista;
    }catch(err){
        return -1
    }
    

}

async function getConquistas(){
    try{
        const resposta = await fetch(base_url+"/gml/conquista/pegar", {
            method: "GET",
            credentials: "include"
        });
        return await resposta.json();
    }catch{
        return -1;
    }
}

async function selecionarConquista(){
    if(selecionado != "conquista"){
        btnRespostasMenu.style.backgroundColor  = "#0d1f3a";
        btnPostsMenu.style.backgroundColor  = "#0d1f3a";
        btnConquista.style.backgroundColor = "#001027";
        selecionado = "conquista";
        content.innerHTML = "";
        
        const conquista = await getViewConquista();

        if(conquista == -1){
            return console.log("erro ao carregar view");
        }

        const {resposta} = await getConquistas();

        for(i=0; i<resposta.length; i++){
            const divConquista = conquista.cloneNode(true);
            
            const quest = resposta[i];

            const titulo = divConquista.querySelector(".conquista-titulo");
            const descricao = divConquista.querySelector(".conquista-descricao");
            const barra = divConquista.querySelector(".progress-barra");
            const porcentagem = divConquista.querySelector(".conquista-porcentagem");

            console.log(quest)

            const porcen = ((quest.progresso / quest.desafio).toFixed(2)) * 100;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  

            titulo.textContent = quest.nome;
            descricao.textContent = quest.descricao;
            barra.style.width = `${porcen}%`;
            porcentagem.textContent = `${porcen}%`;
            
            content.appendChild(divConquista);
        }
        



    
    }

}