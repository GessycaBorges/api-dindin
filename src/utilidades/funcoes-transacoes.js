const verificarDados = (tipo, descricao, valor, data, categoria_id) => {
    let dadosNaoInformados = false;

    if (!tipo || !descricao || !valor || !data || !categoria_id) {
        dadosNaoInformados = true;
    }

    return dadosNaoInformados;
};

const exibirTransacaoCadastrada = async (rows, categoria) => {
    const novaTransacao = rows.map(transacao => {
        const { id, tipo, descricao, valor, data, usuario_id, categoria_id } = transacao;

        return {
            id,
            tipo,
            descricao,
            valor,
            data,
            usuario_id,
            categoria_id,
            categoria_nome: categoria.rows[0].descricao
        };
    });

    return novaTransacao;
};

const consultarExtrato = async (obterEntrada, obterSaida) => {
    let valorDeEntrada = obterEntrada.rows[0].sum
    if (!valorDeEntrada) {
        valorDeEntrada = '0';
    };

    let valorDeSaida = obterSaida.rows[0].sum
    if (!valorDeSaida) {
        valorDeSaida = '0';
    };

    const extrato = {
        entrada: valorDeEntrada,
        saida: valorDeSaida
    };

    return extrato;
};

module.exports = {
    verificarDados,
    exibirTransacaoCadastrada,
    consultarExtrato
};