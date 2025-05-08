import { useState } from 'react';

export default function App() {
  const [produtos, setProdutos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  const [form, setForm] = useState({
    nome: '', categoria: '', tamanho: '', custo: '', frete: '', margem: '', estoque: ''
  });
  const [clienteForm, setClienteForm] = useState({ nome: '', telefone: '', endereco: '', observacoes: '' });
  const [pedidoForm, setPedidoForm] = useState({ cliente: '', produto: '', quantidade: '' });

  const calcularPrecoFinal = (custo, frete, margem) => {
    const totalCusto = parseFloat(custo) + parseFloat(frete);
    return totalCusto + totalCusto * (parseFloat(margem) / 100);
  };

  const adicionarProduto = () => {
    if (!form.nome || !form.custo || !form.margem || !form.estoque) return;
    const preco = calcularPrecoFinal(form.custo, form.frete || 0, form.margem).toFixed(2);
    setProdutos([...produtos, { ...form, preco }]);
    setForm({ nome: '', categoria: '', tamanho: '', custo: '', frete: '', margem: '', estoque: '' });
  };

  const adicionarCliente = () => {
    if (!clienteForm.nome) return;
    setClientes([...clientes, { ...clienteForm }]);
    setClienteForm({ nome: '', telefone: '', endereco: '', observacoes: '' });
  };

  const adicionarPedido = () => {
    const produto = produtos.find(p => p.nome === pedidoForm.produto);
    if (!produto || !pedidoForm.cliente || !pedidoForm.quantidade) return;
    const quantidade = parseInt(pedidoForm.quantidade);
    if (quantidade > parseInt(produto.estoque)) return alert('Estoque insuficiente');

    const novoEstoque = parseInt(produto.estoque) - quantidade;
    const atualizados = produtos.map(p => p.nome === produto.nome ? { ...p, estoque: novoEstoque } : p);
    setProdutos(atualizados);

    const total = (quantidade * parseFloat(produto.preco)).toFixed(2);
    setPedidos([...pedidos, { ...pedidoForm, total }]);
    setPedidoForm({ cliente: '', produto: '', quantidade: '' });
  };

  return (
    <div className="p-4" style={{ backgroundColor: '#FFFDFD', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#FFCCD5', textAlign: 'center' }}>Nossa Duplinha Kids</h1>

      <h2 style={{ marginTop: '20px', color: '#8FBDBB' }}>Cadastro de Produtos</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
        <input placeholder="Nome do Produto" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
        <input placeholder="Categoria" value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })} />
        <input placeholder="Tamanho" value={form.tamanho} onChange={e => setForm({ ...form, tamanho: e.target.value })} />
        <input placeholder="Custo (R$)" type="number" value={form.custo} onChange={e => setForm({ ...form, custo: e.target.value })} />
        <input placeholder="Frete (R$)" type="number" value={form.frete} onChange={e => setForm({ ...form, frete: e.target.value })} />
        <input placeholder="Margem (%)" type="number" value={form.margem} onChange={e => setForm({ ...form, margem: e.target.value })} />
        <input placeholder="Estoque Inicial" type="number" value={form.estoque} onChange={e => setForm({ ...form, estoque: e.target.value })} />
        <button style={{ backgroundColor: '#FFDAC1' }} onClick={adicionarProduto}>Adicionar</button>
      </div>

      <h3 style={{ marginTop: '30px', color: '#8FBDBB' }}>Produtos Cadastrados</h3>
      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        {produtos.map((p, i) => (
          <li key={i} style={{ background: '#F5EBDC', padding: '10px', margin: '10px 0', borderRadius: '8px' }}>
            <strong>{p.nome}</strong> | Cat: {p.categoria} | Tam: {p.tamanho} | Preço: R$ {p.preco} | Estoque: {p.estoque}
          </li>
        ))}
      </ul>

      <h2 style={{ marginTop: '40px', color: '#FFB6C1' }}>Cadastro de Clientes</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        <input placeholder="Nome" value={clienteForm.nome} onChange={e => setClienteForm({ ...clienteForm, nome: e.target.value })} />
        <input placeholder="Telefone" value={clienteForm.telefone} onChange={e => setClienteForm({ ...clienteForm, telefone: e.target.value })} />
        <input placeholder="Endereço" value={clienteForm.endereco} onChange={e => setClienteForm({ ...clienteForm, endereco: e.target.value })} />
        <input placeholder="Observações" value={clienteForm.observacoes} onChange={e => setClienteForm({ ...clienteForm, observacoes: e.target.value })} />
        <button style={{ backgroundColor: '#A3DEE4' }} onClick={adicionarCliente}>Cadastrar</button>
      </div>

      <h3 style={{ marginTop: '20px', color: '#8FBDBB' }}>Clientes Cadastrados</h3>
      <ul>
        {clientes.map((c, i) => (
          <li key={i} style={{ background: '#E1F4F3', padding: '8px', margin: '5px 0', borderRadius: '6px' }}>
            <strong>{c.nome}</strong> - {c.telefone} | {c.endereco}
          </li>
        ))}
      </ul>

      <h2 style={{ marginTop: '40px', color: '#B5A0CB' }}>Pedidos</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        <select value={pedidoForm.cliente} onChange={e => setPedidoForm({ ...pedidoForm, cliente: e.target.value })}>
          <option value="">Selecione o cliente</option>
          {clientes.map((c, i) => (
            <option key={i} value={c.nome}>{c.nome}</option>
          ))}
        </select>
        <select value={pedidoForm.produto} onChange={e => setPedidoForm({ ...pedidoForm, produto: e.target.value })}>
          <option value="">Selecione o produto</option>
          {produtos.map((p, i) => (
            <option key={i} value={p.nome}>{p.nome}</option>
          ))}
        </select>
        <input placeholder="Quantidade" type="number" value={pedidoForm.quantidade} onChange={e => setPedidoForm({ ...pedidoForm, quantidade: e.target.value })} />
        <button style={{ backgroundColor: '#D8B4E2' }} onClick={adicionarPedido}>Adicionar Pedido</button>
      </div>

      <h3 style={{ marginTop: '20px', color: '#8FBDBB' }}>Pedidos Realizados</h3>
      <ul>
        {pedidos.map((p, i) => (
          <li key={i} style={{ background: '#F6E6FA', padding: '8px', margin: '6px 0', borderRadius: '6px' }}>
            Cliente: <strong>{p.cliente}</strong> | Produto: {p.produto} | Qtd: {p.quantidade} | Total: R$ {p.total}
          </li>
        ))}
      </ul>
    </div>
  );
}
