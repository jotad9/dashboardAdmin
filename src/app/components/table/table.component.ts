import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import type { ModalInterface, ModalOptions } from 'flowbite';
import { UsuarioService } from '../../services/usuario.service';
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements AfterViewInit, OnInit {
  $modalElement: HTMLElement | null = null;
  modal: ModalInterface | null = null;
  usuarios: any[] = [];
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private usuarioService:UsuarioService) {}
  ngOnInit(): void {
    this.usuarioService.getUsers().subscribe({
      next: (response) => this.usuarios = response,
      error: (error) => console.error('Error fetching data', error)
    });
  }
  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      import('flowbite').then(({ Modal }) => {
        this.$modalElement = document.getElementById('editUserModal');
        if (this.$modalElement) {
          const modalOptions: ModalOptions = {};
          this.modal = new Modal(this.$modalElement, modalOptions);

          const triggerElement = document.querySelector('[data-modal-show="editUserModal"]');
          if (triggerElement) {
            triggerElement.addEventListener('click', (event) => {
              event.preventDefault();
              this.modal?.show();
            });
          } else {
            console.error('Elemento con data-modal-show="editUserModal" no encontrado');
          }
        } else {
          console.error('Elemento #editUserModal no encontrado');
        }
      });
    }
  }
}
