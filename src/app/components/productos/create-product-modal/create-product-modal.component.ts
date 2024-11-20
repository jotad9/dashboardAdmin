import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Inject, Output, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Modal } from 'flowbite';

@Component({
  selector: 'app-create-product-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-product-modal.component.html',
  styleUrl: './create-product-modal.component.css'
})
export class CreateProductModalComponent implements AfterViewInit {
  @Output() createProduct = new EventEmitter<any>();
  @Output() closeModal = new EventEmitter<void>();
  @ViewChild('createProductModal', { static: true }) modalElement!: ElementRef<HTMLDivElement>;
  createProductForm: FormGroup;
  createProductModal: any = null;

  constructor(
    private fb: FormBuilder,@Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.createProductForm = this.fb.group({
      product: ['', Validators.required],
      quantity: ['', Validators.required],
      cost: ['', Validators.required],
      sale_price: ['', Validators.required],
      image_url: ['', Validators.required],
      sold: ['', Validators.required]
    });
  }
  ngAfterViewInit(): void {
    if(isPlatformBrowser(this.platformId)){
      if(this.modalElement.nativeElement){
        const modalOptions:any={};
        this.createProductModal=new Modal(this.modalElement.nativeElement,modalOptions);
      }else{
        console.error('Elemento #createProductModal no encontrado')
      }
    }
  }
  onSubmit():void{
    if(this.createProductForm.valid){
      this.createProduct.emit(this.createProductForm.value);
      this.createProductModal.hide();
    }
  }
  closeModalProduct():void{
    if(this.createProductModal && this.createProductModal.isVisible()){
      this.createProductModal.hide();
      this.closeModal.emit();//emite el evento
    }
  }
  showModal():void {
    if(this.createProductModal){
      console.log('Mostrando modal');
      this.createProductModal.show();
    }else{
      console.error('Modal no inizialido correctamente')
    }
  }

}
