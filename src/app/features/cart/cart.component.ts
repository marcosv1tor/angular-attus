/**
 * Questão 3.1 — Componente de carrinho usando exclusivamente Signals
 */
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  output,
  signal,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, MatButtonModule, MatIconModule],
  template: `
    <div class="cart">
      <h3>Carrinho ({{ items().length }} itens)</h3>

      <ul>
        @for (item of items(); track item.id) {
          <li>
            {{ item.name }} — {{ item.quantity }}x
            {{ item.price | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
            <button mat-icon-button (click)="removeItem(item.id)">
              <mat-icon>remove_circle</mat-icon>
            </button>
          </li>
        }
      </ul>

      <strong>Total: {{ total() | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</strong>
    </div>
  `,
})
export class CartComponent {
  /** Signal para a lista de itens */
  readonly items = signal<CartItem[]>([]);

  /** Computed para o total (quantidade × preço) */
  readonly total = computed(() =>
    this.items().reduce((acc, item) => acc + item.price * item.quantity, 0)
  );

  /** Output emitido sempre que o total mudar */
  readonly totalChanged = output<number>();

  constructor() {
    effect(() => this.totalChanged.emit(this.total()));
  }

  addItem(item: Omit<CartItem, 'quantity'>): void {
    this.items.update(current => {
      const existing = current.find(i => i.id === item.id);
      if (existing) {
        return current.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...current, { ...item, quantity: 1 }];
    });
  }

  removeItem(id: number): void {
    this.items.update(current =>
      current
        .map(i => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter(i => i.quantity > 0)
    );
  }
}
