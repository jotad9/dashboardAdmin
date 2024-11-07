import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ModalOptions } from 'flowbite';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements AfterViewInit, OnInit {
  //modal de la tabla
  $modalElement: HTMLElement | null = null;
  productos: any[] = [];
  selectedProduct: any = null;
  modal: any = null;
  eliminarProductoModal: any = null;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    console.log('productosComponent cargado');
    this.productService.getProducts().subscribe({
      next: (response) => {
        this.productos = response;
      },
      error: (error) => console.error('Error fetching data', error),
    });
    console.log(this.productos);
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      import('flowbite').then(({ Modal }) => {
        const modalElement = document.getElementById('editProductModal');
        if (modalElement) {
          const modalOptions: ModalOptions = {};
          this.modal = new Modal(modalElement, modalOptions);

          document.querySelectorAll('[data-modal-target="editProductModal"]')
            .forEach((triggerElement) => {
              triggerElement.addEventListener('click', (event) => {
                event.preventDefault();
                const userIndex = (triggerElement as HTMLElement).getAttribute(
                  'data-product-index'
                )!;
                this.updateModalContent(userIndex);
                this.modal.show();
              });
            });
        } else {
          console.error('Elemento #editProductModal no encontrado');
        }

        const despedirModalElement = document.getElementById('eliminarProductoModal');
        if (despedirModalElement) {
          const modalOptions: ModalOptions = {};
          this.eliminarProductoModal = new Modal(despedirModalElement, modalOptions);
        } else {
          console.error('Elemento #despedirUsuarioModal no encontrado');
        }
      });
    }
  }

  updateModalContent(index: string | undefined) {
    if (index !== undefined) {
      const product = this.productos[parseInt(index, 10)];
      this.selectedProduct = { ...product }; // Clonar el usuario seleccionado asegurando que los objetos sean independientes en memoria.
      (document.getElementById('product') as HTMLInputElement).value = product.product;
      (document.getElementById('quantity') as HTMLInputElement).value = product.quantity;
      (document.getElementById('cost') as HTMLInputElement).value = product.cost;
      (document.getElementById('sale_price') as HTMLInputElement).value = product.sale_price;
      (document.getElementById('sold') as HTMLInputElement).value = product.sold;

    }
  }

  saveProduct() {
    if (this.selectedProduct) {
      this.selectedProduct.product = (document.getElementById('product') as HTMLInputElement).value;
      this.selectedProduct.quantity = (document.getElementById('quantity') as HTMLInputElement).value;
      this.selectedProduct.cost = (document.getElementById('cost') as HTMLInputElement).value;
      this.selectedProduct.sale_price = (document.getElementById('sale_price') as HTMLInputElement).value;
      this.selectedProduct.sold = (document.getElementById('sold') as HTMLInputElement).value;
      this.productService.updateProducts(this.selectedProduct).subscribe({
        next: (response) => {
          console.log('producto actualizado', response);
          // Actualizar la lista de productos con la información actualizada
          const index = this.productos.findIndex(u => u.id === this.selectedProduct.id);
          if (index !== -1) {
            this.productos[index] = this.selectedProduct;
            this.closeModalEdit();
          }
        },
        error: (error) => console.error('Error updating user', error),
      });
    }
  }

  openEliminarProductoModal(index: number) {
    this.selectedProduct = this.productos[index];
    this.eliminarProductoModal.show();
  }

  eliminar() {
    if (this.selectedProduct) {
      this.productService.deleteProduct(this.selectedProduct.id).subscribe({
        next: () => {
          console.log('producto eliminado');
          const index = this.productos.findIndex(u => u.id === this.selectedProduct.id);
          if (index !== -1) {
            this.productos.splice(index, 1); // Elimina el usuario del array
          }
          this.closeModal();
        },
        error: (error) => console.error('Error deleting user', error),
      });
    }
  }
  closeModalEdit(){
    this.modal.hide();
  }
  closeModal() {
    this.eliminarProductoModal.hide();
  }
}
