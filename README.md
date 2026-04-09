# Front-End Angular · Attus

Aplicação de gestão de usuários construída com Angular 20, Angular Material (M3), Signals e NgRx.

---

## Instalação e execução

### Pré-requisitos
- Node.js 18+
- npm 9+

### Passos

```bash
# 1. Clone o repositório
git clone <url-do-repo>
cd attus-frontend-challenge

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm start
# → http://localhost:4200
```

### Testes

```bash
npm test               # executa todos os testes (Vitest)
npm run test:watch     # modo watch
npm run test:coverage  # relatório de cobertura
```

### Build de produção

```bash
npm run build
# artefatos em dist/attus-frontend-challenge/
```

---

## Funcionalidades implementadas

- **Listagem de usuários** em grid de cards responsivos  
- **Busca por nome** com debounce de 300 ms (operator `debounceTime` + `distinctUntilChanged`)  
- **Estado de loading** com spinner e **mensagem de erro** em caso de falha  
- **Modal de criação** com botão vermelho (FAB)  
- **Modal de edição** com formulário pré-preenchido  
- Formulário reativo com validações: e-mail, CPF (algoritmo completo) e telefone  
- Botão de salvar desabilitado enquanto o formulário for inválido  
- Subscriptions gerenciadas via `takeUntilDestroyed`  
- Cobertura de testes > 60 % (33 testes, Vitest)

### Stack

| Camada | Tecnologia |
|---|---|
| Framework | Angular 20 (standalone) |
| UI | Angular Material 20 (M3) |
| Estado | Angular Signals |
| Efeitos assíncronos | RxJS 7 |
| Estado global (Todo) | NgRx 19 |
| Testes | Vitest 4 |

---

## Estrutura do projeto

```
src/app/
├── core/
│   ├── models/user.model.ts
│   ├── services/user.service.ts       ← Signals + Observable mocks
│   └── validators/
│       ├── cpf.validator.ts
│       └── phone.validator.ts
├── features/
│   ├── cart/cart.component.ts         ← Questão 3.1 (Signals)
│   ├── todo/store/                    ← Questão 3.2 (NgRx)
│   │   ├── todo.actions.ts
│   │   ├── todo.reducer.ts
│   │   ├── todo.selectors.ts
│   │   └── todo.effects.ts
│   └── users/components/
│       ├── user-list/                 ← Tela principal
│       ├── user-card/                 ← Card individual
│       └── user-form/                 ← Modal criação/edição
```

---

## Respostas — Questões Teóricas

---

### 1. TypeScript e Qualidade de Código

#### 1.1 Refatoração

Problemas no código original:

1. Todos os campos e parâmetros tipados como `any` — perde toda a segurança do TypeScript  
2. Loop `for` manual poderia ser `Array.find()`  
3. `getDescricaoProduto` e `hasEstoqueProduto` duplicam a lógica de busca  
4. `hasEstoque` retorna `if (...) return true; else return false;` — redundante  
5. Sem tratamento para produto não encontrado (acesso a `undefined.id` → runtime error)  
6. Classe `Verdureira` viola SRP ao misturar dados e queries

```typescript
interface Produto {
  id: number;
  descricao: string;
  quantidadeEstoque: number;
}

class Verdureira {
  private readonly produtos: Produto[] = [
    { id: 1, descricao: 'Maçã',   quantidadeEstoque: 20 },
    { id: 2, descricao: 'Laranja', quantidadeEstoque: 0  },
    { id: 3, descricao: 'Limão',  quantidadeEstoque: 20 },
  ];

  private findById(produtoId: number): Produto | undefined {
    return this.produtos.find(p => p.id === produtoId);
  }

  getDescricaoProduto(produtoId: number): string {
    const produto = this.findById(produtoId);
    if (!produto) throw new Error(`Produto ${produtoId} não encontrado`);
    return `${produto.id} - ${produto.descricao} (${produto.quantidadeEstoque}x)`;
  }

  hasEstoqueProduto(produtoId: number): boolean {
    const produto = this.findById(produtoId);
    if (!produto) throw new Error(`Produto ${produtoId} não encontrado`);
    return produto.quantidadeEstoque > 0;
  }
}
```

#### 1.2 Generics e tipos utilitários

```typescript
interface PaginaParams {
  pagina: number;  // base 0
  tamanho: number;
}

interface Pagina<T> {
  itens: T[];
  total: number;
  totalPaginas: number;
}

function filtrarEPaginar<T>(
  data: T[],
  filterFn: (item: T) => boolean,
  params: PaginaParams
): Pagina<T> {
  const filtrados = data.filter(filterFn);
  const inicio = params.pagina * params.tamanho;
  const itens = filtrados.slice(inicio, inicio + params.tamanho);

  return {
    itens,
    total: filtrados.length,
    totalPaginas: Math.ceil(filtrados.length / params.tamanho),
  };
}

// Exemplo de uso
interface Usuario {
  id: number;
  nome: string;
}

const usuarios: Usuario[] = [
  { id: 1, nome: 'Ana' },
  { id: 2, nome: 'Bruno' },
  { id: 3, nome: 'Amanda' },
  { id: 4, nome: 'Carlos' },
];

const resultado = filtrarEPaginar(
  usuarios,
  u => u.nome.toLowerCase().startsWith('a'),
  { pagina: 0, tamanho: 2 }
);
// → { itens: [{id:1, nome:'Ana'}, {id:3, nome:'Amanda'}], total: 2, totalPaginas: 1 }
```

---

### 2. Angular — Fundamentos e Reatividade

#### 2.1 Change Detection e OnPush

**Problema:** O componente usa `ChangeDetectionStrategy.OnPush`, mas `this.texto` é atribuído dentro de um callback de `Observable` (fora da zona Angular, após o delay). O Angular não agenda uma verificação de mudança automaticamente nesse caso quando se usa OnPush — ele só verifica quando há um evento de entrada (`@Input`), um evento do DOM ou uma notificação explícita via `ChangeDetectorRef`.

Além disso, o `setInterval` roda fora da zona Angular (com OnPush ele não dispara CD).

**Correção** (sem alterar a estratégia, o serviço ou remover o `setInterval`):

```typescript
@Component({
  selector: 'app-root',
  providers: [PessoaService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h1>{{ texto }}</h1>`,
})
export class AppComponent implements OnInit, OnDestroy {
  texto: string = '';
  contador = 0;
  subscriptionBuscarPessoa!: Subscription;

  constructor(
    private readonly pessoaService: PessoaService,
    private readonly cdr: ChangeDetectorRef   // ← injetar
  ) {}

  ngOnInit(): void {
    this.subscriptionBuscarPessoa = this.pessoaService
      .buscarPorId(1)
      .subscribe(pessoa => {
        this.texto = `Nome: ${pessoa.nome}`;
        this.cdr.markForCheck();               // ← notificar o CD
      });

    // NgZone garante que o setInterval não "escape" da detecção
    setInterval(() => {
      this.contador++;
      this.cdr.markForCheck();                 // ← notificar a cada tick
    }, 1000);
  }

  ngOnDestroy(): void {
    this.subscriptionBuscarPessoa.unsubscribe();
  }
}
```

#### 2.2 RxJS — eliminando subscriptions aninhadas

```typescript
ngOnInit(): void {
  const pessoaId = 1;

  // forkJoin dispara ambas as requisições em paralelo e emite
  // apenas quando as duas completam — mais eficiente que switchMap
  // quando as chamadas são independentes.
  forkJoin({
    pessoa: this.pessoaService.buscarPorId(pessoaId),
    qtd:    this.pessoaService.buscarQuantidadeFamiliares(pessoaId),
  })
  .pipe(takeUntilDestroyed(this.destroyRef))
  .subscribe(({ pessoa, qtd }) => {
    this.texto = `Nome: ${pessoa.nome} | familiares: ${qtd}`;
  });
}
```

> **Por que `forkJoin`?** As duas chamadas são independentes entre si — `buscarQuantidadeFamiliares` não depende do resultado de `buscarPorId`. `forkJoin` as dispara em paralelo e emite um único objeto quando ambas completam, eliminando o subscribe aninhado e melhorando a performance.  
> Se a segunda dependesse do resultado da primeira, usaríamos `switchMap`.

#### 2.3 RxJS — busca com debounce

```typescript
// user-search.service.ts
@Injectable({ providedIn: 'root' })
export class UserSearchService {
  private readonly http = inject(HttpClient);

  search(term: string): Observable<User[]> {
    return this.http.get<User[]>(`/api/users?name=${term}`);
  }
}

// user-search.component.ts
@Component({
  selector: 'app-user-search',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, MatProgressSpinnerModule],
  template: `
    <input [formControl]="searchControl" placeholder="Buscar usuário..." />
    <mat-spinner *ngIf="loading()" diameter="24" />
    <ul>
      <li *ngFor="let user of users$ | async">{{ user.name }}</li>
    </ul>
  `,
})
export class UserSearchComponent {
  private readonly searchService = inject(UserSearchService);
  readonly loading = signal(false);

  readonly searchControl = new FormControl('', { nonNullable: true });

  readonly users$ = this.searchControl.valueChanges.pipe(
    debounceTime(500),           // aguarda 500 ms após parar de digitar
    distinctUntilChanged(),      // ignora se o valor não mudou
    tap(() => this.loading.set(true)),
    switchMap(term =>            // cancela requisição anterior (race condition)
      this.searchService.search(term).pipe(
        catchError(() => of([])),
        finalize(() => this.loading.set(false)),
      )
    ),
    takeUntilDestroyed(),        // sem memory leak
  );
}
```

#### 2.4 Performance — OnPush e trackBy

**`trackBy`:** Por padrão, `@for`/`*ngFor` usa a identidade de objeto (`===`) para detectar mudanças. A cada nova referência de array (ex.: resultado de uma API), todos os itens são recriados no DOM. Com `trackBy`, o Angular compara por um identificador estável (como `id`), recriando apenas os itens que de fato mudaram.

```typescript
// componente
trackById(_index: number, item: Item): string {
  return item.id;
}
```
```html
<div *ngFor="let item of items; trackBy: trackById">...</div>
```

**`OnPush`:** Com a estratégia `Default`, o Angular percorre toda a árvore de componentes a cada evento (clique, timer, XHR). Com `OnPush`, um componente só é verificado quando:
- um `@Input` muda por referência,
- um `Observable` assinado via `async pipe` emite,
- `markForCheck()` é chamado.

Para uma lista de centenas de itens, `OnPush` nos componentes filhos significa que o Angular não recalcula o template de cada card a cada ciclo — apenas os que receberam novos dados.

**Impacto do `Default`:** Qualquer evento na página dispara verificação em 100s de componentes simultâneos, causando janks de renderização perceptíveis (> 16 ms/frame) em listas grandes.

---

### 3. Gerenciamento de Estado

#### 3.1 Angular Signals — carrinho

Implementado em `src/app/features/cart/cart.component.ts`.

Principais pontos:
- `signal<CartItem[]>([])` — lista reativa de itens  
- `computed(() => ...)` — total derivado automaticamente  
- `output<number>()` — emite sempre que o total muda via `effect()`  
- Sem `BehaviorSubject`, sem `Store`, sem boilerplate

#### 3.2 NgRx — Feature To-do

Implementado em `src/app/features/todo/store/`.

| Arquivo | Responsabilidade |
|---|---|
| `todo.actions.ts` | `loadTodos`, `loadTodosSuccess`, `loadTodosError`, `toggleTodoComplete` |
| `todo.reducer.ts` | Estado tipado `TodoState`, `createReducer` com `on()` |
| `todo.selectors.ts` | `selectAllTodos`, `selectPendingTodos` com `createSelector` |
| `todo.effects.ts` | `loadTodos$` — chama HTTP e despacha sucesso ou erro |

O `Effect` usa `switchMap` para cancelar chamadas anteriores e `catchError` para tratar falhas sem encerrar o stream.

---

## Operadores RxJS utilizados (além de `map` e `tap`)

| Operador | Onde | Motivo |
|---|---|---|
| `debounceTime(300)` | user-list | Aguarda 300 ms após última tecla antes de buscar |
| `distinctUntilChanged()` | user-list | Evita requisições duplicadas com o mesmo termo |
| `switchMap` | user-list, user.service, todo.effects | Cancela observable anterior |
| `catchError` | user-list, todo.effects | Trata erros sem quebrar o stream |
| `takeUntilDestroyed` | user-list | Cancela subscriptions ao destruir o componente |
| `forkJoin` | Questão 2.2 | Executa requisições independentes em paralelo |

---

## Diferenciais implementados

- Validação de formato de CPF (algoritmo de dígitos verificadores)  
- Validação de formato de telefone `(DD) NNNNN-NNNN`  
- `ChangeDetectionStrategy.OnPush` em todos os componentes  
- `trackBy` na lista de usuários  
- Componentes 100 % standalone  
- 48 testes unitários com Vitest (cobertura: 85.71% statements, 91.04% lines)
