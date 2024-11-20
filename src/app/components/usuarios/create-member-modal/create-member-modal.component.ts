import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Output,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Modal } from 'flowbite';

@Component({
  selector: 'app-create-member-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-member-modal.component.html'
})
export class CreateMemberModalComponent {
  @Output() createMember = new EventEmitter<any>();
  @Output() closeModal = new EventEmitter<void>();
  @ViewChild('createMemberModal', { static: true }) modalElement!: ElementRef<HTMLDivElement>;
  createMemberForm: FormGroup;
  createMemberModal: any = null;

  constructor(
    private fb: FormBuilder,@Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.createMemberForm = this.fb.group({
      nombre: ['', Validators.required],
      image_url: ['', Validators.required],
      status: ['', Validators.required],
      email: ['', Validators.required],
      position: ['', Validators.required],
      salary: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.modalElement.nativeElement) {
        const modalOptions: any = {};
        this.createMemberModal = new Modal(
          this.modalElement.nativeElement,
          modalOptions
        );
      } else {
        console.error('Elemento #createMemberModal no encontrado');
      }
    }
  }
  onSubmit(): void {
    if (this.createMemberForm.valid) {
      this.createMember.emit(this.createMemberForm.value);
      this.createMemberModal.hide();
    }
  }

  closeModalMember(): void {
    if (this.createMemberModal && this.createMemberModal.isVisible()) {
      this.createMemberModal.hide();
      this.closeModal.emit(); // Emite el evento para que el padre actualice su estado
    }
  }
  showModal(): void {
    if (this.createMemberModal) {
      console.log('Mostrando modal');
      this.createMemberModal.show(); // Abre el modal visualmente
    } else {
      console.error('Modal no inicializado correctamente');
    }
  }
}
