import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ProdutoService } from './service/produto.service';
import { Produto } from './model/produto';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {

  produtos: Produto[] = [];
  
  produtoForm = this.fb.group({
    id: [],
    nome: [null, Validators.required],
    valor: [null, Validators.required],
    descricao: []
  })

  constructor(
    private fb: FormBuilder,
    private produtoService: ProdutoService
  ) {
    this.bucarProdutos();
  }

  bucarProdutos() {
    this.produtoService.buscarTodos().subscribe({
      next: (res) => {
        this.produtos = res;
      },
      error: (error) => {
        console.log(error);
      }
    })

  }

  criarProduto(): Produto {
    return {
      id: this.produtoForm.get('id')?.value,
      nome: this.produtoForm.get('nome')?.value,
      valor: this.produtoForm.get('valor')?.value,
      descricao: this.produtoForm.get('descricao')?.value,
    }
  }

  salvar() {
    if (this.produtoForm.valid) {
      const produto = this.criarProduto();
      console.log('produto', produto)

      this.produtoService.salvar(produto).subscribe(
        {
          next: (res) => {
            this.produtoForm.reset();
            this.bucarProdutos();
            alert("Produto salvo com sucesso");
          },
          error: (error) => {
            console.log(error);
          }
        }
      )
    }
  }

  remover(produto: Produto) {
    const confirmacao = confirm("Deseja excluir este produto?" + produto.nome);
    if(confirmacao) {
      const id = produto.id;
      this.produtoService.remover(id).subscribe({
        next: (res) => {
          this.bucarProdutos();
          alert("Produto excluído com sucesso")
        },
        error: (error) => {
          console.log(error);
        }
      })
    }
  }
}
