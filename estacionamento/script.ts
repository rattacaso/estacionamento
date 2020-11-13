interface Veiculo{
    nome: string;
    placa: string;
    entrada: Date | string;
}

(function() {
    const $ = (query: string):HTMLInputElement | null => document.querySelector(query);

    function calcTempo(mil: number){
        const min = Math.floor(mil / 60000);
        const sec = Math.floor((mil % 60000)/1000);
        let total = Math.floor(min * 0.20 );
        if (min <=10){
            total = 0;
        }
        return `Tempo de permanência: ${min}min e ${sec}segundos - Total a pagar: R$ ${total} `;
    }
  


    function patio(){
        function ler():Veiculo[]{
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }

        function salvar(veiculos: Veiculo[]){
            localStorage.setItem("patio", JSON.stringify(veiculos));

        }

        function adicionar(veiculo : Veiculo, salva?: boolean){  // ? deixa o parametro opcional.
            const row = document.createElement("tr");

            row.innerHTML = `
            <td>${veiculo.nome}</td>
            <td>${veiculo.placa}</td>
            <td>${veiculo.entrada}</td>
            <td>
              <button class= "delete" data-placa="${veiculo.placa}"> X </button>
            </td>
            `;

            row.querySelector(".delete")?.addEventListener("click", function(){

                remover(this.dataset.placa);

            })

            $("#patio")?.appendChild(row);
            if (salva) salvar([...ler(), veiculo]);
        }

        function remover(placa: string){
            const { entrada, nome } = ler().find(veiculo => veiculo.placa === placa);

            const tempo = calcTempo(new Date().getTime() - new Date(entrada).getTime());

            if(
                !confirm(`O veículo ${nome} permaneceu por ${tempo}. Deseja encerrar?`)
            )
            return;
            salvar(ler().filter((veiculo) => veiculo.placa !== placa));
            
            render();
        }

        

        function render(){
            $("#patio")!.innerHTML = "";// Utilizando um '! force'

            const patio = ler();

             if (patio.length){
                 patio.forEach((veiculo) => adicionar(veiculo));
                     
                 }
             }
             return { ler, adicionar, remover, salvar, render }
        }

        
    patio().render();


    $("#cadastrar")?.addEventListener("click", () => {

        const nome = $("#nome")?.value;
        const placa = $("#placa")?.value;
        //console.log()


        if (!nome || !placa){
            
           alert("Campos de preenchimento obrigatório: 'NOME' e 'PLACA'");
            return;
        }
        
        patio().adicionar({ nome, placa, entrada: new Date().toISOString()}, true);


    })


})();