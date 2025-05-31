# Oscilador de Duffing 🎢

O Oscilador de Duffing é descrito pela equação diferencial ordinária de segunda ordem:


* **Não Linearidade:** A equação é **não linear** devido ao termo **β**x**3**. Se **β**=**0**, a equação se torna linear, representando um oscilador harmônico amortecido forçado. ^^
* **Métodos de Solução:** Não existe uma solução analítica geral para a equação de Duffing. As soluções são tipicamente aproximadas por métodos numéricos. ^^ Métodos comuns incluem:
  * Métodos de Runge-Kutta
  * Métodos de diferenças finitas
  * Software de cálculo numérico (MATLAB, Python com SciPy, etc.)
* **Interpretação do parâmetro  :** O parâmetro **β** introduz a não linearidade na força restauradora da mola. ^^
  * Se **β**>**0**, a mola se torna mais rígida conforme a deflexão aumenta (mola endurecedora).
  * Se **β**<**0**, a mola se torna mais flexível conforme a deflexão aumenta (mola suavizadora). ^^
  * **α** representa a rigidez linear da mola. ^^
  * **δ** representa o amortecimento do sistema. ^^
  * **A** e **φ** representam a amplitude e a frequência da força externa aplicada.

## 👉 Executando projeto

1º - Clone o repositório:

```bash
git clone https://github.com/mfelipesoares/Oscilador-de-Duffing.git
```

2° - Entre na pasta:

```bash
cd Oscilador-de-Duffing
```

3° - Instale as dependências:

```bash
bun install
```

4° - Rode o projeto:

```bash
bun dev
```
