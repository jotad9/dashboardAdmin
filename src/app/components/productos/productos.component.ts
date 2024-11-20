import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  Input,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { Modal, ModalOptions } from 'flowbite';
import { ProductService } from '../../services/product.service';
import { CreateProductModalComponent } from './create-product-modal/create-product-modal.component';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule,CreateProductModalComponent],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css',
})
export class ProductosComponent implements AfterViewInit, OnInit {
  //modal de la tabla
  $modalElement: HTMLElement | null = null;
  @Input() productos: any[] = [];
  @ViewChild(CreateProductModalComponent) createProductModalCom!:CreateProductModalComponent
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
        setTimeout(() => {
          this.addEventListeners();
        }, 0);
      },
      error: (error) => console.error('Error fetching data', error),
    });
    console.log(this.productos);
  }
  addEventListeners(): void {
    document
      .querySelectorAll('[data-modal-target="editProductModal"]')
      .forEach((triggerElement) => {
        triggerElement.addEventListener('click', (event) => {
          event.preventDefault();
          const productIndex = (triggerElement as HTMLElement).getAttribute(
            'data-product-index'
          )!;
          this.updateModalContent(productIndex);
          this.modal.show();
        });
      });
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const modalElement = document.getElementById('editProductModal');
      if (modalElement) {
        const modalOptions: ModalOptions = {};
        this.modal = new Modal(modalElement, modalOptions);
      } else {
        console.error('Elemento #editProductModal not found');
      }

      const despedirModalElement = document.getElementById(
        'eliminarProductoModal'
      );
      if (despedirModalElement) {
        const modalOptions: ModalOptions = {};
        this.eliminarProductoModal = new Modal(
          despedirModalElement,
          modalOptions
        );
      } else {
        console.error('Elemento #despedirUsuarioModal not found');
      }

    }
  }
  openCreateProductModal(): void {
    if(this.createProductModalCom){
      this.createProductModalCom.showModal();
    }else{
      console.error('CreateProductModalComponent not found');
    }
  }

  closeCreateProductModal(): void {
    if(this.createProductModalCom){
      this.createProductModalCom.closeModalProduct();
    }else{
      console.error('CreateProductModalComponent not found');
    }
  }

  createProduct(product:any) {
    this.productService.createProduct(product).subscribe({
      next: (response) => {
        console.log('producto creado', response);
        this.productos.push(response);
      },
      error: (error) => console.error('Error creating product', error),
    });
  }

  updateModalContent(index: string | undefined) {
    if (index !== undefined) {
      const product = this.productos[parseInt(index, 10)];
      this.selectedProduct = { ...product }; // Clonar el usuario seleccionado asegurando que los objetos sean independientes en memoria.
      (document.getElementById('product') as HTMLInputElement).value =
        product.product;
      (document.getElementById('quantity') as HTMLInputElement).value =
        product.quantity;
      (document.getElementById('cost') as HTMLInputElement).value =
        product.cost;
      (document.getElementById('sale_price') as HTMLInputElement).value =
        product.sale_price;
      (document.getElementById('sold') as HTMLInputElement).value =
        product.sold;
    }
  }

  saveProduct() {
    if (this.selectedProduct) {
      this.selectedProduct.product = (
        document.getElementById('product') as HTMLInputElement
      ).value;
      this.selectedProduct.quantity = (
        document.getElementById('quantity') as HTMLInputElement
      ).value;
      this.selectedProduct.cost = (
        document.getElementById('cost') as HTMLInputElement
      ).value;
      this.selectedProduct.sale_price = (
        document.getElementById('sale_price') as HTMLInputElement
      ).value;
      this.selectedProduct.sold = (
        document.getElementById('sold') as HTMLInputElement
      ).value;
      this.productService.updateProducts(this.selectedProduct).subscribe({
        next: (response) => {
          console.log('producto actualizado', response);
          // Actualizar la lista de productos con la información actualizada
          const index = this.productos.findIndex(
            (u) => u.id === this.selectedProduct.id
          );
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
          const index = this.productos.findIndex(
            (u) => u.id === this.selectedProduct.id
          );
          if (index !== -1) {
            this.productos.splice(index, 1); // Elimina el usuario del array
          }
          this.closeModal();
        },
        error: (error) => console.error('Error deleting user', error),
      });
    }
  }
  closeModalEdit() {
    this.modal.hide();
  }
  closeModal() {
    this.eliminarProductoModal.hide();
  }
}
